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
      setError("两次密码输入不一致")
      return
    }

    if (password.length < 6) {
      setError("密码至少6位")
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
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">注册</h1>
          <p className="mt-2 text-sm text-slate-500">注册 ToolClub 账号，免费使用</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/50 backdrop-blur-sm p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">邮箱</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4D6BFE] focus:outline-none focus:ring-2 focus:ring-[#4D6BFE]/20 transition"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">密码</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位"
                className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4D6BFE] focus:outline-none focus:ring-2 focus:ring-[#4D6BFE]/20 transition"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">确认密码</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="再次输入密码"
                className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4D6BFE] focus:outline-none focus:ring-2 focus:ring-[#4D6BFE]/20 transition"
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#4D6BFE] py-2.5 text-sm font-medium text-white hover:bg-[#3B53EB] transition disabled:opacity-50"
            >
              {loading ? "注册中..." : "注册"}
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4 text-center">
            <a href="/login" className="text-sm text-slate-500 hover:text-[#4D6BFE] transition">
              已有账号？去登录
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
