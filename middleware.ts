import { NextRequest, NextResponse } from 'next/server'

// サイト全体（管理画面・APIを含む）をBasic認証で保護する。
// VercelのHobbyプランでは本番URLにDeployment Protectionをかけられないため、アプリ側で守る。
export async function middleware(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER
  const password = process.env.BASIC_AUTH_PASSWORD

  if (!user || !password) {
    // ローカル開発では未設定でも通す。本番で未設定なら閉じる（設定漏れで公開されないように）
    if (process.env.NODE_ENV !== 'production') return NextResponse.next()
    return new NextResponse('Authentication is not configured', { status: 503 })
  }

  const credentials = decodeBasicAuth(request.headers.get('authorization'))
  if (credentials) {
    // ユーザー名が違っても必ずパスワードまで比較する（応答時間の差を出さない）
    const userMatches = await safeEqual(credentials.user, user)
    const passwordMatches = await safeEqual(credentials.password, password)
    if (userMatches && passwordMatches) return NextResponse.next()
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="SOLEIL demo", charset="UTF-8"' },
  })
}

function decodeBasicAuth(header: string | null) {
  if (!header?.startsWith('Basic ')) return null
  try {
    const bytes = Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0))
    const decoded = new TextDecoder().decode(bytes)
    const separator = decoded.indexOf(':')
    if (separator === -1) return null
    return { user: decoded.slice(0, separator), password: decoded.slice(separator + 1) }
  } catch {
    return null
  }
}

// 比較にかかる時間から正解を推測されないよう、ハッシュ同士を定数時間で比較する
async function safeEqual(a: string, b: string) {
  const encoder = new TextEncoder()
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ])
  const bytesA = new Uint8Array(hashA)
  const bytesB = new Uint8Array(hashB)
  let diff = 0
  for (let i = 0; i < bytesA.length; i++) diff |= bytesA[i] ^ bytesB[i]
  return diff === 0
}

export const config = {
  // JS/CSSの静的ファイル以外はすべて認証対象（画像最適化API /_next/image も含む）
  matcher: ['/((?!_next/static|favicon.ico).*)'],
}
