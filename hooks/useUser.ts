'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserCoupon, PointHistory } from '@/types'

interface UserStore {
  user: User | null
  coupons: UserCoupon[]
  pointHistory: PointHistory[]
  setUser: (user: User | null) => void
  setCoupons: (coupons: UserCoupon[]) => void
  setPointHistory: (history: PointHistory[]) => void
  addPoints: (points: number) => void
  usePoints: (points: number) => void
  useCoupon: (couponId: string) => void
}

export const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      coupons: [],
      pointHistory: [],

      setUser: (user) => set({ user }),
      setCoupons: (coupons) => set({ coupons }),
      setPointHistory: (pointHistory) => set({ pointHistory }),

      addPoints: (points) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, totalPoints: state.user.totalPoints + points }
            : null,
        })),

      usePoints: (points) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                totalPoints: Math.max(0, state.user.totalPoints - points),
              }
            : null,
        })),

      useCoupon: (couponId) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.couponId === couponId
              ? { ...c, isUsed: true, usedAt: new Date() }
              : c
          ),
        })),
    }),
    {
      name: 'soleil-user',
    }
  )
)
