import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// 全ページがリクエストごとの描画（force-dynamic）なので、キャッシュ用のR2/KVは使わない
export default defineCloudflareConfig()
