'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Minus, Plus, ShoppingBag, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const addItem = useCart((state) => state.addItem)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addItem(product, quantity)
      router.push('/cart')
    }
  }

  const maxQuantity = product
    ? Math.min(product.stock, product.maxReserveQty)
    : 1

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-square bg-stone-200" />
        <div className="p-4 space-y-4">
          <div className="h-6 bg-stone-200 rounded w-3/4" />
          <div className="h-8 bg-stone-200 rounded w-1/3" />
          <div className="h-20 bg-stone-200 rounded" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-400">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p>商品が見つかりませんでした</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          戻る
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-16 left-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md"
      >
        <ArrowLeft className="w-5 h-5 text-stone-600" />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square bg-stone-100 flex items-center justify-center p-8">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-8xl">
            🍞
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && <Badge variant="new">NEW</Badge>}
          {product.isPopular && <Badge variant="popular">人気</Badge>}
        </div>

        {/* Sold Out Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">売り切れ</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4">
        {/* Category */}
        {product.category && (
          <span className="text-xs text-amber-600 font-medium">
            {product.category.name}
          </span>
        )}

        {/* Name & Price */}
        <div>
          <h1 className="text-xl font-bold text-stone-800">{product.name}</h1>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            ¥{product.price.toLocaleString()}
            <span className="text-sm text-stone-400 font-normal ml-1">
              (税込)
            </span>
          </p>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {product.stock > 0 ? (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-green-600">
                在庫あり
                {product.stock <= 5 && (
                  <span className="text-rose-500 ml-2">
                    (残り{product.stock}個)
                  </span>
                )}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm text-red-600">在庫切れ</span>
            </>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-stone-600 text-sm leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Allergens */}
        {product.allergens && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <span className="font-medium">アレルゲン: </span>
              {product.allergens}
            </p>
          </div>
        )}

        {/* Quantity Selector */}
        {product.stock > 0 && (
          <div className="flex items-center justify-between bg-stone-100 rounded-lg p-3">
            <span className="text-sm text-stone-600">数量</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4 text-stone-600" />
              </button>
              <span className="text-lg font-bold w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                disabled={quantity >= maxQuantity}
              >
                <Plus className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          </div>
        )}

        {/* Reserve Limit Notice */}
        <p className="text-xs text-stone-400 text-center">
          ※ 1回のご注文につき{product.maxReserveQty}個までお取り置きできます
        </p>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-stone-200">
        <div className="max-w-lg mx-auto">
          {product.stock > 0 ? (
            <Button onClick={handleAddToCart} className="w-full" size="lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              カートに追加 ¥{(product.price * quantity).toLocaleString()}
            </Button>
          ) : (
            <Button disabled className="w-full" size="lg">
              売り切れ
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
