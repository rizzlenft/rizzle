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
    const forceRefresh = Boolean(body?.forceRefresh);

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) {
      throw new Error("FIRECRAWL_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!forceRefresh) {
      const { data: recentCasts } = await supabase
        .from("farcaster_casts")
        .select("scraped_at")
        .order("scraped_at", { ascending: false })
        .limit(1);

      if (recentCasts && recentCasts.length > 0) {
        const lastScraped = new Date(recentCasts[0].scraped_at);
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (lastScraped > thirtyMinutesAgo) {
          const { data: cached } = await supabase
            .from("farcaster_casts")
            .select("*")
            .order("published_at", { ascending: false })
            .limit(10);
          return new Response(JSON.stringify({ casts: cached, cached: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: "https://warpcast.com/rizzle",
        formats: ["markdown"],
      }),
    });

    if (!scrapeResponse.ok) {
      const errText = await scrapeResponse.text();
      throw new Error(`Firecrawl scrape failed [${scrapeResponse.status}]: ${errText}`);
    }

    const scrapeData = await scrapeResponse.json();
    const markdown = scrapeData?.data?.markdown || "";

    const parsedCasts = parseCastsFromMarkdown(markdown).slice(0, 10);
    const priorityCast = {
      text: DEFAULT_FARCASTER_TEXT,
      url: DEFAULT_FARCASTER_URL,
      hash: simpleHash(DEFAULT_FARCASTER_URL),
    };

    const castsToStore = [
      priorityCast,
      ...parsedCasts.filter((cast) => normalizeCastUrl(cast.url) !== DEFAULT_FARCASTER_URL),
    ].slice(0, 10);

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
  const castUrlRegex = /https?:\/\/(?:warpcast\.com|farcaster\.xyz)\/rizzle\/0x[a-f0-9]+/gi;
  const matchedUrls = [...new Set((markdown.match(castUrlRegex) ?? []).map(normalizeCastUrl))];

  const casts: Array<{ text: string; url: string; hash: string }> = [];

  for (const url of matchedUrls) {
    const index = markdown.indexOf(url);
    const snippet = markdown.slice(Math.max(0, index - 350), Math.min(markdown.length, index + 350));
    const text = cleanPostText(snippet);

    if (text.length >= 20) {
      casts.push({
        text: text.slice(0, 500),
        url,
        hash: simpleHash(`${url}:${text}`),
      });
    }
  }

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
  return url.replace(/[),.;!?]+$/, "").split("?")[0].split("#")[0];
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `fc_${Math.abs(hash).toString(36)}`;
}

