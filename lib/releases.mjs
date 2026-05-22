/**
 * Release-notes renderers, consumed by build.mjs.
 *
 *   - buildFeed(releases)      -> the Atom feed string for /releases.xml.
 *   - buildAccordion(releases) -> the <details>/<summary> accordion block that
 *     build.mjs drops into the homepage's release-notes section.
 *
 * The Atom feed intentionally preserves the old feedzero:changelog and
 * feedzero:release:<v> IDs so existing subscribers in the app don't
 * re-import every entry as "new".
 */

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

// Markers wrapping the generated accordion inside the homepage.
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
  const tags = ["code", "kbd", "strong"];
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
    <title>v${escapeXml(release.version)}: ${escapeXml(release.title)}</title>
    <link rel="alternate" href="${PAGE_URL}" />
    <published>${ts}</published>
    <updated>${ts}</updated>
    <summary>${escapeXml(release.subtitle)}</summary>
    <content type="html"><![CDATA[${content}]]></content>
    <author><name>FeedZero</name></author>
  </entry>`;
}

export function buildFeed(releases) {
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

export function buildAccordion(releases) {
  // Latest (first) release is open by default, rest are collapsed.
  const items = releases
    .map((r, i) => buildDetails(r, { open: i === 0 }))
    .join("\n");
  return [
    INDEX_START,
    "<!-- Content generated by build.mjs from releases.mjs. Do not edit by hand. -->",
    items,
    INDEX_END,
  ].join("\n");
}
