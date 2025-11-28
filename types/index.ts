// Product types
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  categoryId: string
  stock: number
  maxReserveQty: number
  isNew: boolean
  isPopular: boolean
  isActive: boolean
  allergens: string | null
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  displayOrder: number
  imageUrl: string | null
  products?: Product[]
}

// Cart types
export interface CartItem {
  product: Product
  quantity: number
}

// User types
export interface User {
  id: string
  lineUserId: string
  displayName: string | null
  pictureUrl: string | null
  totalPoints: number
}

// Reservation types
export interface Reservation {
  id: string
  userId: string
  pickupDate: Date
  pickupTimeSlot: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  totalAmount: number
  note: string | null
  items: ReservationItem[]
}

export interface ReservationItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: Product
}

// Coupon types
export interface Coupon {
  id: string
  code: string
  name: string
  description: string | null
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number | null
  validFrom: Date
  validUntil: Date
  conditions: string | null
  isActive: boolean
}

export interface UserCoupon {
  id: string
  userId: string
  couponId: string
  isUsed: boolean
  usedAt: Date | null
  coupon?: Coupon
}

// Business Day types
export interface BusinessDay {
  id: string
  date: Date
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
  note: string | null
}

// Point types
export interface PointHistory {
  id: string
  userId: string
  points: number
  type: 'earned' | 'used' | 'expired' | 'bonus'
  description: string | null
  createdAt: Date
}

// Time slot for reservations
export const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
] as const

export type TimeSlot = (typeof TIME_SLOTS)[number]
