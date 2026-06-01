const BASE_URL = process.env.SEO_LIVE_BASE_URL || "https://rizzle.io";

const CHECKS = [
  {
    path: "/",
    mustInclude: ['<link rel="canonical" href="https://rizzle.io/"'],
  },
  {
    path: "/work-with-rizzle",
    mustInclude: ["Send a Private Inquiry", "/api/contact"],
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

async function main() {
  for (const check of CHECKS) {
    const url = `${BASE_URL}${check.path}`;
    const body = await fetchText(url);
    for (const needle of check.mustInclude) {
      if (!body.includes(needle)) {
        throw new Error(`Live SEO smoke failed: ${check.path} missing "${needle}"`);
      }
    }
  }

  console.log(`[seo-live-smoke] passed for ${BASE_URL}`);
}

main().catch((err) => {
  console.error("[seo-live-smoke] failed", err);
  process.exit(1);
});
