---
meta:
  title: FeedZero, a private RSS reader for your browser
  description: An open-source RSS reader for your browser. Blogs, news sites, newsletters, and podcasts in one inbox. Free, with encrypted sync across devices. No account, no ads, no tracking. Personal plan ($5/month) adds unlimited feeds, auto-organize, and smart filters. AGPL-3.0.
  keywords: RSS reader, open source RSS, browser RSS reader, Atom, JSON Feed, OPML, encrypted RSS sync, self-hosted RSS, private news reader, ad-free reader
  ogDescription: The web in one inbox. No algorithm, no ads, no tracking. Free in your browser, encrypted sync included. Unlimited feeds and power tools on the $5/month Personal plan. Open source.
  twitterDescription: The web in one inbox. No algorithm, no ads, no tracking. Free in your browser, encrypted sync included. Unlimited feeds and power tools on the $5/month Personal plan.
  ogImageAlt: Screenshot of FeedZero showing a three-pane reader with folders, an article list, and a featured story.
  jsonLdDescription: An open-source RSS reader for your browser. Subscribe to blogs, news sites, newsletters, and podcasts. End-to-end encrypted sync across devices, free on every tier. No accounts, no ads, no third-party tracking.
  featureList:
    - RSS, Atom, and JSON Feed support
    - OPML import and export with folder structure preserved
    - Works offline once articles have loaded
    - Keyboard navigation
    - End-to-end encrypted sync across devices (AES-256-GCM), included on every tier
    - Auto-organize folders by topic
    - "Smart filters: saved rules that match articles by keywords, date, feed, and read state"
    - Star articles to read later; offline prefetch of starred articles (Personal)
    - Full article text extraction
    - 1,300+ curated feeds in Explore
    - Self-hostable with one Docker command
    - No accounts, no ads, no third-party tracking

hero:
  heading: Your feeds. Your inbox. No algorithm.
  lede: An open-source RSS reader that runs in your browser. Blogs, news, newsletters, podcasts — sorted by date, never by algorithm.
  ctaPrimary:
    label: Open the app, it's free
    href: https://my.feedzero.app
  ctaSecondary:
    label: Try Personal, 30 days free
    href: https://my.feedzero.app/?subscribe=personal-monthly
  chips:
    - Free, sync included
    - End-to-end encrypted
    - No account, ever
    - 1,300+ feeds to browse
    - "[AGPL-3.0](https://github.com/forcingfx/feedzero)"

shutdown:
  heading: Coming from a shutdown?
  items:
    - text: "**Pocket** shut down 2025-11."
      linkLabel: Where to land →
      href: /pocket
    - text: "**Omnivore** shut down 2024-11."
      linkLabel: Where to land →
      href: /omnivore
    - text: "**TT-RSS** maintainer walked away 2025-11."
      linkLabel: Where to land →
      href: /tt-rss

about:
  eyebrow: The idea
  heading: A reader that just shows you what you follow.
  card:
    - Most sites publish a list of their new posts — a *feed*. FeedZero subscribes and shows everything in one inbox, sorted by date. No "for you", no promoted, no algorithm.
  compare: "Like Feedly, Inoreader, or NetNewsWire — but in your browser, open source, and your data stays on your device."
  body:
    - Currently in alpha (v{{version}}). Used daily by the people building it.

features:
  eyebrow: What it does
  heading: Everything a reader should do. Nothing it shouldn't.
  intro: Free covers most of it. Personal adds the heavy lifts.
  items:
    - id: any-feed
      eyebrow: Any feed
      badge: free
      title: Paste any URL. FeedZero finds the feed.
      desc: Blogs, podcasts, YouTube channels, Substacks, GitHub releases. If it ships a feed (most do), you can read it.
    - id: sync
      eyebrow: Sync
      badge: free
      title: Pick up where you left off, anywhere.
      desc: Subscriptions, folders, and read state follow you. Encrypted in your browser with a four-word passphrase — the server only ever sees ciphertext. Included on every tier.
    - id: keyboard
      eyebrow: Keyboard-driven
      badge: free
      title: Faster than scrolling Twitter.
      desc: Move with <kbd>j</kbd>/<kbd>k</kbd>, jump feeds with <kbd>u</kbd>, open the original with <kbd>o</kbd>. Or click. Both work the same way.
    - id: switch-readers
      eyebrow: Switch readers
      badge: free
      title: Bring your subscriptions. Folders and all.
      desc: Import OPML from Feedly, Inoreader, or NetNewsWire — folders preserved, not flattened. Export the same way, any time.
    - id: starring
      eyebrow: Starring
      badge: free
      title: Star now. Read later. Even offline.
      desc: Hit <kbd>s</kbd> to save any article. Personal also downloads the full text in the background — covered on the train, on the plane, anywhere.
    - id: auto-organize
      eyebrow: Auto-organize
      badge: paid
      title: A button that files your feeds for you.
      desc: One click and FeedZero sorts your subscriptions into topic folders. Tweak it, undo it. On-device, no AI.
    - id: smart-filters
      eyebrow: Smart Filters
      badge: paid
      title: Smart Playlists, for the news.
      desc: <em>"AI news, this week, unread."</em> Stack conditions with AND/OR/NOT and FeedZero keeps a live feed of every match. Syncs across devices.
    - id: discover
      eyebrow: Discover
      badge: free
      title: 1,300+ hand-picked feeds to start from.
      desc: Browse a curated catalog by topic and country. One click to subscribe.
    - id: full-text
      eyebrow: Full text
      badge: free
      title: Read the article, not the teaser.
      desc: When a feed only ships the first paragraph, FeedZero fetches the rest. Stay in the reader.
  miniHeading: And a handful of things that just work
  minis:
    - id: offline
      eyebrow: Offline
      badge: free
      title: Reads on the train.
      desc: Loaded articles stay readable without a connection.
    - id: mobile
      eyebrow: Mobile
      badge: free
      title: Phone-first, not afterthought.
      desc: Swipeable drawer, snap-scroll list, safe-area for the notch.
    - id: no-account
      eyebrow: No account
      badge: free
      title: No sign-up, ever.
      desc: No email, no password, no "sign in with Google." Sync uses a passphrase, not a login.
    - id: privacy
      eyebrow: Privacy
      badge: free
      title: Nobody's tracking your reading.
      desc: No ads, no analytics SDKs, no Tag Manager, no Pixel. We don't log what you read.
    - id: self-host
      eyebrow: Self-host
      badge: free
      title: Run your own, in three commands.
      desc: Docker, Caddy, automatic TLS. amd64 and arm64 on GHCR, Pi included.
    - id: agpl
      eyebrow: AGPL
      badge: free
      title: Read the code.
      desc: Every claim is auditable. Code on [GitHub](https://github.com/forcingfx/feedzero) under AGPL-3.0.
  ctaStrip:
    text: "**Curious yet?** Open the app. It's free, no sign-up. You'll be reading in 30 seconds."
    ctaLabel: Open the app →
    ctaHref: https://my.feedzero.app

compare:
  eyebrow: Versus the others
  heading: How FeedZero compares.
  intro: Same core job. The differences are platform, price, privacy, and how far the power tools go.
  columns:
    - id: feedzero
      name: FeedZero
      featured: true
    - id: feedly
      name: Feedly
    - id: inoreader
      name: Inoreader
    - id: reeder
      name: Reeder
    - id: netnewswire
      name: NetNewsWire
  groups:
    - heading: Platform & money
      rows:
        - label: Runs on
          cells:
            - "Any browser"
            - "Web, iOS, Android"
            - "Web, iOS, Android"
            - "Apple only"
            - "Apple only"
        - label: Free tier
          cells:
            - yes
            - "yes|with ads"
            - "yes|with ads"
            - no
            - yes
        - label: Paid plan starts at
          cells:
            - "$5/mo"
            - "$6/mo*"
            - "$9.99/mo*"
            - "$0.99/mo or one-time"
            - "Free"
        - label: Open source
          cells:
            - "yes|AGPL-3.0"
            - no
            - no
            - no
            - "yes|MIT"
        - label: Self-host the server
          cells:
            - yes
            - no
            - no
            - no
            - "—|native app, no server"
    - heading: Privacy
      rows:
        - label: Works without any account
          cells:
            - yes
            - "no|email + password"
            - "no|email + password"
            - "limited|Apple ID + sync provider"
            - "limited|Apple ID + sync provider"
        - label: End-to-end-encrypted sync, included
          cells:
            - yes
            - no
            - no
            - "—|via provider you choose"
            - "—|via provider you choose"
        - label: No ads, no third-party trackers
          cells:
            - yes
            - no
            - no
            - yes
            - yes
    - heading: Reading & organising
      rows:
        - label: Full-text article extraction
          cells:
            - yes
            - "limited|Pro tier"
            - "limited|Pro tier"
            - yes
            - yes
        - label: Offline reading with full-text prefetch
          cells:
            - "yes|Personal: starred + read-often"
            - "limited|Pro: offline mode only"
            - "limited|Pro: offline mode"
            - yes
            - yes
        - label: Star, with offline copy of starred
          cells:
            - "yes|Personal"
            - "limited|Pro Save for Later"
            - yes
            - yes
            - yes
        - label: One-click auto-organize folders
          cells:
            - "yes|Personal"
            - "limited|via Leo AI"
            - no
            - no
            - no
        - label: Folder colors + custom feed sort
          cells:
            - yes
            - "limited|Pro themes"
            - yes
            - "limited|sort only"
            - "limited|sort only"
    - heading: Power tools
      rows:
        - label: Smart filters (saved rule feeds)
          cells:
            - "yes|Personal"
            - "limited|Pro+ tier only"
            - "yes|Pro tier"
            - no
            - no
        - label: Per-feed rules (auto-actions on new articles)
          cells:
            - "yes|Personal"
            - "limited|Pro+ Mute Filters"
            - "yes|Pro tier"
            - no
            - no
        - label: Bridges — paste a Reddit, GitHub, Mastodon, or YouTube URL
          cells:
            - "yes|Personal, by URL pattern"
            - "limited|YouTube + Reddit"
            - "limited|YouTube + Reddit"
            - no
            - "limited|YouTube only"
        - label: Signal — trends across your feeds, on-device, no AI
          cells:
            - "yes|Personal"
            - "limited|Leo, cloud AI"
            - "limited|cross-user Trending"
            - no
            - no
  footnote: "*Cheapest paid tier on an annual plan, checked 2026-05; competitor pricing and feature tiers change — verify on their sites before deciding. \"Apple only\" means macOS, iOS, and iPadOS; FeedZero runs in any modern browser including Safari, Firefox, Chrome, and Edge. FeedZero is open source under [AGPL-3.0](https://github.com/forcingfx/feedzero); all other product names are trademarks of their respective owners."

pricing:
  eyebrow: What it costs
  heading: Free in your browser. $5 for the power tools.
  intro: Encrypted sync is included on every tier. Personal lifts the 50-feed cap and adds auto-organize, smart filters, and offline prefetch. Self-host unlocks everything, free.
  plans:
    - name: Free
      price: $0
      period: · forever
      summary: "Up to 50 feeds, with encrypted sync across devices. The full reader: keyboard shortcuts, full-text extraction, OPML with folders, 1,300+ feeds to browse, starring, offline reading, encrypted local storage. No card, no email."
      ctaLabel: Open the app →
      ctaHref: https://my.feedzero.app
      ctaStyle: secondary
    - name: Personal
      featured: true
      recommended: true
      price: 30 days free
      period: · then $5/mo USD
      summary: Everything in Free, plus unlimited feeds, auto-organize folders, smart filters, and offline prefetch of starred articles. Cancel anytime during the trial; no charge until day 31.
      ctaLabel: Start 30-day free trial
      ctaHref: https://my.feedzero.app/?subscribe=personal-monthly
      ctaStyle: primary
      annualLabel: or $50/yr, 30 days free, save 17%
      annualHref: https://my.feedzero.app/?subscribe=personal-yearly
    - name: Self-host
      selfHost: true
      price: $0
      period: · AGPL-3.0-or-later
      summary: "Your server, your data. Every Personal feature unlocked: unlimited feeds, auto-organize, smart filters, offline starred. Sync runs on your own server. No license check, no kill switch, no phoning home. Three commands to deploy."
      ctaLabel: Self-hosting guide →
      ctaHref: https://github.com/forcingfx/feedzero/blob/main/docs/self-hosting.md
      ctaStyle: secondary
  seeAll: Already a Personal subscriber? [Open the app](https://my.feedzero.app) and sign in with your license. One purchase, every device. &nbsp;·&nbsp; [See the full comparison →](/pricing)

faq:
  eyebrow: FAQ
  heading: Things people ask.
  items:
    - q: If it's open source, why does anything cost money?
      a:
        - The reader and encrypted sync are free — they cost us nothing. The Personal plan covers the heavy ones: auto-organize, smart filters, offline prefetch, and the lifted 50-feed cap. No VCs, no ads, no data sales. If you'd rather not pay, self-host. Same code, AGPL, free.
    - q: What if I cancel my subscription?
      a:
        - The reader keeps working. Sync keeps working — it's free for everyone. You lose auto-organize, smart filters, offline prefetch, and the 50-feed cap comes back. Re-subscribe any time, or export to OPML and walk away.
    - q: Is sync really private? You're storing my data.
      a:
        - Yes. Encryption happens in your browser with a four-word passphrase only you know. The server holds ciphertext it has no way to decrypt — not for support, not for a subpoena, not for us. Lose the passphrase and your cloud data is gone. There's no reset; that's the trade-off.
    - q: One license, multiple devices?
      a:
        - Yes. One Personal subscription covers every device. Enter your sync passphrase to restore, paste your license to unlock. No per-device fees, no seat limits.
    - q: What's the catch with "Free"?
      a:
        - "No catch. Full reader, same speed, same OPML export, same encrypted sync. Capped at 50 feed subscriptions; beyond that, subscribe or self-host."
    - q: Why should I care about RSS in 2026?
      a:
        - Every link you click is shaped by someone else's algorithm. RSS is the opposite: you pick what you follow, you see everything they publish, in the order it happened. A small, stubborn corner of the internet that still works.
    - q: What if FeedZero shuts down tomorrow?
      a:
        - Export to OPML in one click and import into any other reader. Or run the open-source build yourself: AGPL code, Docker image on GHCR, self-hosting guide in the repo. The format is yours.

privacy:
  eyebrow: Privacy
  heading: We can't read your data. By design.
  body:
    - Your subscriptions and reading history live in your browser, encrypted. Turn on sync and the server stores a vault it has no way to decrypt — the keys never leave your device.
    - No third-party trackers, no analytics SDKs, no ads. We don't log what you read. The server sees the feed addresses (it fetches them on your behalf); if that bothers you, self-host.
    - "For the curious: AES-GCM-256 with PBKDF2 at 600k iterations; sync keys derived from a four-word EFF-wordlist passphrase. Threat model and limits in [SECURITY.md](https://github.com/forcingfx/feedzero/blob/main/SECURITY.md)."

source:
  eyebrow: Open source
  heading: Read the code. Run your own.
  intro: Source on [GitHub](https://github.com/forcingfx/feedzero) under [AGPL-3.0-or-later](https://github.com/forcingfx/feedzero/blob/main/LICENSE). Audit it, fork it, send a patch.
  commandsIntro: "Self-hosting, three commands:"
  commands:
    - git clone https://github.com/forcingfx/feedzero.git
    - cd feedzero && cp .env.example .env
    - ./scripts/feedzero up
  outro: Automatic TLS, multi-arch images, one-command day-2 ops. Full walkthrough in the [self-hosting guide](https://github.com/forcingfx/feedzero/blob/main/docs/self-hosting.md).

releases:
  eyebrow: Changelog
  heading: What's new.
  intro: Newest first. Also an [Atom feed](/releases.xml).

footer:
  - label: Open app
    href: https://my.feedzero.app
  - label: Pricing
    href: /pricing
  - label: Source
    href: https://github.com/forcingfx/feedzero
  - label: Security
    href: https://github.com/forcingfx/feedzero/blob/main/SECURITY.md
  - label: Atom feed
    href: /releases.xml
  - label: Impressum
    href: /legal/impressum
  - label: Privacy
    href: /legal/privacy
  - label: Terms
    href: /legal/terms
---
