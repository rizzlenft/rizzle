import { readFile } from "node:fs/promises";
import path from "node:path";
import { OG, OG_FILES, PRERENDER_OG_CHECKS } from "./og-config.mjs";

const dist = path.resolve("dist");
const publicDir = path.resolve("public");

const requiredFiles = [
  "index.html",
  "guests/index.html",
  "games/index.html",
  "work-with-rizzle/index.html",
  "sitemap.xml",
  "rss.xml",
  "robots.txt",
  "llms.txt",
];

const requiredByFile = {
  "index.html": [
    "<title>",
    'rel="canonical"',
    'meta name="description"',
    `property="og:image" content="${OG.home.url}"`,
    'property="og:image:width" content="1200"',
    'name="twitter:card" content="summary_large_image"',
  ],
  "guests/index.html": [
    "Network | Rizzle Guest Archive",
    `property="og:image" content="${OG.guests.url}"`,
    "https://rizzle.io/guests",
  ],
  "games/index.html": [
    "Arcade | Rizzle Dash, CapyRizzle Rush",
    `property="og:image" content="${OG.games.url}"`,
    "https://rizzle.io/games",
  ],
  "work-with-rizzle/index.html": [
    "<title>Work With Rizzle",
    `property="og:image" content="${OG.work.url}"`,
    "https://rizzle.io/work-with-rizzle",
  ],
  "sitemap.xml": [
    "https://rizzle.io/work-with-rizzle",
    "https://rizzle.io/guests",
    "https://rizzle.io/games",
    "https://rizzle.io/games/rizzle-dash",
  ],
  "rss.xml": ['<rss version="2.0">', "<channel>", "https://rizzle.io/work-with-rizzle"],
};

async function readUtf8(file) {
  return readFile(path.join(dist, file), "utf8");
}

function extractOgImage(html) {
  const match = html.match(/property="og:image"\s+content="([^"]+)"/i);
  return match?.[1];
}

async function main() {
  for (const file of requiredFiles) {
    try {
      await readUtf8(file);
    } catch (err) {
      throw new Error(`Missing required SEO artifact: dist/${file} (${err})`);
    }
  }

  for (const [file, needles] of Object.entries(requiredByFile)) {
    const body = await readUtf8(file);
    for (const needle of needles) {
      if (!body.includes(needle)) {
        throw new Error(`SEO smoke failed: dist/${file} missing "${needle}"`);
      }
    }
  }

  for (const check of PRERENDER_OG_CHECKS) {
    const body = await readUtf8(check.html);
    const image = extractOgImage(body);
    if (image !== check.image) {
      throw new Error(
        `OG smoke failed: dist/${check.html} expected og:image "${check.image}", got "${image ?? "none"}"`,
      );
    }
  }

  for (const file of OG_FILES) {
    try {
      const bytes = await readFile(path.join(publicDir, "og", file));
      if (bytes.byteLength < 10_000) {
        throw new Error(`OG asset too small: public/og/${file} (${bytes.byteLength} bytes)`);
      }
    } catch (err) {
      throw new Error(`Missing OG asset: public/og/${file} (${err})`);
    }
  }

  console.log("[seo-smoke] passed (includes OG image checks)");
}

main().catch((err) => {
  console.error("[seo-smoke] failed", err);
  process.exit(1);
});
