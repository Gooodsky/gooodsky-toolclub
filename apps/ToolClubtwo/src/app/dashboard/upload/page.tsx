'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createListingProject, batchCreateListingProjects, getRemainingCount } from '@/app/actions/generate'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'
import { useEffect } from 'react'

export default function NewListingPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [batchMode, setBatchMode] = useState(false)
  const [productNamesText, setProductNamesText] = useState('')
  const [selectedMarkets, setSelectedMarkets] = useState<Set<PlatformKey>>(new Set(['amazon-en']))
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    getRemainingCount().then(r => setRemaining(r.remaining))
  }, [])

  const productCount = batchMode
    ? productNamesText.split('\n').filter((s) => s.trim()).length
    : 1

  function toggleMarket(key: PlatformKey) {
    const next = new Set(selectedMarkets)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setSelectedMarkets(next)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')

    if (selectedMarkets.size === 0) {
      setError('请至少选择一个目标市场')
      setPending(false)
      return
    }

    const fd = new FormData(e.currentTarget)
    fd.set('markets', Array.from(selectedMarkets).join(','))

    if (batchMode) {
      fd.set('productNames', productNamesText)
      const result = await batchCreateListingProjects(fd)
      if (result?.error) {
        setError(result.error)
        setPending(false)
      } else {
        router.push(`/dashboard?batch=done&ok=${result.ok}`)
      }
    } else {
      const result = await createListingProject(fd)
      if (result?.error) {
        setError(result.error)
        setPending(false)
      } else if (result?.id) {
        router.push(`/dashboard/projects/${result.id}`)
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800">新建项目</h1>
        {remaining !== null && (
          <p className="mt-1 text-sm text-slate-500">
            今日剩余 {remaining} 次免费生成
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-100 bg-white/50 backdrop-blur-sm p-6">
        {/* 模式切换 */}
        <div className="mb-5 flex rounded-lg bg-slate-100 p-1">
          <button type="button" onClick={() => setBatchMode(false)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${!batchMode ? 'bg-[#4D6BFE] text-white' : 'text-slate-500'}`}>
            单个产品
          </button>
          <button type="button" onClick={() => setBatchMode(true)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${batchMode ? 'bg-[#4D6BFE] text-white' : 'text-slate-500'}`}>
            批量生成
          </button>
        </div>

        {/* 第一行两列：产品名称 + 产品信息 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {batchMode ? '产品名称（每行一个）' : '产品名称'}
            </label>
            {batchMode ? (
              <textarea name="productNames" value={productNamesText} onChange={(e) => setProductNamesText(e.target.value)} required rows={3}
                className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4D6BFE] focus:outline-none transition"
                placeholder="便携式电动榨汁杯&#10;宠物自动喂食器&#10;无线蓝牙耳机" />
            ) : (
              <textarea name="productName" required rows={3}
                className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4D6BFE] focus:outline-none transition"
                placeholder="例如：便携式电动榨汁杯、宠物自动喂食器" />
            )}
            <p className={`mt-1.5 text-xs text-slate-400 ${batchMode ? '' : 'invisible'}`}>
              {batchMode ? `已输入 ${productCount} 个产品${productCount > 20 ? '（最多20个）' : ''}` : ' '}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">产品信息{batchMode ? '（共用）' : ''}</label>
            <textarea name="productInfo" required rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4D6BFE] focus:outline-none transition"
              placeholder="核心卖点、规格参数、材质、适用场景、目标人群等，越详细效果越好" />
          </div>
        </div>

        {/* 目标市场 */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">目标市场</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(PLATFORMS).map(([key, platform]) => {
              const selected = selectedMarkets.has(key as PlatformKey)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleMarket(key as PlatformKey)}
                  className={`relative flex flex-col items-center rounded border px-0.5 py-0 text-center text-[10px] transition ${
                    selected
                      ? 'border-[#4D6BFE] bg-[#4D6BFE]/5 text-[#4D6BFE]'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {selected && (
                    <span className="absolute top-0 right-0.5 text-[10px] text-[#4D6BFE]">✔</span>
                  )}
                  <span className="font-medium leading-tight">{platform.name}</span>
                  <span className="opacity-60 leading-tight">{platform.languageLabel}</span>
                  <span className="opacity-40 leading-tight">{platform.titleMaxChars}字</span>
                </button>
              )
            })}
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">{error}</div>}

        <button
          type="submit"
          disabled={pending || selectedMarkets.size === 0 || (batchMode && productCount > 20)}
          className="w-full rounded-lg bg-[#4D6BFE] py-2.5 text-sm font-medium text-white transition hover:bg-[#3B53EB] disabled:opacity-40"
        >
          {pending ? '生成详情中...' : '生成商品详情'}
        </button>
      </form>
    </div>
  )
}
