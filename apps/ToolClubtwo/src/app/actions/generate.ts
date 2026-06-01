'use server'

import { ensureUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateListings } from '@/lib/generate'
import type { PlatformKey } from '@/lib/platforms'
import { redirect } from 'next/navigation'

export async function createListingProject(formData: FormData) {
  const user = await ensureUser()
  if (!user) redirect('/login')

  const productName = (formData.get('productName') as string).trim()
  const productInfo = (formData.get('productInfo') as string).trim()
  const marketsStr = (formData.get('markets') as string).trim()

  if (!productName || !productInfo || !marketsStr) {
    return { error: '请填写完整信息' }
  }

  const marketKeys = marketsStr.split(',').filter(Boolean) as PlatformKey[]

  // Daily limit check for free users
  if (user.plan === 'free') {
    const today = new Date().toISOString().slice(0, 10)
    const count = user.dailyCountDate === today ? user.dailyCount : 0
    if (count >= 2) {
      return { error: '今日免费次数已用完，请升级会员' }
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { dailyCountDate: today, dailyCount: count + 1 },
    })
  }

  const project = await prisma.listingProject.create({
    data: {
      userId: user.id,
      productName,
      productInfo,
      targetMarkets: marketsStr,
      status: 'GENERATING',
    },
  })

  // Generate in background - results will populate
  try {
    const results = await generateListings(productName, productInfo, marketKeys)

    const listingData = Object.entries(results).map(([key, result]) => ({
      projectId: project.id,
      platform: key,
      language: key.split('-')[1],
      title: result.title,
      bullets: result.bullets.length > 0 ? JSON.stringify(result.bullets) : null,
      description: result.description,
      keywords: result.keywords || null,
    }))

    await prisma.listing.createMany({ data: listingData })
    await prisma.listingProject.update({
      where: { id: project.id },
      data: { status: 'COMPLETED' },
    })
  } catch (e) {
    await prisma.listingProject.update({
      where: { id: project.id },
      data: { status: 'FAILED', errorMessage: e instanceof Error ? e.message : '生成失败' },
    })
  }

  return { id: project.id }
}

export async function batchCreateListingProjects(formData: FormData) {
  const user = await ensureUser()
  if (!user) redirect('/login')

  const productNamesText = formData.get('productNames') as string
  const productInfo = formData.get('productInfo') as string
  const marketsStr = formData.get('markets') as string

  if (!productNamesText || !productInfo || !marketsStr) {
    return { error: '请填写所有必填项' }
  }

  const productNames = productNamesText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  if (productNames.length === 0) return { error: '请至少输入一个产品名称' }
  if (productNames.length > 20) return { error: '单次最多生成20个产品' }

  const marketKeys = marketsStr.split(',').filter(Boolean) as PlatformKey[]

  // Daily limit check for free users
  if (user.plan === 'free') {
    const today = new Date().toISOString().slice(0, 10)
    const count = user.dailyCountDate === today ? user.dailyCount : 0
    if (count + productNames.length > 2) {
      return { error: `今日最多还可生成 ${Math.max(0, 2 - count)} 个产品，请升级会员` }
    }
  }

  const results: { productName: string; projectId?: string; error?: string }[] = []

  for (const productName of productNames) {
    try {
      const project = await prisma.listingProject.create({
        data: {
          userId: user.id,
          productName,
          productInfo,
          targetMarkets: marketsStr,
          status: 'GENERATING',
        },
      })

      const genResults = await generateListings(productName, productInfo, marketKeys)

      const listingData = Object.entries(genResults).map(([key, result]) => ({
        projectId: project.id,
        platform: key,
        language: key.split('-')[1],
        title: result.title,
        bullets: result.bullets.length > 0 ? JSON.stringify(result.bullets) : null,
        description: result.description,
        keywords: result.keywords || null,
      }))

      await prisma.listing.createMany({ data: listingData })
      await prisma.listingProject.update({
        where: { id: project.id },
        data: { status: 'COMPLETED' },
      })

      results.push({ productName, projectId: project.id })
    } catch (e) {
      results.push({
        productName,
        error: e instanceof Error ? e.message : 'AI生成失败',
      })
    }
  }

  // Increment daily count by successful generations
  if (user.plan === 'free') {
    const today = new Date().toISOString().slice(0, 10)
    const currentCount = user.dailyCountDate === today ? user.dailyCount : 0
    const ok = results.filter((r) => r.projectId).length
    await prisma.user.update({
      where: { id: user.id },
      data: { dailyCountDate: today, dailyCount: currentCount + ok },
    })
  }

  const ok = results.filter((r) => r.projectId).length
  return { results, ok, total: productNames.length }
}

export async function getRemainingCount() {
  const user = await ensureUser()
  if (!user) return { remaining: 0, plan: 'free' as const }
  const today = new Date().toISOString().slice(0, 10)
  const todayCount = user.dailyCountDate === today ? user.dailyCount : 0
  const limit = user.plan === 'free' ? 2 : 999
  return { remaining: Math.max(0, limit - todayCount), plan: user.plan as string }
}
