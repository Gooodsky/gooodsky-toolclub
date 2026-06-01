import Link from 'next/link'
import { ensureUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { PlusCircle, Globe, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string; ok?: string }>
}) {
  const user = await ensureUser()
  if (!user) redirect('/login')

  const { batch, ok } = await searchParams

  const projects = await prisma.listingProject.findMany({
    where: { userId: user.id },
    include: { listings: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const today = new Date().toISOString().slice(0, 10)
  const todayCount = user.dailyCountDate === today ? user.dailyCount : 0
  const limit = user.plan === 'free' ? 2 : 999
  const remaining = Math.max(0, limit - todayCount)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative mb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">我的项目</h1>
          <p className="mt-1 text-sm text-slate-500">
            {user.plan === 'free'
              ? `今日剩余 ${remaining} 次免费生成`
              : '不限次数生成'}
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-lg bg-[#4D6BFE] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3B53EB]"
        >
          <PlusCircle size={16} />
          新建项目
        </Link>
      </div>

      {batch === 'done' && (
        <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success border border-success/20">
          批量生成完成！成功 {ok || 0} 个产品，请查看下方项目列表。
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Globe size={48} className="mb-4 text-text-muted" />
          <h2 className="mb-2 text-lg font-semibold text-on-surface">还没有项目</h2>
          <p className="mb-6 text-sm text-on-surface-variant">创建第一个跨境 Listing 项目，体验 AI 多语言生成</p>
          <Link
            href="/dashboard/upload"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
          >
            开始创建
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => {
            const StatusIcon = p.status === 'COMPLETED' ? CheckCircle : p.status === 'FAILED' ? XCircle : Loader2
            const statusColor = p.status === 'COMPLETED' ? 'text-success' : p.status === 'FAILED' ? 'text-error' : 'text-tertiary'
            return (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface p-5 shadow-elevation-1 transition hover:shadow-elevation-2 hover:border-outline"
              >
                <div className="flex items-center gap-4">
                  <StatusIcon size={20} className={`${statusColor} ${p.status === 'GENERATING' ? 'animate-spin' : ''}`} />
                  <div>
                    <h3 className="font-semibold text-on-surface">{p.productName}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {p.targetMarkets.split(',').length} 个市场 · {p.listings.length} 条 Listing
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.errorMessage && (
                    <span className="text-xs text-error">{p.errorMessage}</span>
                  )}
                  <span className="text-xs text-on-surface-variant">
                    <Clock size={12} className="inline mr-1" />
                    {new Date(p.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
