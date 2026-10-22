// Cloudflareへアップロードする前に、秘密情報がWorkerに同梱されていないか確認する。
// OpenNextはビルド時に .env 系ファイルの中身をWorkerのコードに書き込むため、
// もともと公開される NEXT_PUBLIC_ 以外の値が入っていたらデプロイを止める。
// 使い方: opennextjs-cloudflare build の後に `node scripts/check-bundle-env.mjs`
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const BUNDLED_ENV = '.open-next/cloudflare/next-env.mjs'
const isAllowed = (key) => key.startsWith('NEXT_PUBLIC_')
const problems = []

// 1. Next.jsが読み込む .env 系ファイル（.env / .env.local / .env.production など）
const ENV_FILE = /^\.env(\.(development|production|test))?(\.local)?$/
for (const name of readdirSync(root).filter((n) => ENV_FILE.test(n))) {
  for (const line of readFileSync(path.join(root, name), 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match || isAllowed(match[1])) continue
    const value = match[2].trim().replace(/^(['"])(.*)\1$/, '$2')
    if (value !== '') problems.push(`${name} に ${match[1]}`)
  }
}

// 2. 実際にWorkerへ同梱される値（ビルド結果）
if (!existsSync(path.join(root, BUNDLED_ENV))) {
  console.error(`✖ ${BUNDLED_ENV} がありません。先に opennextjs-cloudflare build を実行してください。`)
  process.exit(1)
}
const bundled = await import(pathToFileURL(path.join(root, BUNDLED_ENV)).href)
for (const [mode, vars] of Object.entries(bundled)) {
  for (const key of Object.keys(vars ?? {})) {
    if (!isAllowed(key)) problems.push(`ビルド結果（${mode}）に ${key}`)
  }
}

if (problems.length > 0) {
  console.error('✖ デプロイを中止しました。秘密情報がWorkerに同梱されます（値は表示しません）:')
  for (const problem of [...new Set(problems)]) console.error(`  - ${problem}`)
  console.error('  .env 系ファイルから外し、本番の値は `npx wrangler secret put <名前>` で登録してください。')
  process.exit(1)
}
console.log('✔ Workerに同梱される環境変数は NEXT_PUBLIC_ のみです。')
