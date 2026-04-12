/**
 * Source of truth for FeedZero release notes.
 *
 * Edit this file when cutting a new release. Then run:
 *   node build-releases.mjs
 * to regenerate releases.xml (the Atom feed) and releases/index.html.
 *
 * The feed is hosted at https://feedzero.app/releases.xml and the app
 * (my.feedzero.app) subscribes to it. Preserve the entry identifiers
 * (`feedzero:release:<version>`) and the feed `<id>` (`feedzero:changelog`)
 * — changing them makes every existing subscriber treat old entries as new.
 *
 * Style: plain, factual, README/man-page tone. See
 * ~/.claude/projects/.../memory/feedback_writing_style.md for the full rules.
 * Short rule of thumb: describe what changed, not how exciting it is. No
 * marketing verbs, no emojis, no call-to-action. Each bullet is one
 * verb-led past-tense sentence ending with a period.
 */

/**
 * Each release:
 *   version   — semver string (must match the app's APP_VERSION when cut)
 *   date      — ISO 8601 date or date-time
 *   title     — short headline (plain, no hype)
 *   subtitle  — one-sentence summary of the release
 *   added / changed / fixed / removed — Keep-a-Changelog sections.
 *     Each is an array of plain strings. Omit empty sections entirely.
 */
export const releases = [
  {
    version: "0.4.0",
    date: "2026-04-06T18:00:00Z",
    title: "Release notes feed",
    subtitle: "The release notes are now an Atom feed that any RSS reader can subscribe to.",
    added: [
      "Published the release notes as an Atom feed at feedzero.app/releases.xml. New installs auto-subscribe on first launch; existing users can subscribe via Settings → What's new.",
      "Added a \"Clear cached articles\" action to the feed context menu. It deletes the feed's stored articles and re-fetches from source. Read/unread status is lost, and older articles may not reappear if the source no longer publishes them.",
    ],
    changed: [
      "Article content now renders h1–h4 headings with appropriate sizing and spacing. Lists render with markers.",
      "Feeds in the sidebar sort alphabetically, with the release notes feed pinned to the top.",
      "Unread badges use a squircle shape with a subtle background.",
    ],
    removed: [
      "Removed the in-app changelog dialog (~700 lines of custom UI). The Atom feed replaces it.",
    ],
  },
  {
    version: "0.3.1",
    date: "2026-04-06T12:00:00Z",
    title: "More vertical space",
    subtitle: "Removed the desktop header bar. Added per-feed unread counts and in-memory article preloading.",
    added: [
      "Added per-feed unread count badges in the sidebar. The count is derived from the full article set, not just the current page.",
      "Added source attribution in the reader panel. Each article shows the feed's favicon and title under the headline.",
      "Added a \"Load more\" button for feeds with more than 25 articles.",
    ],
    changed: [
      "Removed the 40-pixel desktop header bar. The sidebar toggle moved into the sidebar itself.",
      "Articles preload into memory at startup, so switching feeds no longer shows a loading state.",
      "Replaced the \"mark all read\" toolbar with a floating pill that appears at the bottom only when there are unread articles.",
      "Favicons now refresh on a 7-day cycle. Removed the manual \"Reload favicons\" menu item.",
    ],
  },
  {
    version: "0.3.0",
    date: "2026-04-06T06:00:00Z",
    title: "Tracker and link-param stripping",
    subtitle: "Tracking pixels and URL tracking parameters are removed from feed content before it reaches the browser.",
    added: [
      "Added tracking-pixel stripping. 1×1 images loaded from known tracker domains (Facebook, Google Analytics, Quantserve, Feedburner, and others) are removed from article HTML before render.",
      "Added URL tracking-parameter stripping. `utm_*`, `fbclid`, `gclid`, and around 20 similar parameters are removed from links inside article content.",
      "Added an anonymous feed catalog on the server. It records which feeds exist and how often they are fetched. No user-identifying information is stored.",
    ],
    changed: [
      "The changelog dialog supports arrow-key navigation between releases.",
    ],
  },
  {
    version: "0.2.2",
    date: "2026-03-29",
    title: "Bug fixes",
    subtitle: "Fixes for favicon loading, feed refresh, and error messages.",
    fixed: [
      "Fixed favicon loading for sites that serve icons at non-standard paths.",
      "Improved feed refresh reliability.",
      "Improved error messages when adding an invalid feed URL.",
    ],
  },
  {
    version: "0.2.1",
    date: "2026-03-28",
    title: "Visual polish",
    subtitle: "Palette, transition, and typography adjustments.",
    changed: [
      "Warmed the background tint. Accent color is now blue-indigo.",
      "Added CSS transitions for hover, selection, and sidebar open/close.",
      "Reworked blockquotes, inline images, and editorial typography in article content.",
      "Unread and read article states are now distinguished by bold titles and an accent bar.",
      "Focus rings are softer, and the `prefers-reduced-motion` media query is honored.",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-03-28",
    title: "Explore, keyboard nav, sync, and OPML",
    subtitle: "A catalog of around 1,000 feeds, vim-style keyboard shortcuts, end-to-end encrypted sync, and OPML import/export.",
    added: [
      "Added an Explore tab with around 1,000 feeds organized by topic and country. The search box accepts a URL, which is added directly as a feed.",
      "Added vim-style keyboard navigation: `j`/`k` for next/previous article, `Enter` to add a feed, `Space` to scroll, `h` for full text view, `o` to open the original.",
      "Added unread dots and a \"mark all read\" action.",
      "Added optional end-to-end encrypted cloud sync. The encryption key is derived from a four-word passphrase generated from the EFF wordlist. Lost passphrase means lost data — by design.",
      "Added OPML import and export.",
    ],
    changed: [
      "Feed switching now reads from an in-memory cache instead of IndexedDB.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-01-31",
    title: "First release",
    subtitle: "The initial alpha.",
    added: [
      "Added RSS 2.0, Atom 1.0, and JSON Feed parsers.",
      "Added AES-256 encryption of all stored data in IndexedDB.",
      "Added optional cloud sync using a passphrase-derived encryption key.",
      "Added full-text article extraction for feeds that publish only summaries.",
      "Added dark mode.",
      "Added vim-style keyboard navigation.",
    ],
  },
];
