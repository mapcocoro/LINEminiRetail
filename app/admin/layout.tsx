import Link from 'next/link'
import { LayoutDashboard, Package, CalendarDays, Ticket, ClipboardList } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'ダッシュボード' },
    { href: '/admin/products', icon: Package, label: '商品管理' },
    { href: '/admin/reservations', icon: ClipboardList, label: '予約管理' },
    { href: '/admin/coupons', icon: Ticket, label: 'クーポン' },
    { href: '/admin/calendar', icon: CalendarDays, label: '営業日' },
  ]

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Admin Header */}
      <header className="bg-stone-800 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥐</span>
            <span className="font-bold">SOLEIL 管理画面</span>
          </div>
          <Link href="/" className="text-sm text-stone-400 hover:text-white">
            サイトを見る
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white min-h-[calc(100vh-52px)] shadow-sm hidden md:block">
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 md:hidden">
        <ul className="flex justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className="flex flex-col items-center py-2 text-stone-600"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label.slice(0, 4)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
