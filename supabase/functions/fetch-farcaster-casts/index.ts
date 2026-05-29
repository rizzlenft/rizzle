import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_FARCASTER_URL = "https://farcaster.xyz/rizzle/0x70d0d410";
const DEFAULT_FARCASTER_TEXT = "Latest cast from @rizzle on Farcaster.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    void body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the Warpcast profile page via Jina's free reader-mode proxy.
    // r.jina.ai renders the JS-heavy Warpcast page and returns clean markdown,
    // which our existing parseCastsFromMarkdown() understands. This replaces
    // the previous Firecrawl integration (which required a paid API key).
    // Same approach the fetch-twitter-posts function already uses.
    const scrapeResponse = await fetch("https://r.jina.ai/https://warpcast.com/rizzle", {
      headers: {
        // Asking for markdown explicitly. Without this Jina sometimes returns
        // text/html which is still parsable but messier.
        Accept: "text/markdown",
      },
    });

    if (!scrapeResponse.ok) {
      const errText = await scrapeResponse.text();
      throw new Error(`Jina reader fetch failed [${scrapeResponse.status}]: ${errText}`);
    }

    const markdown = await scrapeResponse.text();

    const parsedCasts = parseCastsFromMarkdown(markdown).slice(0, 10);
    const parsedDefaultCast = parsedCasts.find((cast) => normalizeCastUrl(cast.url) === DEFAULT_FARCASTER_URL);

    const castsToStore = (
      parsedDefaultCast
        ? [parsedDefaultCast, ...parsedCasts.filter((cast) => normalizeCastUrl(cast.url) !== DEFAULT_FARCASTER_URL)]
        : [
            { text: DEFAULT_FARCASTER_TEXT, url: DEFAULT_FARCASTER_URL, hash: simpleHash(DEFAULT_FARCASTER_URL) },
            ...parsedCasts,
          ]
    ).slice(0, 10);

    const nowIso = new Date().toISOString();
    await Promise.all(
      castsToStore.map((cast, index) => {
        const publishedAt = new Date(Date.now() - index * 1000).toISOString();
        return supabase
          .from("farcaster_casts")
          .upsert(
            {
              cast_text: cast.text,
              cast_url: cast.url,
              author_username: "rizzle",
              published_at: publishedAt,
              scraped_at: nowIso,
              hash: cast.hash,
            },
            { onConflict: "hash" }
          );
      })
    );

    const { data: freshCasts } = await supabase
      .from("farcaster_casts")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(10);

    return new Response(JSON.stringify({ casts: freshCasts, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching Farcaster casts:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data: fallback } = await supabase
        .from("farcaster_casts")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(10);
      if (fallback && fallback.length > 0) {
        return new Response(
          JSON.stringify({ casts: fallback, cached: true, warning: "Used cached data due to error" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } catch (_) {
      // ignore fallback errors
    }

    return new Response(JSON.stringify({ error: "Failed to fetch casts", detail: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function parseCastsFromMarkdown(markdown: string): Array<{ text: string; url: string; hash: string }> {
  // Match cast URLs in either format we see in the wild:
  //   - path style:  https://farcaster.xyz/rizzle/0xabcd1234         (legacy, used by old DEFAULT_FARCASTER_URL)
  //   - query style: https://farcaster.xyz/rizzle?castHash=0xabcd... (what r.jina.ai's render of warpcast.com returns today)
  // Both resolve to the same cast on Farcaster's site, so we accept either.
  const castUrlRegex = /https?:\/\/(?:warpcast\.com|farcaster\.xyz)\/rizzle(?:\/|\?castHash=)0x[a-f0-9]+/gi;

  // We need both the raw URL (to locate it inside the markdown for snippet
  // extraction) and the normalized URL (for storage + dedup). Keep them paired.
  const rawMatches = markdown.match(castUrlRegex) ?? [];
  const seen = new Map<string, string>(); // normalized -> first raw occurrence
  for (const raw of rawMatches) {
    const normalized = normalizeCastUrl(raw);
    if (!seen.has(normalized)) seen.set(normalized, raw);
  }

  const enriched = [...seen.entries()]
    .map(([normalizedUrl, rawUrl]) => {
      const index = markdown.indexOf(rawUrl);
      if (index === -1) return null;
      const snippet = markdown.slice(Math.max(0, index - 220), Math.min(markdown.length, index + 220));
      const text = cleanPostText(snippet);
      const ageMinutes = parseAgeMinutes(snippet);

      if (text.length < 20) return null;

      return {
        text: text.slice(0, 500),
        url: normalizedUrl,
        hash: simpleHash(`${normalizedUrl}:${text}`),
        ageMinutes,
        index,
      };
    })
    .filter((cast): cast is { text: string; url: string; hash: string; ageMinutes: number; index: number } => Boolean(cast))
    .sort((a, b) => a.ageMinutes - b.ageMinutes || a.index - b.index);

  const casts = enriched.map(({ text, url, hash }) => ({ text, url, hash }));

  if (casts.length) return casts;

  const lines = markdown
    .split("\n")
    .map((line) => cleanPostText(line))
    .filter((line) => line.length >= 20 && line.length <= 500);

  for (const line of lines) {
    if (/^(navigation|home|explore|notifications|followers|following)$/i.test(line)) continue;
    casts.push({
      text: line,
      url: DEFAULT_FARCASTER_URL,
      hash: simpleHash(line),
    });

    if (casts.length >= 10) break;
  }

  return casts;
}

function cleanPostText(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/^#+\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCastUrl(url: string): string {
  // Strip trailing punctuation that markdown links sometimes carry.
  let normalized = url.replace(/[),.;!?]+$/, "").split("#")[0];

  // Convert query-style cast URLs (?castHash=0xFULLHASH) to the legacy path
  // style (/0xFULLHASH). Both forms are valid links on farcaster.xyz; keeping
  // them in one shape means duplicate detection works and the downstream
  // parser (which uses indexOf to locate snippets in the markdown) doesn't
  // need to look for two URL formats.
  const queryStyleMatch = normalized.match(
    /^(https?:\/\/(?:warpcast\.com|farcaster\.xyz)\/rizzle)\?castHash=(0x[a-f0-9]+)(?:&.*)?$/i,
  );
  if (queryStyleMatch) {
    return `${queryStyleMatch[1]}/${queryStyleMatch[2]}`;
  }

  // Otherwise this is already a path-style URL — strip any remaining query.
  return normalized.split("?")[0];
}

function parseAgeMinutes(text: string): number {
  const minuteMatch = text.match(/(\d+)\s*m\b/i);
  if (minuteMatch) return Number(minuteMatch[1]);

  const hourMatch = text.match(/(\d+)\s*h\b/i);
  if (hourMatch) return Number(hourMatch[1]) * 60;

  const dayMatch = text.match(/(\d+)\s*d\b/i);
  if (dayMatch) return Number(dayMatch[1]) * 1440;

  if (/just now/i.test(text)) return 0;
  return Number.MAX_SAFE_INTEGER;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `fc_${Math.abs(hash).toString(36)}`;
}

