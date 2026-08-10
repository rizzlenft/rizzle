const BASE_URL = process.env.SEO_LIVE_BASE_URL || "https://rizzle.io";

import { OG } from "./og-config.mjs";

const CHECKS = [
  {
    path: "/",
    mustInclude: ['<link rel="canonical" href="https://rizzle.io/"'],
    ogImage: OG.home.url,
  },
  {
    path: "/guests",
    mustInclude: ["Network | Rizzle Guest Archive"],
    ogImage: OG.guests.url,
  },
  {
    path: "/games",
    mustInclude: ["Arcade | Rizzle Dash, CapyRizzle Rush"],
    ogImage: OG.games.url,
  },
  {
    path: "/work-with-rizzle",
    mustInclude: ["Send a Private Inquiry", "/api/contact"],
    ogImage: OG.work.url,
  },
  {
    path: "/sitemap.xml",
    mustInclude: ["https://rizzle.io/work-with-rizzle"],
  },
  {
    path: "/robots.txt",
    mustInclude: ["Sitemap: https://rizzle.io/sitemap.xml"],
  },
  {
    path: "/.well-known/security.txt",
    mustInclude: ["Contact: https://rizzle.io/work-with-rizzle"],
  },
];

const OG_ASSETS = Object.values(OG).map((entry) => entry.url.replace(BASE_URL, ""));

function extractOgImage(html) {
  const match = html.match(/property="og:image"\s+content="([^"]+)"/i);
  return match?.[1];
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "rizzle-seo-live-smoke/1.0" },
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`${url} returned ${res.status}`);
  }
  return body;
}

async function fetchHead(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "rizzle-seo-live-smoke/1.0" },
  });
  if (!res.ok) {
    throw new Error(`${url} returned ${res.status}`);
  }
  return res;
}

async function main() {
  for (const check of CHECKS) {
    const url = `${BASE_URL}${check.path}`;
    const body = await fetchText(url);
    for (const needle of check.mustInclude) {
      if (!body.includes(needle)) {
        throw new Error(`Live SEO smoke failed: ${check.path} missing "${needle}"`);
      }
    }
    if (check.ogImage) {
      const image = extractOgImage(body);
      if (image !== check.ogImage) {
        throw new Error(
          `Live OG smoke failed: ${check.path} expected og:image "${check.ogImage}", got "${image ?? "none"}"`,
        );
      }
    }
  }

  for (const assetPath of OG_ASSETS) {
    const res = await fetchHead(`${BASE_URL}${assetPath}`);
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("image/jpeg")) {
      throw new Error(`Live OG asset failed: ${assetPath} content-type "${type}"`);
    }
    const bytes = Number(res.headers.get("content-length") ?? 0);
    if (bytes > 0 && bytes < 10_000) {
      throw new Error(`Live OG asset too small: ${assetPath} (${bytes} bytes)`);
    }
  }

  console.log(`[seo-live-smoke] passed for ${BASE_URL} (includes OG checks)`);
}

main().catch((err) => {
  console.error("[seo-live-smoke] failed", err);
  process.exit(1);
});
