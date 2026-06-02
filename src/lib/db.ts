import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// 确保表存在
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

// 模块加载时初始化表
ensureTable().catch(console.error)

export interface User {
  id: string
  email: string
  password: string
  name: string | null
  createdAt: string
}

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const rows = await sql`SELECT * FROM "User" WHERE email = ${email}`
  return rows[0] as User | undefined
}

export const createUser = async (id: string, email: string, password: string): Promise<void> => {
  await sql`INSERT INTO "User" (id, email, password) VALUES (${id}, ${email}, ${password})`
}

export { sql as db }
