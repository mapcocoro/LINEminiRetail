import { prisma } from '@/lib/prisma'
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
} from 'lucide-react'

async function getDashboardStats() {
  const [
    productCount,
    lowStockProducts,
    pendingReservations,
    todayReservations,
    totalUsers,
    recentReservations,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: 5 } },
      orderBy: { stock: 'asc' },
      take: 5,
    }),
    prisma.reservation.count({ where: { status: 'pending' } }),
    prisma.reservation.count({
      where: {
        pickupDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    prisma.user.count(),
    prisma.reservation.findMany({
      include: {
        user: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return {
    productCount,
    lowStockProducts,
    pendingReservations,
    todayReservations,
    totalUsers,
    recentReservations,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-stone-100 text-stone-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-stone-100 text-stone-800'
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <h1 className="text-2xl font-bold text-stone-800">ダッシュボード</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">商品数</p>
              <p className="text-2xl font-bold text-stone-800">
                {stats.productCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">本日の予約</p>
              <p className="text-2xl font-bold text-stone-800">
                {stats.todayReservations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">確認待ち</p>
              <p className="text-2xl font-bold text-stone-800">
                {stats.pendingReservations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">会員数</p>
              <p className="text-2xl font-bold text-stone-800">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-stone-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-stone-800">在庫警告</h2>
          </div>
          <div className="p-4">
            {stats.lowStockProducts.length > 0 ? (
              <ul className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-stone-600">{product.name}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      残り {product.stock}個
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-stone-400 text-center py-4">
                在庫不足の商品はありません
              </p>
            )}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-stone-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h2 className="font-bold text-stone-800">最近の予約</h2>
          </div>
          <div className="p-4">
            {stats.recentReservations.length > 0 ? (
              <ul className="space-y-3">
                {stats.recentReservations.map((reservation) => (
                  <li
                    key={reservation.id}
                    className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-stone-800">
                        {reservation.user?.displayName || 'ゲスト'}
                      </p>
                      <p className="text-xs text-stone-400">
                        {new Date(reservation.pickupDate).toLocaleDateString('ja-JP')}{' '}
                        {reservation.pickupTimeSlot}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(
                          reservation.status
                        )}`}
                      >
                        {reservation.status === 'pending' && '確認待ち'}
                        {reservation.status === 'confirmed' && '確認済'}
                        {reservation.status === 'completed' && '完了'}
                        {reservation.status === 'cancelled' && 'キャンセル'}
                      </span>
                      <p className="text-sm font-bold text-stone-800 mt-1">
                        ¥{reservation.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-stone-400 text-center py-4">
                予約がありません
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
