'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Calendar, Clock, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { TIME_SLOTS } from '@/types'

export default function ReservePage() {
  const router = useRouter()
  const { items, getTotalAmount, clearCart } = useCart()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Generate available dates (next 7 days, excluding past times)
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1))

  // Check if all items are still in stock
  const hasStockIssue = items.some((item) => item.quantity > item.product.stock)

  useEffect(() => {
    if (items.length === 0 && !isComplete) {
      router.push('/cart')
    }
  }, [items, router, isComplete])

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot || items.length === 0) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupDate: selectedDate.toISOString(),
          pickupTimeSlot: selectedTimeSlot,
          note,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalAmount: getTotalAmount(),
        }),
      })

      if (res.ok) {
        setIsComplete(true)
        clearCart()
      } else {
        alert('予約に失敗しました。もう一度お試しください。')
      }
    } catch {
      alert('エラーが発生しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">
          予約が完了しました！
        </h2>
        <p className="text-stone-600 mb-6">
          ご来店をお待ちしております。
          <br />
          予約内容はマイページからご確認いただけます。
        </p>
        <div className="space-y-3 w-full max-w-xs">
          <Button onClick={() => router.push('/mypage')} className="w-full">
            マイページを見る
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full"
          >
            ホームに戻る
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="px-4 py-4 pb-32">
      <h1 className="text-xl font-bold text-stone-800 mb-4">取り置き予約</h1>

      {/* Stock Warning */}
      {hasStockIssue && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            一部商品の在庫が不足しています。カートを確認してください。
          </p>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <h3 className="font-bold text-stone-800 mb-3">ご予約商品</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-stone-600">
                {item.product.name} × {item.quantity}
              </span>
              <span className="text-stone-800">
                ¥{(item.product.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>合計</span>
              <span className="text-amber-600">
                ¥{getTotalAmount().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-stone-800">受取日を選択</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {availableDates.map((date) => {
            const isSelected =
              selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  isSelected
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <div className="text-xs">
                  {format(date, 'M/d', { locale: ja })}
                </div>
                <div className="text-sm font-medium">
                  {format(date, 'E', { locale: ja })}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-stone-800">受取時間を選択</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedTimeSlot(slot)}
              className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                selectedTimeSlot === slot
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-stone-800">備考（任意）</h3>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="ご要望がありましたらご記入ください"
          className="w-full p-3 border border-stone-200 rounded-lg resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <ul className="space-y-1">
          <li>・ご予約の取り置き時間を過ぎますとキャンセルになります</li>
          <li>・お支払いは店頭にてお願いします</li>
          <li>・在庫状況により予約できない場合があります</li>
        </ul>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-stone-200">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTimeSlot || isSubmitting || hasStockIssue}
            isLoading={isSubmitting}
            className="w-full"
            size="lg"
          >
            予約を確定する
          </Button>
        </div>
      </div>
    </div>
  )
}
