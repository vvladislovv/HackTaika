import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { portfolioSchema } from '@/lib/validation'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = portfolioSchema.parse(body)

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        ...validatedData,
        videos: validatedData.videos || [],
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json(portfolioItem, { status: 201 })
  } catch (error) {
    console.error('Error creating portfolio item:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    )
  }
}

