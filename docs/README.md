# HabitEngineer Website

## 概要

HabitEngineer（ハビットエンジニア）の公式ウェブサイトです。IT技術で習慣を定着させるサービスを提供しています。

**サイトURL**: https://habitengineer.com/

## 技術スタック

- **静的サイトジェネレーター**: Hugo
- **ホスティング**: Netlify
- **ソースコード管理**: GitHub
- **言語**: HTML, CSS, JavaScript, Markdown
- **デプロイ**: 自動デプロイ（GitHub → Netlify）

## プロジェクト構成

```
HabitEngineerWebsite/
├── content/                # コンテンツファイル
│   ├── blog/              # ブログ記事
│   ├── about.md           # 事業者情報
│   ├── products.md        # 開発製品
│   ├── services.md        # サービス
│   └── results/           # 実績
├── layouts/               # HTMLテンプレート
│   ├── _default/          # デフォルトレイアウト
│   ├── index.html         # トップページ
│   └── shortcodes/        # ショートコード
├── static/                # 静的ファイル
│   ├── css/               # スタイルシート
│   ├── images/            # 画像ファイル
│   └── js/                # JavaScript
├── hugo.toml              # Hugo設定ファイル
└── netlify.toml           # Netlify設定ファイル
```

## 開発環境のセットアップ

### 前提条件

- Hugo Extended版（バージョン 0.139.4 以上）
- Git
- Node.js（オプション）

### ローカル開発

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/infoHiroki/HabitEngineerWebsite.git
   cd HabitEngineerWebsite
   ```

2. **開発サーバーを起動**
   ```bash
   hugo server -D
   ```

3. **ブラウザでアクセス**
   ```
   http://localhost:1313
   ```

## ブログ記事の投稿

### 新しい記事の作成

```bash
hugo new blog/YYYY-MM-DD-記事タイトル.md
```

### 記事の編集

作成されたMarkdownファイルを編集します：

```markdown
---
title: "記事タイトル"
date: 2025-06-08T10:00:00+09:00
draft: false
categories: ["習慣形成"]
tags: ["習慣", "行動科学"]
---

記事の内容をここに記述...
```

### 公開手順

1. **ローカルでプレビュー**
   ```bash
   hugo server -D
   ```

2. **公開設定**
   - `draft: false` に設定

3. **GitHubにプッシュ**
   ```bash
   git add .
   git commit -m "新しいブログ記事を追加: 記事タイトル"
   git push origin master
   ```

4. **自動デプロイ**
   - NetlifyがGitHubの変更を検知し、自動的にサイトを更新

## デプロイメント

### 自動デプロイ

- **トリガー**: `master` ブランチへのプッシュ
- **ビルドコマンド**: `hugo --gc --minify`
- **公開ディレクトリ**: `public`
- **デプロイ時間**: 約1-2分

### 手動デプロイ

Netlifyの管理画面から手動でデプロイを実行することも可能です。

## カスタムドメイン設定

- **ドメイン**: habitengineer.com
- **DNS**: ムームードメインで管理
- **SSL証明書**: Netlifyで自動発行・更新

## ファイル管理

### 画像ファイル

- 配置場所: `static/images/`
- 参照方法: `/images/filename.jpg`

### CSS・JavaScript

- CSS: `static/css/style.css`
- JavaScript: `static/js/main.js`

## サイト設定

主要な設定は `hugo.toml` で管理：

- サイトタイトル、説明
- メニュー構成
- パーマリンク設定
- SEO設定

## SEO・パフォーマンス

- **サイトマップ**: 自動生成
- **RSS**: 自動生成
- **画像最適化**: Hugo内蔵機能
- **コード圧縮**: 本番ビルド時に自動実行

## トラブルシューティング

### よくある問題

1. **ビルドエラー**
   - Hugo Extended版が必要
   - 設定ファイルの構文確認

2. **画像が表示されない**
   - ファイルパスの確認
   - `static/` ディレクトリ配置の確認

3. **デプロイが失敗する**
   - Netlifyの管理画面でログ確認
   - ビルドコマンドの確認

### サポート

技術的な問題については、GitHubのIssuesまたはメールでお問い合わせください。

## ライセンス

© 2025 HabitEngineer. All rights reserved.

## 更新履歴

- **2025-06-08**: Netlifyへ移行、HTTPS対応
- **2025-06-06**: 初版リリース