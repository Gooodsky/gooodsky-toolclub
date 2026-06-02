"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { signOut } from "next-auth/react"
import type { Session } from "next-auth"
import AuthModal from "@/components/auth-modal"

export default function HomeClient({ initialSession }: { initialSession: Session | null }) {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"login" | "register">("login")
  const [redirectTo, setRedirectTo] = useState<string | undefined>()

  // 按钮 refs——原生 DOM 事件不受 bfcache 影响
  const cta1Ref = useRef<HTMLButtonElement>(null)
  const cta2Ref = useRef<HTMLButtonElement>(null)
  const loginBtnRef = useRef<HTMLButtonElement>(null)
  const regBtnRef = useRef<HTMLButtonElement>(null)
  const logoutBtnRef = useRef<HTMLButtonElement>(null)

  // 当 initialSession 变化时（服务端重新渲染），同步更新
  useEffect(() => {
    setSession(initialSession)
  }, [initialSession])

  // 登录后自动跳转到目标地址
  useEffect(() => {
    if (session?.user) {
      const pending = sessionStorage.getItem("loginRedirect")
      if (pending) {
        sessionStorage.removeItem("loginRedirect")
        window.location.href = pending
      }
    }
  }, [session])

  const openModal = useCallback((mode: "login" | "register", redirect?: string) => {
    setModalMode(mode)
    setRedirectTo(redirect)
    setModalOpen(true)
  }, [])

  const handleCtaClick = useCallback((url: string) => {
    if (session?.user) {
      window.location.href = url
    } else {
      openModal("login", url)
    }
  }, [session?.user, openModal])

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  // 用原生 DOM 事件绑定按钮，确保 bfcache 恢复后仍有效
  useEffect(() => {
    const cta1 = cta1Ref.current
    const cta2 = cta2Ref.current
    const loginBtn = loginBtnRef.current
    const regBtn = regBtnRef.current
    const logoutBtn = logoutBtnRef.current

    const onCta1 = () => handleCtaClick("https://toolclub.net/one/dashboard/upload")
    const onCta2 = () => handleCtaClick("https://toolclub.net/two/dashboard/upload")
    const onLogin = () => openModal("login")
    const onReg = () => openModal("register")
    const onLogout = () => handleLogout()

    cta1?.addEventListener("click", onCta1)
    cta2?.addEventListener("click", onCta2)
    loginBtn?.addEventListener("click", onLogin)
    regBtn?.addEventListener("click", onReg)
    logoutBtn?.addEventListener("click", onLogout)

    return () => {
      cta1?.removeEventListener("click", onCta1)
      cta2?.removeEventListener("click", onCta2)
      loginBtn?.removeEventListener("click", onLogin)
      regBtn?.removeEventListener("click", onReg)
      logoutBtn?.removeEventListener("click", onLogout)
    }
  }, [handleCtaClick, openModal, handleLogout])

  return (
    <>
    {modalOpen && <AuthModal mode={modalMode} onClose={() => setModalOpen(false)} callbackUrl={redirectTo} />}
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* ===== Top Section ===== */}
      <div
        className="w-full bg-center bg-cover px-8"
        style={{ backgroundImage: 'url(/images/ds-bg.webp)' }}
      >
        <div className="flex flex-col items-center w-full pt-24 md:pt-32 pb-20 md:pb-40">
          {/* Logo + Brand Name */}
          <div className="flex items-center gap-1 absolute top-4 left-4">
            <img
              alt="ToolClub"
              className="w-10 h-10"
              src="/logo1-no-bg.png"
            />
            <span className="text-xl font-bold" style={{ color: '#4D6BFE' }}>ToolClub</span>
          </div>

          {/* Announcement */}
          <div className="mb-12 md:mb-16 text-center text-sm">
            <a
              target="_blank"
              href="https://mp.weixin.qq.com/s/8bxXqS2R8Fx5-1TLDBiEDg"
              style={{ display: 'block' }}
              className="!text-slate-400"
            >
              🚀 ToolClub 正式上线 — 互联网创业者的AI工具百宝箱，覆盖短视频文案、跨境营销、数据分析等核心场景，点击体验。
            </a>
          </div>

          {/* ToolClub Text Logo */}
          <div
            className="text-8xl md:text-9xl font-bold mb-2"
            style={{
              letterSpacing: '0.05em',
              backgroundImage: 'linear-gradient(to bottom, #4D6BFE, #2d4bc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >ToolClub</div>
          {/* Subtitle */}
          <div
            className="text-xl md:text-2xl font-medium mb-4 mt-1 tracking-widest"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #ffffff, #000000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >创业难题，一站搞定</div>

          {/* CTA Cards */}
          <div className="flex gap-4 w-full max-w-2xl">
            {session?.user ? (
              <a
                href="https://toolclub.net/one/dashboard/upload"
                className="relative rounded-2xl pt-6 pb-7 px-8 min-w-0 flex-1 bg-white/50 backdrop-blur-sm cursor-pointer text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg border-none no-underline"
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
            ) : (
              <button
                ref={cta1Ref}
                className="relative rounded-2xl pt-6 pb-7 px-8 min-w-0 flex-1 bg-white/50 backdrop-blur-sm cursor-pointer text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg border-none"
                style={{ boxShadow: '0 0 0 1px #f1f5f9, 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)' }}
              >
                <div className="text-lg font-bold mb-2" style={{ color: '#4D6BFE' }}>多平台爆款文案生成系统</div>
                <div className="text-slate-500" style={{ fontSize: 15 }}>
                  AI短视频文案生成<br />一键爆款，多平台发布
                </div>
                <div className="flex items-center justify-center gap-1 mt-4 text-sm font-medium" style={{ color: '#4D6BFE' }}>
                  立即体验 <span className="text-base">→</span>
                </div>
              </button>
            )}
            {session?.user ? (
              <a
                href="https://toolclub.net/two/dashboard/upload"
                className="relative rounded-2xl pt-6 pb-7 px-8 min-w-0 flex-1 bg-white/50 backdrop-blur-sm cursor-pointer text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg border-none no-underline"
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
            ) : (
              <button
                ref={cta2Ref}
                className="relative rounded-2xl pt-6 pb-7 px-8 min-w-0 flex-1 bg-white/50 backdrop-blur-sm cursor-pointer text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg border-none"
                style={{ boxShadow: '0 0 0 1px #f1f5f9, 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)' }}
              >
                <div className="text-lg font-bold mb-2" style={{ color: '#4D6BFE' }}>跨境电商详情生成系统</div>
                <div className="text-slate-500" style={{ fontSize: 15 }}>
                  AI跨境商品文案<br />多语言优化，转化率翻倍
                </div>
                <div className="flex items-center justify-center gap-1 mt-4 text-sm font-medium" style={{ color: '#4D6BFE' }}>
                  立即体验 <span className="text-base">→</span>
                </div>
              </button>
            )}
          </div>
          {/* Top-Right Nav Links */}
          <div className="flex gap-6 !absolute right-6 top-4 items-center">
            {session?.user ? (
              <>
                <span className="text-sm text-slate-500">{session.user.email}</span>
                <button
                  ref={logoutBtnRef}
                  className="text-sm font-medium text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none transition"
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <button ref={loginBtnRef} className="text-base font-bold !text-slate-600 cursor-pointer bg-transparent border-none">登录</button>
                <button ref={regBtnRef} className="text-base font-bold !text-slate-600 cursor-pointer bg-transparent border-none">注册</button>
              </>
            )}
            <a href="https://toolclub.net/en/" className="text-sm !text-slate-400 cursor-pointer">English</a>
          </div>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <div className="w-full bg-white border-t border-slate-100 px-8 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Logo + Social */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <img
                  alt="ToolClub"
                  className="w-8 h-8"
                  src="/logo1-no-bg.png"
                />
                <span className="text-lg font-bold" style={{ color: '#4D6BFE' }}>ToolClub</span>
              </div>
              <div className="flex items-center gap-1">
                <a href="mailto:hello@toolclub.net" className="text-slate-400 hover:text-slate-600 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
                <a href="https://github.com/toolclub" target="_blank" className="text-slate-400 hover:text-slate-600 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-600 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                </a>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              &copy; 2026 ToolClub 版权所有
            </div>
          </div>

          {/* Link Columns */}
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
    </main>
    </>
  )
}
