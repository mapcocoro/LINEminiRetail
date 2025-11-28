import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // In real app, get user from session/LIFF
  // For demo, return all reservations
  const reservations = await prisma.reservation.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return NextResponse.json(reservations)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pickupDate, pickupTimeSlot, note, items, totalAmount } = body

    // In real app, get user from LIFF session
    // For demo, create or get a demo user
    let user = await prisma.user.findUnique({
      where: { lineUserId: 'demo-user' },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          lineUserId: 'demo-user',
          displayName: 'デモユーザー',
        },
      })
    }

    // Check stock availability
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `商品「${product?.name || item.productId}」の在庫が不足しています` },
          { status: 400 }
        )
      }
    }

    // Create reservation with items
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        pickupDate: new Date(pickupDate),
        pickupTimeSlot,
        note,
        totalAmount,
        status: 'pending',
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update stock (decrease by reserved quantity)
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    // Add points to user (1 point per 100 yen)
    const pointsEarned = Math.floor(totalAmount / 100)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalPoints: {
          increment: pointsEarned,
        },
      },
    })

    // Record point history
    await prisma.pointHistory.create({
      data: {
        userId: user.id,
        points: pointsEarned,
        type: 'earned',
        description: `取り置き予約 #${reservation.id.slice(-6)}`,
      },
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error('Reservation error:', error)
    return NextResponse.json(
      { error: '予約の作成に失敗しました' },
      { status: 500 }
    )
  }
}
