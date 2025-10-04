import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
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

