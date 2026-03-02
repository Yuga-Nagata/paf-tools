# YouTube Song Searcher (paf-tools/songs)

paf-tools の一部として提供される、歌枠向けの YouTube 動画検索ツールです。
妻がIRIAMの歌枠で使える許諾済みYouTubeチャンネル群から、曲名で一括検索し、見つかる動画を最速で判断することを目的としています。

## 技術スタック
- **Frontend/Backend**: Next.js (App Router) / TypeScript
- **UI Components**: MUI (Material UI)
- **Data Acquisition**: `yt-dlp` (YouTube Data API v3 代替)
- **Database**: Local JSON Storage (`data/index.json`)
- **Automation**: GitHub Actions (Daily sync)

## セットアップ

1. **必要要件**
   - Node.js 20+
   - `yt-dlp` (実行環境の PATH に通っている必要があります)

2. **インストール**
   ```bash
   npm install
   ```

3. **環境変数**
   `.env.example` を `.env.local` にコピーし、値を設定してください。
   ```bash
   cp .env.example .env.local
   ```
   - `SYNC_TOKEN`: 同期 API を保護するためのパスワード文字列

## 使い方

### 開発サーバーの起動
```bash
npm run dev
```

### データの同期 (CLI)
ローカルでデータを同期する場合は CLI ツールを使用します。

```bash
# 日次更新 (既知の動画が見つかるまでスキャン)
npm run sync-daily

# 全件更新 (全動画をスキャン)
npx tsx scripts/sync-cli.ts --mode=full
```

### データの同期 (API)
HTTP POST 経由で同期を行うことも可能です。

```bash
curl -X POST "http://localhost:3000/api/sync?mode=daily" -H "x-sync-token: YOUR_SYNC_TOKEN"
```

## 自動更新 (GitHub Actions)
リポジトリの GitHub Actions が毎日午前3時（日本時間）に `yt-dlp` を使用して自動更新を行い、結果をリポジトリにコミットします。
Vercel などのホスティング環境では、コミットを検知して最新データが自動反映されます。

**設定方法**:
GitHub リポジトリの `Settings -> Secrets and variables -> Actions` に **`SYNC_TOKEN`** を登録してください。

## 検索ロジック
- **正規化**: 全角英数→半角、小文字化、記号→空白、**カタカナ→ひらがな変換**（かな検索対応）。
- **順序**: 
  1. **チャンネルの優先順位 (Rank)**: rank=1 のチャンネルが最優先で表示されます。
  2. **一致度スコア (Score)**: 同一 Rank 内ではタイトルのキーワード一致度が高い順に表示されます。

## テスト
```bash
npm run test
```
`vitest` を使用して、インデックス管理、検索ロジック、および `yt-dlp` 連携の単体テストを実行します。
