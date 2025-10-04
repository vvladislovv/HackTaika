import { prisma } from '@/lib/prisma'
import { orderSchema } from '@/lib/validation'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = orderSchema.parse(body)

    const order = await prisma.order.create({
      data: validatedData,
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

