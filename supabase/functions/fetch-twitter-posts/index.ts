import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEFAULT_X_URL = "https://x.com/NFTland/status/2029592869363687564";
const DEFAULT_X_TEXT = "Latest post from @NFTland on X.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    void body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Backend env vars are missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);


    const mirrorResponse = await fetch("https://r.jina.ai/http://x.com/NFTland");
    if (!mirrorResponse.ok) {
      throw new Error(`Mirror fetch failed [${mirrorResponse.status}]`);
    }

    const mirrorText = await mirrorResponse.text();
    const parsedTweets = parseTweetsFromText(mirrorText).slice(0, 10);

    const newestParsedId = parsedTweets.length ? extractTweetId(parsedTweets[0].url) : 0;
    const defaultTweetId = extractTweetId(DEFAULT_X_URL);

    const tweetsToStore = (
      newestParsedId < defaultTweetId
        ? [
            { text: DEFAULT_X_TEXT, url: DEFAULT_X_URL, hash: simpleHash(DEFAULT_X_URL) },
            ...parsedTweets.filter((tweet) => normalizeXUrl(tweet.url) !== DEFAULT_X_URL),
          ]
        : parsedTweets
    ).slice(0, 10);

    if (!tweetsToStore.length) {
      tweetsToStore.push({ text: DEFAULT_X_TEXT, url: DEFAULT_X_URL, hash: simpleHash(DEFAULT_X_URL) });
    }

    const nowIso = new Date().toISOString();
    for (const [index, tweet] of tweetsToStore.entries()) {
      const publishedAt = new Date(Date.now() - index * 1000).toISOString();
      const payload = {
        tweet_text: tweet.text,
        tweet_url: tweet.url,
        author_username: "NFTland",
        published_at: publishedAt,
        scraped_at: nowIso,
        hash: tweet.hash,
      };

      const { error: upsertError } = await supabase
        .from("twitter_tweets")
        .upsert(payload, { onConflict: "hash" });

      if (upsertError) {
        await supabase.from("twitter_tweets").insert(payload);
      }
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
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const { data: fallback } = await supabase
        .from("twitter_tweets")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(10);

      if (fallback?.length) {
        return new Response(
          JSON.stringify({ tweets: fallback, cached: true, warning: "Using cached tweets" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
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
  const tweetUrlRegex = /https?:\/\/(?:x\.com|twitter\.com)\/NFTland\/status\/\d+/gi;
  const matchedUrls = [...new Set((input.match(tweetUrlRegex) ?? []).map(normalizeXUrl))].sort(
    (a, b) => extractTweetId(b) - extractTweetId(a)
  );

  const tweets: Array<{ text: string; url: string; hash: string }> = [];

  for (const url of matchedUrls) {
    const index = input.indexOf(url);
    const snippet = input.slice(Math.max(0, index - 320), Math.min(input.length, index + 320));
    const text = cleanPostText(snippet);

    if (text.length >= 20) {
      tweets.push({
        text: text.slice(0, 500),
        url,
        hash: simpleHash(`${url}:${text}`),
      });
    }
  }

  if (tweets.length) return tweets;

  const lines = input
    .split("\n")
    .map((line) => cleanPostText(line))
    .filter((line) => line.length >= 20 && line.length <= 500);

  for (const line of lines) {
    const hash = simpleHash(line);
    tweets.push({
      text: line,
      url: DEFAULT_X_URL,
      hash,
    });

    if (tweets.length >= 10) break;
  }

  return tweets;
}

function cleanPostText(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/^(Title:|URL Source:|Markdown Content:)\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeXUrl(url: string): string {
  return url
    .replace("twitter.com", "x.com")
    .replace(/[),.;!?]+$/, "")
    .split("?")[0]
    .split("#")[0];
}

function extractTweetId(url: string): number {
  const match = url.match(/status\/(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function simpleHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `tw_${Math.abs(hash).toString(36)}`;
}

