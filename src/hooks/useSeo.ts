import { useEffect } from "react";

interface SeoOptions {
  title?: string;
  description?: string;
  canonical?: string;
  /** Absolute URL to the OG/Twitter share image (1200x630). */
  image?: string;
  /** Alt text for the share image. */
  imageAlt?: string;
  /** Optional JSON-LD object (or array of objects) injected as <script type="application/ld+json"> with id `route-jsonld`. Replaces previous route's injection. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** When true, sets <meta name="robots" content="noindex, nofollow"> for this route. Use for private/post-purchase pages that should not appear in search results. */
  noindex?: boolean;
}

const DEFAULT_TITLE = "Rizzle | Web3 & AI Strategist";
const DEFAULT_DESCRIPTION =
  "Web3 & AI strategist launching progressive companies and projects with cutting-edge tech. Launches, community programs, and onchain products since 2019.";
const DEFAULT_CANONICAL = "https://rizzle.io/";
const DEFAULT_IMAGE = "https://rizzle.io/og/og-home.jpg";
const DEFAULT_IMAGE_ALT = "Rizzle — Web3 & AI Strategist";
const OG_WIDTH = "1200";
const OG_HEIGHT = "630";
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

/**
 * Lightweight per-route SEO hook — sets <title>, meta description,
 * canonical, OG/Twitter image, and an optional route-scoped JSON-LD
 * block. No external dependencies.
 */
const upsertMeta = (selector: string, attr: string, attrValue: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const ROUTE_JSONLD_ID = "route-jsonld";

const upsertRouteJsonLd = (data: SeoOptions["jsonLd"]) => {
  const existing = document.getElementById(ROUTE_JSONLD_ID);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = ROUTE_JSONLD_ID;
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

const upsertShareImage = (image: string, imageAlt: string) => {
  upsertMeta('meta[property="og:image"]', "property", "og:image", image);
  upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
  upsertMeta('meta[property="fc:frame:image"]', "property", "fc:frame:image", image);
  upsertMeta('meta[property="og:image:width"]', "property", "og:image:width", OG_WIDTH);
  upsertMeta('meta[property="og:image:height"]', "property", "og:image:height", OG_HEIGHT);
  upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", imageAlt);
  upsertMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", imageAlt);
};

const restoreDefaults = () => {
  document.title = DEFAULT_TITLE;
  upsertMeta('meta[name="description"]', "name", "description", DEFAULT_DESCRIPTION);
  upsertMeta('meta[property="og:title"]', "property", "og:title", DEFAULT_TITLE);
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", DEFAULT_TITLE);
  upsertMeta('meta[property="og:description"]', "property", "og:description", DEFAULT_DESCRIPTION);
  upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", DEFAULT_DESCRIPTION);
  upsertCanonical(DEFAULT_CANONICAL);
  upsertMeta('meta[property="og:url"]', "property", "og:url", DEFAULT_CANONICAL);
  upsertShareImage(DEFAULT_IMAGE, DEFAULT_IMAGE_ALT);
  upsertMeta('meta[name="robots"]', "name", "robots", DEFAULT_ROBOTS);
  upsertRouteJsonLd(undefined);
};

export const useSeo = ({ title, description, canonical, image, imageAlt, jsonLd, noindex }: SeoOptions) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      upsertMeta('meta[property="og:title"]', "property", "og:title", title);
      upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    }
    if (description) {
      upsertMeta('meta[name="description"]', "name", "description", description);
      upsertMeta('meta[property="og:description"]', "property", "og:description", description);
      upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }
    if (canonical) {
      upsertCanonical(canonical);
      upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    }
    if (image) {
      upsertShareImage(image, imageAlt ?? title ?? DEFAULT_IMAGE_ALT);
    }
    upsertMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, nofollow" : DEFAULT_ROBOTS);
    upsertRouteJsonLd(jsonLd);

    return restoreDefaults;
  }, [title, description, canonical, image, imageAlt, jsonLd, noindex]);
};
