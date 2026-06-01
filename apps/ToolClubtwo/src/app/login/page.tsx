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
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">登录</h1>
          <p className="mt-2 text-sm text-slate-500">登录你的 ToolClub 账号</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/50 backdrop-blur-sm p-6 shadow-sm">
          <form
            method="POST"
            action="/api/auth/callback/credentials"
            onSubmit={() => setLoading(true)}
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value="/dashboard" />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">邮箱</label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4D6BFE] focus:outline-none focus:ring-2 focus:ring-[#4D6BFE]/20 transition"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">密码</label>
              <input
                type="password"
                name="password"
                required
                placeholder="输入密码"
                className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4D6BFE] focus:outline-none focus:ring-2 focus:ring-[#4D6BFE]/20 transition"
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
              className="w-full rounded-lg bg-[#4D6BFE] py-2.5 text-sm font-medium text-white hover:bg-[#3B53EB] transition disabled:opacity-50"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4 text-center">
            <a href="/register" className="text-sm text-slate-500 hover:text-[#4D6BFE] transition">
              没有账号？去注册
            </a>
          </div>
        </div>
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
