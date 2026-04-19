#!/usr/bin/env node

/**
 * Captures screenshots of the FeedZero app.
 *
 * Usage:
 *   node take-screenshot.mjs              # starts dev server, takes screenshot, stops server
 *   node take-screenshot.mjs --url URL    # uses an already-running instance
 *   node take-screenshot.mjs --scene X    # "explore" (default) or "feeds"
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
