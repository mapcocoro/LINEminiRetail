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
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| データベース | PostgreSQL (Neon on Vercel) |
| ORM | Prisma 5 |
| 状態管理 | Zustand |
| アイコン | Lucide React |
| LINE連携 | LIFF SDK |
| ホスティング | Vercel |

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

### 3. 環境変数の設定

`.env.example`をコピーして`.env`を作成し、必要な値を設定してください。

```bash
cp .env.example .env
```

**必要な環境変数:**
```env
# Database (ローカル開発用SQLite)
DATABASE_URL="file:./dev.db"

# LINE LIFF
NEXT_PUBLIC_LIFF_ID="your-liff-id-here"
```

### 4. データベースのセットアップ

```bash
# Prismaクライアント生成
npx prisma generate

# マイグレーション実行
npx prisma migrate dev

# シードデータ投入（18商品、3クーポン、デモユーザー）
npx prisma db seed
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリにアクセスできます。

## Vercelへのデプロイ

### 1. GitHubリポジトリをVercelに接続

### 2. Neon PostgreSQLデータベースを作成
- Vercel Dashboard → Storage → Create Database → Neon
- プロジェクトに接続

### 3. ビルド設定
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && prisma db push && next build`

### 4. 環境変数（自動設定される）
- `DATABASE_URL`: Neon接続文字列
- `NEXT_PUBLIC_LIFF_ID`: LIFF ID（LINE連携時に設定）

### 5. シードデータ投入
ローカルから本番DBに接続してシード実行：
```bash
# .envのDATABASE_URLをVercelのNeon URLに変更後
npx prisma db seed
```

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
3. LIFF IDを環境変数`NEXT_PUBLIC_LIFF_ID`に設定
4. LINE公式アカウントと連携（任意）

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
