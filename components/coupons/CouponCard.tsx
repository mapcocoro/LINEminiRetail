'use client'

import { Ticket, Clock, CloudRain } from 'lucide-react'
import type { Coupon as PrismaCoupon, UserCoupon as PrismaUserCoupon } from '@prisma/client'
import Button from '@/components/ui/Button'

interface CouponCardProps {
  coupon: PrismaCoupon
  userCoupon?: PrismaUserCoupon
  onUse?: () => void
}

export default function CouponCard({ coupon, userCoupon, onUse }: CouponCardProps) {
  const isUsed = userCoupon?.isUsed
  const isExpired = new Date(coupon.validUntil) < new Date()
  const isDisabled = isUsed || isExpired

  const getConditionIcon = () => {
    if (coupon.conditions === 'rain') return <CloudRain className="w-4 h-4" />
    return <Ticket className="w-4 h-4" />
  }

  const getConditionText = () => {
    switch (coupon.conditions) {
      case 'rain':
        return '雨の日限定'
      case 'first_visit':
        return '初回限定'
      case 'birthday':
        return '誕生日月限定'
      default:
        return null
    }
  }

  return (
    <div
      className={`relative bg-white rounded-xl overflow-hidden shadow-sm border-2 ${
        isDisabled ? 'border-stone-200 opacity-60' : 'border-amber-400'
      }`}
    >
      {/* Coupon Design - Left stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-2 ${
          isDisabled ? 'bg-stone-300' : 'bg-amber-500'
        }`}
      />

      <div className="pl-5 pr-4 py-4">
        {/* Condition Badge */}
        {coupon.conditions && (
          <div className="flex items-center gap-1 text-xs text-amber-700 mb-2">
            {getConditionIcon()}
            <span>{getConditionText()}</span>
          </div>
        )}

        {/* Discount Value */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className={`text-3xl font-bold ${isDisabled ? 'text-stone-400' : 'text-amber-600'}`}>
            {coupon.discountType === 'percentage'
              ? `${coupon.discountValue}%`
              : `¥${coupon.discountValue}`}
          </span>
          <span className="text-sm text-stone-500">OFF</span>
        </div>

        {/* Coupon Name */}
        <h3 className="font-medium text-stone-800 mb-2">{coupon.name}</h3>

        {/* Description */}
        {coupon.description && (
          <p className="text-xs text-stone-500 mb-2">{coupon.description}</p>
        )}

        {/* Min Purchase */}
        {coupon.minPurchase && (
          <p className="text-xs text-stone-400 mb-2">
            ¥{coupon.minPurchase.toLocaleString()}以上のご購入で利用可能
          </p>
        )}

        {/* Validity */}
        <div className="flex items-center gap-1 text-xs text-stone-400 mb-3">
          <Clock className="w-3 h-3" />
          <span>
            {new Date(coupon.validUntil).toLocaleDateString('ja-JP')}まで有効
          </span>
        </div>

        {/* Status / Action */}
        {isUsed ? (
          <div className="text-center py-2 text-stone-400 text-sm">使用済み</div>
        ) : isExpired ? (
          <div className="text-center py-2 text-stone-400 text-sm">期限切れ</div>
        ) : onUse ? (
          <Button onClick={onUse} size="sm" className="w-full">
            このクーポンを使う
          </Button>
        ) : null}
      </div>

      {/* Used Stamp */}
      {isUsed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg]">
          <div className="border-4 border-red-400 text-red-400 px-4 py-1 rounded-lg text-xl font-bold opacity-50">
            使用済
          </div>
        </div>
      )}
    </div>
  )
}
