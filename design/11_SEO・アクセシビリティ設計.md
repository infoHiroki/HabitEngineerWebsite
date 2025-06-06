# SEO・アクセシビリティ設計

## SEO設計

### メタタグ設定
```html
<!-- 基本メタタグ -->
<title>{% if page.title %}{{ page.title }} | {% endif %}{{ site.title }}</title>
<meta name="description" content="{{ page.description | default: site.description }}">
<meta name="keywords" content="習慣形成,IT技術,業務改善,技術顧問,自動化,HabitEngineer">

<!-- OGP設定 -->
<meta property="og:title" content="{{ page.title | default: site.title }}">
<meta property="og:description" content="{{ page.description | default: site.description }}">
<meta property="og:image" content="{{ '/assets/images/ogp.png' | absolute_url }}">
<meta property="og:url" content="{{ page.url | absolute_url }}">
<meta property="og:type" content="{% if page.layout == 'post' %}article{% else %}website{% endif %}">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ page.title | default: site.title }}">
<meta name="twitter:description" content="{{ page.description | default: site.description }}">
<meta name="twitter:image" content="{{ '/assets/images/twitter-card.png' | absolute_url }}">
```

### 構造化データ
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HabitEngineer",
  "description": "良い習慣をIT技術で定着させる専門家",
  "url": "https://habitengineer.com",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "service@habitengineer.com",
    "contactType": "customer service"
  },
  "founder": {
    "@type": "Person",
    "name": "[代表者名]"
  },
  "sameAs": [
    "https://github.com/infoHiroki"
  ]
}
```

### URLクリーン設計
```
Good:
https://habitengineer.com/services/
https://habitengineer.com/results/cases/sakura-hospital/
https://habitengineer.com/blog/ai/llm-automation-tips/

Bad:
https://habitengineer.com/page.html
https://habitengineer.com/results?id=1
```

## アクセシビリティ設計

### セマンティックHTML
```html
<main role="main">
  <article>
    <header>
      <h1>記事タイトル</h1>
      <time datetime="2025-01-01">2025年1月1日</time>
    </header>
    
    <section>
      <h2>セクションタイトル</h2>
      <p>内容...</p>
    </section>
  </article>
</main>
```

### キーボードナビゲーション
```css
/* フォーカス表示 */
.btn:focus,
.nav-link:focus {
  outline: 2px solid var(--sakura-pink);
  outline-offset: 2px;
}

/* スキップリンク */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--sakura-pink);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}
```

### ARIA属性
```html
<!-- ナビゲーション -->
<nav aria-label="メインナビゲーション">
  <ul role="menubar">
    <li role="none">
      <a href="/" role="menuitem">トップ</a>
    </li>
  </ul>
</nav>

<!-- アコーディオン -->
<button 
  aria-expanded="false" 
  aria-controls="accordion-content-1"
  class="accordion-header">
  ソフトウェア開発
</button>
<div 
  id="accordion-content-1" 
  aria-hidden="true"
  class="accordion-content">
  内容...
</div>
```

## パフォーマンス設計

### 画像最適化
```html
<!-- レスポンシブ画像 -->
<picture>
  <source media="(min-width: 768px)" srcset="image-large.webp">
  <source media="(min-width: 400px)" srcset="image-medium.webp">
  <img src="image-small.webp" alt="説明文" loading="lazy">
</picture>
```

### CSS/JS最適化
```scss
// Critical CSS インライン化
// 非Critical CSS 遅延読み込み
<link rel="preload" href="/assets/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### Core Web Vitals対策
- LCP: ヒーロー画像の最適化
- FID: JavaScript最小化
- CLS: レイアウトシフト防止