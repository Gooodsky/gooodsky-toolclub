import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { findUserByEmail, createUser } from "@/lib/db"

function cuid() {
  const t = Date.now().toString(36)
  const r = Math.random().toString(36).slice(2, 10)
  return t + r
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "密码至少8位" }, { status: 400 })
    }

    if (findUserByEmail(email)) {
      return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 })
    }

    const id = cuid()
    const hashed = await bcrypt.hash(password, 10)
    createUser(id, email, hashed)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "注册失败，请重试" }, { status: 500 })
  }
}
