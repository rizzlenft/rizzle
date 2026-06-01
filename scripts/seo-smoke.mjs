import { readFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");

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
  "index.html": ["<title>", 'rel="canonical"', 'meta name="description"'],
  "work-with-rizzle/index.html": [
    "<title>Work With Rizzle",
    "Service",
    "https://rizzle.io/work-with-rizzle",
  ],
  "sitemap.xml": [
    "https://rizzle.io/work-with-rizzle",
    "https://rizzle.io/guests",
    "https://rizzle.io/games",
  ],
  "rss.xml": ["<rss version=\"2.0\">", "<channel>", "https://rizzle.io/work-with-rizzle"],
};

async function readUtf8(file) {
  return readFile(path.join(dist, file), "utf8");
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

  console.log("[seo-smoke] passed");
}

main().catch((err) => {
  console.error("[seo-smoke] failed", err);
  process.exit(1);
});
