import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { workSchema } from '@/lib/validation'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = workSchema.parse(body)

    const work = await prisma.work.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        videos: validatedData.videos || [],
      },
    })

    return NextResponse.json(work)
  } catch (error) {
    console.error('Error updating work:', error)
    return NextResponse.json(
      { error: 'Failed to update work' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.work.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting work:', error)
    return NextResponse.json(
      { error: 'Failed to delete work' },
      { status: 500 }
    )
  }
}

