'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const totalItems = useCart((state) => state.getTotalItems())

  const navItems = [
    { href: '/', label: 'ホーム' },
    { href: '/products', label: '商品一覧' },
    { href: '/coupons', label: 'クーポン' },
    { href: '/calendar', label: '営業日' },
    { href: '/mypage', label: 'マイページ' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🥐</span>
            <span className="font-bold text-amber-800">SOLEIL</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2">
              <ShoppingBag className="w-6 h-6 text-stone-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 lg:hidden"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-stone-600" />
              ) : (
                <Menu className="w-6 h-6 text-stone-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="py-4 border-t">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 px-3 rounded-lg ${
                      pathname === item.href
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
