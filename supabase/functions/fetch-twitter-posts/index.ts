import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Backend env vars are missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: recentTweets } = await supabase
      .from("twitter_tweets")
      .select("scraped_at")
      .order("scraped_at", { ascending: false })
      .limit(1);

    if (recentTweets?.length) {
      const lastScraped = new Date(recentTweets[0].scraped_at);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      if (lastScraped > thirtyMinutesAgo) {
        const { data: cached } = await supabase
          .from("twitter_tweets")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(10);

        return new Response(JSON.stringify({ tweets: cached ?? [], cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Firecrawl may block X in some environments, so we fetch from r.jina.ai mirror first.
    const mirrorResponse = await fetch("https://r.jina.ai/http://x.com/NFTland");
    if (!mirrorResponse.ok) {
      throw new Error(`Mirror fetch failed [${mirrorResponse.status}]`);
    }

    const mirrorText = await mirrorResponse.text();
    const tweets = parseTweetsFromText(mirrorText);

    for (const tweet of tweets) {
      await supabase.from("twitter_tweets").upsert(
        {
          tweet_text: tweet.text,
          tweet_url: tweet.url,
          author_username: "NFTland",
          published_at: new Date().toISOString(),
          scraped_at: new Date().toISOString(),
          hash: tweet.hash,
        },
        { onConflict: "hash" }
      );
    }

    const { data: freshTweets } = await supabase
      .from("twitter_tweets")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(10);

    return new Response(JSON.stringify({ tweets: freshTweets ?? [], cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("fetch-twitter-posts error:", message);

    try {
      const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      const { data: fallback } = await supabase
        .from("twitter_tweets")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(10);

      if (fallback?.length) {
        return new Response(JSON.stringify({ tweets: fallback, cached: true, warning: "Using cached tweets" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch {
      // ignore fallback errors
    }

    return new Response(JSON.stringify({ tweets: [], error: "Failed to fetch X posts", detail: message }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function parseTweetsFromText(input: string): Array<{ text: string; url: string; hash: string }> {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 20);

  const skip = [/^Title:/i, /^URL Source:/i, /^Markdown Content:/i, /^\s*home\s*$/i, /^\s*explore\s*$/i];

  const tweets: Array<{ text: string; url: string; hash: string }> = [];

  for (const line of lines) {
    if (skip.some((pattern) => pattern.test(line))) continue;
    if (line.toLowerCase().includes("sign in") || line.toLowerCase().includes("sign up")) continue;

    const cleaned = line
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned.length < 40 || cleaned.length > 500) continue;

    const hash = simpleHash(cleaned);
    tweets.push({
      text: cleaned,
      url: "https://x.com/NFTland",
      hash,
    });

    if (tweets.length >= 10) break;
  }

  return tweets;
}

function simpleHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `tw_${Math.abs(hash).toString(36)}`;
}
