# Boulangerie SOLEIL - LINEミニアプリ

パン屋向けのLINEミニアプリデモです。

## デモサイト

**https://lin-emini-retail.vercel.app**

## 機能一覧

### お客様向け機能
- **商品カタログ**: カテゴリ別商品一覧（食パン、菓子パン、惣菜パン、ハード系、サンドイッチ）
- **商品詳細**: かわいいイラスト、価格、在庫数、アレルゲン表示
- **カート機能**: 商品追加、数量変更、合計金額計算
- **取り置き予約**: 在庫連動フォーム、来店日時選択
- **クーポン**: 雨の日クーポン、初回来店クーポンなど
- **営業日カレンダー**: 定休日（毎週月曜日）、臨時休業の表示
- **ポイント/スタンプ**: 100円=1pt
- **マイページ**: 予約履歴、ポイント履歴

### 管理者向け機能 (`/admin`)
- **ダッシュボード**: 本日の予約、確認待ち、在庫警告、会員数
- **商品管理**: 在庫管理、商品の追加・編集
- **予約管理**: 予約の確認・ステータス変更

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| データベース | PostgreSQL (Neon on Vercel) |
| ORM | Prisma 6（driver adapter: pg） |
| 状態管理 | Zustand |
| アイコン | Lucide React |
| LINE連携 | LIFF SDK |
| ホスティング | Cloudflare Workers（OpenNext） |

## ローカル開発セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/mapcocoro/LINEminiRetail.git
cd LINEminiRetail
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. ローカル設定

`.dev.vars.example` を `.dev.vars` にコピーし、**ローカル用のDB**の接続先などを書きます（`npm run dev` と `npm run preview` の両方がここを読みます）。

```bash
cp .dev.vars.example .dev.vars
```

- **本番DBのURLは `.dev.vars` にも `.env` にも書かないでください。**
- `.env` 系ファイルには `NEXT_PUBLIC_` で始まる値だけを置きます。OpenNextはビルド時に `.env` の中身をWorkerに同梱するため、それ以外があると `npm run deploy` が自動チェックで止まります。

### 4. データベースのセットアップ

```bash
npx prisma generate
DATABASE_URL="<ローカルDBのURL>" npx prisma db push
DATABASE_URL="<ローカルDBのURL>" npm run db:seed   # 18商品、3クーポン、デモユーザー
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリにアクセスできます。

## Cloudflare Workersへのデプロイ

[OpenNext](https://opennext.js.org/cloudflare) でNext.jsをCloudflare Workers上で動かします（無料プランで動作）。DBはNeon PostgreSQLをそのまま使います。

### 1. 秘密情報を登録（初回のみ）
```bash
npx wrangler secret put DATABASE_URL         # Neonの接続文字列
npx wrangler secret put BASIC_AUTH_USER
npx wrangler secret put BASIC_AUTH_PASSWORD  # 長いランダムな文字列
```
`DEMO_MODE` は `wrangler.jsonc` の `vars` で `true` にしています。LINE連携時は `LINE_LOGIN_CHANNEL_ID` も `wrangler secret put` で登録します。

### 2. デプロイ
```bash
npm run deploy
```
`npm run deploy` はビルド後に `scripts/check-bundle-env.mjs` を実行し、Workerに同梱される環境変数に `NEXT_PUBLIC_` 以外が含まれていればアップロード前に中止します（OpenNextはビルド時に `.env` 系ファイルの中身を同梱するため）。`wrangler deploy` を直接使わず、必ず `npm run deploy` を使ってください。

### 3. ローカルでWorkerとして動かす
`.dev.vars`（「ローカル設定」参照）を用意してから:
```bash
npm run preview   # http://localhost:8787
```

### 4. DBのスキーマ変更・シード
ビルド時には自動でスキーマを反映しません。変更したときだけ、手元から実行します:
```bash
DATABASE_URL="<NeonのURL>" npm run db:push
DATABASE_URL="<NeonのURL>" npm run db:seed   # 既存データは消えます
```

### 環境変数
- `DATABASE_URL`: Neon接続文字列（secret）
- `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD`: サイト全体（管理画面・APIを含む）のBasic認証（secret）。**本番で未設定だと全ページ503になる**
- `DEMO_MODE`: `true` にするとLINEログインなしでデモユーザーとして予約できる
- `NEXT_PUBLIC_LIFF_ID`: LIFF ID（LINE連携時に設定。ビルド時に埋め込まれる）
- `LINE_LOGIN_CHANNEL_ID`: LINEログインチャネルID（LINE連携時に設定。IDトークンの検証に使う）

## ディレクトリ構造

```
LINEminiRetail/
├── app/
│   ├── page.tsx              # ホームページ
│   ├── products/             # 商品一覧・詳細
│   ├── cart/                 # カート
│   ├── reserve/              # 取り置き予約
│   ├── coupons/              # クーポン一覧
│   ├── calendar/             # 営業日カレンダー
│   ├── mypage/               # マイページ
│   ├── admin/                # 管理画面
│   │   ├── page.tsx          # ダッシュボード
│   │   ├── products/         # 商品管理
│   │   └── reservations/     # 予約管理
│   └── api/                  # APIエンドポイント
├── components/
│   ├── ui/                   # Button, Badge
│   ├── layout/               # Header, BottomNav
│   ├── products/             # ProductCard
│   ├── coupons/              # CouponCard
│   └── calendar/             # BusinessCalendar
├── hooks/
│   ├── useCart.ts            # カート状態管理
│   └── useUser.ts            # ユーザー状態管理
├── lib/
│   ├── prisma.ts             # Prismaクライアント
│   └── liff.ts               # LIFF初期化
├── prisma/
│   ├── schema.prisma         # DBスキーマ
│   └── seed.ts               # シードデータ
├── public/
│   └── images/products/      # 商品イラスト（SVG）
└── types/
    └── index.ts              # 型定義
```

## 主要なページ

| パス | 説明 |
|------|------|
| `/` | ホーム（人気・新着商品） |
| `/products` | 商品一覧（カテゴリフィルター） |
| `/products/[id]` | 商品詳細 |
| `/cart` | カート |
| `/reserve` | 取り置き予約フォーム |
| `/coupons` | クーポン一覧 |
| `/calendar` | 営業日カレンダー |
| `/mypage` | マイページ |
| `/admin` | 管理画面ダッシュボード |
| `/admin/products` | 商品管理 |
| `/admin/reservations` | 予約管理 |

## 商品カテゴリ

1. **食パン** - 極上生食パン、全粒粉食パン、レーズン食パン
2. **菓子パン** - クリームパン、メロンパン、あんパン、チョコクロワッサン、シナモンロール
3. **惣菜パン** - カレーパン、焼きそばパン、ピザパン、明太フランス
4. **ハード系** - バゲット、カンパーニュ、くるみパン
5. **サンドイッチ** - BLTサンド、たまごサンド、ハムチーズサンド

## LINE Developers設定（本番運用時）

1. [LINE Developers Console](https://developers.line.biz/)でプロバイダーとLINEログインチャネルを作成
2. LIFFアプリを追加
   - サイズ: Full
   - エンドポイントURL: `https://lin-emini-retail.vercel.app`
3. LIFF IDを環境変数`NEXT_PUBLIC_LIFF_ID`に、チャネルIDを`LINE_LOGIN_CHANNEL_ID`に設定
4. API呼び出し時に `liff.getIDToken()` の値を `X-Line-Id-Token` ヘッダーで送る（サーバー側でLINEに問い合わせて本人確認する。`DEMO_MODE` は外す）
5. LINE公式アカウントと連携（任意）

## 今後の拡張案

- [ ] オンライン決済（Stripe/PayPay）
- [ ] プッシュ通知（予約リマインダー）
- [ ] サブスクリプション（定期便）
- [ ] セグメント配信
- [ ] 購買履歴分析
- [ ] 売れ筋ランキング
- [ ] 在庫アラートのLINE通知

## ライセンス

MIT

## 作者

Generated with Claude Code
