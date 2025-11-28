import Link from 'next/link'
import { ChevronRight, Clock, MapPin, Ticket, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/products/ProductCard'
import Badge from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

async function getPopularProducts() {
  return await prisma.product.findMany({
    where: { isActive: true, isPopular: true },
    include: { category: true },
    take: 4,
  })
}

async function getNewProducts() {
  return await prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: { category: true },
    take: 4,
  })
}

async function getActiveCoupons() {
  const now = new Date()
  return await prisma.coupon.findMany({
    where: {
      isActive: true,
      validFrom: { lte: now },
      validUntil: { gte: now },
    },
    take: 2,
  })
}

export default async function HomePage() {
  const [popularProducts, newProducts, coupons] = await Promise.all([
    getPopularProducts(),
    getNewProducts(),
    getActiveCoupons(),
  ])

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-b-3xl overflow-hidden">
        <div className="px-4 py-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-4xl">🥐</span>
            <div>
              <h1 className="text-2xl font-bold text-amber-900">
                Boulangerie SOLEIL
              </h1>
              <p className="text-sm text-amber-700">ブーランジェリー ソレイユ</p>
            </div>
          </div>
          <p className="text-amber-800 mt-3 text-sm">
            毎日焼きたてのパンをお届けします。
            <br />
            取り置き予約で人気商品を確実にGET!
          </p>

          {/* Store Info */}
          <div className="mt-4 flex items-center gap-4 text-xs text-amber-700">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>9:00-18:00</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>東京都渋谷区</span>
            </div>
          </div>
        </div>

        {/* Decorative bread icons */}
        <div className="absolute -right-4 top-4 text-6xl opacity-20 rotate-12">
          🍞
        </div>
        <div className="absolute right-8 bottom-2 text-4xl opacity-20 -rotate-12">
          🥖
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/reserve"
            className="bg-amber-600 text-white rounded-xl p-4 flex items-center gap-3 shadow-lg hover:bg-amber-700 transition-colors"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <p className="font-bold">取り置き予約</p>
              <p className="text-xs text-amber-100">人気商品をキープ</p>
            </div>
          </Link>
          <Link
            href="/coupons"
            className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-stone-200 hover:border-amber-300 transition-colors"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Ticket className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-stone-800">クーポン</p>
              <p className="text-xs text-stone-500">お得に買い物</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Active Coupons Banner */}
      {coupons.length > 0 && (
        <section className="px-4">
          <Link
            href="/coupons"
            className="block bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <div>
                  <p className="font-bold">使えるクーポンがあります!</p>
                  <p className="text-xs text-white/80">
                    {coupons[0].name}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        </section>
      )}

      {/* Popular Products */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <span>🔥</span> 人気商品
          </h2>
          <Link
            href="/products?filter=popular"
            className="text-sm text-amber-600 flex items-center"
          >
            もっと見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {popularProducts.length === 0 && (
            <p className="col-span-2 text-center text-stone-400 py-8">
              商品を準備中です
            </p>
          )}
        </div>
      </section>

      {/* New Products */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <Badge variant="new">NEW</Badge> 新商品
          </h2>
          <Link
            href="/products?filter=new"
            className="text-sm text-amber-600 flex items-center"
          >
            もっと見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {newProducts.length === 0 && (
            <p className="col-span-2 text-center text-stone-400 py-8">
              新商品を準備中です
            </p>
          )}
        </div>
      </section>

      {/* Store Notice */}
      <section className="px-4 pb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-bold text-amber-800 mb-2">営業のお知らせ</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>・毎週月曜日は定休日です</li>
            <li>・取り置きは前日18時までにお願いします</li>
            <li>・駐車場2台あり（店舗横）</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
