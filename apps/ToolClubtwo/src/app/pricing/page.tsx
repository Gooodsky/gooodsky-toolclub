'use client'

import { useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'

const PLANS = [
  {
    key: 'free',
    name: '免费版',
    price: '¥0',
    period: '永久',
    desc: '适合体验尝鲜',
    features: ['每日 2 次生成', '英语 Listing', 'Amazon US 平台', '一键复制使用'],
    cta: '当前方案',
    popular: false,
  },
  {
    key: 'pro',
    name: '专业版',
    price: '¥29',
    period: '/月',
    desc: '适合个人跨境卖家',
    features: [
      '不限次数生成',
      '英语 + 泰语 + 印尼语',
      '全平台覆盖（5大平台）',
      'DeepSeek 大模型驱动',
      '优先客服支持',
    ],
    cta: '立即开通',
    popular: true,
  },
  {
    key: 'enterprise',
    name: '企业版',
    price: '¥199',
    period: '/年',
    desc: '适合跨境团队和代运营',
    features: [
      '不限次数生成',
      '全部语言（含越南语等）',
      '全平台覆盖（5大平台）',
      '批量生成（即将推出）',
      'DeepSeek 大模型驱动',
      '专属客户经理',
    ],
    cta: '立即开通',
    popular: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [orderNo, setOrderNo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentPlan] = useState('free')

  async function handlePay(plan: string, method: 'wxpay' | 'alipay') {
    setLoading(plan + method)
    setError(null)

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, method }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || '创建订单失败')

      setQrCode(data.qrcode || data.codeUrl)
      setOrderNo(data.orderNo)
    } catch (e) {
      setError(e instanceof Error ? e.message : '创建订单失败')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text transition cursor-pointer bg-transparent border-none">
            <ArrowLeft className="h-4 w-4" />
            返回上一页
          </button>
          <span className="text-lg font-semibold text-text">选择适合你的套餐</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-text">简单透明的定价</h1>
          <p className="mt-2 text-text-secondary">先免费体验，好用再付费升级</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.key
            return (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-xl border bg-white p-6 shadow-sm ${
                  plan.popular ? 'border-secondary ring-1 ring-secondary' : 'border-border'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-white">
                    推荐
                  </span>
                )}

                <h3 className="text-lg font-bold text-text">{plan.name}</h3>
                <p className="mt-1 text-sm text-text-muted">{plan.desc}</p>

                <div className="mt-5 flex items-baseline gap-0.5">
                  <span className="text-4xl font-extrabold text-text">{plan.price}</span>
                  <span className="text-sm text-text-muted">{plan.period}</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="h-4 w-4 flex-shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  {plan.key === 'free' ? (
                    <div className="flex gap-2">
                      <button
                        disabled
                        className="flex-1 rounded-md border border-border bg-bg px-4 py-2.5 text-sm font-medium text-text-muted cursor-not-allowed"
                      >
                        {isCurrent ? '当前方案' : plan.cta}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePay(plan.key, 'wxpay')}
                        disabled={isCurrent || loading !== null}
                        className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                          isCurrent
                            ? 'cursor-not-allowed border border-border bg-bg text-text-muted'
                            : 'bg-[#07C160] text-white hover:bg-[#06AD56]'
                        }`}
                      >
                        {isCurrent
                          ? '当前方案'
                          : loading === plan.key + 'wxpay'
                            ? '处理中...'
                            : (
                              <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                  <circle cx="12" cy="12" r="12" fill="#07C160"/>
                                  <path d="M8.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 2C6.477 2 2 5.925 2 10.75c0 2.552 1.25 4.86 3.25 6.42L4 22l5.25-2.5c.88.25 1.8.38 2.75.38 5.523 0 10-3.925 10-8.75S17.523 2 12 2z" fill="white"/>
                                </svg>
                                微信支付
                              </>
                            )}
                      </button>
                      <button
                        onClick={() => handlePay(plan.key, 'alipay')}
                        disabled={isCurrent || loading !== null}
                        className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                          isCurrent
                            ? 'cursor-not-allowed border border-border bg-bg text-text-muted'
                            : 'bg-[#007BFF] text-white hover:bg-[#0069D9]'
                        }`}
                      >
                        {isCurrent
                          ? '当前方案'
                          : loading === plan.key + 'alipay'
                            ? '处理中...'
                            : (
                              <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                  <circle cx="12" cy="12" r="12" fill="#1677FF"/>
                                  <text x="12" y="17" text-anchor="middle" font-size="14" font-weight="bold" fill="white">支</text>
                                </svg>
                                支付宝
                              </>
                            )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {qrCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setQrCode(null)}>
          <div
            className="mx-4 w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-bold text-text">扫码支付</h3>
            <p className="mb-4 text-sm text-text-secondary">订单号: {orderNo}</p>
            <img
              src={qrCode}
              alt="支付二维码"
              className="mx-auto rounded-lg border border-border"
              width={220}
              height={220}
            />
            <p className="mt-4 text-xs text-text-muted">支付完成后页面将自动更新会员状态</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-red-50 border border-red-200 px-6 py-3 text-sm text-red-700 shadow-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-3 font-medium underline">关闭</button>
        </div>
      )}

      <footer className="border-t border-border py-6 text-center text-xs text-text-muted space-x-4">
        <span>Gooodsky 出品</span>
        <a href="/p/terms" className="hover:text-text-secondary transition">用户协议</a>
        <a href="/p/privacy" className="hover:text-text-secondary transition">隐私政策</a>
      </footer>
    </div>
  )
}
