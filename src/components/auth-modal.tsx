"use client"

import { useState, useEffect, useCallback } from "react"

type Mode = "login" | "register"

interface Props {
  mode: Mode
  onClose: () => void
  callbackUrl?: string
}

export default function AuthModal({ mode: initialMode, onClose, callbackUrl }: Props) {
  const [mode, setMode] = useState<Mode>(initialMode)

  // 登录表单
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 注册表单
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirm, setRegConfirm] = useState("")
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState("")
  const [regSuccess, setRegSuccess] = useState(false)

  // 监听初始 mode 变化
  useEffect(() => {
    setMode(initialMode)
    setError("")
    setRegError("")
    setRegSuccess(false)
  }, [initialMode])

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 获取 CSRF token
      const csrfRes = await fetch("/api/auth/csrf")
      const { csrfToken } = await csrfRes.json()

      // 用动态表单提交 → 触发浏览器完整导航
      const form = document.createElement("form")
      form.method = "POST"
      form.action = "/api/auth/callback/credentials"
      form.style.display = "none"

      // 如果目标不是首页，存到 sessionStorage，登录后首页会自动跳转
      if (callbackUrl && callbackUrl !== window.location.origin + "/") {
        sessionStorage.setItem("loginRedirect", callbackUrl)
      }
      const fields = { csrfToken, email, password, callbackUrl: window.location.origin + "/" }
      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = name
        input.value = value
        form.appendChild(input)
      }

      document.body.appendChild(form)
      form.submit()
    } catch {
      setError("登录失败，请重试")
      setLoading(false)
    }
  }, [email, password])

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError("")

    if (regPassword !== regConfirm) {
      setRegError("两次密码不一致")
      return
    }

    if (regPassword.length < 8) {
      setRegError("密码至少8位")
      return
    }

    setRegLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setRegError(data.error || "注册失败")
      } else {
        setRegSuccess(true)
        // 1.5 秒后切换到登录
        setTimeout(() => {
          setMode("login")
          setRegSuccess(false)
          setEmail(regEmail)
          setPassword("")
        }, 1500)
      }
    } catch {
      setRegError("注册失败，请重试")
    } finally {
      setRegLoading(false)
    }
  }, [regEmail, regPassword, regConfirm])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 模态框 */}
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl pt-8 pb-10 px-8 bg-white shadow-xl">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-6">
          <img alt="ToolClub" className="w-10 h-10" src="/logo1-no-bg.png" />
          <span className="text-xl font-bold" style={{ color: "#4D6BFE" }}>ToolClub</span>
        </div>

        {mode === "login" ? (
          <>
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">登录</h2>

            {regSuccess && (
              <p className="text-sm text-green-500 text-center mb-4">注册成功！请登录</p>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                required
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
              />
              <input
                type="password"
                required
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
              />
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white cursor-pointer transition disabled:opacity-50"
                style={{ background: "#4D6BFE" }}
              >
                {loading ? "登录中..." : "登录"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              还没有账号？
              <button
                onClick={() => { setMode("register"); setError(""); setRegSuccess(false) }}
                className="font-medium hover:underline ml-1"
                style={{ color: "#4D6BFE" }}
              >
                立即注册
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">注册</h2>

            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                type="email"
                required
                placeholder="邮箱地址"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
              />
              <input
                type="password"
                required
                placeholder="密码（至少8位）"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
              />
              <input
                type="password"
                required
                placeholder="确认密码"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
              />
              {regError && <p className="text-sm text-red-500 text-center">{regError}</p>}
              {regSuccess && <p className="text-sm text-green-500 text-center">注册成功！</p>}
              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 rounded-xl font-bold text-white cursor-pointer transition disabled:opacity-50"
                style={{ background: "#4D6BFE" }}
              >
                {regLoading ? "注册中..." : "注册"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              已有账号？
              <button
                onClick={() => { setMode("login"); setRegError("") }}
                className="font-medium hover:underline ml-1"
                style={{ color: "#4D6BFE" }}
              >
                立即登录
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
