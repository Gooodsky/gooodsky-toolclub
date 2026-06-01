import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { CopyButton } from './copy-button'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await ensureUser()
  if (!user) redirect('/login')

  const { id } = await params
  const project = await prisma.listingProject.findUnique({
    where: { id },
    include: { listings: true },
  })

  if (!project || project.userId !== user.id) notFound()

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <a href="/dashboard" className="text-sm text-on-surface-variant hover:text-on-surface transition inline-flex items-center gap-1">
          <ArrowLeft size={14} />
          返回项目列表
        </a>
        <h1 className="mt-2 text-2xl font-bold text-on-surface">{project.productName}</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{project.productInfo}</p>
      </div>

      {project.status === 'FAILED' && (
        <div className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container">
          生成失败：{project.errorMessage || '未知错误'}
        </div>
      )}

      {project.status === 'GENERATING' && (
        <div className="mb-6 rounded-lg bg-primary-container px-4 py-3 text-sm text-on-primary-container flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          AI 正在生成多语言 Listing...
        </div>
      )}

      {project.listings.length === 0 && project.status !== 'GENERATING' && (
        <div className="flex justify-center py-16">
          <p className="text-on-surface-variant">暂无生成结果</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {project.listings.map((listing) => {
          const platform = PLATFORMS[listing.platform as PlatformKey]
          const bullets: string[] = listing.bullets ? JSON.parse(listing.bullets) : []

          return (
            <div key={listing.id} className="rounded-lg border border-outline-variant bg-surface p-5 shadow-elevation-1" style={{ borderTop: `3px solid ${platform?.color || '#ccc'}` }}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface">{platform?.name || listing.platform}</span>
                  <span className="ml-2 text-xs text-on-surface-variant">{platform?.languageLabel}</span>
                </div>
              </div>

              {/* Title */}
              <div className="mb-3">
                <h4 className="mb-1 text-xs font-medium text-on-surface-variant uppercase tracking-wider">标题</h4>
                <div className="flex items-start gap-2 group">
                  <p className="text-sm font-semibold text-on-surface flex-1">{listing.title}</p>
                  <CopyButton text={listing.title} />
                </div>
              </div>

              {/* Bullets */}
              {bullets.length > 0 && (
                <div className="mb-3">
                  <h4 className="mb-1 text-xs font-medium text-on-surface-variant uppercase tracking-wider">要点</h4>
                  <ul className="space-y-1">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                        <span className="flex-1">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="mb-3">
                <h4 className="mb-1 text-xs font-medium text-on-surface-variant uppercase tracking-wider">描述</h4>
                <div className="flex items-start gap-2 group">
                  <p className="text-sm text-on-surface-variant flex-1 whitespace-pre-wrap leading-relaxed">{listing.description}</p>
                  <CopyButton text={listing.description} />
                </div>
              </div>

              {/* Keywords */}
              {listing.keywords && (
                <div>
                  <h4 className="mb-1 text-xs font-medium text-on-surface-variant uppercase tracking-wider">搜索关键词</h4>
                  <div className="flex items-start gap-2 group">
                    <p className="text-sm text-on-surface-variant flex-1">{listing.keywords}</p>
                    <CopyButton text={listing.keywords} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
