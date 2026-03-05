import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MessageCircle, RefreshCw, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SourceType = "farcaster" | "twitter";

interface FeedItem {
  id: string;
  text: string;
  url: string;
  source: SourceType;
  publishedAt: string | null;
}

const FarcasterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M3.5 3h17v18h-3v-5.25c0-1.5-.5-2.75-2.25-2.75s-2.25 1.25-2.25 2.75V21h-3v-5.25c0-1.5-.5-2.75-2.25-2.75S5.5 14.25 5.5 15.75V21h-2V3zm2 2v7h2V5h-2zm10 0v7h2V5h-2z" />
  </svg>
);

const cleanText = (raw: string) => {
  const noLinks = raw.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  const noUrls = noLinks.replace(/https?:\/\/\S+/g, "");
  return noUrls.replace(/\s+/g, " ").trim();
};

const formatTimeAgo = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ActivityFeed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeed = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);

      const [castsRes, tweetsRes] = await Promise.all([
        supabase.from("farcaster_casts").select("id, cast_text, cast_url, published_at").order("published_at", { ascending: false }).limit(8),
        supabase.from("twitter_tweets").select("id, tweet_text, tweet_url, published_at").order("published_at", { ascending: false }).limit(8),
      ]);

      const castItems: FeedItem[] = (castsRes.data ?? []).map((row) => ({
        id: `fc-${row.id}`,
        text: cleanText(row.cast_text),
        url: row.cast_url || "https://warpcast.com/rizzle",
        source: "farcaster",
        publishedAt: row.published_at,
      }));

      const tweetItems: FeedItem[] = (tweetsRes.data ?? []).map((row) => ({
        id: `tw-${row.id}`,
        text: cleanText(row.tweet_text),
        url: row.tweet_url || "https://x.com/NFTland",
        source: "twitter",
        publishedAt: row.published_at,
      }));

      const merged = [...castItems, ...tweetItems]
        .filter((item) => item.text.length > 12)
        .sort((a, b) => {
          const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, 10);

      setItems(merged);

      // Backfill missing sources without blocking render
      if (forceRefresh || (tweetsRes.data?.length ?? 0) === 0 || (castsRes.data?.length ?? 0) === 0) {
        await Promise.allSettled([
          supabase.functions.invoke("fetch-farcaster-casts"),
          supabase.functions.invoke("fetch-twitter-posts"),
        ]);
      }
    } catch (error) {
      console.error("Activity feed error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeed(false);
  }, []);

  const hasItems = useMemo(() => items.length > 0, [items]);

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Latest Activity</h2>
            </div>
            <button
              onClick={() => fetchFeed(true)}
              disabled={refreshing}
              title="Refresh feed"
              className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border/50 bg-card/30 p-4">
                  <div className="mb-2 h-4 w-2/3 rounded bg-muted/50" />
                  <div className="h-4 w-1/2 rounded bg-muted/50" />
                </div>
              ))}
            </div>
          )}

          {!loading && !hasItems && (
            <div className="rounded-xl border border-border/50 bg-card/30 p-6 text-center">
              <p className="text-sm text-muted-foreground">No posts loaded yet. Tap refresh and I’ll pull Farcaster + X.</p>
            </div>
          )}

          {!loading && hasItems && (
            <div className="space-y-3">
              {items.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 rounded-xl border border-border/50 bg-card/30 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card/60"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.25 }}
                >
                  {item.source === "farcaster" ? (
                    <FarcasterIcon className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Twitter className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-3 text-sm leading-relaxed text-foreground/90">{item.text}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.source === "farcaster" ? "Farcaster" : "X"}</span>
                      {item.publishedAt && (
                        <>
                          <span>·</span>
                          <span>{formatTimeAgo(item.publishedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground" />
                </motion.a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ActivityFeed;
