# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for **FeedZero** (feedzero.app), a privacy-first RSS reader. Static site — no framework, no runtime dependencies. One small Node build step for release notes (see below).

- **Live site:** https://feedzero.app
- **App:** https://my.feedzero.app
- **Source (main app):** https://github.com/forcingfx/feedzero
- **Source (this landing site):** https://github.com/forcingfx/feedzero-landing
- **Release feed:** https://feedzero.app/releases.xml (Atom, consumed by the app)

## Architecture

The landing page is a single `index.html` with inline CSS + a tiny scroll-detection script. Assets: `favicon.svg`, `screenshot.png`.

**Release notes** live in `releases.mjs` (source of truth) and are compiled to two static files by `build-releases.mjs`:

- `releases.xml` — Atom feed served at `/releases.xml` with CORS open so the app can fetch it cross-origin.
- `releases/index.html` — standalone release-notes page linked from the topnav.

The app (my.feedzero.app) subscribes to `https://feedzero.app/releases.xml` for its "What's new" feature. The feed's `<id>` (`feedzero:changelog`) and entry IDs (`feedzero:release:<version>`) must stay stable — changing them makes existing subscribers re-import every entry as "new".

Deployed on **Vercel**. `vercel.json` configures security headers (HSTS, X-Frame-Options DENY, no-referrer, nosniff) plus `Content-Type: application/atom+xml`, `Cache-Control: public, max-age=3600`, and `Access-Control-Allow-Origin: *` for `/releases.xml`.

## Development

No lint or test commands. To preview locally:

```sh
python3 -m http.server 8000
```

**Cutting a new release:**

1. Add a new entry at the top of the `releases` array in `releases.mjs`. Preserve old entries — they're the published history.
2. Run `node build-releases.mjs` to regenerate `releases.xml` and `releases/index.html`.
3. Commit all three files (`releases.mjs`, `releases.xml`, `releases/index.html`).
4. Deploy. The app picks up the new entry on its next refresh.

## Screenshot

`take-screenshot.mjs` captures the app's Explore tab using Playwright from the sister repo (`../feedzero`). It auto-starts the Vite dev server, dismisses the changelog dialog, and saves `screenshot.png`.

```sh
node take-screenshot.mjs                    # auto-starts dev server on :3001
node take-screenshot.mjs --url http://...   # uses an already-running instance
```

The version string in `localStorage` (`feedzero:last-seen-version`) must match `APP_VERSION` in the app's `changelog-bento.tsx` to suppress the changelog dialog.

## Design Notes

- Brand palette: white background, slate text (`#0f172a`), light blue accents (`#38bdf8` / `#0284c7`), black/white CTAs
- Mobile-responsive at 768px and 480px breakpoints
- Currently marked "Alpha v0.2.0"
- Bento grid mirrors the changelog panel in the main app (`changelog-bento.tsx`) — same tile content, same visual patterns
- All features listed on the page are verified against the app codebase — do not add unimplemented features
- Source code links use the GitHub octocat icon (project moved from GitLab to GitHub on 2026-05-09)
