import { ensureUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createPayment } from '@/lib/xorpay'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const user = await ensureUser()
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

  const { plan, method } = (await req.json()) as {
    plan: string
    method: 'wxpay' | 'alipay'
  }

  if (!['pro', 'enterprise'].includes(plan)) {
    return NextResponse.json({ error: '无效的套餐' }, { status: 400 })
  }
  if (!['wxpay', 'alipay'].includes(method)) {
    return NextResponse.json({ error: '无效的支付方式' }, { status: 400 })
  }

  const PRICES: Record<string, { amount: number; label: string }> = {
    pro: { amount: 29, label: '跨境商品详情生成助手专业版 - 1个月' },
    enterprise: { amount: 99, label: '跨境商品详情生成助手企业版 - 1年' },
  }

  const p = PRICES[plan]
  const outTradeNo = `LG_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const order = await prisma.paymentOrder.create({
    data: {
      orderNo: outTradeNo,
      userId: user.id,
      plan,
      amount: Math.round(p.amount * 100),
    },
  })

  try {
    const result = await createPayment({
      amount: p.amount,
      outTradeNo,
      body: p.label,
      type: method,
    })

    return NextResponse.json({
      codeUrl: result.qr,
      qrcode: result.qr,
      orderNo: outTradeNo,
      xorpayOrderId: result.aoid,
    })
  } catch (e) {
    await prisma.paymentOrder.delete({ where: { id: order.id } })
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '创建支付订单失败' },
      { status: 500 },
    )
  }
}
