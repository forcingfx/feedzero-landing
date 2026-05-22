# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for **FeedZero** (feedzero.app), a privacy-first RSS reader. Static site — no framework, no runtime dependencies. All copy lives in editable markdown/frontmatter files under `content/`; a small zero-dependency Node build step (`node build.mjs`) compiles them into the deployed HTML (see below).

- **Live site:** https://feedzero.app
- **App:** https://my.feedzero.app
- **Source (main app):** https://github.com/forcingfx/feedzero
- **Source (this landing site):** https://github.com/forcingfx/feedzero-landing
- **Release feed:** https://feedzero.app/releases.xml (Atom, consumed by the app)

## Architecture

This is a **content-driven static site**. Three layers:

- **`content/`** — the source of truth for all copy, as markdown with YAML-subset frontmatter:
  - `content/home.md` → `index.html`
  - `content/pricing.md` → `pricing/index.html`
  - `content/legal/{impressum,privacy,terms,refund}.md` → `legal/<x>/index.html`
- **`templates/`** — layout: full HTML scaffold, inline CSS, the topnav/scroll script, and the bespoke per-feature SVG tile illustrations (`templates/partials/feature-tiles.html`). Placeholders are `{{ key }}`.
- **`lib/`** — `markdown.mjs` (zero-dependency frontmatter parser + inline/block markdown renderer) and `releases.mjs` (release-notes renderers).

**`build.mjs`** is the only thing that writes the deployed HTML. It stitches content into templates and folds in the release-notes accordion. **The generated `index.html`, `pricing/index.html`, and `legal/*/index.html` are build artefacts — never edit them by hand; edit `content/` or `templates/` and re-run the build.** They're committed because Vercel serves the repo's static files directly (no build command in `vercel.json`).

**Release notes** still live in `releases.mjs` (source of truth) and are compiled by the build into:

- `releases.xml` — Atom feed served at `/releases.xml` with CORS open so the app can fetch it cross-origin.
- the `<details>` accordion in the homepage's "Release notes" section.

The app (my.feedzero.app) subscribes to `https://feedzero.app/releases.xml` for its "What's new" feature. The feed's `<id>` (`feedzero:changelog`) and entry IDs (`feedzero:release:<version>`) must stay stable — changing them makes existing subscribers re-import every entry as "new".

The homepage version string (the "alpha (v…)" line and JSON-LD `softwareVersion`) is sourced automatically from the latest entry in `releases.mjs` via a `{{version}}` token; don't hardcode it in content.

Deployed on **Vercel**. `vercel.json` configures security headers (HSTS, X-Frame-Options DENY, no-referrer, nosniff) plus `Content-Type: application/atom+xml`, `Cache-Control: public, max-age=3600`, and `Access-Control-Allow-Origin: *` for `/releases.xml`.

## Development

No lint or test commands. After any edit to `content/`, `templates/`, `lib/`, or `releases.mjs`, regenerate the HTML:

```sh
node build.mjs          # rebuilds every page + releases.xml
```

(`node build-releases.mjs` still works — it's a thin shim that delegates to `build.mjs`.) Then preview locally:

```sh
python3 -m http.server 8000
```

**Editing copy:** open the relevant file in `content/` and edit the text. Frontmatter fields hold structured copy (headings, CTAs, feature/plan/FAQ items); markdown bodies hold longer prose (legal pages, pricing footnotes). Inline markdown is supported in every field (`[links](…)`, `**bold**`, `*em*`, `` `code` ``), and raw inline HTML (`<kbd>`, `<br>`, `<em>`) passes through. Re-run `node build.mjs` and commit both the content file and the regenerated HTML.

**Cutting a new release:**

1. Add a new entry at the top of the `releases` array in `releases.mjs`. Preserve old entries — they're the published history.
2. Run `node build.mjs` to regenerate `releases.xml` and the homepage.
3. Commit `releases.mjs`, `releases.xml`, and `index.html`.
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
