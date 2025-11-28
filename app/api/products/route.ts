import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const filter = searchParams.get('filter')

  const where: Record<string, unknown> = { isActive: true }

  if (category) {
    const categoryRecord = await prisma.category.findUnique({
      where: { slug: category },
    })
    if (categoryRecord) {
      where.categoryId = categoryRecord.id
    }
  }

  if (filter === 'popular') {
    where.isPopular = true
  } else if (filter === 'new') {
    where.isNew = true
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}
