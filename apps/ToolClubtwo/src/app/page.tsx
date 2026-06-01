import Link from 'next/link'
import { ArrowRight, Globe, Zap, Languages, FileText, ShoppingCart, CheckCircle, Blocks } from 'lucide-react'

const painPoints = [
  { icon: Globe, title: '多语言翻译贵且慢', desc: '专业翻译一条 Listing 收费 200-500 元，交付需 2-3 天。小卖家根本请不起。' },
  { icon: ShoppingCart, title: '不懂各平台规则', desc: 'Amazon 要五点描述、Shopee 要 emoji 标题、TikTok 要短而炸——各平台要求完全不同。' },
  { icon: Languages, title: '本地化不到位', desc: '机翻生硬，本地买家一看就划走。好的 Listing 要融入当地文化语境和搜索习惯。' },
]

const features = [
  { icon: Zap, title: 'AI 一键生成', desc: '输入中文产品信息，DeepSeek 大模型自动生成多语言、多平台商品详情页，秒级出稿。' },
  { icon: Globe, title: '5 大平台覆盖', desc: 'Amazon US、Shopee 泰国/印尼、Lazada 泰国、TikTok Shop 泰国，持续扩展中。' },
  { icon: FileText, title: '全字段输出', desc: '标题、五点描述、详情、搜索关键词——每个平台按规范格式输出，直接复制上架。' },
  { icon: CheckCircle, title: '本地化地道表达', desc: '不是机翻。AI 理解文化差异，泰语用 emoji、英语用 FAB 结构、印尼语强调清真认证。' },
]

const platforms = [
  { name: 'Amazon US', flag: '🇺🇸', lang: 'English' },
  { name: 'Shopee 泰国', flag: '🇹🇭', lang: 'ภาษาไทย' },
  { name: 'Shopee 印尼', flag: '🇮🇩', lang: 'Bahasa Indonesia' },
  { name: 'Lazada 泰国', flag: '🇹🇭', lang: 'ภาษาไทย' },
  { name: 'TikTok Shop 泰国', flag: '🇹🇭', lang: 'ภาษาไทย' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16 md:pt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/8 via-transparent to-transparent" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white/60 px-4 py-1.5 text-xs text-on-surface-variant backdrop-blur-sm">
            <Zap size={12} className="text-tertiary" />
            DeepSeek 大模型驱动 · 5 大平台覆盖
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-on-surface md:text-5xl lg:text-6xl">
            中文产品信息
            <br />
            <span className="text-gradient bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">秒变多语言 Listing</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-on-surface-variant">
            覆盖 Amazon、Shopee、Lazada、TikTok Shop，一条中文信息自动生成英语/泰语/印尼语商品详情页，让跨境生意无语言障碍
          </p>
          <div className="mb-10 flex items-center justify-center gap-8 md:gap-12">
            {[
              { num: '5', label: '平台覆盖' },
              { num: '4', label: '语种支持' },
              { num: '3s', label: '出稿速度' },
              { num: '¥0', label: '免费起步' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-secondary md:text-3xl">{num}</div>
                <div className="mt-1 text-xs text-on-surface-variant">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 text-base font-semibold text-on-primary shadow-elevation-2 transition hover:bg-primary-hover"
            >
              免费开始使用
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-on-surface">跨境 Listing 三大痛点</h2>
            <p className="mt-3 text-on-surface-variant">做过跨境的都懂</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {painPoints.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-lg border border-white/20 bg-white/50 backdrop-blur-sm p-6 shadow-elevation-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-secondary/10">
                  <Icon size={20} className="text-secondary" />
                </div>
                <h3 className="mb-2 font-semibold text-on-surface">{title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-on-surface">核心功能</h2>
            <p className="mt-3 text-on-surface-variant">为跨境电商卖家量身打造</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-lg border border-white/20 bg-white/50 backdrop-blur-sm p-6 shadow-elevation-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary-container">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-on-surface">{title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-on-surface">支持平台</h2>
            <p className="mt-3 text-on-surface-variant">持续扩展更多平台和语种</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {platforms.map(({ name, flag, lang }) => (
              <div key={name} className="rounded-lg border border-white/20 bg-white/50 backdrop-blur-sm p-5 text-center shadow-elevation-1">
                <div className="mb-2 text-2xl">{flag}</div>
                <h3 className="mb-1 text-sm font-semibold text-on-surface">{name}</h3>
                <p className="text-xs text-on-surface-variant">{lang}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross Product */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-on-surface">更多电商工具</h2>
            <p className="mt-3 text-on-surface-variant">ToolClub 旗下产品矩阵，覆盖国内电商与跨境电商全场景</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <a
              href="http://47.120.55.167"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 bg-white/50 backdrop-blur-sm p-6 shadow-elevation-1 transition hover:border-primary hover:shadow-elevation-2"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary-container">
                <Blocks size={20} className="text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-on-surface">多平台爆款文案生成助手</h3>
              <p className="mb-4 text-sm text-on-surface-variant">国内电商短视频文案 AI 生成，覆盖抖音、快手、小红书、视频号</p>
              <span className="text-xs text-primary font-medium">立即体验 →</span>
            </a>
            <div className="rounded-lg border border-white/20 bg-white/50 backdrop-blur-sm p-6 shadow-elevation-1">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-secondary/10">
                <Globe size={20} className="text-secondary" />
              </div>
              <h3 className="mb-2 font-semibold text-on-surface">跨境商品详情生成助手</h3>
              <p className="mb-4 text-sm text-on-surface-variant">跨境电商商品详情 AI 生成，支持 Amazon、Shopee、Lazada、TikTok Shop</p>
              <span className="text-xs text-secondary font-medium">← 当前工具</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-xl bg-gradient-to-r from-secondary to-primary p-12 text-center shadow-elevation-3 md:p-16">
          <h2 className="mb-3 text-3xl font-bold text-white">准备好出海了吗？</h2>
          <p className="mb-8 text-lg text-white/80">
            免费注册，即刻体验 AI 驱动的多语言商品详情生成
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md bg-white px-8 py-3.5 text-base font-semibold text-primary transition hover:bg-white/90 shadow-elevation-1"
          >
            免费开始使用
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </>
  )
}
