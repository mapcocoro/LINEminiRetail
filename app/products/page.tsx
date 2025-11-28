import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/products/ProductCard'

export const dynamic = 'force-dynamic'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; filter?: string }>
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
  })
}

async function getProducts(categorySlug?: string, filter?: string) {
  const where: Record<string, unknown> = { isActive: true }

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    })
    if (category) {
      where.categoryId = category.id
    }
  }

  if (filter === 'popular') {
    where.isPopular = true
  } else if (filter === 'new') {
    where.isNew = true
  }

  return await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden">
          <div className="aspect-square bg-stone-200" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function ProductList({
  categorySlug,
  filter,
}: {
  categorySlug?: string
  filter?: string
}) {
  const products = await getProducts(categorySlug, filter)

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-stone-400">
        <p className="text-4xl mb-2">🍞</p>
        <p>該当する商品がありません</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const categories = await getCategories()
  const currentCategory = params.category
  const currentFilter = params.filter

  const getFilterTitle = () => {
    if (currentFilter === 'popular') return '人気商品'
    if (currentFilter === 'new') return '新商品'
    if (currentCategory) {
      const cat = categories.find((c) => c.slug === currentCategory)
      return cat?.name || '商品一覧'
    }
    return '商品一覧'
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Page Title */}
      <h1 className="text-xl font-bold text-stone-800">{getFilterTitle()}</h1>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
        <a
          href="/products"
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !currentCategory && !currentFilter
              ? 'bg-amber-600 text-white'
              : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          すべて
        </a>
        {categories.map((category) => (
          <a
            key={category.id}
            href={`/products?category=${category.slug}`}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentCategory === category.slug
                ? 'bg-amber-600 text-white'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            {category.name}
          </a>
        ))}
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2">
        <a
          href="/products?filter=popular"
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentFilter === 'popular'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          🔥 人気
        </a>
        <a
          href="/products?filter=new"
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentFilter === 'new'
              ? 'bg-green-100 text-green-700'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          ✨ 新商品
        </a>
      </div>

      {/* Products Grid */}
      <Suspense fallback={<ProductsLoading />}>
        <ProductList categorySlug={currentCategory} filter={currentFilter} />
      </Suspense>
    </div>
  )
}
