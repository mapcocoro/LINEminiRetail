import { prisma } from '@/lib/prisma'
import CouponCard from '@/components/coupons/CouponCard'
import { CloudRain, Gift, Sparkles } from 'lucide-react'

async function getAvailableCoupons() {
  const now = new Date()
  return await prisma.coupon.findMany({
    where: {
      isActive: true,
      validFrom: { lte: now },
      validUntil: { gte: now },
    },
    orderBy: { validUntil: 'asc' },
  })
}

export default async function CouponsPage() {
  const coupons = await getAvailableCoupons()

  // Group by condition
  const rainCoupons = coupons.filter((c) => c.conditions === 'rain')
  const otherCoupons = coupons.filter((c) => c.conditions !== 'rain')

  return (
    <div className="px-4 py-4 space-y-6">
      <h1 className="text-xl font-bold text-stone-800">クーポン</h1>

      {/* Weather-based Coupons */}
      {rainCoupons.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CloudRain className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-bold text-stone-800">雨の日クーポン</h2>
          </div>
          <div className="space-y-3">
            {rainCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-2">
            ※ 雨の日にご来店時にご利用いただけます
          </p>
        </section>
      )}

      {/* Other Coupons */}
      {otherCoupons.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-bold text-stone-800">使えるクーポン</h2>
          </div>
          <div className="space-y-3">
            {otherCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {coupons.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">
            現在使えるクーポンはありません
          </p>
          <p className="text-sm text-stone-400 mt-2">
            新しいクーポンが発行されるとここに表示されます
          </p>
        </div>
      )}

      {/* How to Use */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-bold text-amber-800 mb-2">クーポンの使い方</h3>
        <ol className="text-sm text-amber-700 space-y-2">
          <li className="flex gap-2">
            <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs flex-shrink-0">
              1
            </span>
            <span>使いたいクーポンを選んでください</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs flex-shrink-0">
              2
            </span>
            <span>お会計時にスタッフにこの画面を見せてください</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs flex-shrink-0">
              3
            </span>
            <span>割引が適用されます</span>
          </li>
        </ol>
      </section>
    </div>
  )
}
