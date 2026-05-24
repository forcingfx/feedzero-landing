---
meta:
  title: "Pricing: FeedZero"
  description: "FeedZero pricing in USD. Free in your browser, with encrypted sync across devices included. Hosted lifts the feed cap and adds auto-organize, smart filters, and offline starred. 30 days free, then $5 a month. Self-host for free."
  ogTitle: "Pricing, FeedZero"
  ogDescription: "Free in your browser, sync included. Hosted lifts the feed cap and adds auto-organize, smart filters, offline starred. 30 days free, then $5/month. Self-host for free."
  canonical: /pricing
heading: Pricing
lede: Free in your browser, with encrypted sync across devices included. Hosted lifts the feed cap and adds auto-organize, smart filters, and offline prefetch. 30-day free trial, then $5 a month. Self-host the whole thing for free. Prices in USD.
plans:
  - name: Free
    tagline: Open it and read. No account.
    price: $0
    period: · in your browser
    priceSub: No card, no email, no tracking.
    cta:
      label: Open the app →
      href: https://my.feedzero.app
      style: secondary
    features:
      - Up to 50 feed subscriptions
      - End-to-end encrypted sync across every device. Four-word passphrase, no account, no license
      - Access to 1,300+ curated feeds in Explore
      - OPML import and export with folder structure preserved
      - Full-text article extraction
      - Star articles to save them for later
      - Works offline once articles have loaded
      - Keyboard navigation and three-pane resizable desktop layout
      - No account. Data stays in your browser, AES-256-GCM encrypted at rest
      - Subscribe to Hosted or self-host (below) for unlimited feeds
  - name: Hosted
    featured: true
    recommended: true
    tagline: For power readers. Lift the feed cap, auto-file, save complex queries.
    price: 30 days free
    period: · then $5/month USD
    priceSub: Cancel anytime during the trial. No charge until day 31. Card required.
    cta:
      label: Start 30-day free trial
      href: https://my.feedzero.app/?subscribe=personal-monthly
      style: primary
    annual:
      label: or 30 days free, then $50/yr, save 17%
      href: https://my.feedzero.app/?subscribe=personal-yearly
    features:
      - heading: "Everything in Free, and:"
      - Unlimited feed subscriptions (the 50-feed cap lifts)
      - Auto-organize folders. FeedZero files your feeds by topic
      - Smart filters. Saved rules that pull matching articles into a live feed (like Smart Playlists for the news)
      - Offline prefetch of starred articles. Full text downloaded in the background for the train
      - Log in on any device with your license. One purchase, every device
selfHost:
  name: Self-host
  selfHost: true
  tagline: Run your own copy. Every shipped feature unlocked.
  price: $0
  period: · AGPL-3.0-or-later
  priceSub: For people who already run a server, or want to.
  cta:
    label: Self-hosting guide →
    href: https://github.com/forcingfx/feedzero/blob/main/docs/self-hosting.md
    style: secondary
  features:
    - Unlimited feeds. The 50-feed cap does not apply
    - "Every Hosted feature unlocked: auto-organize, smart filters, offline starred"
    - End-to-end encrypted sync runs on your own server, against your own vault store
    - One-command Docker deploy with Caddy + automatic TLS. Three commands from clone to running
    - Multi-arch images on GHCR (amd64 + arm64). Raspberry Pi included
    - Open source under AGPL-3.0-or-later. Fork it, audit it, modify it
    - No license check, no kill switch, no telemetry, no phoning home
    - You provide the server and pay its cost. We provide the code and docs
---
**Why pay for Hosted if self-host is free?** Convenience. Hosted is one click, no setup, automatic updates, and a backend we keep running for the heavier features. Self-host if you already run a server or want full control of where your data lives.

**Tax:** Prices in USD. The operator is below the local VAT registration threshold, so no tax is added at checkout. Where local VAT or sales-tax law obligates the consumer to self-account, that obligation rests with the consumer.

**Refund:** See our [refund policy](/legal/refund).

**EU 14-day withdrawal:** By starting your subscription you consent to immediate provision of digital content and waive the 14-day withdrawal right. See [Terms](/legal/terms).

**Privacy:** See our [privacy policy](/legal/privacy). We do not read your feeds or articles.
