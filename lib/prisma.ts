import { cache } from 'react'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * リクエストごとにPrismaClientを作る。
 * Cloudflare Workersではリクエストをまたいでコネクションを使い回せないため、グローバルに1つ持たない。
 * Server Componentの描画中は cache() で1リクエスト1つにまとまる（Route Handlerでは呼ぶたびに作られるので、1回だけ呼んで使い回す）。
 */
export const getPrisma = cache(() => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? '',
    maxUses: 1,
    // 1リクエスト1接続（Workersは同時接続数に上限があり、並列クエリはこの1本に順番に流す）
    max: 1,
  })
  return new PrismaClient({ adapter })
})
