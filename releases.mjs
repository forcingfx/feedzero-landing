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
    version: "0.8.1",
    date: "2026-05-14T13:00:00Z",
    title: "Server reliability, observability, and rate limiting",
    subtitle: "Three production bugs fixed across cloud sync, the public stats page, and mobile dialogs. Server-side storage consolidated onto a single backend. Every error response now carries a trace identifier for support.",
    fixed: [
      "Fixed cloud sync vault pulls returning the literal string <code>[object Object]</code> instead of the encrypted payload. The server was storing vaults correctly all along; only the read path was broken. Existing vaults are unaffected and now load correctly.",
      "Fixed cloud sync pushes failing with a 500 error after a deployment-time configuration drift. Sync storage now self-detects the correct backend rather than relying on an exact environment-variable match.",
      "Fixed the public stats page always showing zero feeds tracked. The feed catalog had no persistence layer and reset on every cold start; now backed by persistent storage so counts and the popular-feeds leaderboard populate correctly.",
      "Fixed the mobile soft keyboard covering the bottom of every dialog, which made the cloud-sync passphrase entry unusable. The fix applies to every dialog in the app.",
      "Fixed the mobile bottom navigation drawer being partially hidden behind iOS Safari's browser chrome. The drawer's bottom padding now grows dynamically with the toolbar height.",
    ],
    added: [
      "Added per-client rate limiting on the feed and page proxies. Default 300 requests per minute per client; returns <code>429 Retry-After</code> per RFC 6585 when exceeded.",
      "Added a trace identifier (<code>req_</code> followed by 8 hex characters) to every non-2xx response from the monetization endpoints. Quote it in a support report and the issue can be looked up in the runtime logs.",
      "Added structured single-line JSON logs on every 5xx server error, with an allow-listed field set (route, method, status, trace identifier, error class, error message). No personal data is ever logged.",
      "Added module-load logs in each serverless function that surface which storage backend resolved at cold start. Any future regression where the wrong adapter is chosen becomes visible in the first deploy log.",
      "Added production smoke tests for every server endpoint. Run with <code>SMOKE_TESTS=1 npx vitest run tests/smoke/</code>. The smoke layer is now a required phase of the standard development workflow.",
    ],
    changed: [
      "Consolidated all server-side persistence (license records, vault sync, Stripe event deduplication, the feed catalog, and rate-limit counters) onto a single Upstash KV instance. Replaces a previous mix of Vercel Blob, separate Upstash, and in-memory adapters. Self-hosters not configuring Upstash continue to use the filesystem and memory adapters.",
    ],
  },
  {
    version: "0.8.0",
    date: "2026-05-09T12:00:00Z",
    title: "First-launch reliability fix",
    subtitle: "A latent bug in the new-user initialization path that could leave the app marked as onboarded after a failed first init is fixed.",
    fixed: [
      "Fixed first-launch initialization continuing to mark onboarding complete when the initial database setup failed (for example on browsers without Web Crypto, such as iOS Lockdown Mode). The error is now surfaced and onboarding is not marked complete, so the user is prompted to retry rather than landing in a half-initialized state.",
    ],
  },
  {
    version: "0.7.0",
    date: "2026-05-03T12:00:00Z",
    title: "Mobile bottom drawer, pill navigation, and the stats page",
    subtitle: "A persistent swipeable bottom drawer replaces the offcanvas mobile sidebar, navigation pills handle prev/next on every device, and a public /stats dashboard exposes anonymous usage numbers.",
    added: [
      "Added a persistent swipeable bottom drawer on mobile that replaces the offcanvas sidebar. The drawer handle is always visible at the bottom of the screen and shows the current feed name; tapping or swiping up reveals the full feed list, folders, All items, Explore, and Settings.",
      "Added a bottom sheet feed switcher on mobile. The active feed name in the bottom drawer doubles as a switcher: a tap opens a sheet with all feeds and folders.",
      "Added a public stats page at <code>/stats</code>. Shows total vaults, total feeds tracked, and the top 100 feeds by request volume. No accounts, no personal data, no login.",
      "Added automatic color assignment for new folders. Created folders now get a distinct color from the eight-color palette without an extra picker step.",
      "Added the full settings menu inline in the mobile bottom drawer. Cloud sync, Auto-organize, Keyboard shortcuts, Send feedback, and What's new are all reachable without opening a separate dropdown.",
    ],
    changed: [
      "Replaced the pull-to-advance gesture on mobile with explicit prev/next nav pills. The pills are pinned to the bottom of the reader and remain accessible regardless of scroll position. Pull-to-advance was removed because behavior was inconsistent across mobile browsers.",
      "The mobile nav pills are now icon-only for back navigation, show no keyboard hints, and stretch to fill the available width. Long article titles in the prev/next labels are truncated with ellipses instead of overflowing.",
      "The desktop sidebar and the mobile bottom drawer now share a single navigation body component. Adding a new top-level entry (such as Explore) only needs to be done in one place.",
    ],
    fixed: [
      "Fixed the article list jumping unexpectedly when clicking an already-visible article. The virtualizer no longer re-anchors on click-driven selection changes; keyboard <kbd>j</kbd>/<kbd>k</kbd> still scroll the selected article into view.",
      "Fixed the mobile bottom drawer overflowing horizontally on viewports with safe-area insets. The drawer now respects the iOS Dynamic Island and notch in all orientations.",
      "Fixed desktop reader navigation pills clipping long article titles. The pills now share the available width and grow to fit instead of letting text overflow.",
      "Fixed the folder title toggle in the sidebar collapsing the folder when clicked. Selecting a feed inside a folder on mobile now snaps back to the article list as expected.",
      "Fixed the mobile drawer settings rendering as a nested dropdown that introduced horizontal scroll. The settings entries are now inline within the drawer.",
    ],
  },
  {
    version: "0.6.0",
    date: "2026-05-01T12:00:00Z",
    title: "Resizable panels, navigation pills, and auto-organize",
    subtitle: "Three-panel resizable desktop layout, always-visible prev/next navigation, pull-to-advance on mobile, folder colors, and keyword-based auto-organize.",
    added: [
      "Added a three-panel resizable desktop layout. The sidebar, article list, and reader are now independently draggable columns.",
      "Added prev/next navigation pills pinned to the bottom of the reader panel. The pills are always visible regardless of scroll position and show <kbd>k</kbd>/<kbd>j</kbd> keyboard hints.",
      "Added pull-to-advance gesture on mobile. Scrolling past the end of an article advances to the next; pulling down from the top goes back.",
      "Added folder color customization. An eight-color swatch picker in the folder context menu tints the sidebar label and applies a colored background to folder items.",
      "Added auto-organize. The wand button near New Folder groups existing feeds into topic folders using a built-in keyword ruleset.",
      "Added feed sort mode. Feeds in the sidebar can now be sorted by name, unread count, or kept in the original custom order.",
    ],
    changed: [
      "Article titles in the reader panel are now links to the original URL. The external-link icon in the meta line shows an <kbd>o</kbd> shortcut hint on hover.",
      "The Feed/Full text mode selector is now a compact inline pill control, reducing vertical space. The <kbd>h</kbd> shortcut hint is in a hover tooltip.",
      "The article list is now virtualized. Scrolling through All Items with hundreds of articles no longer causes layout jank.",
      "The desktop breakpoint was lowered from 1024px to 768px so tablet-sized windows use the multi-panel layout.",
      "Publisher boilerplate phrases (\"Read more at\", \"Continue reading\", etc.) are stripped from feed content before display.",
    ],
    fixed: [
      "Fixed article text clipping at the right edge of the reader panel. Replaced Radix ScrollArea (which uses a `display:table` wrapper that breaks text wrapping) with a native `overflow-y-auto` container.",
      "Fixed mobile landing on the reader view when selecting a feed. The app now defaults to the article list, not the reader.",
    ],
  },
  {
    version: "0.5.0",
    date: "2026-04-19T12:00:00Z",
    title: "Feed folders and mobile navigation",
    subtitle: "Organize feeds into collapsible folders, read all items in a folder at once, and swipe between articles on mobile.",
    added: [
      "Added feed folders. Create folders from the sidebar, drag feeds between them, rename or delete folders from the context menu.",
      "Added folder aggregated feeds. Clicking a folder header shows all articles from every feed in that folder, with per-feed title and favicon on each row.",
      "Added swipe navigation on mobile. The article list and reader are side-by-side scroll-snap panels. Swipe left to read, swipe right to go back.",
      "Added a floating back pill on the mobile reader view. Tapping it scrolls back to the article list.",
      "Added safe-area inset support for iPhone Dynamic Island and notch. Content no longer renders under the notch in any orientation.",
      "Added inline feed rename from the three-dot context menu.",
      "Added Vercel Speed Insights for Core Web Vitals monitoring.",
    ],
    changed: [
      "The app now defaults to the All Items view when feeds exist, instead of auto-selecting the first feed.",
      "Unread counts are derived from a single source of truth (`articlesByFeedId`) instead of a separately stored counter. Badges update immediately after adding a feed from the Explore tab.",
      "All articles in a feed render at once. Removed the 25-article display cap and the Load More button.",
      "Sidebar action dots appear only on hover, not after clicking a feed. The fix uses `:focus-visible` so keyboard users still see the dots when tabbing.",
      "Article selection no longer shifts text. The left accent bar reserves its 2px space at all times.",
      "The sidebar was decomposed from a single 728-line component into focused sub-components (FeedItem, FolderItem, SidebarFeedList, confirmation dialogs).",
    ],
    fixed: [
      "Fixed unread badge not updating after adding a feed from the Explore tab.",
      "Fixed sidebar action dots and unread badge overlapping after clicking a feed.",
      "Fixed article text shifting 2px when selected.",
    ],
  },
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
