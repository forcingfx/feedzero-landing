# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for **FeedZero** (feedzero.app), a privacy-first RSS reader. This is a static site — no build step, no framework, no dependencies.

- **Live site:** https://feedzero.app
- **App:** https://my.feedzero.app
- **Source (main app):** https://gitlab.com/github.sudoku/feedzero (GitLab, not GitHub)

## Architecture

The entire site is a single `index.html` with inline CSS and no JS. Assets are `favicon.svg` and `screenshot.png`.

Deployed on **Vercel**. `vercel.json` configures security headers (HSTS, X-Frame-Options DENY, no-referrer, nosniff).

## Development

No build, lint, or test commands — just open `index.html` in a browser. To preview locally:

```sh
python3 -m http.server 8000
```

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
- Source code links use the GitLab tanuki icon, not GitHub's octocat
