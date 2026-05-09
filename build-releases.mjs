#!/usr/bin/env node
/**
 * Builds the release-notes artefacts from releases.mjs:
 *
 *   1. releases.xml — Atom feed served at /releases.xml (consumed by the app
 *      at my.feedzero.app via its "What's new" feature).
 *   2. The <!-- RELEASE_NOTES_START --> / <!-- RELEASE_NOTES_END --> block
 *      inside index.html, replaced with a <details>/<summary> accordion of
 *      every release.
 *
 * Run this by hand after editing releases.mjs:
 *   node build-releases.mjs
 *
 * Commit both releases.xml and the updated index.html.
 *
 * The Atom feed intentionally preserves the old feedzero:changelog and
 * feedzero:release:<v> IDs so existing subscribers in the app don't
 * re-import every entry as "new".
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { releases } from "./releases.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEED_URL = "https://feedzero.app/releases.xml";
const PAGE_URL = "https://feedzero.app/#releases";

// Release sections rendered in order. Each key maps to a schema field
// (release.added, release.changed, ...) and a user-facing heading.
const SECTIONS = [
  { key: "added", label: "Added" },
  { key: "changed", label: "Changed" },
  { key: "fixed", label: "Fixed" },
  { key: "removed", label: "Removed" },
];

// Markers for the region of index.html that gets replaced on each build.
const INDEX_START = "<!-- RELEASE_NOTES_START -->";
const INDEX_END = "<!-- RELEASE_NOTES_END -->";

// ---------- Shared helpers ----------

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toTimestamp(date) {
  return date.includes("T") ? date : `${date}T00:00:00Z`;
}

function formatDate(dateStr) {
  const d = new Date(toTimestamp(dateStr));
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function presentSections(release) {
  return SECTIONS.filter(
    ({ key }) => Array.isArray(release[key]) && release[key].length > 0,
  );
}

/**
 * After HTML/XML escaping, convert `foo` into <code>foo</code>. Lets release
 * authors write inline code in releases.mjs using backticks and get a styled
 * <code> element in the rendered output.
 */
function codeify(text) {
  return text.replace(/`([^`]+)`/g, "<code>$1</code>");
}

/**
 * Re-allow a small whitelist of inline tags in release-note text. Authors
 * write release-note bullets as plain English with the occasional `<code>`
 * or `<kbd>` for terminal commands or keyboard shortcuts; without this step
 * those tags get HTML-escaped and rendered as literal "&lt;code&gt;".
 */
function unescapeInlineTags(text) {
  const tags = ["code", "kbd"];
  for (const tag of tags) {
    text = text
      .replace(new RegExp(`&lt;${tag}&gt;`, "g"), `<${tag}>`)
      .replace(new RegExp(`&lt;/${tag}&gt;`, "g"), `</${tag}>`);
  }
  return text;
}

function renderItem(item, escape) {
  return unescapeInlineTags(codeify(escape(item)));
}

// ---------- XML (Atom feed) ----------

function buildEntryContent(release) {
  const parts = [];
  if (release.subtitle) parts.push(`<p>${escapeXml(release.subtitle)}</p>`);
  for (const { key, label } of presentSections(release)) {
    parts.push(`<h3>${label}</h3>`);
    parts.push("<ul>");
    for (const item of release[key]) {
      parts.push(`  <li>${renderItem(item, escapeXml)}</li>`);
    }
    parts.push("</ul>");
  }
  return parts.join("\n");
}

function buildEntry(release) {
  const content = buildEntryContent(release);
  const ts = toTimestamp(release.date);
  return `  <entry>
    <id>feedzero:release:${escapeXml(release.version)}</id>
    <title>v${escapeXml(release.version)} — ${escapeXml(release.title)}</title>
    <link rel="alternate" href="${PAGE_URL}" />
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
  <subtitle>What changed in FeedZero.</subtitle>
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

// ---------- HTML accordion fragment ----------

function buildDetails(release, { open }) {
  const id = `v${escapeHtml(release.version)}`;
  const ts = toTimestamp(release.date);

  const sectionHtml = presentSections(release)
    .map(({ key, label }) => {
      const items = release[key]
        .map((it) => `                        <li>${renderItem(it, escapeHtml)}</li>`)
        .join("\n");
      return `                <section class="changes">
                    <h3>${label}</h3>
                    <ul>
${items}
                    </ul>
                </section>`;
    })
    .join("\n");

  return `            <details id="${id}"${open ? " open" : ""}>
                <summary>
                    <span class="version">v${escapeHtml(release.version)}</span>
                    <span class="rel-title">${escapeHtml(release.title)}</span>
                    <time class="rel-date" datetime="${escapeHtml(ts)}">${formatDate(release.date)}</time>
                </summary>
                <div class="release-body">
                    <p class="release-sub">${escapeHtml(release.subtitle)}</p>
${sectionHtml}
                </div>
            </details>`;
}

function buildAccordion() {
  // Latest (first) release is open by default, rest are collapsed.
  const items = releases
    .map((r, i) => buildDetails(r, { open: i === 0 }))
    .join("\n");
  return [
    INDEX_START,
    "<!-- Content generated by build-releases.mjs from releases.mjs. Do not edit by hand. -->",
    items,
    INDEX_END,
  ].join("\n");
}

// ---------- Index injection ----------

/**
 * Update every place in the landing page that should reflect the current
 * version. Two strategies:
 *
 * 1. HTML body copy: replace text between <!-- LATEST_VERSION --> ...
 *    <!-- /LATEST_VERSION --> markers. Idempotent, lets authors put the
 *    sentinel anywhere a version reference appears in prose.
 *
 * 2. JSON-LD softwareVersion: regex-replace the value of the
 *    softwareVersion key. HTML comments aren't valid inside a JSON string
 *    so the marker approach can't be used there.
 */
function applyVersionMarkers(html, version) {
  const markerRe = /<!--\s*LATEST_VERSION\s*-->[\s\S]*?<!--\s*\/LATEST_VERSION\s*-->/g;
  const jsonLdRe = /("softwareVersion"\s*:\s*)"[^"]*"/g;
  return html
    .replace(markerRe, `<!-- LATEST_VERSION -->${version}<!-- /LATEST_VERSION -->`)
    .replace(jsonLdRe, `$1"${version}"`);
}

async function injectIntoIndex(fragment) {
  const indexPath = join(__dirname, "index.html");
  const html = await readFile(indexPath, "utf8");

  const startIdx = html.indexOf(INDEX_START);
  const endIdx = html.indexOf(INDEX_END);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      `Could not find release-notes markers in index.html.\n` +
      `Expected to find ${INDEX_START} and ${INDEX_END}.`,
    );
  }
  if (endIdx < startIdx) {
    throw new Error(`${INDEX_END} appears before ${INDEX_START} in index.html.`);
  }

  const before = html.slice(0, startIdx);
  const after = html.slice(endIdx + INDEX_END.length);
  const stitched = before + fragment + after;
  const next = applyVersionMarkers(stitched, releases[0].version);

  if (next === html) {
    console.log("index.html: no changes (release notes already up to date).");
    return;
  }

  await writeFile(indexPath, next, "utf8");
  console.log(`Updated ${indexPath}`);
}

// ---------- Write files ----------

async function main() {
  const xml = buildFeed();
  const fragment = buildAccordion();

  const xmlPath = join(__dirname, "releases.xml");

  await writeFile(xmlPath, xml, "utf8");
  console.log(`Wrote ${xmlPath}`);

  await injectIntoIndex(fragment);

  console.log(`${releases.length} releases.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
