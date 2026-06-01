import { prisma } from '@/lib/db'
import { verifyNotifySign } from '@/lib/xorpay'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const text = await req.text()
  const params = new URLSearchParams(text)
  const body = Object.fromEntries(params) as Record<string, string>

  if (!verifyNotifySign({
    aoid: body.aoid || '',
    order_id: body.order_id || '',
    pay_price: body.pay_price || '',
    pay_time: body.pay_time || '',
    sign: body.sign,
  })) {
    return new NextResponse('sign error', { status: 400 })
  }

  try {
    const paymentOrder = await prisma.paymentOrder.findUnique({
      where: { orderNo: body.order_id },
    })

    if (!paymentOrder) {
      return new NextResponse('order not found', { status: 404 })
    }

    if (paymentOrder.paid) {
      return new NextResponse('success')
    }

    const now = new Date()
    const planExpiresAt = new Date(
      paymentOrder.plan === 'enterprise'
        ? now.setFullYear(now.getFullYear() + 1)
        : now.setMonth(now.getMonth() + 1),
    )

    await prisma.$transaction([
      prisma.paymentOrder.update({
        where: { id: paymentOrder.id },
        data: { paid: true, paidAt: new Date() },
      }),
      prisma.user.update({
        where: { id: paymentOrder.userId },
        data: { plan: paymentOrder.plan, planExpiresAt },
      }),
    ])

    return new NextResponse('success')
  } catch (e) {
    return new NextResponse('error', { status: 500 })
  }
}
