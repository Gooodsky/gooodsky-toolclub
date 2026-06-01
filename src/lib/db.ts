import Database from "better-sqlite3"
import path from "node:path"

const dbPath = "C:/Users/Administrator/toolclub.db"
const db = new Database(dbPath)

db.pragma("journal_mode = WAL")

db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

export interface User {
  id: string
  email: string
  password: string
  name: string | null
  createdAt: string
}

export const findUserByEmail = (email: string): User | undefined => {
  return db.prepare("SELECT * FROM User WHERE email = ?").get(email) as User | undefined
}

export const createUser = (id: string, email: string, password: string): void => {
  db.prepare("INSERT INTO User (id, email, password) VALUES (?, ?, ?)").run(id, email, password)
}

export { db }
