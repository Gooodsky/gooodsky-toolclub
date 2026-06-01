export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <a href="/" className="text-sm text-text-secondary hover:text-text transition">← 返回首页</a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-text">用户协议</h1>
        <p className="mt-1 text-sm text-text-muted">最后更新：2026年5月23日</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="mb-2 text-base font-semibold text-text">1. 服务说明</h2>
            <p>跨境商品详情生成助手是 ToolClub 旗下的 AI 驱动跨境电商商品详情生成工具。用户输入中文产品信息后，系统调用 DeepSeek 大模型自动生成适配 Amazon、Shopee、Lazada、TikTok Shop 等多平台的多语言商品详情页。</p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">2. 账号注册</h2>
            <p>用户通过邮箱注册账号，注册信息应当真实、准确。用户对账号下的所有操作负责。发现账号异常时应立即通知我们。</p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">3. 免费与付费</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>免费用户每日可生成 2 次 Listing，仅支持英语和 Amazon US 平台。</li>
              <li>专业版 ¥29/月，不限生成次数，支持英语、泰语、印尼语及全部 5 大平台。</li>
              <li>企业版 ¥99/年，不限生成次数，支持全部语言和平台，含批量生成功能。</li>
              <li>付费通过 XorPay 平台完成，支付相关争议以 XorPay 平台规则为准。</li>
              <li>虚拟商品一经交付不支持退款，除非服务本身存在重大缺陷且 24 小时内无法修复。</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">4. 使用规范</h2>
            <p>用户不得利用本服务生成违法、侵权、欺诈、虚假广告或其他危害他人合法权益的内容。不得对系统进行逆向工程、自动化抓取或未授权的大规模调用。违反者我们有权暂停或终止服务。</p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">5. AI 生成内容说明</h2>
            <p>Listing 内容由 DeepSeek 大模型自动生成，仅供创作参考。用户发布前应自行审核内容真实性、合规性和准确性。因 AI 生成内容引发的任何争议或损失，由用户自行承担。</p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">6. 服务可用性</h2>
            <p>我们尽力保障服务稳定运行，但不承诺服务不中断。因系统维护、网络故障、第三方服务（DeepSeek、Supabase、XorPay）异常等原因导致的服务暂停，我们不承担责任。</p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">7. 协议变更</h2>
            <p>我们可能随时更新本协议。重大变更将通过站内通知或邮箱告知。继续使用服务即视为接受更新后的协议。</p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-text">8. 联系方式</h2>
            <p>对本协议有任何疑问，请联系：80128348@qq.com</p>
          </div>
        </section>
      </main>
    </div>
  )
}
