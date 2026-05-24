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
  heading: What is this?
  card:
    - Almost every site on the internet (blogs, news outlets, YouTube channels, podcasts, even most newsletters) publishes a public list of its new posts. The list is called a *feed*. FeedZero subscribes to those feeds and pulls everything into one inbox, sorted by date.
    - That's it. No timeline algorithm reordering posts. No "for you" page. No promoted content. You pick what you follow, and you see everything they publish, in the order they wrote it.
  compare: "If you've used Feedly, Inoreader, NetNewsWire, or Reeder, FeedZero is the same idea. The differences: it runs in your browser, it's open source, and your data stays on your device."
  body:
    - Open [my.feedzero.app](https://my.feedzero.app) and start reading. No email, no password, no install. Your subscriptions and reading history live on your device, encrypted. If you want to read across devices, turn on encrypted sync. It's included on every tier and doesn't need an account. Or run the whole thing on your own server. The code is open source under [AGPL-3.0](https://github.com/forcingfx/feedzero/blob/main/LICENSE).
    - Currently in alpha (v{{version}}). Used daily by the people building it.

features:
  heading: Features
  intro: Most of FeedZero is free, including encrypted sync across devices. The Personal plan lifts the 50-feed cap and adds auto-organize, smart filters, and offline prefetch of starred articles. It's free for 30 days, and unlocked by default if you self-host.
  items:
    - id: any-feed
      eyebrow: Any feed
      badge: free
      title: Works with any site that publishes a feed.
      desc: Blogs, news sites, podcasts, YouTube channels, Substacks, GitHub releases. If it has a feed (most do), FeedZero reads it. Paste the address and the app finds the right URL automatically.
    - id: sync
      eyebrow: Sync
      badge: free
      title: Read on your laptop, pick up on your phone.
      desc: Turn on sync and your subscriptions, folders, and read state follow you to every device. Encryption happens in the browser using a four-word passphrase. The server only ever sees ciphertext, so we can't read your data. Sync is included on every tier, no account, no license.
    - id: keyboard
      eyebrow: Keyboard-driven
      badge: free
      title: Faster than scrolling Twitter.
      desc: Feeds load from memory. Articles switch instantly. Move with <kbd>j</kbd>/<kbd>k</kbd>, jump feeds with <kbd>u</kbd>, open the original with <kbd>o</kbd>. Or just click everything. Both work the same way.
    - id: switch-readers
      eyebrow: Switch readers
      badge: free
      title: Bring your subscriptions. Folders and all.
      desc: Coming from Feedly, Inoreader, or NetNewsWire? Import your OPML and the folders are preserved, not flattened. Want to leave? Export the same way. Your subscription list belongs to you.
    - id: starring
      eyebrow: Starring
      badge: free
      title: Star it now. Read it later. Even offline.
      desc: Hit <kbd>s</kbd> on any article to save it. Starred items land in a virtual feed in the sidebar, sorted by date. It's your "read later" pile, and it doesn't get lost in the flow. With sync (free), starred items follow you across devices. On Personal, FeedZero also downloads the full text of starred articles in the background, so the train ride home is covered.
    - id: auto-organize
      eyebrow: Auto-organize
      badge: paid
      title: A button that files your feeds for you.
      desc: Click the wand and FeedZero groups your feeds into topic folders (tech, news, science, design, sports, and more) based on what each feed actually publishes. Tweak the result, or undo it. No AI, no round trip to a server.
    - id: smart-filters
      eyebrow: Smart Filters
      badge: paid
      title: Smart Playlists, for the news.
      desc: Build a rule once and FeedZero keeps a live feed of every matching article. <em>"AI news, this week, unread."</em> <em>"Anything from these three feeds I starred."</em> <em>"Everything tagged 'launch'."</em> Stack conditions, nest them with AND/OR/NOT, sync them across devices. Like iTunes Smart Playlists, for your reading.
    - id: discover
      eyebrow: Discover
      badge: free
      title: 1,300+ hand-picked feeds to start from.
      desc: "Not sure what to follow? Browse a curated catalog: tech, world news, science, culture, finance, sports, design. Organized by topic and country. One click to subscribe."
    - id: full-text
      eyebrow: Full text
      badge: free
      title: Read the article, not just the teaser.
      desc: Some feeds publish only the first paragraph to drive clicks back to their site. FeedZero pulls the full article so you stay in the reader. No clickbait detour.
  miniHeading: And a handful of things that just work
  minis:
    - id: offline
      eyebrow: Offline
      badge: free
      title: Reads on the train.
      desc: Already-loaded articles stay readable even without a connection. Subway, plane, the back of the cafe with bad Wi-Fi.
    - id: mobile
      eyebrow: Mobile
      badge: free
      title: Phone-first, not phone-afterthought.
      desc: A swipeable bottom drawer for everything, snap-scroll between the article list and the reader, safe-area support for the notch and Dynamic Island.
    - id: no-account
      eyebrow: No account
      badge: free
      title: No sign-up, ever.
      desc: "No email, no password, no \"sign in with Google.\" Open the app and start reading. Sync is account-free too: a four-word passphrase, not a login."
    - id: privacy
      eyebrow: Privacy
      badge: free
      title: Nobody's tracking your reading.
      desc: No ads, no analytics SDKs, no Google Tag Manager, no Facebook Pixel. We don't log what you read or who you are. The privacy policy says it because the code does it.
    - id: self-host
      eyebrow: Self-host
      badge: free
      title: Run your own, in three commands.
      desc: Clone the repo, copy `.env.example`, run `./scripts/feedzero up`. Docker, Caddy, automatic TLS. amd64 and arm64 images on GHCR, including Raspberry Pi.
    - id: agpl
      eyebrow: AGPL
      badge: free
      title: Read the code.
      desc: Every claim on this page is checkable in the source. The code is on [GitHub](https://github.com/forcingfx/feedzero) under AGPL-3.0-or-later. Read it, fork it, run your own, send a patch.
  ctaStrip:
    text: "**Curious yet?** Open the app. It's free, no sign-up. You'll be reading in 30 seconds."
    ctaLabel: Open the app →
    ctaHref: https://my.feedzero.app

compare:
  heading: How FeedZero compares
  intro: "Every reader on this list does the same core job: subscribe to feeds, show new posts. The differences are platform, price, privacy, and how far the power tools go. Footnoted sources at the bottom."
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
  heading: Pricing
  intro: "Free in your browser, with encrypted sync across devices included. Unlimited feeds, auto-organize, smart filters, and offline prefetch are on the Personal plan: free for 30 days, then $5 a month. Or self-host the whole thing for free."
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
  heading: Common questions
  items:
    - q: If it's open source, why does anything cost money?
      a:
        - The reader runs in your browser, which costs us nothing, so it's free. Cross-device sync is free too, because reading across devices shouldn't sit behind a paywall. The Personal plan covers the heavier features: auto-organize, smart filters, offline prefetch of starred articles, and the lifted 50-feed cap.
        - The $5 covers it. No VCs, no ads, no upsells, no data sales. If you'd rather not pay, self-host. It's the same code, AGPL-licensed, free.
    - q: What if I cancel my subscription?
      a:
        - The reader keeps working. Everything you read locally stays local. Sync keeps working too; it's free for everyone. You lose auto-organize, smart filters, offline prefetch of starred articles, and the 50-feed cap comes back. You can re-subscribe any time, or export to OPML and walk away.
    - q: Is sync really private? You're storing my data on your server.
      a:
        - Yes. Encryption happens in your browser using a four-word passphrase that only you know. The server never sees that passphrase. It stores a blob of ciphertext that it has no way to decrypt: not for support, not for a subpoena, not for us.
        - Lose the passphrase and your cloud data is gone. There is no reset. That's the trade-off for the server never holding the key.
    - q: I bought a license. Can I use it on my other devices?
      a:
        - Yes. One Personal subscription covers every device you use. Open the app on a new laptop or phone, enter your sync passphrase to restore your subscriptions and read state, then paste your license token to unlock the Personal features. No per-device fees, no seat limits.
    - q: What's the catch with "Free"?
      a:
        - "No catch. The free tier is the full reader: same UI, same speed, same keyboard shortcuts, same OPML export, same encrypted sync across devices. You're capped at 50 feed subscriptions; beyond that, subscribe or self-host. No card, no email, no \"free for the first month then we charge you.\""
    - q: Why should I care about RSS in 2026?
      a:
        - Because every link you click is shaped by someone else's algorithm. RSS is the opposite: you pick what you follow, you see everything they publish, in the order it happened. No promoted posts. No "you might also like." No quietly-deprecated emails. It is a small, stubborn corner of the internet that still works the way you'd expect.
    - q: What happens if FeedZero shuts down tomorrow?
      a:
        - Export your subscriptions to OPML (one click, in Settings) and import them into any other reader. Or spin up the open-source build on your own server: the code is AGPL, the Docker image is on GHCR, the self-hosting guide is in the repo. The format is yours to take with you.

privacy:
  heading: Privacy
  body:
    - Your subscriptions and reading history live in your browser, encrypted at rest. When you turn on sync, the server stores an encrypted vault. The keys never leave the browser, so the server holds ciphertext and nothing else.
    - There are no third-party trackers, no ads, no analytics SDKs, no crash reporters. We count anonymous usage to know what's working. We don't log what you read or who you are. The server does see the addresses of the feeds you subscribe to, because it fetches them on your behalf. If that bothers you, self-host. The code is open source and reproducible.
    - "For the curious: local storage uses AES-GCM-256 with PBKDF2 key derivation at 600,000 iterations. Sync derives keys in the browser from a four-word passphrase generated from the EFF wordlist. Full threat model and known limitations are in [SECURITY.md](https://github.com/forcingfx/feedzero/blob/main/SECURITY.md)."

source:
  heading: Open source
  intro: Every claim on this page is auditable. The source is on [GitHub](https://github.com/forcingfx/feedzero) under [AGPL-3.0-or-later](https://github.com/forcingfx/feedzero/blob/main/LICENSE). Read it. Audit it. Fork it. Run your own copy. Send a patch.
  commandsIntro: "Self-hosting takes three commands once Docker is installed:"
  commands:
    - git clone https://github.com/forcingfx/feedzero.git
    - cd feedzero && cp .env.example .env
    - ./scripts/feedzero up
  outro: Caddy handles automatic TLS, multi-arch images (amd64 + arm64) ship from GHCR on every release, and day-2 ops (`update`, `backup`, `restore`, `logs`, `doctor`) are one command each. Full walkthrough in the [self-hosting guide](https://github.com/forcingfx/feedzero/blob/main/docs/self-hosting.md).

releases:
  heading: Release notes
  intro: What changed in each release, newest first. Also available as an [Atom feed](/releases.xml).

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
