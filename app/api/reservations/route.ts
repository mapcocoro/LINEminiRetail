import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { getRequestUser } from '@/lib/auth'
import { parseReservationInput } from '@/lib/reservationInput'

export const dynamic = 'force-dynamic'

class OutOfStockError extends Error {}

// 自分の予約だけを返す
export async function GET(request: NextRequest) {
  const prisma = getPrisma()
  const user = await getRequestUser(request, prisma)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reservations = await prisma.reservation.findMany({
    where: { userId: user.id },
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
    const prisma = getPrisma()
    const user = await getRequestUser(request, prisma)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const input = parseReservationInput(body)
    if (typeof input === 'string') {
      return NextResponse.json({ error: input }, { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: { id: { in: input.items.map((item) => item.productId) }, isActive: true },
    })
    const productById = new Map(products.map((product) => [product.id, product]))

    // 単価と合計はDBの価格から計算する（クライアントの金額は使わない）
    const lineItems: { product: (typeof products)[number]; quantity: number }[] = []
    for (const item of input.items) {
      const product = productById.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: '取り扱いのない商品が含まれています' },
          { status: 400 }
        )
      }
      if (item.quantity > product.maxReserveQty) {
        return NextResponse.json(
          { error: `商品「${product.name}」の取り置きは${product.maxReserveQty}個までです` },
          { status: 400 }
        )
      }
      lineItems.push({ product, quantity: item.quantity })
    }
    const totalAmount = lineItems.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0
    )
    const pointsEarned = Math.floor(totalAmount / 100) // 100円で1ポイント

    // 在庫の確保・予約作成・ポイント付与を1つのトランザクションで行う
    const reservation = await prisma.$transaction(async (tx) => {
      for (const { product, quantity } of lineItems) {
        // 在庫が足りるときだけ減らす（同時に予約されても在庫がマイナスにならない）
        const { count } = await tx.product.updateMany({
          where: { id: product.id, isActive: true, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        })
        if (count !== 1) {
          throw new OutOfStockError(`商品「${product.name}」の在庫が不足しています`)
        }
      }

      const reservation = await tx.reservation.create({
        data: {
          userId: user.id,
          pickupDate: input.pickupDate,
          pickupTimeSlot: input.pickupTimeSlot,
          note: input.note,
          totalAmount,
          status: 'pending',
          items: {
            create: lineItems.map(({ product, quantity }) => ({
              productId: product.id,
              quantity,
              price: product.price,
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

      await tx.user.update({
        where: { id: user.id },
        data: {
          totalPoints: {
            increment: pointsEarned,
          },
        },
      })

      await tx.pointHistory.create({
        data: {
          userId: user.id,
          points: pointsEarned,
          type: 'earned',
          description: `取り置き予約 #${reservation.id.slice(-6)}`,
        },
      })

      return reservation
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    console.error('Reservation error:', error)
    return NextResponse.json(
      { error: '予約の作成に失敗しました' },
      { status: 500 }
    )
  }
}
