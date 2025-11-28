'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Gift, History, ChevronRight, Star, Ticket, Bell } from 'lucide-react'

interface UserData {
  displayName: string
  pictureUrl?: string
  totalPoints: number
}

interface ReservationData {
  id: string
  pickupDate: string
  pickupTimeSlot: string
  status: string
  totalAmount: number
  items: { product: { name: string }; quantity: number }[]
}

export default function MyPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [reservations, setReservations] = useState<ReservationData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // In real app, fetch user data from API
        // For demo, using mock data
        setUser({
          displayName: 'ゲストユーザー',
          totalPoints: 150,
        })

        const res = await fetch('/api/reservations')
        if (res.ok) {
          const data = await res.json()
          setReservations(data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '確認待ち'
      case 'confirmed':
        return '確認済み'
      case 'completed':
        return '受取済み'
      case 'cancelled':
        return 'キャンセル'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-stone-100 text-stone-600'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-stone-100 text-stone-600'
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-4 space-y-4 animate-pulse">
        <div className="bg-white rounded-xl p-4 h-32" />
        <div className="bg-white rounded-xl p-4 h-48" />
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-xl font-bold text-stone-800">マイページ</h1>

      {/* User Card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            {user?.pictureUrl ? (
              <img
                src={user.pictureUrl}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-7 h-7" />
            )}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.displayName || 'ゲスト'}</p>
            <p className="text-sm text-white/80">会員</p>
          </div>
        </div>

        {/* Points */}
        <div className="bg-white/20 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span>ポイント</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">{user?.totalPoints || 0}</span>
            <span className="text-sm ml-1">pt</span>
          </div>
        </div>
        <p className="text-xs text-white/70 mt-2">100円のお買い上げで1ポイント獲得</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/coupons"
          className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
            <Ticket className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <p className="font-medium text-stone-800">クーポン</p>
            <p className="text-xs text-stone-400">2枚</p>
          </div>
        </Link>
        <Link
          href="/notifications"
          className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-stone-800">お知らせ</p>
            <p className="text-xs text-stone-400">新着1件</p>
          </div>
        </Link>
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-stone-800">予約履歴</h2>
          </div>
          <Link
            href="/mypage/reservations"
            className="text-sm text-amber-600 flex items-center"
          >
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {reservations.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {reservations.slice(0, 3).map((reservation) => (
              <div key={reservation.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-stone-500">
                    {new Date(reservation.pickupDate).toLocaleDateString('ja-JP')}{' '}
                    {reservation.pickupTimeSlot}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    {getStatusText(reservation.status)}
                  </span>
                </div>
                <div className="text-sm text-stone-600">
                  {reservation.items.map((item, i) => (
                    <span key={i}>
                      {item.product.name} × {item.quantity}
                      {i < reservation.items.length - 1 && '、'}
                    </span>
                  ))}
                </div>
                <p className="text-right text-amber-600 font-bold mt-1">
                  ¥{reservation.totalAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400">
            <Gift className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">予約履歴がありません</p>
          </div>
        )}
      </div>

      {/* Menu Links */}
      <div className="bg-white rounded-xl shadow-sm divide-y divide-stone-100">
        <Link
          href="/mypage/points"
          className="flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-600" />
            <span className="text-stone-800">ポイント履歴</span>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400" />
        </Link>
        <Link
          href="/mypage/coupons"
          className="flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5 text-amber-600" />
            <span className="text-stone-800">クーポン履歴</span>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400" />
        </Link>
      </div>

      {/* Settings */}
      <div className="text-center py-4">
        <button className="text-sm text-stone-400 hover:text-stone-600">
          ログアウト
        </button>
      </div>
    </div>
  )
}
