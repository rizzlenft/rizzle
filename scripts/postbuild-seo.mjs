import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const BASE_HTML_PATH = path.join(DIST_DIR, "index.html");
const SITEMAP_PATH = path.join(DIST_DIR, "sitemap.xml");
const RSS_PATH = path.join(DIST_DIR, "rss.xml");

const routes = [
  {
    path: "/",
    canonical: "https://rizzle.io/",
    title: "Rizzle | Crypto Ecosystem Operator",
    description:
      "Rizzle (NFTland) — crypto operator and builder since 2019. Community growth, launch execution, and onchain product momentum.",
    priority: "1.0",
    changefreq: "weekly",
    sourceFiles: ["src/pages/Index.tsx", "src/components/Hero.tsx", "src/components/ContentTabs.tsx"],
  },
  {
    path: "/guests",
    canonical: "https://rizzle.io/guests",
    title: "Network | Rizzle Guest Archive",
    description:
      "Searchable archive of guests and collaborators across The WIP Meetup, The Matthew & Rizzle Show, and TokenSmart.",
    priority: "0.8",
    changefreq: "weekly",
    sourceFiles: ["src/pages/GuestArchive.tsx"],
  },
  {
    path: "/games",
    canonical: "https://rizzle.io/games",
    title: "Arcade | Rizzle Games",
    description:
      "Play Rizzle Dash and Web3 Whack-a-Mole with live leaderboards in Rizzle's browser arcade.",
    priority: "0.7",
    changefreq: "weekly",
    sourceFiles: ["src/pages/Games.tsx"],
  },
  {
    path: "/work-with-rizzle",
    canonical: "https://rizzle.io/work-with-rizzle",
    title: "Work With Rizzle | Hire, Partner, or Invest",
    description:
      "Choose the best path to work with Rizzle: hiring, partnerships, or investment conversations.",
    priority: "0.9",
    changefreq: "weekly",
    sourceFiles: ["src/pages/WorkWithRizzle.tsx", "functions/api/contact.js"],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://rizzle.io/work-with-rizzle#service",
      name: "Rizzle Operator Services",
      url: "https://rizzle.io/work-with-rizzle",
      provider: { "@id": "https://rizzle.io/#person" },
      areaServed: "Worldwide",
      serviceType: [
        "Community-led growth",
        "Crypto launch support",
        "Ecosystem partnerships",
      ],
      offers: [
        {
          "@type": "Offer",
          name: "Strategy Sprint",
          url: "https://buy.stripe.com/9B65kF3CTbyH5Eh0XM63K00",
          priceCurrency: "USD",
        },
      ],
    },
  },
];

const queryRoutes = [
  {
    loc: "https://rizzle.io/?tab=art",
    priority: "0.8",
    changefreq: "monthly",
    sourceFiles: ["src/pages/Index.tsx", "src/components/ContentTabs.tsx"],
  },
];

const rssItems = [
  {
    title: "Work With Rizzle: Hire, Partner, or Invest",
    link: "https://rizzle.io/work-with-rizzle",
    description:
      "Choose the best path to work with Rizzle, including hiring, partnerships, and investment conversations.",
  },
  {
    title: "Rizzle Projects",
    link: "https://rizzle.io/",
    description:
      "Flagship launches, community programs, and onchain products built and operated by Rizzle.",
  },
  {
    title: "Rizzle Network Archive",
    link: "https://rizzle.io/guests",
    description:
      "Searchable archive of collaborators and guests from The WIP Meetup, The Matthew & Rizzle Show, and TokenSmart.",
  },
  {
    title: "Rizzle Arcade",
    link: "https://rizzle.io/games",
    description: "Browser games by Rizzle with live leaderboards.",
  },
];

function upsert(html, regex, replacement) {
  return regex.test(html) ? html.replace(regex, replacement) : html;
}

function buildRouteHtml(baseHtml, route) {
  let html = baseHtml;
  html = upsert(html, /<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);
  html = upsert(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${route.description}">`,
  );
  html = upsert(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${route.title}">`,
  );
  html = upsert(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${route.title}">`,
  );
  html = upsert(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${route.description}">`,
  );
  html = upsert(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${route.description}">`,
  );
  html = upsert(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${route.canonical}" />`,
  );
  html = upsert(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${route.canonical}" />`,
  );
  html = upsert(
    html,
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />',
  );
  html = html.replace(/<script id="route-jsonld-static"[^>]*>[\s\S]*?<\/script>/g, "");
  if (route.jsonLd) {
    html = html.replace(
      "</head>",
      `  <script id="route-jsonld-static" type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>\n</head>`,
    );
  }
  return html;
}

function buildSitemapXml() {
  const urlEntries = [
    ...routes.map((route) => ({
      loc: route.canonical,
      priority: route.priority,
      changefreq: route.changefreq,
      lastmod: route.lastmod,
    })),
    ...queryRoutes.map((route) => ({ ...route, lastmod: route.lastmod })),
  ];

  const rows = urlEntries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>
`;
}

function escapeXml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildRssXml() {
  const pubDate = new Date().toUTCString();
  const items = rssItems
    .map(
      (item) => `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${escapeXml(item.link)}</link>
    <guid>${escapeXml(item.link)}</guid>
    <description>${escapeXml(item.description)}</description>
    <pubDate>${pubDate}</pubDate>
  </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Rizzle Updates</title>
  <link>https://rizzle.io/</link>
  <description>Updates from Rizzle: projects, community, and onchain work.</description>
  <language>en-us</language>
  <lastBuildDate>${pubDate}</lastBuildDate>
${items}
</channel>
</rss>
`;
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);

  async function resolveLastmod(sourceFiles = []) {
    let latest = 0;
    for (const relativePath of sourceFiles) {
      try {
        const fullPath = path.resolve(relativePath);
        const details = await stat(fullPath);
        latest = Math.max(latest, details.mtimeMs);
      } catch {
        // Keep best-effort behavior and fall back to today's date.
      }
    }
    if (!latest) return today;
    return new Date(latest).toISOString().slice(0, 10);
  }

  for (const route of routes) {
    route.lastmod = await resolveLastmod(route.sourceFiles);
  }
  for (const route of queryRoutes) {
    route.lastmod = await resolveLastmod(route.sourceFiles);
  }

  const baseHtml = await readFile(BASE_HTML_PATH, "utf8");

  for (const route of routes) {
    const html = buildRouteHtml(baseHtml, route);
    if (route.path === "/") {
      await writeFile(BASE_HTML_PATH, html, "utf8");
      continue;
    }
    const routeDir = path.join(DIST_DIR, route.path.slice(1));
    await mkdir(routeDir, { recursive: true });
    await writeFile(path.join(routeDir, "index.html"), html, "utf8");
  }

  await writeFile(SITEMAP_PATH, buildSitemapXml(), "utf8");
  await writeFile(RSS_PATH, buildRssXml(), "utf8");
  console.log("[postbuild-seo] route html + sitemap + rss generated");
}

main().catch((err) => {
  console.error("[postbuild-seo] failed", err);
  process.exit(1);
});
