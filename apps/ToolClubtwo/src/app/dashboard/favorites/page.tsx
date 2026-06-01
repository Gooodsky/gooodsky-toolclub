import { Star } from 'lucide-react'

export default function FavoritesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800 text-center">我的收藏</h1>

      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-white/50 backdrop-blur-sm py-20">
        <Star size={32} className="mb-3 text-slate-300" />
        <p className="text-slate-500">还没有收藏任何商品详情</p>
        <p className="mt-1 text-sm text-slate-400">功能开发中，敬请期待</p>
      </div>
    </div>
  )
}
