# Boulangerie SOLEIL - LINEミニアプリ

小売業（パン屋）向けのLINEミニアプリデモです。

## 機能一覧

### お客様向け機能
- **商品カタログ**: カテゴリ別商品一覧、新着・人気タグ、在庫数表示
- **取り置き予約**: 在庫連動フォーム、来店日時選択
- **クーポン**: 雨の日クーポン、初回来店クーポンなど
- **営業日カレンダー**: 定休日・臨時休業の表示
- **ポイント/スタンプ**: 100円=1pt
- **マイページ**: 予約履歴、ポイント履歴

### 管理者向け機能
- **ダッシュボード**: 売上・予約状況・在庫警告
- **商品管理**: 在庫管理、商品の追加・編集
- **予約管理**: 予約の確認・ステータス変更

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Prisma + SQLite (開発), PostgreSQL (本番)
- **状態管理**: Zustand
- **LINE連携**: LIFF SDK

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`を作成し、必要な値を設定してください。

```bash
cp .env.example .env
```

### 3. データベースのセットアップ

```bash
# マイグレーション実行
npx prisma migrate dev

# シードデータ投入
npx prisma db seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリにアクセスできます。

## LINE Developers設定

1. [LINE Developers Console](https://developers.line.biz/)でプロバイダーとチャネルを作成
2. LIFFアプリを追加し、エンドポイントURLを設定
3. LIFF IDを`.env`の`NEXT_PUBLIC_LIFF_ID`に設定

## Vercelへのデプロイ

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定:
   - `DATABASE_URL`: PostgreSQL接続文字列
   - `NEXT_PUBLIC_LIFF_ID`: LIFF ID
3. デプロイ後、LINE DevelopersでエンドポイントURLを更新

## ディレクトリ構造

```
├── app/                  # Next.js App Router
│   ├── (customer)/       # お客様向けページ
│   ├── (admin)/          # 管理画面
│   └── api/              # APIエンドポイント
├── components/           # Reactコンポーネント
├── hooks/                # カスタムフック
├── lib/                  # ユーティリティ
├── prisma/               # データベーススキーマ
└── types/                # 型定義
```

## 主要なページ

| パス | 説明 |
|------|------|
| `/` | ホーム（人気・新着商品） |
| `/products` | 商品一覧 |
| `/products/[id]` | 商品詳細 |
| `/cart` | カート |
| `/reserve` | 取り置き予約フォーム |
| `/coupons` | クーポン一覧 |
| `/calendar` | 営業日カレンダー |
| `/mypage` | マイページ |
| `/admin` | 管理画面ダッシュボード |

## ライセンス

MIT
