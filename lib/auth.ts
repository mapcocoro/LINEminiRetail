import type { PrismaClient } from '@prisma/client'

// LIFFのIDトークンを送るヘッダー（AuthorizationはBasic認証で使うため別名にする）
export const LINE_ID_TOKEN_HEADER = 'x-line-id-token'

const DEMO_LINE_USER_ID = 'demo-user'

interface LineProfile {
  lineUserId: string
  displayName?: string
  pictureUrl?: string
}

// LINEのverifyエンドポイントでIDトークンを検証し、本物のLINEユーザーIDを得る
async function verifyLineIdToken(idToken: string): Promise<LineProfile | null> {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID
  if (!channelId) return null

  const res = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
    cache: 'no-store',
  })
  if (!res.ok) return null

  const payload = await res.json()
  if (typeof payload.sub !== 'string') return null
  return {
    lineUserId: payload.sub,
    displayName: typeof payload.name === 'string' ? payload.name : undefined,
    pictureUrl: typeof payload.picture === 'string' ? payload.picture : undefined,
  }
}

/**
 * リクエストしてきたユーザーを特定する。クライアントが送ってくるlineUserIdは信用しない。
 * - IDトークンあり: LINEで検証できたユーザー
 * - IDトークンなし: DEMO_MODE=true のときだけデモユーザー
 * 特定できなければ null（呼び出し側で401を返す）
 */
export async function getRequestUser(request: Request, prisma: PrismaClient) {
  const idToken = request.headers.get(LINE_ID_TOKEN_HEADER)

  if (idToken) {
    const profile = await verifyLineIdToken(idToken)
    if (!profile) return null
    return prisma.user.upsert({
      where: { lineUserId: profile.lineUserId },
      update: { displayName: profile.displayName, pictureUrl: profile.pictureUrl },
      create: profile,
    })
  }

  if (process.env.DEMO_MODE === 'true') {
    return prisma.user.upsert({
      where: { lineUserId: DEMO_LINE_USER_ID },
      update: {},
      create: { lineUserId: DEMO_LINE_USER_ID, displayName: 'デモユーザー' },
    })
  }

  return null
}
