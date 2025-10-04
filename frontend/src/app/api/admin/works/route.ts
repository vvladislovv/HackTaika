import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { workSchema } from '@/lib/validation'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const works = await prisma.work.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(works)
  } catch (error) {
    console.error('Error fetching works:', error)
    return NextResponse.json(
      { error: 'Failed to fetch works' },
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
    const validatedData = workSchema.parse(body)

    const work = await prisma.work.create({
      data: {
        ...validatedData,
        videos: validatedData.videos || [],
      },
    })

    return NextResponse.json(work, { status: 201 })
  } catch (error) {
    console.error('Error creating work:', error)
    return NextResponse.json(
      { error: 'Failed to create work' },
      { status: 500 }
    )
  }
}

