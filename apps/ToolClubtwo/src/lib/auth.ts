import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getSession() {
  const session = await auth()
  return session?.user ?? null
}

export async function ensureUser() {
  const session = await auth()
  if (!session?.user?.email) return null

  return prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: {
      email: session.user.email,
    },
  })
}

export async function logout() {
  "use server"
  const { signOut } = await import("@/auth")
  await signOut({ redirectTo: "/login" })
}
