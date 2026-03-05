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
    const { data: recentTweets } = await supabase
      .from("twitter_tweets")
      .select("scraped_at")
      .order("scraped_at", { ascending: false })
      .limit(1);

    if (recentTweets && recentTweets.length > 0) {
      const lastScraped = new Date(recentTweets[0].scraped_at);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (lastScraped > thirtyMinutesAgo) {
        const { data: cached } = await supabase
          .from("twitter_tweets")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(10);
        return new Response(JSON.stringify({ tweets: cached, cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Scrape X/Twitter profile using Firecrawl
    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: "https://x.com/NFTland",
        formats: ["markdown"],
      }),
    });

    if (!scrapeResponse.ok) {
      const errText = await scrapeResponse.text();
      throw new Error(`Firecrawl scrape failed [${scrapeResponse.status}]: ${errText}`);
    }

    const scrapeData = await scrapeResponse.json();
    const markdown = scrapeData?.data?.markdown || "";

    const tweets = parseTweetsFromMarkdown(markdown);

    if (tweets.length > 0) {
      for (const tweet of tweets) {
        await supabase
          .from("twitter_tweets")
          .upsert(
            {
              tweet_text: tweet.text,
              tweet_url: tweet.url || "https://x.com/NFTland",
              author_username: "NFTland",
              published_at: new Date().toISOString(),
              scraped_at: new Date().toISOString(),
              hash: tweet.hash,
            },
            { onConflict: "hash" }
          );
      }
    }

    const { data: freshTweets } = await supabase
      .from("twitter_tweets")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(10);

    return new Response(JSON.stringify({ tweets: freshTweets, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tweets:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data: fallback } = await supabase
        .from("twitter_tweets")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(10);
      if (fallback && fallback.length > 0) {
        return new Response(JSON.stringify({ tweets: fallback, cached: true, warning: "Used cached data" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (_) {
      // ignore
    }

    return new Response(JSON.stringify({ error: "Failed to fetch tweets", detail: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function parseTweetsFromMarkdown(markdown: string): Array<{
  text: string;
  url?: string;
  hash: string;
}> {
  const tweets: Array<{ text: string; url?: string; hash: string }> = [];
  const lines = markdown.split("\n").filter((l) => l.trim().length > 0);

  const skipPatterns = [
    /^#/,
    /^navigation/i,
    /^home/i,
    /^explore/i,
    /^notifications/i,
    /^messages/i,
    /^settings/i,
    /^trending/i,
    /^who to follow/i,
    /^\[.*\]\(.*\)$/,
    /^!\[/,
    /^\*/,
    /^---/,
    /sign in/i,
    /sign up/i,
    /^following$/i,
    /^followers$/i,
    /^posts$/i,
    /^replies$/i,
    /^media$/i,
    /^likes$/i,
  ];

  let currentTweet = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (skipPatterns.some((p) => p.test(trimmed))) continue;
    if (trimmed.length < 10) continue;

    const timePattern = /(\d+[hm]\s*ago|yesterday|just now|\d+d\s*ago|·\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))/i;

    if (timePattern.test(trimmed) && currentTweet) {
      if (currentTweet.length >= 15) {
        const hash = simpleHash(currentTweet);
        tweets.push({
          text: currentTweet.trim().substring(0, 500),
          url: "https://x.com/NFTland",
          hash,
        });
      }
      currentTweet = "";
      continue;
    }

    if (trimmed.length >= 15 && !trimmed.startsWith("[") && !trimmed.startsWith("!")) {
      currentTweet = currentTweet ? currentTweet + " " + trimmed : trimmed;

      if (currentTweet.length > 200) {
        const hash = simpleHash(currentTweet);
        tweets.push({
          text: currentTweet.trim().substring(0, 500),
          url: "https://x.com/NFTland",
          hash,
        });
        currentTweet = "";
      }
    }
  }

  if (currentTweet.length >= 15) {
    const hash = simpleHash(currentTweet);
    tweets.push({
      text: currentTweet.trim().substring(0, 500),
      url: "https://x.com/NFTland",
      hash,
    });
  }

  return tweets.slice(0, 10);
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `tw_${Math.abs(hash).toString(36)}`;
}
