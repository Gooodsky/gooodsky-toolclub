"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("两次密码不一致")
      return
    }

    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "注册失败")
      setLoading(false)
    } else {
      router.push("/login?registered=1")
    }
  }

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

        <h1 className="text-2xl font-bold text-slate-800 text-center mb-8">注册</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="邮箱地址"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/60 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="密码（至少8位）"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/60 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="确认密码"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/60 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-[#4D6BFE] transition"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white cursor-pointer transition disabled:opacity-50"
            style={{ background: '#4D6BFE' }}
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          已有账号？<a href="/login" className="font-medium hover:underline" style={{ color: '#4D6BFE' }}>立即登录</a>
        </p>
      </div>
    </div>
  );
}
