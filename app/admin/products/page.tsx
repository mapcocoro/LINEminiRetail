import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, AlertTriangle } from 'lucide-react'

async function getProducts() {
  return await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ category: { displayOrder: 'asc' } }, { name: 'asc' }],
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
  })
}

export default async function ProductsAdminPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  // Group by category
  const productsByCategory = categories.map((cat) => ({
    category: cat,
    products: products.filter((p) => p.categoryId === cat.id),
  }))

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">商品管理</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          <Plus className="w-4 h-4" />
          商品を追加
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-stone-800">{products.length}</p>
          <p className="text-sm text-stone-500">全商品</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.isActive).length}
          </p>
          <p className="text-sm text-stone-500">公開中</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">
            {products.filter((p) => p.stock <= 5).length}
          </p>
          <p className="text-sm text-stone-500">在庫少</p>
        </div>
      </div>

      {/* Products by Category */}
      {productsByCategory.map(({ category, products: catProducts }) => (
        <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50">
            <h2 className="font-bold text-stone-800">{category.name}</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {catProducts.length > 0 ? (
              catProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-2xl">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        '🍞'
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-stone-800">
                          {product.name}
                        </p>
                        {!product.isActive && (
                          <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs rounded-full">
                            非公開
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            NEW
                          </span>
                        )}
                        {product.isPopular && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                            人気
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-amber-600 font-bold">
                        ¥{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {product.stock <= 5 && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                        <span
                          className={`font-medium ${
                            product.stock === 0
                              ? 'text-red-600'
                              : product.stock <= 5
                              ? 'text-amber-600'
                              : 'text-stone-600'
                          }`}
                        >
                          在庫: {product.stock}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 text-stone-400 hover:text-stone-600"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-stone-400">
                商品がありません
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
