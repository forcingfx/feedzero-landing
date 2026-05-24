#!/usr/bin/env node
/**
 * Builds every static HTML page from editable content + templates.
 *
 *   content/home.md          -> index.html
 *   content/pricing.md       -> pricing/index.html
 *   content/legal/<x>.md     -> legal/<x>/index.html
 *   releases.mjs             -> releases.xml  (+ the homepage accordion)
 *
 * Content lives in markdown/frontmatter files under content/. Layout, CSS, and
 * the bespoke feature-tile illustrations live under templates/. This script is
 * the only thing that writes the deployed HTML, so the generated files are
 * build artefacts: edit content/ or templates/, never the HTML directly.
 *
 * Run after editing content, templates, or releases.mjs:
 *   node build.mjs
 *
 * Commit the regenerated HTML (and releases.xml) so Vercel serves them.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseFrontmatter, renderInline, renderMarkdown } from "./lib/markdown.mjs";
import { releases } from "./releases.mjs";
import { buildFeed, buildAccordion } from "./lib/releases.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const VERSION = releases[0].version;
const SITE_ORIGIN = "https://feedzero.app";

// Shutdown-migration pages: source-of-truth markdown lives in the feedzero repo
// under docs/marketing/<slug>-migration.md. Build-time fetch keeps the landing
// pages in sync with strategy refreshes there without duplicating copy here.
const MIGRATION_SOURCE_DIR = "docs/marketing";
const MIGRATION_RAW_BASE =
  "https://raw.githubusercontent.com/forcingfx/feedzero/main/docs/marketing";
const FEEDZERO_REPO_BASE = "https://github.com/forcingfx/feedzero/blob/main";
const MIGRATIONS = [
  { slug: "pocket", file: "pocket-migration.md" },
  { slug: "omnivore", file: "omnivore-migration.md" },
  { slug: "tt-rss", file: "tt-rss-migration.md" },
];

// ---------- Small helpers ----------

const read = (rel) => readFile(join(ROOT, rel), "utf8");

async function write(rel, content) {
  const path = join(ROOT, rel);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
  console.log(`Wrote ${rel}`);
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replace {{ key }} placeholders; throw on any that has no value. */
function fill(template, vars) {
  return template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_m, key) => {
    if (!(key in vars)) throw new Error(`Missing template var: ${key}`);
    return vars[key] == null ? "" : String(vars[key]);
  });
}

/** Parse the feature-tiles partial into a { "icon:id": html, ... } map. */
function parsePartials(text) {
  const map = {};
  const re = /<!--\s*@\s*([\w:-]+)\s*-->/g;
  const marks = [];
  let m;
  while ((m = re.exec(text))) marks.push({ name: m[1], start: m.index, end: re.lastIndex });
  for (let i = 0; i < marks.length; i++) {
    const slice = text.slice(marks[i].end, i + 1 < marks.length ? marks[i + 1].start : undefined);
    map[marks[i].name] = slice.trim();
  }
  return map;
}

// ---------- Footer ----------

function renderFooter(links) {
  return links
    .map((l) => `        <a href="${l.href}">${renderInline(l.label)}</a>`)
    .join(" ·\n");
}

// ---------- Homepage sections ----------

function badgeSpan(badge) {
  return badge === "paid"
    ? '<span class="badge badge-paid">Paid</span>'
    : '<span class="badge badge-free">Free</span>';
}

function renderFeatureItems(items, partials) {
  return items
    .map((f) => {
      const icon = partials[`icon:${f.id}`] ?? "";
      const tile = partials[`tile:${f.id}`] ?? "";
      return `        <li>
            <div class="feat-text">
                <span class="eyebrow">
                    ${icon}
                    ${renderInline(f.eyebrow)}${badgeSpan(f.badge)}
                </span>
                <h3 class="feat-title">${renderInline(f.title)}</h3>
                <p class="feat-desc">${renderInline(f.desc)}</p>
            </div>
            <div class="feat-tile">
                ${tile}
            </div>
        </li>`;
    })
    .join("\n");
}

function renderMinis(minis, partials) {
  return minis
    .map((mn) => {
      const icon = partials[`icon:mini-${mn.id}`] ?? "";
      return `            <div class="mini">
                <span class="eyebrow">
                    ${icon}
                    ${renderInline(mn.eyebrow)}${badgeSpan(mn.badge)}
                </span>
                <h3>${renderInline(mn.title)}</h3>
                <p>${renderInline(mn.desc)}</p>
            </div>`;
    })
    .join("\n");
}

function planMiniClass(p) {
  if (p.featured) return " featured";
  if (p.selfHost) return " self-host";
  return "";
}

function renderPricingMinis(plans) {
  return plans
    .map((p) => {
      const recommended = p.recommended
        ? '\n                <span class="recommended">Recommended</span>'
        : "";
      const annual = p.annualLabel
        ? `\n                    <a href="${p.annualHref}" class="annual-mini">${renderInline(p.annualLabel)}</a>`
        : "";
      return `            <article class="plan-mini${planMiniClass(p)}">${recommended}
                <div>
                    <p class="name">${renderInline(p.name)}</p>
                    <p class="price-mini">${renderInline(p.price)}<span class="period"> ${renderInline(p.period)}</span></p>
                </div>
                <p class="feature-summary">
                    ${renderInline(p.summary)}
                </p>
                <div class="cta-col">
                    <a href="${p.ctaHref}" class="cta-mini ${p.ctaStyle}">${renderInline(p.ctaLabel)}</a>${annual}
                </div>
            </article>`;
    })
    .join("\n");
}

const ICON_CHECK =
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_X =
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const ICON_LIMITED =
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

function renderCompareCell(raw, isFz) {
  const value = raw == null ? "" : String(raw);
  let main = value;
  let note = "";
  const pipe = value.indexOf("|");
  if (pipe !== -1) {
    main = value.slice(0, pipe).trim();
    note = value.slice(pipe + 1).trim();
  }
  const noteHtml = note ? `<span class="cell-note">${renderInline(note)}</span>` : "";
  if (main === "yes" || main === "true") {
    const cls = isFz ? "cell-yes cell-yes-fz" : "cell-yes";
    return `<span class="${cls}" aria-label="Yes">${ICON_CHECK}</span>${noteHtml}`;
  }
  if (main === "no" || main === "false") {
    return `<span class="cell-no" aria-label="No">${ICON_X}</span>${noteHtml}`;
  }
  if (main === "limited") {
    return `<span class="cell-limited" aria-label="Limited">${ICON_LIMITED}</span>${noteHtml}`;
  }
  if (main === "—" || main === "-") {
    return `<span class="cell-dash" aria-label="Not applicable">&mdash;</span>${noteHtml}`;
  }
  return `<span class="cell-text">${renderInline(main)}</span>${noteHtml}`;
}

function renderCompare(c) {
  const fzIndex = c.columns.findIndex((col) => col.featured);
  const headerCells = c.columns
    .map((col, i) => {
      const cls = i === fzIndex ? ' class="col-fz"' : "";
      return `                <th${cls} scope="col">${renderInline(col.name)}</th>`;
    })
    .join("\n");
  const totalCols = c.columns.length + 1;
  const groupBlocks = c.groups
    .map((group) => {
      const groupHead = `            <tr class="group-row">
                <th scope="rowgroup" colspan="${totalCols}">${renderInline(group.heading)}</th>
            </tr>`;
      const rowsHtml = group.rows
        .map((row) => {
          const cells = row.cells
            .map((cell, i) => {
              const isFz = i === fzIndex;
              const cls = isFz ? ' class="cell-fz"' : "";
              return `                <td${cls}>${renderCompareCell(cell, isFz)}</td>`;
            })
            .join("\n");
          return `            <tr>
                <th scope="row" class="row-label">${renderInline(row.label)}</th>
${cells}
            </tr>`;
        })
        .join("\n");
      return `${groupHead}\n${rowsHtml}`;
    })
    .join("\n");
  return `        <table class="compare-table">
            <thead>
                <tr>
                    <th scope="col" class="row-label"></th>
${headerCells}
                </tr>
            </thead>
            <tbody>
${groupBlocks}
            </tbody>
        </table>`;
}

function renderFaq(items) {
  return items
    .map((it) => {
      const body = it.a.map((p) => `                    <p>${renderInline(p)}</p>`).join("\n");
      return `            <details>
                <summary>${renderInline(it.q)}</summary>
                <div class="faq-body">
${body}
                </div>
            </details>`;
    })
    .join("\n");
}

function renderParagraphs(arr, indent) {
  return arr.map((p) => `${indent}<p>${renderInline(p)}</p>`).join("\n");
}

function renderHeroChips(segments) {
  return segments
    .map((s) => `            <li class="hero-chip">${renderInline(s)}</li>`)
    .join("\n");
}

function renderSourceCommands(commands) {
  return commands
    .map((line) => {
      const colored = line.replace(/ && /g, ' <span style="color:#94a3b8">&amp;&amp;</span> ');
      return `<span style="color:#94a3b8">$</span> ${colored}`;
    })
    .join("\n");
}

function buildJsonLd(meta) {
  const obj = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FeedZero",
    url: "https://feedzero.app",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: meta.jsonLdDescription,
    screenshot: "https://feedzero.app/screenshot.png",
    softwareVersion: VERSION,
    author: { "@type": "Person", name: "Arjun Muralidharan" },
    license: "https://github.com/forcingfx/feedzero/blob/main/LICENSE",
    downloadUrl: "https://my.feedzero.app",
    featureList: meta.featureList,
  };
  // Indent every line by 4 spaces to sit under the <script> in the template.
  return JSON.stringify(obj, null, 2).split("\n").join("\n    ");
}

async function buildHome() {
  const [{ data }, template, partialsRaw] = await Promise.all([
    read("content/home.md").then(parseFrontmatter),
    read("templates/home.html"),
    read("templates/partials/feature-tiles.html"),
  ]);
  const partials = parsePartials(partialsRaw);
  const c = data;

  const shutdownItems = c.shutdown.items
    .map(
      (it) => `            <li>
                <span class="shutdown-text">${renderInline(it.text)}</span>
                <a href="${it.href}">${renderInline(it.linkLabel)}</a>
            </li>`,
    )
    .join("\n");

  const vars = {
    metaTitle: escapeAttr(c.meta.title),
    metaDescription: escapeAttr(c.meta.description),
    metaKeywords: escapeAttr(c.meta.keywords),
    ogDescription: escapeAttr(c.meta.ogDescription),
    ogImageAlt: escapeAttr(c.meta.ogImageAlt),
    twitterDescription: escapeAttr(c.meta.twitterDescription),
    jsonLd: buildJsonLd(c.meta),

    heroHeading: renderInline(c.hero.heading),
    heroLede: renderInline(c.hero.lede),
    heroCtaPrimaryHref: c.hero.ctaPrimary.href,
    heroCtaPrimaryLabel: renderInline(c.hero.ctaPrimary.label),
    heroCtaSecondaryHref: c.hero.ctaSecondary.href,
    heroCtaSecondaryLabel: renderInline(c.hero.ctaSecondary.label),
    heroChips: renderHeroChips(c.hero.chips),

    shutdownHeading: renderInline(c.shutdown.heading),
    shutdownItems,

    aboutHeading: renderInline(c.about.heading),
    aboutCard:
      renderParagraphs(c.about.card, "            ") +
      `\n            <p class="compare">${renderInline(c.about.compare)}</p>`,
    aboutBody: renderParagraphs(c.about.body, "        "),

    featuresHeading: renderInline(c.features.heading),
    featuresIntro: renderInline(c.features.intro),
    featuresItems: renderFeatureItems(c.features.items, partials),
    miniHeading: renderInline(c.features.miniHeading),
    miniItems: renderMinis(c.features.minis, partials),
    ctaStripText: renderInline(c.features.ctaStrip.text),
    ctaStripHref: c.features.ctaStrip.ctaHref,
    ctaStripLabel: renderInline(c.features.ctaStrip.ctaLabel),

    compareHeading: renderInline(c.compare.heading),
    compareIntro: renderInline(c.compare.intro),
    compareTable: renderCompare(c.compare),
    compareFootnote: renderInline(c.compare.footnote),

    pricingHeading: renderInline(c.pricing.heading),
    pricingIntro: renderInline(c.pricing.intro),
    pricingPlans: renderPricingMinis(c.pricing.plans),
    pricingSeeAll: renderInline(c.pricing.seeAll),

    faqHeading: renderInline(c.faq.heading),
    faqItems: renderFaq(c.faq.items),

    privacyHeading: renderInline(c.privacy.heading),
    privacyBody: renderParagraphs(c.privacy.body, "        "),

    sourceHeading: renderInline(c.source.heading),
    sourceIntro: renderInline(c.source.intro),
    sourceCommandsIntro: renderInline(c.source.commandsIntro),
    sourceCommands: renderSourceCommands(c.source.commands),
    sourceOutro: renderInline(c.source.outro),

    releasesHeading: renderInline(c.releases.heading),
    releasesIntro: renderInline(c.releases.intro),
    releaseNotes: buildAccordion(releases),

    footer: renderFooter(c.footer),
  };

  // The version sentinel can appear in any content string.
  const html = fill(template, vars).replace(/\{\{\s*version\s*\}\}/g, VERSION);
  await write("index.html", html);
}

// ---------- Pricing page ----------

function renderPricingPageFeatures(features) {
  return features
    .map((f) => {
      if (typeof f === "string") return `                    <li>${renderInline(f)}</li>`;
      if (f.heading) return `                    <li class="heading">${renderInline(f.heading)}</li>`;
      if (f.soon)
        return `                    <li class="soon">${renderInline(f.soon)} <span class="soon-pill">Soon</span></li>`;
      return "";
    })
    .join("\n");
}

function renderPricingPagePlan(p) {
  const cls = p.featured ? " featured" : p.selfHost ? " self-host" : "";
  const recommended = p.recommended
    ? '\n                <span class="recommended">Recommended</span>'
    : "";
  const annual = p.annual
    ? `\n                    <a href="${p.annual.href}" class="annual-link">${renderInline(p.annual.label)}</a>`
    : "";
  return `            <article class="plan${cls}">${recommended}
                <div class="plan-meta">
                    <h2>${renderInline(p.name)}</h2>
                    <p class="tagline">${renderInline(p.tagline)}</p>
                    <p class="price">${renderInline(p.price)}<span class="period"> ${renderInline(p.period)}</span></p>
                    <p class="price-sub">${renderInline(p.priceSub)}</p>
                    <a href="${p.cta.href}" class="cta ${p.cta.style}">${renderInline(p.cta.label)}</a>${annual}
                </div>
                <ul class="plan-features">
${renderPricingPageFeatures(p.features)}
                </ul>
            </article>`;
}

async function buildPricing() {
  const [{ data, body }, template] = await Promise.all([
    read("content/pricing.md").then(parseFrontmatter),
    read("templates/pricing.html"),
  ]);
  const c = data;
  const vars = {
    title: escapeAttr(c.meta.title),
    description: escapeAttr(c.meta.description),
    ogTitle: escapeAttr(c.meta.ogTitle),
    ogDescription: escapeAttr(c.meta.ogDescription),
    heading: renderInline(c.heading),
    lede: renderInline(c.lede),
    plans: c.plans.map(renderPricingPagePlan).join("\n"),
    selfHost: renderPricingPagePlan(c.selfHost),
    metaNotes: renderMarkdown(body),
  };
  await write("pricing/index.html", fill(template, vars));
}

// ---------- Legal pages ----------

const LEGAL_PAGES = ["impressum", "privacy", "terms", "refund"];
const LEGAL_FOOTER = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Impressum", href: "/legal/impressum" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Refund", href: "/legal/refund" },
];

function renderLegalFooter(canonical) {
  return LEGAL_FOOTER.filter((l) => l.href !== canonical)
    .map((l) => `        <a href="${l.href}">${l.label}</a>`)
    .join(" ·\n");
}

async function buildLegal() {
  const template = await read("templates/legal.html");
  for (const name of LEGAL_PAGES) {
    const { data, body } = parseFrontmatter(await read(`content/legal/${name}.md`));
    const updated = data.updated
      ? `        <p class="updated">Last updated: ${data.updated}</p>\n`
      : "";
    const vars = {
      title: escapeAttr(data.title),
      description: escapeAttr(data.description),
      canonical: data.canonical,
      updated,
      body: renderMarkdown(body),
      footer: renderLegalFooter(data.canonical),
    };
    await write(`legal/${name}/index.html`, fill(template, vars));
  }
}

// ---------- Migration pages ----------

const MIGRATION_FOOTER = [
  { label: "Home", href: "/" },
  { label: "Open app", href: "https://my.feedzero.app" },
  { label: "Pricing", href: "/pricing" },
  { label: "Impressum", href: "/legal/impressum" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
];

/**
 * Rewrite relative markdown links (`../foo.md`, `../../README.md#x`) to point
 * at the feedzero repo on GitHub. The source markdown lives at
 * `docs/marketing/<file>.md` so relative paths resolve against that directory.
 */
function rewriteRelativeLinks(body, sourceDir) {
  return body.replace(/(\[[^\]]+\]\()(\.\.?\/[^)\s]+)\)/g, (_m, prefix, raw) => {
    const hashIdx = raw.indexOf("#");
    const pathPart = hashIdx === -1 ? raw : raw.slice(0, hashIdx);
    const hash = hashIdx === -1 ? "" : raw.slice(hashIdx);
    const segments = sourceDir.split("/").filter(Boolean);
    for (const part of pathPart.split("/")) {
      if (part === "..") segments.pop();
      else if (part === "." || part === "") continue;
      else segments.push(part);
    }
    return `${prefix}${FEEDZERO_REPO_BASE}/${segments.join("/")}${hash})`;
  });
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed for ${url}: ${res.status} ${res.statusText}`);
  return res.text();
}

async function buildMigrations() {
  const template = await read("templates/migration.html");
  for (const { slug, file } of MIGRATIONS) {
    const url = `${MIGRATION_RAW_BASE}/${file}`;
    const raw = await fetchText(url);
    const { data, body } = parseFrontmatter(raw);
    if (data.slug !== slug) {
      throw new Error(`Slug mismatch in ${file}: expected ${slug}, got ${data.slug}`);
    }
    const rewritten = rewriteRelativeLinks(body, MIGRATION_SOURCE_DIR);
    const footer = MIGRATION_FOOTER.filter((l) => l.href !== `/${slug}`)
      .map((l) => `        <a href="${l.href}">${l.label}</a>`)
      .join(" ·\n");
    const vars = {
      title: escapeAttr(data.title),
      description: escapeAttr(data.description),
      intendedUrl: data.intended_url,
      body: renderMarkdown(rewritten),
      footer,
    };
    await write(`${slug}/index.html`, fill(template, vars));
  }
}

// ---------- Sitemap ----------

async function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/pricing", priority: "0.8", changefreq: "monthly" },
    { loc: "/pocket", priority: "0.7", changefreq: "monthly" },
    { loc: "/omnivore", priority: "0.7", changefreq: "monthly" },
    { loc: "/tt-rss", priority: "0.7", changefreq: "monthly" },
    { loc: "/legal/impressum", priority: "0.3", changefreq: "yearly" },
    { loc: "/legal/privacy", priority: "0.3", changefreq: "yearly" },
    { loc: "/legal/terms", priority: "0.3", changefreq: "yearly" },
    { loc: "/legal/refund", priority: "0.3", changefreq: "yearly" },
  ];
  const entries = urls
    .map(
      (u) => `    <url>
        <loc>${SITE_ORIGIN}${u.loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
  await write("sitemap.xml", xml);
}

// ---------- Main ----------

export async function buildAll() {
  await write("releases.xml", buildFeed(releases));
  await buildHome();
  await buildPricing();
  await buildLegal();
  await buildMigrations();
  await buildSitemap();
  console.log(
    `Done. ${releases.length} releases, ${LEGAL_PAGES.length} legal pages, ${MIGRATIONS.length} migration pages.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildAll().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
