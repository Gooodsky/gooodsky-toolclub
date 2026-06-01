export interface PlatformConfig {
  key: string
  name: string
  color: string
  language: string
  languageLabel: string
  titleMaxChars: number
  bulletsCount: number
  bulletsMaxLen: number
  descMaxChars: number
  keywordsMaxLen: number
  tips: string
}

export const PLATFORMS: Record<string, PlatformConfig> = {
  'amazon-en': {
    key: 'amazon-en',
    name: 'Amazon US',
    color: '#ff9900',
    language: 'en',
    languageLabel: 'English',
    titleMaxChars: 200,
    bulletsCount: 5,
    bulletsMaxLen: 500,
    descMaxChars: 2000,
    keywordsMaxLen: 250,
    tips: 'Amazon 标题格式: Brand + Model + Key Feature + Product Type。五点描述每段首字母大写，突出核心卖点。关键词用空格分隔，不要逗号。',
  },
  'shopee-th': {
    key: 'shopee-th',
    name: 'Shopee 泰国',
    color: '#ee4d2d',
    language: 'th',
    languageLabel: 'ภาษาไทย',
    titleMaxChars: 60,
    bulletsCount: 0,
    bulletsMaxLen: 0,
    descMaxChars: 3000,
    keywordsMaxLen: 0,
    tips: 'Shopee 泰国标题简短，大量使用 emoji 和促销文案。描述可以很详细，注意融入本地化表达和热点话题。',
  },
  'shopee-id': {
    key: 'shopee-id',
    name: 'Shopee 印尼',
    color: '#ee4d2d',
    language: 'id',
    languageLabel: 'Bahasa Indonesia',
    titleMaxChars: 60,
    bulletsCount: 0,
    bulletsMaxLen: 0,
    descMaxChars: 3000,
    keywordsMaxLen: 0,
    tips: '印尼市场偏好清真认证标注，价格敏感型消费者居多。描述中强调性价比和产品认证。',
  },
  'lazada-th': {
    key: 'lazada-th',
    name: 'Lazada 泰国',
    color: '#0f1568',
    language: 'th',
    languageLabel: 'ภาษาไทย',
    titleMaxChars: 100,
    bulletsCount: 5,
    bulletsMaxLen: 60,
    descMaxChars: 3000,
    keywordsMaxLen: 0,
    tips: 'Lazada 标题可稍长，highlight 要点简短有力。描述区支持 HTML 富文本，可以使用加粗、换行、表情符号。',
  },
  'tiktok-th': {
    key: 'tiktok-th',
    name: 'TikTok Shop 泰国',
    color: '#000000',
    language: 'th',
    languageLabel: 'ภาษาไทย',
    titleMaxChars: 64,
    bulletsCount: 0,
    bulletsMaxLen: 0,
    descMaxChars: 1500,
    keywordsMaxLen: 0,
    tips: 'TikTok Shop 标题极短，强调视觉冲击力和紧迫感。描述中用口语化表达，适合短视频带货场景。',
  },
  'tiktok-id': {
    key: 'tiktok-id',
    name: 'TikTok Shop 印尼',
    color: '#000000',
    language: 'id',
    languageLabel: 'Bahasa Indonesia',
    titleMaxChars: 64,
    bulletsCount: 0,
    bulletsMaxLen: 0,
    descMaxChars: 1500,
    keywordsMaxLen: 0,
    tips: '印尼 TikTok Shop 用户年轻化，内容偏娱乐和创意。描述融合本地化俚语和流行趋势效果更佳。',
  },
  'shopee-vn': {
    key: 'shopee-vn',
    name: 'Shopee 越南',
    color: '#ee4d2d',
    language: 'vi',
    languageLabel: 'Tiếng Việt',
    titleMaxChars: 60,
    bulletsCount: 0,
    bulletsMaxLen: 0,
    descMaxChars: 3000,
    keywordsMaxLen: 0,
    tips: '越南消费者偏好性价比和正品保障，描述中强调产品质量和优惠活动。使用越南语声调符号。',
  },
  'lazada-vn': {
    key: 'lazada-vn',
    name: 'Lazada 越南',
    color: '#0f1568',
    language: 'vi',
    languageLabel: 'Tiếng Việt',
    titleMaxChars: 100,
    bulletsCount: 5,
    bulletsMaxLen: 60,
    descMaxChars: 3000,
    keywordsMaxLen: 0,
    tips: 'Lazada 越南站注重品牌信誉，highlight 要点简洁。描述支持富文本，可使用表情符号增强可读性。',
  },
  'tiktok-vn': {
    key: 'tiktok-vn',
    name: 'TikTok Shop 越南',
    color: '#000000',
    language: 'vi',
    languageLabel: 'Tiếng Việt',
    titleMaxChars: 64,
    bulletsCount: 0,
    bulletsMaxLen: 0,
    descMaxChars: 1500,
    keywordsMaxLen: 0,
    tips: '越南 TikTok 用户热衷短视频购物，文案需口语化、有感染力，融入本地流行语和热点话题。',
  },
}

export type PlatformKey = keyof typeof PLATFORMS

export const PLATFORM_LIST = Object.values(PLATFORMS)
