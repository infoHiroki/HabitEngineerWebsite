# HabitEngineer Website

良い習慣をIT技術で定着させる専門家のウェブサイト

Hugo静的サイトジェネレーターで構築されています。

## 🚀 開発環境

### 必要なもの
- Hugo (extended版)

### インストール
```bash
# macOS
brew install hugo

# Windows
choco install hugo-extended

# Linux
snap install hugo
```

### 開発サーバー起動
```bash
hugo server
# または
hugo server --buildDrafts

# ブラウザで確認
open http://localhost:1313
```

## 📁 ファイル構造
```
├── content/              # コンテンツ
│   ├── _index.md        # トップページ
│   ├── services.md      # サービスページ
│   ├── results.md       # 実績ページ
│   └── about.md         # 事業者情報
├── layouts/             # テンプレート
│   ├── _default/
│   ├── partials/
│   └── index.html
├── static/              # 静的ファイル
│   ├── css/
│   └── js/
└── hugo.toml            # Hugo設定
```

## 🎨 デザインシステム
- **メインカラー**: 桜色 (#FFC0CB)
- **フォント**: Noto Sans JP
- **レスポンシブデザイン**: モバイルファースト

## 📝 コンテンツ管理

### ページの追加
```bash
hugo new content/new-page.md
```

### ブログ記事の追加
```bash
hugo new content/blog/2025-06-06-new-post.md
```

## 🚢 デプロイ

### GitHub Pages
1. GitHubリポジトリにpush
2. GitHub Actionsが自動でビルド・デプロイ
3. `https://[username].github.io/[repository-name]` でアクセス

### 手動ビルド
```bash
hugo --minify
# publicディレクトリに静的ファイル生成
```

## 🔧 技術スタック
- **Hugo**: 静的サイトジェネレーター
- **CSS**: カスタムCSS（変数使用）
- **JavaScript**: Vanilla JS
- **GitHub Actions**: 自動デプロイ

## 📱 対応ブラウザ
- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 🎯 特徴
- ✅ **超高速**: Hugo + 静的サイト
- ✅ **ゼロ依存関係**: Goバイナリのみ
- ✅ **SEO対応**: メタタグ・構造化データ
- ✅ **レスポンシブ**: モバイル対応
- ✅ **自動デプロイ**: GitHub Actions

## 🤝 貢献
プロジェクトへの貢献を歓迎します！

1. Fork
2. Feature branch作成
3. Commit
4. Push
5. Pull Request作成