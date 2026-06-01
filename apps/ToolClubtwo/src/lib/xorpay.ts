import crypto from 'crypto'

const aid = () => process.env.XORPAY_AID!
const secret = () => process.env.XORPAY_APP_SECRET!

const API = `https://xorpay.com/api/pay/${aid()}`

function md5(s: string) {
  return crypto.createHash('md5').update(s, 'utf8').digest('hex')
}

export function createSign(params: { name: string; pay_type: string; price: string; order_id: string; notify_url: string }) {
  return md5(params.name + params.pay_type + params.price + params.order_id + params.notify_url + secret())
}

export function verifyNotifySign(params: { aoid: string; order_id: string; pay_price: string; pay_time: string; sign?: string }) {
  const received = params.sign
  if (!received) return false
  const computed = md5(params.aoid + params.order_id + params.pay_price + params.pay_time + secret())
  return computed === received
}

export interface CreatePaymentParams {
  amount: number
  outTradeNo: string
  body: string
  type: 'wxpay' | 'alipay'
  notifyUrl?: string
}

export interface CreatePaymentResult {
  qr: string
  aoid: string
  orderNo: string
}

export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
  const pay_type = params.type === 'alipay' ? 'alipay' : 'native'
  const price = params.amount.toFixed(2)
  const notify_url = params.notifyUrl || process.env.XORPAY_NOTIFY_URL || ''

  const sign = createSign({
    name: params.body,
    pay_type,
    price,
    order_id: params.outTradeNo,
    notify_url,
  })

  const body = new URLSearchParams()
  body.append('name', params.body)
  body.append('pay_type', pay_type)
  body.append('price', price)
  body.append('order_id', params.outTradeNo)
  body.append('notify_url', notify_url)
  body.append('sign', sign)

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const json = await res.json()

  if (json.status !== 'ok') {
    throw new Error(json.status || 'XorPay 创建订单失败')
  }

  return {
    qr: json.info?.qr || '',
    aoid: json.aoid,
    orderNo: params.outTradeNo,
  }
}
