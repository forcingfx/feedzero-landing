---
name: release-screenshot
description: Use when cutting a FeedZero landing-page release (the /release flow, or any time `screenshot.png` needs to be refreshed) to regenerate the marketing hero image with the latest app build.
---

# Release Screenshot

## When to use

- Cutting a new release in `feedzero-landing` (typically as part of `/release`).
- The hero `screenshot.png` looks stale because the app's UI has shifted (sidebar layout, reader pane, etc.).
- Manually requested ("retake the screenshot").

If the only change is copy or release notes, you don't need to regenerate the screenshot.

## What it produces

`/home/DeadEye3164/builder/feedzero-landing/screenshot.png`, a 1440×900 capture of the app showing:

- A populated sidebar: 4 folders (News, Technology, Design, Science) + 2 unfiled feeds, 20 feeds total.
- A populated article list pane (Ars Technica selected).
- A featured article ("Inside the quiet revolution rewriting silicon") in the reader pane with an Unsplash hero image, figcaption, and body copy.
- No "feeds stored locally" warning, no changelog dialog, no onboarding banner.

## How to run

From `/home/DeadEye3164/builder/feedzero-landing`:

```sh
node take-screenshot.mjs --scene landing
```

That auto-starts a Vite dev server on `:3001` against the sister repo at `../feedzero`, seeds the encrypted IndexedDB directly via `initFresh()` + `db.addFolder/addFeed/addArticles`, opens the featured article URL, and writes `screenshot.png`.

If a dev server is already running, pass `--url http://localhost:PORT` to skip the spawn step.

## Verification (before claiming done)

1. Confirm the file changed: `git diff --stat screenshot.png` should show a modification.
2. **Look at the image.** Use the Read tool on `screenshot.png` to view it. The hero image must have rendered (Unsplash CDN occasionally times out — re-run if the right pane looks blank).
3. Confirm there's no amber "Your feeds are stored locally" banner in the bottom-left of the sidebar.

## Things that commonly go wrong

| Symptom | Cause / fix |
|---------|-------------|
| Screenshot taken before the hero image decoded | The script waits 2.5s after `figure img` appears; bump the timeout in `screenshotLanding` if Unsplash is slow that day |
| `initFresh failed` / module import error | The sister repo `../feedzero` is missing or out of date. Check `ls ../feedzero/src/core/storage/key-manager.ts` exists |
| Sidebar layout shifted, screenshot looks wrong | The app's component structure changed. Update the seed data or selectors in `screenshotLanding` |
| Cloud-sync warning re-appears | `feedzero:local-warning-dismissed` localStorage key was renamed in the app — search `app-sidebar.tsx` for the new key and update the seed |

## After regenerating

The screenshot lives in the landing repo and ships with the deploy. Commit it alongside the release-notes update for the cut:

```sh
git add screenshot.png releases.mjs releases.xml releases/index.html
```

(`releases.xml` and `releases/index.html` come from `node build-releases.mjs` — the regular release flow handles those.)
