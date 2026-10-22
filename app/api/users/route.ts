import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// ログイン中のユーザー自身の情報だけを返す（他人のlineUserIdは指定できない）
export async function GET(request: NextRequest) {
  const prisma = getPrisma()
  const currentUser = await getRequestUser(request, prisma)
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    include: {
      coupons: {
        include: { coupon: true },
        where: {
          isUsed: false,
          coupon: {
            validUntil: { gte: new Date() },
          },
        },
      },
      pointHistory: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })

  return NextResponse.json(user)
}

// ユーザー登録（LINEで検証できたユーザーのみ）。プロフィールはIDトークンの内容を使う
export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma()
    const user = await getRequestUser(request, prisma)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ウェルカムクーポンは1人1回だけ付与する
    const welcomeCoupon = await prisma.coupon.findFirst({
      where: {
        conditions: 'first_visit',
        isActive: true,
      },
    })

    if (welcomeCoupon) {
      const alreadyGranted = await prisma.userCoupon.findFirst({
        where: { userId: user.id, couponId: welcomeCoupon.id },
      })
      if (!alreadyGranted) {
        await prisma.userCoupon.create({
          data: {
            userId: user.id,
            couponId: welcomeCoupon.id,
          },
        })
      }
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
