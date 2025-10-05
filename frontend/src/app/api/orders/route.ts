import { prisma } from '@/lib/prisma'
import { orderSchema } from '@/lib/validation'
import { NextResponse } from 'next/server'

// Функция для отправки уведомления в Telegram
async function notifyTelegram(orderData: any) {
  try {
    const webhookUrl = process.env.BOT_WEBHOOK_URL
    const webhookSecret = process.env.BOT_WEBHOOK_SECRET

    if (!webhookUrl || !webhookSecret) {
      console.warn('Telegram webhook not configured')
      return
    }

    await fetch(`${webhookUrl}/webhook/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': webhookSecret,
      },
      body: JSON.stringify({
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        telegram: orderData.telegram,
        message: orderData.message,
        createdAt: orderData.createdAt.toISOString(),
      }),
    })
  } catch (error) {
    console.error('Error notifying telegram:', error)
    // Не прерываем выполнение, если уведомление не отправилось
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = orderSchema.parse(body)

    const order = await prisma.order.create({
      data: validatedData,
    })

    // Отправляем уведомление в Telegram (асинхронно, не ждем результата)
    notifyTelegram(order).catch(err => 
      console.error('Failed to send telegram notification:', err)
    )

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

