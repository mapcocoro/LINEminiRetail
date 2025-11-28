import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lineUserId = searchParams.get('lineUserId')

  if (!lineUserId) {
    return NextResponse.json(
      { error: 'lineUserId is required' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { lineUserId },
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

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(user)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lineUserId, displayName, pictureUrl } = body

    const user = await prisma.user.upsert({
      where: { lineUserId },
      update: {
        displayName,
        pictureUrl,
      },
      create: {
        lineUserId,
        displayName,
        pictureUrl,
      },
    })

    // If new user, give welcome coupon
    if (user.createdAt.getTime() > Date.now() - 1000) {
      const welcomeCoupon = await prisma.coupon.findFirst({
        where: {
          conditions: 'first_visit',
          isActive: true,
        },
      })

      if (welcomeCoupon) {
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
