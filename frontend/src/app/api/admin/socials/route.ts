import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { socialSchema } from '@/lib/validation'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const socials = await prisma.social.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(socials)
  } catch (error) {
    console.error('Error fetching socials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch socials' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = socialSchema.parse(body)

    const social = await prisma.social.create({
      data: {
        ...validatedData,
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json(social, { status: 201 })
  } catch (error) {
    console.error('Error creating social:', error)
    return NextResponse.json(
      { error: 'Failed to create social' },
      { status: 500 }
    )
  }
}

