# HabitEngineer Website

良い習慣をIT技術で定着させる専門家のウェブサイト

## 開発環境

### eventmachine問題について
現在Ruby 3.4 + Apple Silicon環境でeventmachineのビルドエラーが発生しています。

### 解決策の選択肢

#### Option 1: Ruby 3.1を使用（推奨）
```bash
# rbenvでRuby 3.1をインストール
rbenv install 3.1.6
rbenv local 3.1.6

# 依存関係のインストール
bundle install

# ローカルサーバーの起動
bundle exec jekyll serve
```

#### Option 2: Dockerを使用
```bash
# Docker Composeで起動
docker-compose up
```

#### Option 3: GitHub Codespaces使用
GitHubでCodespacesを開いて開発

### セットアップ（Ruby 3.1環境）
```bash
bundle install
bundle exec jekyll serve
open http://localhost:4000
```

## デプロイ

### GitHub Pages
1. GitHubリポジトリにpush
2. GitHub Actionsが自動でビルド・デプロイ
3. `https://[username].github.io/[repository-name]` でアクセス可能

### カスタムドメイン設定
1. GitHub Pages設定でカスタムドメインを設定
2. DNS設定でCNAMEレコードを追加
3. `habitengineer.com` -> `[username].github.io`

## ファイル構造
```
├── _config.yml           # Jekyll設定
├── _layouts/             # レイアウトテンプレート
├── _includes/            # 部分テンプレート
├── _sass/                # SCSS変数・ミックスイン
├── assets/               # CSS、JS、画像
├── _posts/               # ブログ記事
├── _cases/               # 導入事例
├── _products/            # 開発製品
├── index.md              # トップページ
├── services.md           # サービスページ
├── results/              # 実績ページ
├── about.md              # 事業者情報
└── blog/                 # ブログ
```

## ページ追加方法

### ブログ記事
```bash
# _posts/YYYY-MM-DD-title.md形式で作成
touch _posts/2025-06-06-new-post.md
```

### 導入事例
```bash
# _cases/case-name.md形式で作成
touch _cases/sakura-hospital.md
```

### 開発製品
```bash
# _products/product-name.md形式で作成
touch _products/koemoji.md
```