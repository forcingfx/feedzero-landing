#!/usr/bin/env node

/**
 * Captures screenshots of the FeedZero app.
 *
 * Usage:
 *   node take-screenshot.mjs              # starts dev server, takes screenshot, stops server
 *   node take-screenshot.mjs --url URL    # uses an already-running instance
 *   node take-screenshot.mjs --scene X    # "explore" (default), "feeds", or "landing"
 *
 * Requires: playwright (installed in ../feedzero/node_modules)
 */

import { chromium } from "../feedzero/node_modules/playwright/index.mjs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEEDZERO_DIR = resolve(__dirname, "../feedzero");
const OUTPUT = resolve(__dirname, "screenshot.png");
const DEFAULT_PORT = 3001;

function parseArgs() {
  const args = process.argv.slice(2);
  const urlIdx = args.indexOf("--url");
  const sceneIdx = args.indexOf("--scene");
  return {
    url: urlIdx !== -1 ? args[urlIdx + 1] : null,
    scene: sceneIdx !== -1 ? args[sceneIdx + 1] : "explore",
  };
}

async function startDevServer(port) {
  const vite = spawn("npx", ["vite", "--port", String(port)], {
    cwd: FEEDZERO_DIR,
    stdio: ["ignore", "pipe", "pipe"],
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Dev server failed to start within 15s")),
      15000
    );
    vite.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Local:")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    vite.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  return vite;
}

async function screenshotExplore(page, baseUrl) {
  await page.addInitScript(() => {
    localStorage.setItem("feedzero:onboarding-complete", "true");
    localStorage.setItem("feedzero:storage-mode", "local");
  });

  await page.goto(`${baseUrl}/explore`);
  await page.getByRole("heading", { name: "Explore" }).waitFor({ timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: OUTPUT });
}

async function screenshotFeeds(page, baseUrl) {
  await page.addInitScript(() => {
    localStorage.setItem("feedzero:onboarding-complete", "true");
    localStorage.setItem("feedzero:storage-mode", "sync");
  });

  // Start at Explore to add feeds
  await page.goto(`${baseUrl}/explore`);
  await page.getByText("Explore feeds").waitFor({ timeout: 15000 });
  await page.waitForTimeout(1500);

  // Add feeds by clicking their Add buttons
  const feedsToAdd = [
    "Ars Technica",
    "Hacker News",
    "The Verge",
    "NPR",
    "Reuters",
    "BBC News",
  ];

  for (const feedName of feedsToAdd) {
    try {
      const row = page.locator(`[role="option"]`, {
        has: page.getByText(feedName, { exact: true }),
      });
      const addBtn = row.getByRole("button", { name: "Add" });
      if ((await addBtn.count()) > 0) {
        await addBtn.click();
        await page.waitForTimeout(300);
      }
    } catch {
      // Skip if feed not found
    }
  }

  // Wait for feeds to start loading
  await page.waitForTimeout(3000);

  // Navigate to feeds view
  await page.goto(`${baseUrl}/feeds`);
  await page.waitForTimeout(2000);

  // Click the first feed that has articles
  const firstFeed = page.locator('[data-sidebar="menu-button"]').nth(2);
  if ((await firstFeed.count()) > 0) {
    await firstFeed.click();
    await page.waitForTimeout(1500);
  }

  // Click the first article if available
  const firstArticle = page.locator("article").first();
  if ((await firstArticle.count()) > 0) {
    await firstArticle.click();
    await page.waitForTimeout(1000);
  }

  // Mock the sync badge to show "synced" state
  await page.evaluate(() => {
    // Find the sync badge and update it
    const localBadge = document.querySelector(
      '[class*="amber"]  span'
    );
    if (localBadge) {
      // Try to find and update the sync store
      const badge = document.querySelector('[data-sidebar="footer"] [class*="badge"]');
      if (badge) {
        badge.textContent = "Synced";
        badge.className = badge.className.replace(/amber/g, "emerald");
      }
    }
  });

  await page.waitForTimeout(500);
  await page.screenshot({ path: OUTPUT });
}

/**
 * Seeds 4 folders, 20 feeds, and articles by directly invoking the app's
 * own storage modules through Vite's module graph. The featured article
 * gets a hero image so the resulting screenshot looks like a real reading
 * session instead of an empty shell.
 */
async function screenshotLanding(page, baseUrl) {
  await page.goto(`${baseUrl}/`);
  // Wait for Vite to have loaded the app shell so /src/* dynamic imports resolve.
  await page.waitForFunction(() => !!document.querySelector("#root"));
  await page.waitForTimeout(500);

  const featured = await page.evaluate(async () => {
    const km = await import("/src/core/storage/key-manager.ts");
    const db = await import("/src/core/storage/db.ts");

    const init = await km.initFresh("screenshot-fixture", { sync: false, skipServerCleanup: true });
    if (!init.ok) throw new Error("initFresh failed: " + init.error);

    const now = Date.now();
    const day = 86_400_000;

    const folders = [
      { id: crypto.randomUUID(), name: "News",       color: "#0ea5e9", createdAt: now },
      { id: crypto.randomUUID(), name: "Technology", color: "#8b5cf6", createdAt: now },
      { id: crypto.randomUUID(), name: "Design",     color: "#f59e0b", createdAt: now },
      { id: crypto.randomUUID(), name: "Science",    color: "#10b981", createdAt: now },
    ];
    for (const f of folders) {
      const r = await db.addFolder(f);
      if (!r.ok) throw new Error("addFolder failed: " + r.error);
    }
    const [news, tech, design, science] = folders;

    const feedDefs = [
      // News (4)
      { title: "Reuters",            site: "https://reuters.com",            folderId: news.id },
      { title: "BBC News",           site: "https://bbc.com/news",           folderId: news.id },
      { title: "NPR",                site: "https://npr.org",                folderId: news.id },
      { title: "The Guardian",       site: "https://theguardian.com",        folderId: news.id },
      // Technology (6)
      { title: "Ars Technica",       site: "https://arstechnica.com",        folderId: tech.id },
      { title: "Hacker News",        site: "https://news.ycombinator.com",   folderId: tech.id },
      { title: "The Verge",          site: "https://theverge.com",           folderId: tech.id },
      { title: "Wired",              site: "https://wired.com",              folderId: tech.id },
      { title: "MIT Technology Review", site: "https://technologyreview.com",folderId: tech.id },
      { title: "TechCrunch",         site: "https://techcrunch.com",         folderId: tech.id },
      // Design (4)
      { title: "Smashing Magazine",  site: "https://smashingmagazine.com",   folderId: design.id },
      { title: "A List Apart",       site: "https://alistapart.com",         folderId: design.id },
      { title: "CSS-Tricks",         site: "https://css-tricks.com",         folderId: design.id },
      { title: "Nielsen Norman Group", site: "https://nngroup.com",          folderId: design.id },
      // Science (4)
      { title: "Quanta Magazine",    site: "https://quantamagazine.org",     folderId: science.id },
      { title: "Nature",             site: "https://nature.com",             folderId: science.id },
      { title: "Scientific American",site: "https://scientificamerican.com", folderId: science.id },
      { title: "Phys.org",           site: "https://phys.org",               folderId: science.id },
      // Unfiled (2) — total 20
      { title: "xkcd",               site: "https://xkcd.com",               folderId: undefined },
      { title: "Pitchfork",          site: "https://pitchfork.com",          folderId: undefined },
    ];

    const feeds = feedDefs.map((f, i) => ({
      id: crypto.randomUUID(),
      url: f.site + "/rss",
      title: f.title,
      description: "",
      siteUrl: f.site,
      folderId: f.folderId,
      createdAt: now - i * 1000,
      updatedAt: now - i * 1000,
    }));
    for (const f of feeds) {
      const r = await db.addFeed(f);
      if (!r.ok) throw new Error("addFeed failed: " + r.error);
    }

    // Featured feed + article. Ars Technica gets a hero image so the right
    // pane shows real-looking content with a picture, not just text.
    const ars = feeds.find((f) => f.title === "Ars Technica");
    const featuredArticleId = crypto.randomUUID();
    const heroImg =
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=85&auto=format&fit=crop";

    const featuredContent = `
      <figure>
        <img src="${heroImg}" alt="Close-up of a green circuit board" style="width:100%;height:auto;border-radius:8px;" />
        <figcaption>The new chip stacks logic and memory in a single die.</figcaption>
      </figure>
      <p>The fab in Hsinchu has been quiet about its newest process node, but
      engineers familiar with the line describe a manufacturing breakthrough
      that could reshape how we build everyday computing devices for the next
      decade.</p>
      <p>By co-locating SRAM directly above the compute fabric, the design
      avoids the long copper traces that dominate power budgets in modern
      accelerators. Early benchmarks suggest a 40% reduction in idle draw
      without compromising peak throughput.</p>
      <p>Independent reviewers will not get their hands on silicon until late
      next quarter, but if the published figures hold, the implications for
      battery-powered devices are substantial.</p>
      <h2>What changed</h2>
      <p>The core innovation is not the transistor density — it is the
      packaging. By thinning the memory die to under 25 microns and bonding
      it directly to the logic substrate, the team eliminated an entire
      hierarchy of off-chip caches.</p>
      <p>This is the kind of incremental, deeply physical engineering work
      that rarely makes headlines, and almost always reshapes the industry
      in retrospect.</p>
    `;

    const articles = [];
    // 20+ articles spread across the featured feed and a few siblings, so
    // the middle "article list" pane is populated and looks alive.
    const featuredArticle = {
      id: featuredArticleId,
      feedId: ars.id,
      guid: "featured",
      title: "Inside the quiet revolution rewriting silicon",
      link: ars.siteUrl + "/2026/05/silicon",
      content: featuredContent,
      summary: "A new packaging technique cuts idle power by 40% without sacrificing throughput.",
      author: "Marian Keller",
      publishedAt: now - 30 * 60_000,
      read: false,
      createdAt: now,
    };
    articles.push(featuredArticle);

    const arsTitles = [
      "Open-source RISC-V is finally hitting its stride",
      "How a tiny capacitor change saved a satellite launch",
      "What the new GPU pricing tells us about AI demand",
      "The slow death of x86 in datacenter inference",
      "Why your phone's modem still runs proprietary firmware",
    ];
    arsTitles.forEach((t, i) => {
      articles.push({
        id: crypto.randomUUID(),
        feedId: ars.id,
        guid: "ars-" + i,
        title: t,
        link: ars.siteUrl + "/2026/05/" + i,
        content: "<p>" + t + ".</p>",
        summary: t,
        author: "Ars staff",
        publishedAt: now - (i + 1) * 3 * 3600_000,
        read: i >= 3,
        createdAt: now,
      });
    });

    // Sprinkle a handful of articles on other feeds so unread counts show.
    const others = feeds.filter((f) => f.id !== ars.id).slice(0, 14);
    others.forEach((feed, fi) => {
      const count = 1 + (fi % 4);
      for (let i = 0; i < count; i++) {
        articles.push({
          id: crypto.randomUUID(),
          feedId: feed.id,
          guid: feed.id + "-" + i,
          title: feed.title + ": story " + (i + 1),
          link: feed.siteUrl + "/" + i,
          content: "<p>Placeholder.</p>",
          summary: "",
          author: "",
          publishedAt: now - (fi * 5 + i) * 7200_000 - day,
          read: false,
          createdAt: now,
        });
      }
    });

    const addRes = await db.addArticles(articles);
    if (!addRes.ok) throw new Error("addArticles failed: " + addRes.error);

    localStorage.setItem("feedzero:onboarding-complete", "true");
    // Hide the "feeds are stored locally" warning that otherwise sits in the
    // bottom-left of the sidebar — we want a clean marketing shot.
    localStorage.setItem("feedzero:local-warning-dismissed", "true");

    return { feedId: ars.id, articleId: featuredArticleId };
  });

  // Reload into the seeded state and open the featured article directly.
  await page.goto(`${baseUrl}/feeds/${featured.feedId}/articles/${featured.articleId}`);

  // Wait for the article body to render — the figure/img we injected confirms
  // the reader pane has hydrated with the seeded content.
  await page.waitForSelector("article img, figure img", { timeout: 15000 });
  // Give the hero image a moment to actually decode.
  await page.waitForTimeout(2500);

  await page.screenshot({ path: OUTPUT });
}

async function main() {
  const { url, scene } = parseArgs();
  let server = null;

  try {
    const baseUrl = url || `http://localhost:${DEFAULT_PORT}`;

    if (!url) {
      console.log("Starting dev server...");
      server = await startDevServer(DEFAULT_PORT);
      console.log(`Dev server running on ${baseUrl}`);
    }

    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    if (scene === "feeds") {
      await screenshotFeeds(page, baseUrl);
    } else if (scene === "landing") {
      await screenshotLanding(page, baseUrl);
    } else {
      await screenshotExplore(page, baseUrl);
    }

    await browser.close();
    console.log(`Screenshot saved to ${OUTPUT} (scene: ${scene})`);
  } finally {
    if (server) {
      server.kill();
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
