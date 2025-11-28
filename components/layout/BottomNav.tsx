'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3X3, Ticket, Calendar, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'ホーム' },
    { href: '/products', icon: Grid3X3, label: '商品' },
    { href: '/coupons', icon: Ticket, label: 'クーポン' },
    { href: '/calendar', icon: Calendar, label: '営業日' },
    { href: '/mypage', icon: User, label: 'マイページ' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50">
      <div className="max-w-lg mx-auto">
        <ul className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center py-2 ${
                    isActive ? 'text-amber-600' : 'text-stone-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  )
}
