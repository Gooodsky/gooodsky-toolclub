import OpenAI from 'openai'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: 'https://api.deepseek.com',
})

interface ListingOutput {
  title: string
  bullets: string[]
  description: string
  keywords: string
}

function buildPrompt(productName: string, productInfo: string, platformKey: PlatformKey): string {
  const platform = PLATFORMS[platformKey]

  const bulletsSection = platform.bulletsCount > 0
    ? `- ${platform.bulletsCount} bullet points (max ${platform.bulletsMaxLen} chars each), each starting with a benefit or feature`
    : ''

  const keywordsSection = platform.keywordsMaxLen > 0
    ? `- Search keywords (max ${platform.keywordsMaxLen} chars), space-separated`
    : ''

  return `你是一个专业的跨境电商 Listing 优化专家。请为以下产品生成 ${platform.name} (${platform.languageLabel}) 的商品 Listing。

产品名称：${productName}
产品信息：${productInfo}

请用 ${platform.languageLabel} 输出，JSON 格式：
{
  "title": "商品标题 (max ${platform.titleMaxChars} chars)",
  ${platform.bulletsCount > 0 ? '"bullets": ["要点1", "要点2", ...],' : ''}
  "description": "商品描述 (max ${platform.descMaxChars} chars)",
  ${platform.keywordsMaxLen > 0 ? '"keywords": "搜索关键词"' : ''}
}

${platform.tips}

${bulletsSection}
${keywordsSection}

只返回 JSON，不要其他文字。`
}

async function aiGenerate(productName: string, productInfo: string, platformKey: PlatformKey): Promise<ListingOutput> {
  const prompt = buildPrompt(productName, productInfo, platformKey)

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      })

      const content = res.choices[0]?.message?.content || ''

      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON in response')

      const parsed = JSON.parse(jsonMatch[0]) as ListingOutput

      return {
        title: parsed.title || '',
        bullets: parsed.bullets || [],
        description: parsed.description || '',
        keywords: parsed.keywords || '',
      }
    } catch (e) {
      if (attempt === 2) throw e
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  throw new Error('AI 生成失败')
}

export async function generateListings(
  productName: string,
  productInfo: string,
  platformKeys: PlatformKey[],
) {
  const results: Record<string, ListingOutput> = {}

  for (const key of platformKeys) {
    results[key] = await aiGenerate(productName, productInfo, key)
  }

  return results
}
