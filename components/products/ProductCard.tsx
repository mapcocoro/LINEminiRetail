'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Product } from '@/types'
import Badge from '@/components/ui/Badge'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock > 0) {
      addItem(product)
    }
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square bg-stone-100 flex items-center justify-center p-4">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-6xl">
            🍞
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge variant="new">NEW</Badge>}
          {product.isPopular && <Badge variant="popular">人気</Badge>}
        </div>

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="soldout">売り切れ</Badge>
          </div>
        )}

        {/* Add to Cart Button */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-stone-800 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-amber-700 font-bold">
            ¥{product.price.toLocaleString()}
          </span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-xs text-rose-500">残り{product.stock}個</span>
          )}
        </div>
      </div>
    </Link>
  )
}
