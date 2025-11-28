import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'Boulangerie SOLEIL | ブーランジェリー ソレイユ',
  description: '地元で愛される街のパン屋さん。焼きたてパンの取り置き予約や、お得なクーポン情報をお届けします。',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen">
        <div className="max-w-lg mx-auto bg-[#faf7f5] min-h-screen">
          <Header />
          <main className="pb-20">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
