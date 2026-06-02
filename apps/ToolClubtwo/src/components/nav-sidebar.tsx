"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, Star, CreditCard, Home } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: '项目列表', icon: LayoutDashboard },
  { href: '/dashboard/upload', label: '新建项目', icon: Upload },
  { href: '/dashboard/favorites', label: '我的收藏', icon: Star },
  { href: '/pricing', label: '升级会员', icon: CreditCard },
  { href: 'https://toolclub.net/', label: '返回首页', icon: Home },
]

export default function NavSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 flex-col border-r border-slate-100 bg-white/40 backdrop-blur-sm p-4">
      {/* 产品标识 */}
      <div className="mb-6 mt-2">
        <div className="rounded-lg bg-[#4D6BFE]/10 px-3 py-2 text-center">
          <span className="text-base font-medium text-[#4D6BFE]">跨境商品详情<br />生成系统</span>
        </div>
      </div>

      {/* 导航 */}
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isExternal = href.startsWith('http')
          const active = !isExternal && (pathname === href || (href !== '/dashboard' && pathname.startsWith(href)))
          const className = `flex items-center justify-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            active
              ? 'bg-[#4D6BFE]/10 text-[#4D6BFE]'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`

          if (isExternal) {
            return (
              <a key={href} href={href} className={className}>
                <Icon size={18} />
                {label}
              </a>
            )
          }

          return (
            <Link key={href} href={href} className={className}>
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
