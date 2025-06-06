# Jekyll技術設計

## ディレクトリ構造
```
habitengineer-website/
├── _config.yml                 ← Jekyll設定
├── _layouts/                   ← レイアウトテンプレート
│   ├── default.html           ← 基本レイアウト
│   ├── page.html              ← 固定ページ用
│   ├── post.html              ← ブログ記事用
│   └── results.html           ← 実績ページ用
├── _includes/                  ← 部分テンプレート
│   ├── head.html              ← HTMLヘッダー
│   ├── sidebar.html           ← サイドバー
│   ├── footer.html            ← フッター
│   └── pagination.html        ← ページネーション
├── _sass/                      ← SCSSファイル
│   ├── _variables.scss        ← 変数定義
│   ├── _base.scss             ← 基本スタイル
│   ├── _layout.scss           ← レイアウト
│   ├── _components.scss       ← コンポーネント
│   └── _responsive.scss       ← レスポンシブ
├── assets/                     ← 静的ファイル
│   ├── css/
│   ├── js/
│   └── images/
├── _posts/                     ← ブログ記事
├── _data/                      ← データファイル
│   └── navigation.yml         ← ナビゲーション設定
├── index.md                   ← トップページ
├── services.md                ← サービスページ
├── results/                   ← 実績ページ
├── about.md                   ← 事業者情報
└── blog/
    └── index.html             ← ブログ一覧
```

## _config.yml設定
```yaml
title: HabitEngineer
description: 良い習慣をIT技術で定着させる専門家
url: https://habitengineer.com
baseurl: ""

# Build settings
markdown: kramdown
highlighter: rouge
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag

# Collections
collections:
  cases:
    output: true
    permalink: /results/cases/:name/
  products:
    output: true
    permalink: /results/products/:name/

# Pagination
paginate: 10
paginate_path: "/blog/page:num/"

# Defaults
defaults:
  - scope:
      path: ""
      type: "posts"
    values:
      layout: "post"
  - scope:
      path: ""
      type: "pages"
    values:
      layout: "page"
```

## データファイル設計

### _data/navigation.yml
```yaml
main:
  - name: "とは"
    url: "/"
  - name: "サービス"
    url: "/services/"
  - name: "実績"
    url: "/results/"
    submenu:
      - name: "導入事例"
        url: "/results/cases/"
      - name: "開発製品"
        url: "/results/products/"
  - name: "事業者情報"
    url: "/about/"
  - name: "ブログ"
    url: "/blog/"
```