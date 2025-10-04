import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { socialSchema } from '@/lib/validation'
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
    const validatedData = socialSchema.parse(body)

    const social = await prisma.social.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json(social)
  } catch (error) {
    console.error('Error updating social:', error)
    return NextResponse.json(
      { error: 'Failed to update social' },
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
    await prisma.social.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting social:', error)
    return NextResponse.json(
      { error: 'Failed to delete social' },
      { status: 500 }
    )
  }
}

