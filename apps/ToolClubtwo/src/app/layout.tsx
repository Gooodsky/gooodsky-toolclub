import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/providers'
import NavUser from '@/components/nav-user'

export const metadata: Metadata = {
  title: 'ToolClub · 跨境商品详情生成系统',
  description: '一条中文商品信息，秒级生成多语言、多平台商品详情页，覆盖 Amazon、Shopee、Lazada、TikTok Shop',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>
        <div className="min-h-screen bg-center bg-cover flex flex-col" style={{ backgroundImage: 'url(/images/ds-bg.webp)' }}>
          {/* Nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50">
            <a href="http://localhost:3000" className="flex items-center gap-1">
              <img alt="ToolClub" className="w-10 h-10" src="/logo1-no-bg.png" />
              <span className="text-xl font-bold" style={{ color: '#4D6BFE' }}>ToolClub</span>
            </a>
            <NavUser />
          </div>

          {/* Page Content */}
          <div className="flex-1">{children}</div>

          {/* Footer */}
          <div className="w-full bg-white border-t border-slate-100 px-8 py-12">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-1">
                  <img alt="ToolClub" className="w-8 h-8" src="/logo1-no-bg.png" />
                  <span className="text-lg font-bold" style={{ color: '#4D6BFE' }}>ToolClub</span>
                </div>
                <div className="text-sm text-slate-500">&copy; 2026 ToolClub 版权所有</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-3">产品</h4>
                  <div className="space-y-2">
                    {['悦拍 · AI短视频文案','ListingGen · 跨境文案','更多工具'].map(s => (
                      <a key={s} href="#" className="block text-sm text-slate-500 hover:text-slate-800 transition">{s}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-3">资源</h4>
                  <div className="space-y-2">
                    {['使用教程','API 文档','常见问题','更新日志'].map(s => (
                      <a key={s} href="#" className="block text-sm text-slate-500 hover:text-slate-800 transition">{s}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-3">法务 & 安全</h4>
                  <div className="space-y-2">
                    {['隐私政策','用户协议','Cookie 政策'].map(s => (
                      <a key={s} href="#" className="block text-sm text-slate-500 hover:text-slate-800 transition">{s}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-3">关于</h4>
                  <div className="space-y-2">
                    {['关于我们','联系我们','Blog'].map(s => (
                      <a key={s} href="#" className="block text-sm text-slate-500 hover:text-slate-800 transition">{s}</a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Providers>
      </body>
    </html>
  )
}
