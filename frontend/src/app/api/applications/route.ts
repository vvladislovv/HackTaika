import { prisma } from '@/lib/prisma'
import { detailedApplicationSchema } from '@/lib/validation'
import { NextResponse } from 'next/server'

// Функция для отправки уведомления в Telegram
async function notifyTelegram(appData: any) {
  try {
    const webhookUrl = process.env.BOT_WEBHOOK_URL
    const webhookSecret = process.env.BOT_WEBHOOK_SECRET

    if (!webhookUrl || !webhookSecret) {
      console.warn('Telegram webhook not configured')
      return
    }

    await fetch(`${webhookUrl}/webhook/application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': webhookSecret,
      },
      body: JSON.stringify({
        fullName: appData.fullName,
        email: appData.email,
        phone: appData.phone,
        telegram: appData.telegram,
        projectType: appData.projectType,
        projectProblem: appData.projectProblem,
        targetAudience: appData.targetAudience,
        budget: appData.budget,
        deadline: appData.deadline,
        description: appData.description,
        additionalInfo: appData.additionalInfo,
        createdAt: appData.createdAt.toISOString(),
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
    const validatedData = detailedApplicationSchema.parse(body)

    const application = await prisma.detailedApplication.create({
      data: validatedData,
    })

    // Отправляем уведомление в Telegram (асинхронно, не ждем результата)
    notifyTelegram(application).catch(err => 
      console.error('Failed to send telegram notification:', err)
    )

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const applications = await prisma.detailedApplication.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

