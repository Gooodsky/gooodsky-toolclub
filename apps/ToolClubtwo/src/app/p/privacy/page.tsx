export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <a href="/" className="text-sm text-text-secondary hover:text-text transition">← 返回首页</a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-text">隐私政策</h1>
        <p className="mt-1 text-sm text-text-muted">最后更新：2026年5月23日</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="mb-2 text-base font-semibold text-text">1. 我们收集什么信息</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>邮箱地址</strong> — 用于注册、登录和找回密码。</li>
              <li><strong>产品信息</strong> — 你输入的产品名称、规格、卖点等，仅用于生成 Listing。</li>
              <li><strong>支付记录</strong> — 订单号、套餐类型、支付状态。完整支付信息（银行卡、支付账户）由 XorPay 处理，我们不会接触到。</li>
              <li><strong>使用数据</strong> — 每日生成次数，用于免费额度控制。</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">2. 信息如何存储</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>账号认证由 Supabase 提供，你的登录凭证存储在 Supabase 服务器。</li>
              <li>产品数据、Listing 生成记录存储在我们的数据库中。</li>
              <li>我们采取合理的安全措施保护你的信息，但互联网传输无法保证 100% 安全。</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">3. 信息如何共享</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>DeepSeek</strong> — 你输入的产品信息会发送到 DeepSeek API 用于生成 Listing 内容。请参阅 DeepSeek 的隐私政策。</li>
              <li><strong>XorPay</strong> — 支付时订单信息会发送到 XorPay 用于创建支付二维码。请参阅 XorPay 的隐私政策。</li>
              <li><strong>法律要求</strong> — 在法律、法规或政府部门强制要求下，我们可能需要披露相关信息。</li>
              <li>除此之外，我们不会将你的信息出售、出租或分享给任何第三方。</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">4. Cookie</h2>
            <p>我们使用必要的 Cookie 来维持登录状态和防止跨站请求伪造。不投放广告，不使用第三方跟踪 Cookie。</p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">5. 你的权利</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>你可以随时查看、修改你的账号信息。</li>
              <li>你可以要求删除你的账号和所有关联数据，发送邮件到下方联系方式即可。</li>
              <li>删除请求将在 7 个工作日内处理完成。</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">6. 政策更新</h2>
            <p>本政策可能随时更新。重大变更将通过站内通知或邮箱告知。</p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">7. 联系方式</h2>
            <p>对本政策有任何疑问，请联系：80128348@qq.com</p>
          </div>
        </section>
      </main>
    </div>
  )
}
