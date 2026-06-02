import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div
      className="min-h-screen bg-center bg-cover"
      style={{ backgroundImage: 'url(/images/ds-bg.webp)' }}
    >
      {/* Top Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50">
        <div className="flex items-center gap-1">
          <img alt="ToolClub" className="w-10 h-10" src="/logo1-no-bg.png" />
          <span className="text-xl font-bold" style={{ color: '#4D6BFE' }}>ToolClub</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{session.user.email}</span>
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}>
            <button type="submit" className="text-sm text-slate-500 hover:text-slate-800 transition cursor-pointer">
              退出登录
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">欢迎使用 ToolClub</h1>
        <p className="text-slate-500 text-lg">您的AI工具百宝箱</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-12">
          <a href="https://toolclub.net/one" target="_blank"
            className="relative rounded-2xl pt-6 pb-7 px-8 min-w-0 flex-1 bg-white/50 backdrop-blur-sm cursor-pointer text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg"
            style={{ boxShadow: '0 0 0 1px #f1f5f9, 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)' }}
          >
            <div className="text-lg font-bold mb-2" style={{ color: '#4D6BFE' }}>多平台爆款文案生成系统</div>
            <div className="text-slate-500" style={{ fontSize: 15 }}>
              AI短视频文案生成<br />一键爆款，多平台发布
            </div>
            <div className="flex items-center justify-center gap-1 mt-4 text-sm font-medium" style={{ color: '#4D6BFE' }}>
              立即体验 <span className="text-base">→</span>
            </div>
          </a>
          <a href="https://toolclub.net/two" target="_blank"
            className="relative rounded-2xl pt-6 pb-7 px-8 min-w-0 flex-1 bg-white/50 backdrop-blur-sm cursor-pointer text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg"
            style={{ boxShadow: '0 0 0 1px #f1f5f9, 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)' }}
          >
            <div className="text-lg font-bold mb-2" style={{ color: '#4D6BFE' }}>跨境电商详情生成系统</div>
            <div className="text-slate-500" style={{ fontSize: 15 }}>
              AI跨境商品文案<br />多语言优化，转化率翻倍
            </div>
            <div className="flex items-center justify-center gap-1 mt-4 text-sm font-medium" style={{ color: '#4D6BFE' }}>
              立即体验 <span className="text-base">→</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
