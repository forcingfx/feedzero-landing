#!/usr/bin/env node
/**
 * Generates releases.xml (Atom feed) and releases/index.html from releases.mjs.
 *
 * Run this by hand after editing releases.mjs:
 *   node build-releases.mjs
 *
 * Commit the generated files. Vercel serves them as static assets.
 *
 * The Atom feed intentionally preserves the old feedzero:changelog / feedzero:release:<v>
 * IDs so existing subscribers in the app don't re-import every entry as "new".
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { releases } from "./releases.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEED_URL = "https://feedzero.app/releases.xml";
const PAGE_URL = "https://feedzero.app/releases/";

// ---------- XML (Atom feed) ----------

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toTimestamp(date) {
  return date.includes("T") ? date : `${date}T00:00:00Z`;
}

function buildEntryContent(release) {
  const parts = [];
  if (release.subtitle) parts.push(`<p>${escapeXml(release.subtitle)}</p>`);
  parts.push("<ul>");
  for (const item of release.items) {
    parts.push(`  <li>${escapeXml(item)}</li>`);
  }
  parts.push("</ul>");
  if (release.richContent) parts.push(release.richContent);
  return parts.join("\n");
}

function buildEntry(release) {
  const content = buildEntryContent(release);
  const ts = toTimestamp(release.date);
  return `  <entry>
    <id>feedzero:release:${escapeXml(release.version)}</id>
    <title>v${escapeXml(release.version)} — ${escapeXml(release.title)}</title>
    <link rel="alternate" href="${PAGE_URL}#v${escapeXml(release.version)}" />
    <published>${ts}</published>
    <updated>${ts}</updated>
    <summary>${escapeXml(release.subtitle)}</summary>
    <content type="html"><![CDATA[${content}]]></content>
    <author><name>FeedZero</name></author>
  </entry>`;
}

function buildFeed() {
  const updated = toTimestamp(releases[0]?.date ?? new Date().toISOString());
  const entries = releases.map(buildEntry).join("\n");
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>FeedZero Release Notes</title>
  <subtitle>What's new in FeedZero</subtitle>
  <id>feedzero:changelog</id>
  <updated>${updated}</updated>
  <link rel="self" href="${FEED_URL}" />
  <link rel="alternate" type="text/html" href="${PAGE_URL}" />
  <author>
    <name>FeedZero</name>
  </author>
${entries}
</feed>
`;
}

// ---------- HTML (release notes page) ----------

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(dateStr) {
  const d = new Date(toTimestamp(dateStr));
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildReleaseArticle(release) {
  const itemsHtml = release.items
    .map((it) => `                <li>${escapeHtml(it)}</li>`)
    .join("\n");

  // Rich content is already HTML — inject verbatim inside the release-body scope.
  const richHtml = release.richContent
    ? `            <div class="release-body">${release.richContent}</div>`
    : "";

  return `        <article class="release" id="v${escapeHtml(release.version)}">
            <header class="release-head">
                <h2>v${escapeHtml(release.version)} — ${escapeHtml(release.title)}</h2>
                <time datetime="${escapeHtml(toTimestamp(release.date))}">${formatDate(release.date)}</time>
            </header>
            <p class="release-sub">${escapeHtml(release.subtitle)}</p>
            <ul class="release-items">
${itemsHtml}
            </ul>
${richHtml}
        </article>`;
}

function buildHtmlPage() {
  const articles = releases.map(buildReleaseArticle).join("\n\n");
  const latestVersion = releases[0]?.version ?? "";
  const latestDate = releases[0] ? formatDate(releases[0].date) : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Release notes — FeedZero</title>
    <meta name="description" content="What's new in FeedZero. A plain-text changelog of every release, also available as an Atom feed at feedzero.app/releases.xml.">
    <link rel="canonical" href="https://feedzero.app/releases/">
    <link rel="alternate" type="application/atom+xml" title="FeedZero Release Notes" href="/releases.xml">

    <meta property="og:title" content="FeedZero Release Notes">
    <meta property="og:description" content="What's new in FeedZero. Also available as an Atom feed.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://feedzero.app/releases/">

    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#ffffff">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <style>
        html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 17px;
            line-height: 1.6;
            color: #111;
            background: #fff;
            max-width: 40rem;
            margin: 3rem auto 4rem;
            padding: 0 1.25rem;
        }
        h1 {
            font-size: 1.85rem;
            font-weight: 700;
            letter-spacing: -0.01em;
            margin: 0 0 0.25rem;
        }
        .page-sub {
            color: #475569;
            margin: 0 0 0.5rem;
        }
        .page-meta {
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 2rem;
        }
        .page-meta a {
            color: #0645ad;
            text-decoration: underline;
        }
        a { color: #0645ad; text-decoration: underline; }
        a:visited { color: #0b0080; }
        a:hover { color: #06c; }
        .back {
            display: inline-block;
            color: #64748b;
            text-decoration: none;
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
        }
        .back:hover { color: #111; text-decoration: underline; }

        .release {
            margin: 0 0 3rem;
            padding: 0 0 2.25rem;
            border-bottom: 1px solid #e5e7eb;
        }
        .release:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .release-head {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 0.35rem;
        }
        .release-head h2 {
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: -0.01em;
            margin: 0;
            scroll-margin-top: 3rem;
        }
        .release-head time {
            color: #64748b;
            font-size: 0.85rem;
            white-space: nowrap;
        }
        .release-sub {
            color: #475569;
            margin: 0 0 0.75rem;
        }
        .release-items {
            margin: 0 0 1.25rem;
            padding-left: 1.25rem;
        }
        .release-items li {
            margin-bottom: 0.2rem;
        }

        /* ---- Rich content rendering ---- */
        /* The release bodies (migrated from the app) contain Tailwind utility
           class names. We don't load Tailwind here — instead we define just
           the handful of classes actually used in the rich content, scoped
           to .release-body so they don't leak. If you add new Tailwind
           classes to a release body, add them here too. */
        .release-body {
            margin-top: 1rem;
            color: #1f2937;
            font-size: 0.97rem;
        }
        .release-body h2 {
            font-size: 1.15rem;
            font-weight: 700;
            margin: 1.5rem 0 0.6rem;
        }
        .release-body h3 {
            font-size: 1.02rem;
            font-weight: 600;
            margin: 1.25rem 0 0.45rem;
        }
        .release-body p { margin: 0 0 0.9rem; }
        .release-body em { font-style: italic; }
        .release-body code {
            font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
            font-size: 0.88em;
            background: #f4f4f5;
            padding: 0.05em 0.3em;
            border-radius: 3px;
        }
        .release-body mark {
            background: #fee2e2;
            color: #991b1b;
            padding: 0 0.1em;
        }

        /* Layout primitives */
        .release-body .flex { display: flex; }
        .release-body .flex-1 { flex: 1 1 0%; }
        .release-body .flex-wrap { flex-wrap: wrap; }
        .release-body .items-center { align-items: center; }
        .release-body .justify-center { justify-content: center; }
        .release-body .ml-auto { margin-left: auto; }
        .release-body .shrink-0 { flex-shrink: 0; }
        .release-body .grid { display: grid; }
        .release-body .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .release-body .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .release-body .gap-1\\.5 { gap: 0.375rem; }
        .release-body .gap-2 { gap: 0.5rem; }
        .release-body .gap-3 { gap: 0.75rem; }
        .release-body .space-y-1 > * + * { margin-top: 0.25rem; }
        .release-body .space-y-2 > * + * { margin-top: 0.5rem; }
        .release-body .text-center { text-align: center; }
        .release-body .break-all { word-break: break-all; }

        /* Sizing */
        .release-body .w-3\\.5 { width: 0.875rem; }
        .release-body .h-3\\.5 { height: 0.875rem; }
        .release-body .w-6 { width: 1.5rem; }
        .release-body .h-6 { height: 1.5rem; }

        /* Spacing */
        .release-body .p-2\\.5 { padding: 0.625rem; }
        .release-body .p-3 { padding: 0.75rem; }
        .release-body .p-4 { padding: 1rem; }
        .release-body .px-1\\.5 { padding-left: 0.375rem; padding-right: 0.375rem; }
        .release-body .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .release-body .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
        .release-body .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .release-body .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
        .release-body .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .release-body .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
        .release-body .my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
        .release-body .mb-1 { margin-bottom: 0.25rem; }
        .release-body .mb-2 { margin-bottom: 0.5rem; }
        .release-body .mt-2 { margin-top: 0.5rem; }

        /* Borders & radius */
        .release-body .border { border: 1px solid #e5e7eb; }
        .release-body .border-gray-200 { border-color: #e5e7eb; }
        .release-body .rounded { border-radius: 0.25rem; }
        .release-body .rounded-sm { border-radius: 0.125rem; }
        .release-body .rounded-md { border-radius: 0.375rem; }
        .release-body .rounded-lg { border-radius: 0.5rem; }
        .release-body .rounded-xl { border-radius: 0.75rem; }
        .release-body .rounded-full { border-radius: 9999px; }

        /* Backgrounds */
        .release-body .bg-white { background: #fff; }
        .release-body .bg-gray-50 { background: #f9fafb; }
        .release-body .bg-gray-100 { background: #f3f4f6; }
        .release-body .bg-orange-400 { background: #fb923c; }
        .release-body .bg-green-500 { background: #22c55e; }
        .release-body .bg-red-400 { background: #f87171; }
        .release-body .bg-red-100 { background: #fee2e2; }
        .release-body .bg-blue-100 { background: #dbeafe; }
        .release-body .bg-emerald-100 { background: #d1fae5; }

        /* Text colors & sizes */
        .release-body .text-gray-300 { color: #d1d5db; }
        .release-body .text-gray-400 { color: #9ca3af; }
        .release-body .text-gray-500 { color: #6b7280; }
        .release-body .text-gray-600 { color: #4b5563; }
        .release-body .text-gray-700 { color: #374151; }
        .release-body .text-red-500 { color: #ef4444; }
        .release-body .text-red-700 { color: #b91c1c; }
        .release-body .text-green-600 { color: #16a34a; }
        .release-body .text-blue-500 { color: #3b82f6; }
        .release-body .text-blue-700 { color: #1d4ed8; }
        .release-body .text-emerald-700 { color: #047857; }
        .release-body .text-\\[10px\\] { font-size: 10px; }
        .release-body .text-xs { font-size: 0.75rem; }
        .release-body .text-sm { font-size: 0.875rem; }
        .release-body .text-lg { font-size: 1.125rem; }
        .release-body .text-2xl { font-size: 1.5rem; }
        .release-body .font-mono { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; }
        .release-body .font-medium { font-weight: 500; }
        .release-body .font-semibold { font-weight: 600; }
        .release-body .font-bold { font-weight: 700; }
        .release-body .tracking-tight { letter-spacing: -0.01em; }
        .release-body .shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

        /* ---- Minimal topnav (matches main site) ---- */
        .topnav {
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(255,255,255,0.85);
            -webkit-backdrop-filter: saturate(180%) blur(10px);
            backdrop-filter: saturate(180%) blur(10px);
            border-bottom: 1px solid #e5e7eb;
            margin: -3rem -1.25rem 2rem;
            padding: 0.65rem 1.25rem;
            font-size: 0.9rem;
        }
        .topnav a {
            color: #64748b;
            text-decoration: none;
            margin-right: 1rem;
        }
        .topnav a:hover { color: #0f172a; }
        .topnav .brand {
            color: #0f172a;
            font-weight: 700;
        }

        @media (max-width: 520px) {
            body { margin-top: 2rem; }
            .release-head {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.15rem;
            }
            .release-body .grid-cols-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
    </style>
</head>
<body>

    <nav class="topnav" aria-label="Site navigation">
        <a href="/" class="brand">FeedZero</a>
        <a href="/#about">About</a>
        <a href="/#features">Features</a>
        <a href="/releases/">Releases</a>
    </nav>

    <h1>Release notes</h1>
    <p class="page-sub">What's new in FeedZero, in reverse chronological order.</p>
    <p class="page-meta">
        Latest: <strong>v${escapeHtml(latestVersion)}</strong> on ${escapeHtml(latestDate)} &middot;
        <a href="/releases.xml">Subscribe via Atom feed</a>
    </p>

${articles}

</body>
</html>
`;
}

// ---------- Write files ----------

async function main() {
  const xml = buildFeed();
  const html = buildHtmlPage();

  const xmlPath = join(__dirname, "releases.xml");
  const htmlDir = join(__dirname, "releases");
  const htmlPath = join(htmlDir, "index.html");

  await writeFile(xmlPath, xml, "utf8");
  await mkdir(htmlDir, { recursive: true });
  await writeFile(htmlPath, html, "utf8");

  console.log(`Wrote ${xmlPath}`);
  console.log(`Wrote ${htmlPath}`);
  console.log(`${releases.length} releases.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
