"use client"

import { useSession, signOut } from "next-auth/react"

export default function NavUser() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{session.user.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: "https://toolclub.net" })}
          className="text-sm font-medium text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none transition"
        >
          退出登录
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <a href="/login" className="text-base font-bold text-slate-600 cursor-pointer">登录</a>
      <a href="/register" className="text-base font-bold text-slate-600 cursor-pointer">注册</a>
    </div>
  )
}
