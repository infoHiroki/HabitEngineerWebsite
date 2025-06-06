# Hugo実装設計書

## 実装方針

### KISS原則
- 最小限のレイアウトファイル
- シンプルなコンテンツ構造
- 既存CSSを最大活用
- 複雑なロジックを避ける

### Hugo構造方針
- Hugoの標準的な機能のみ使用
- カスタムレイアウトは必要最小限
- Markdownコンテンツ + Front matter
- 既存の`static/css/style.css`を活用

## ディレクトリ構造

```
content/
├── _index.md                    # トップページ
├── services/
│   └── _index.md               # サービス詳細ページ
├── results/
│   ├── _index.md               # 実績一覧ページ
│   ├── cases/
│   │   └── _index.md           # 導入事例一覧
│   └── products/
│       └── _index.md           # 開発製品一覧
├── about/
│   └── _index.md               # 事業者情報
└── blog/
    ├── _index.md               # ブログ一覧
    └── posts/                  # 個別記事

layouts/
├── _default/
│   ├── baseof.html             # ベーステンプレート
│   ├── single.html             # 単一ページ
│   └── list.html               # 一覧ページ
├── index.html                  # トップページ専用
├── services/
│   └── single.html             # サービスページ（カード表示）
├── results/
│   └── single.html             # 実績ページ（ナビカード表示）
└── partials/
    ├── navigation.html         # ナビゲーション
    ├── hero.html               # ヒーローセクション
    └── footer.html             # フッター
```

## レイアウト設計

### 1. ベーステンプレート (`layouts/_default/baseof.html`)
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ if .Title }}{{ .Title }} - {{ end }}{{ .Site.Title }}</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    {{ partial "navigation.html" . }}
    <main>
        {{ block "main" . }}{{ end }}
    </main>
    {{ partial "footer.html" . }}
</body>
</html>
```

### 2. サービスページレイアウト (`layouts/services/single.html`)
```html
{{ define "main" }}
<div class="hero-sub">
    <div class="container">
        <h1 class="page-title">{{ .Title }}</h1>
    </div>
</div>

<div class="page-content">
    <div class="container">
        <!-- サービス価格プラン -->
        <section class="section">
            <h2 class="section-title">契約形態</h2>
            <div class="service-plans">
                {{ range .Params.plans }}
                <div class="plan-card{{ if .recommended }} recommended{{ end }}">
                    {{ if .recommended }}<div class="plan-badge">推奨</div>{{ end }}
                    <h3>{{ .name }}</h3>
                    <div class="plan-price">{{ .price }}</div>
                    <p>{{ .description }}</p>
                </div>
                {{ end }}
            </div>
        </section>

        <!-- サービス内容 -->
        <section class="section section-gray">
            <h2 class="section-title">サービス内容</h2>
            <div class="service-grid">
                {{ range .Params.services }}
                <div class="service-card">
                    <h3>{{ .title }}</h3>
                    <p class="service-desc">{{ .description }}</p>
                    <ul class="service-points">
                        {{ range .points }}
                        <li>{{ . }}</li>
                        {{ end }}
                    </ul>
                    <div class="service-result">{{ .result }}</div>
                    <div class="service-contact">{{ .contact }}</div>
                </div>
                {{ end }}
            </div>
        </section>

        <!-- CTA -->
        <section class="section">
            <div class="cta-box">
                <h3>サービスについて相談する</h3>
                <div class="cta-buttons">
                    <a href="mailto:service@habitengineer.com" class="btn btn-primary">お問い合わせ</a>
                </div>
            </div>
        </section>
    </div>
</div>
{{ end }}
```

### 3. 実績ページレイアウト (`layouts/results/single.html`)
```html
{{ define "main" }}
<div class="hero-sub">
    <div class="container">
        <h1 class="page-title">{{ .Title }}</h1>
    </div>
</div>

<div class="page-content">
    <div class="container">
        <div class="results-navigation">
            {{ range .Params.navigation }}
            <a href="{{ .url }}" class="results-nav-card">
                <h2>{{ .title }}</h2>
                <p>{{ .description }}</p>
                <span class="link-arrow">→</span>
            </a>
            {{ end }}
        </div>
    </div>
</div>
{{ end }}
```

## コンテンツ設計

### サービスページのFront Matter
```yaml
---
title: "HabitEngineer 技術顧問サービス"
description: "良い業務習慣をIT技術で定着させ、継続的な成果を実現します"
plans:
  - name: "6ヶ月契約"
    price: "月額30,000円"
    description: "長期で関係性を深める"
    recommended: true
  - name: "3ヶ月契約"
    price: "月額50,000円"
    description: "短期集中型"
services:
  - title: "ソフトウェア開発"
    description: "業務効率化のためのツール開発"
    points:
      - "月間稼働時間：15時間"
      - "初回ヒアリング"
      - "月次提案"
    result: "実績：桜十字病院"
    contact: "窓口：dev@habitengineer.com"
---
```

### 実績ページのFront Matter
```yaml
---
title: "実績"
navigation:
  - title: "導入事例"
    description: "お客様への導入実績をご紹介"
    url: "/results/cases/"
  - title: "開発製品"
    description: "開発した製品・ツールのご紹介"
    url: "/results/products/"
---
```

## CSS活用方針
- 既存の`static/css/style.css`をそのまま活用
- 追加CSSは最小限
- カードレイアウト用のクラスを活用：
  - `.service-plans`、`.plan-card`
  - `.service-grid`、`.service-card`
  - `.results-navigation`、`.results-nav-card`

## 実装順序
1. コンテンツファイル作成（Front matter設定）
2. レイアウトファイル作成
3. 動作確認
4. スタイル微調整（必要最小限）

## デプロイ設定
- GitHub Actions (`.github/workflows/hugo.yml`)
- GitHub Pages
- ドメイン設定: habitengineer.com