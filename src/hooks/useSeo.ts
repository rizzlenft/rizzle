import { useEffect } from "react";

interface SeoOptions {
  title?: string;
  description?: string;
  canonical?: string;
  /** Absolute URL to the OG/Twitter share image (1200x630). */
  image?: string;
  /** Optional JSON-LD object (or array of objects) injected as <script type="application/ld+json"> with id `route-jsonld`. Replaces previous route's injection. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

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
  // Always remove the prior route-scoped block so stale schema doesn't linger.
  const existing = document.getElementById(ROUTE_JSONLD_ID);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = ROUTE_JSONLD_ID;
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

export const useSeo = ({ title, description, canonical, image, jsonLd }: SeoOptions) => {
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
      upsertMeta('meta[property="og:image"]', "property", "og:image", image);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
      upsertMeta('meta[property="fc:frame:image"]', "property", "fc:frame:image", image);
    }
    upsertRouteJsonLd(jsonLd);
  }, [title, description, canonical, image, jsonLd]);
};
