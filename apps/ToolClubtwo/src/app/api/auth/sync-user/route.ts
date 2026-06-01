import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const { supabaseId, email, name } = await request.json()

  if (!supabaseId || !email) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 })
  }

  await prisma.user.upsert({
    where: { supabaseId },
    update: { email },
    create: { supabaseId, email, name: name || null },
  })

  return NextResponse.json({ ok: true })
}
