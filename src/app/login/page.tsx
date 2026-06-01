"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [csrfToken, setCsrfToken] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken))
      .catch(() => {})
  }, [])

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 bg-center bg-cover"
      style={{ backgroundImage: 'url(/images/ds-bg.webp)' }}
    >
      <div className="w-full max-w-sm rounded-2xl pt-8 pb-10 px-8 bg-white/50 backdrop-blur-sm" style={{ boxShadow: '0 0 0 1px #f1f5f9, 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)' }}>
        <div className="flex items-center justify-center gap-1 mb-6">
          <img alt="ToolClub" className="w-12 h-12" src="/logo1-no-bg.png" />
          <span className="text-xl font-bold" style={{ color: '#4D6BFE' }}>ToolClub</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 text-center mb-8">登录</h1>

        <form method="POST" action="/api/auth/callback/credentials" onSubmit={() => setLoading(true)} className="space-y-4">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value="/" />
          <div>
            <input
              type="email"
              name="email"
              placeholder="邮箱地址"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/60 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="密码"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/60 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error === "CredentialsSignin" ? "邮箱或密码错误" : "登录失败，请重试"}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !csrfToken}
            className="w-full py-3 rounded-xl font-bold text-white cursor-pointer transition disabled:opacity-50"
            style={{ background: '#4D6BFE' }}
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          还没有账号？<a href="/register" className="font-medium hover:underline" style={{ color: '#4D6BFE' }}>立即注册</a>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
