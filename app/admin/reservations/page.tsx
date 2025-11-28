import { prisma } from '@/lib/prisma'
import { Clock, User, Package } from 'lucide-react'

async function getReservations() {
  return await prisma.reservation.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { pickupDate: 'asc' },
  })
}

export default async function ReservationsPage() {
  const reservations = await getReservations()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '確認待ち' }
      case 'confirmed':
        return { bg: 'bg-green-100', text: 'text-green-800', label: '確認済' }
      case 'completed':
        return { bg: 'bg-stone-100', text: 'text-stone-800', label: '完了' }
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'キャンセル' }
      default:
        return { bg: 'bg-stone-100', text: 'text-stone-800', label: status }
    }
  }

  // Group reservations by date
  const groupedByDate = reservations.reduce((acc, reservation) => {
    const dateKey = new Date(reservation.pickupDate).toLocaleDateString('ja-JP')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(reservation)
    return acc
  }, {} as Record<string, typeof reservations>)

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">予約管理</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
            確認待ち: {reservations.filter((r) => r.status === 'pending').length}
          </span>
        </div>
      </div>

      {Object.keys(groupedByDate).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dayReservations]) => (
            <div key={date}>
              <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {date}
              </h2>
              <div className="space-y-3">
                {dayReservations.map((reservation) => {
                  const status = getStatusBadge(reservation.status)
                  return (
                    <div
                      key={reservation.id}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-stone-400" />
                            <span className="font-medium text-stone-800">
                              {reservation.user?.displayName || 'ゲスト'}
                            </span>
                          </div>
                          <p className="text-sm text-stone-500">
                            受取: {reservation.pickupTimeSlot}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="bg-stone-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-stone-600 mb-2">
                          <Package className="w-4 h-4" />
                          <span>予約商品</span>
                        </div>
                        <ul className="space-y-1">
                          {reservation.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.product.name} × {item.quantity}
                              </span>
                              <span className="text-stone-600">
                                ¥{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {reservation.status === 'pending' && (
                            <>
                              <form
                                action={`/api/reservations/${reservation.id}/confirm`}
                                method="POST"
                              >
                                <button
                                  type="submit"
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                >
                                  確認
                                </button>
                              </form>
                              <form
                                action={`/api/reservations/${reservation.id}/cancel`}
                                method="POST"
                              >
                                <button
                                  type="submit"
                                  className="px-3 py-1 bg-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-300"
                                >
                                  キャンセル
                                </button>
                              </form>
                            </>
                          )}
                          {reservation.status === 'confirmed' && (
                            <form
                              action={`/api/reservations/${reservation.id}/complete`}
                              method="POST"
                            >
                              <button
                                type="submit"
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                              >
                                受取完了
                              </button>
                            </form>
                          )}
                        </div>
                        <p className="text-lg font-bold text-amber-600">
                          ¥{reservation.totalAmount.toLocaleString()}
                        </p>
                      </div>

                      {reservation.note && (
                        <div className="mt-3 pt-3 border-t border-stone-100">
                          <p className="text-sm text-stone-500">
                            <span className="font-medium">備考:</span>{' '}
                            {reservation.note}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center text-stone-400">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>予約がありません</p>
        </div>
      )}
    </div>
  )
}
