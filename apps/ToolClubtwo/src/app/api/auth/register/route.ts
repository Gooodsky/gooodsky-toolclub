import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "node:crypto"
import { findUserByEmail, createUser } from "@/lib/db-auth"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "密码至少6位" }, { status: 400 })
  }

  const existing = findUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 })
  }

  const id = crypto.randomUUID()
  const hashed = await bcrypt.hash(password, 10)
  createUser(id, email, hashed)

  return NextResponse.json({ success: true })
}
