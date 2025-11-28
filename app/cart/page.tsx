'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotalAmount, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <ShoppingBag className="w-16 h-16 text-stone-300 mb-4" />
        <h2 className="text-lg font-bold text-stone-600 mb-2">
          カートは空です
        </h2>
        <p className="text-sm text-stone-400 text-center mb-6">
          美味しいパンをカートに追加してください
        </p>
        <Button onClick={() => router.push('/products')}>
          商品を見る
        </Button>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 pb-32">
      <h1 className="text-xl font-bold text-stone-800 mb-4">カート</h1>

      {/* Cart Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-xl p-3 flex gap-3 shadow-sm"
          >
            {/* Product Image */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
              {item.product.imageUrl ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  🍞
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-stone-800 line-clamp-1">
                {item.product.name}
              </h3>
              <p className="text-amber-600 font-bold mt-1">
                ¥{item.product.price.toLocaleString()}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="w-7 h-7 bg-stone-100 rounded-full flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3 text-stone-600" />
                  </button>
                  <span className="w-6 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="w-7 h-7 bg-stone-100 rounded-full flex items-center justify-center"
                    disabled={
                      item.quantity >= Math.min(item.product.stock, item.product.maxReserveQty)
                    }
                  >
                    <Plus className="w-3 h-3 text-stone-600" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 text-stone-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clear Cart */}
      <button
        onClick={clearCart}
        className="w-full mt-4 py-2 text-sm text-stone-400 hover:text-red-500"
      >
        カートを空にする
      </button>

      {/* Summary */}
      <div className="bg-white rounded-xl p-4 mt-6 shadow-sm">
        <h3 className="font-bold text-stone-800 mb-3">注文内容</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>商品点数</span>
            <span>{items.reduce((sum, item) => sum + item.quantity, 0)}点</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>小計</span>
            <span>¥{getTotalAmount().toLocaleString()}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>合計</span>
              <span className="text-amber-600">
                ¥{getTotalAmount().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Point Earning Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
        <p className="text-sm text-amber-800">
          このお買い物で
          <span className="font-bold mx-1">
            {Math.floor(getTotalAmount() / 100)}ポイント
          </span>
          獲得できます！
        </p>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-stone-200">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={() => router.push('/reserve')}
            className="w-full"
            size="lg"
          >
            取り置き予約へ進む
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
