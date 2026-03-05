import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) {
      throw new Error("FIRECRAWL_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we have recent data (within last 30 minutes)
    const { data: recentCasts } = await supabase
      .from("farcaster_casts")
      .select("scraped_at")
      .order("scraped_at", { ascending: false })
      .limit(1);

    if (recentCasts && recentCasts.length > 0) {
      const lastScraped = new Date(recentCasts[0].scraped_at);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (lastScraped > thirtyMinutesAgo) {
        // Return cached data
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

    // Scrape Warpcast profile using Firecrawl
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

    // Parse casts from the scraped markdown
    // Warpcast renders casts as text blocks — we extract them heuristically
    const casts = parseCastsFromMarkdown(markdown);

    if (casts.length > 0) {
      // Upsert casts into database
      for (const cast of casts) {
        await supabase
          .from("farcaster_casts")
          .upsert(
            {
              cast_text: cast.text,
              cast_url: cast.url || `https://warpcast.com/rizzle`,
              author_username: "rizzle",
              published_at: cast.publishedAt || new Date().toISOString(),
              scraped_at: new Date().toISOString(),
              hash: cast.hash,
            },
            { onConflict: "hash" }
          );
      }
    }

    // Return fresh data
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
    
    // Try to return cached data on error
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
        return new Response(JSON.stringify({ casts: fallback, cached: true, warning: "Used cached data due to error" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
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

function parseCastsFromMarkdown(markdown: string): Array<{
  text: string;
  url?: string;
  publishedAt?: string;
  hash: string;
}> {
  const casts: Array<{ text: string; url?: string; publishedAt?: string; hash: string }> = [];

  // Split by common Warpcast patterns - each cast is typically a paragraph
  // Filter out navigation, headers, profile info
  const lines = markdown.split("\n").filter((l) => l.trim().length > 0);
  
  const skipPatterns = [
    /^#/,
    /^navigation/i,
    /^home/i,
    /^direct casts/i,
    /^explore/i,
    /^notifications/i,
    /^\[.*\]\(.*\)$/,
    /^followers/i,
    /^following/i,
    /^rizzle$/i,
    /^@rizzle$/i,
    /^!\[/,
    /^\*/,
    /^---/,
    /sign in/i,
    /sign up/i,
  ];

  let currentCast = "";

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip navigation/UI elements
    if (skipPatterns.some((p) => p.test(trimmed))) continue;
    if (trimmed.length < 10) continue;

    // Time indicators often mark cast boundaries
    const timePattern = /(\d+[hm]\s*ago|yesterday|just now|\d+d\s*ago)/i;
    
    if (timePattern.test(trimmed) && currentCast) {
      // This line contains a timestamp, save the current cast
      if (currentCast.length >= 15) {
        const hash = simpleHash(currentCast);
        casts.push({
          text: currentCast.trim(),
          url: `https://warpcast.com/rizzle`,
          hash,
        });
      }
      currentCast = "";
      continue;
    }

    // Accumulate text
    if (trimmed.length >= 15 && !trimmed.startsWith("[") && !trimmed.startsWith("!")) {
      if (currentCast) {
        currentCast += " " + trimmed;
      } else {
        currentCast = trimmed;
      }

      // If we have a good chunk of text, save it
      if (currentCast.length > 200) {
        const hash = simpleHash(currentCast);
        casts.push({
          text: currentCast.trim().substring(0, 500),
          url: `https://warpcast.com/rizzle`,
          hash,
        });
        currentCast = "";
      }
    }
  }

  // Don't forget the last cast
  if (currentCast.length >= 15) {
    const hash = simpleHash(currentCast);
    casts.push({
      text: currentCast.trim().substring(0, 500),
      url: `https://warpcast.com/rizzle`,
      hash,
    });
  }

  return casts.slice(0, 10);
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `fc_${Math.abs(hash).toString(36)}`;
}
