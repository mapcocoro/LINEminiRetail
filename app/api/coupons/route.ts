import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const prisma = getPrisma()
  const now = new Date()

  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      validFrom: { lte: now },
      validUntil: { gte: now },
    },
    orderBy: { validUntil: 'asc' },
  })

  return NextResponse.json(coupons)
}
