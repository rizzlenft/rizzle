import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ExternalLink, RefreshCw, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FeedItem {
  id: string;
  text: string;
  url: string;
  source: "farcaster" | "twitter";
  published_at: string | null;
}

const FarcasterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M3.5 3h17v18h-3v-5.25c0-1.5-.5-2.75-2.25-2.75s-2.25 1.25-2.25 2.75V21h-3v-5.25c0-1.5-.5-2.75-2.25-2.75S5.5 14.25 5.5 15.75V21h-2V3zm2 2v7h2V5h-2zm10 0v7h2V5h-2z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/** Strip markdown link syntax, leaving just the display text */
function cleanMarkdownText(text: string): string {
  // Convert [text](url) to just text, but skip if text looks like a URL
  let cleaned = text.replace(/\[([^\]]+)\]\([^)]+\)/g, (_, label) => {
    // If the label itself is a URL, skip it entirely
    if (/^https?:\/\//.test(label) || /^www\./.test(label)) return "";
    return label;
  });
  // Remove standalone URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s)]+/g, "");
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
  return cleaned;
}

const ActivityFeed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);

      // Fetch both sources in parallel
      const [castsRes, tweetsRes] = await Promise.all([
        supabase
          .from("farcaster_casts")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(6),
        supabase
          .from("twitter_tweets")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(6),
      ]);

      const feedItems: FeedItem[] = [];

      if (castsRes.data) {
        for (const c of castsRes.data) {
          feedItems.push({
            id: c.id,
            text: cleanMarkdownText(c.cast_text),
            url: c.cast_url || "https://warpcast.com/rizzle",
            source: "farcaster",
            published_at: c.published_at,
          });
        }
      }

      if (tweetsRes.data) {
        for (const t of tweetsRes.data) {
          feedItems.push({
            id: t.id,
            text: cleanMarkdownText(t.tweet_text),
            url: t.tweet_url || "https://x.com/NFTland",
            source: "twitter",
            published_at: t.published_at,
          });
        }
      }

      // Sort by date, interleave sources
      feedItems.sort((a, b) => {
        const da = a.published_at ? new Date(a.published_at).getTime() : 0;
        const db = b.published_at ? new Date(b.published_at).getTime() : 0;
        return db - da;
      });

      // Filter out empty cleaned texts
      const validItems = feedItems.filter((i) => i.text.length > 10);
      setItems(validItems.slice(0, 10));

      // Trigger background refresh if needed
      if (forceRefresh || validItems.length === 0) {
        await Promise.allSettled([
          supabase.functions.invoke("fetch-farcaster-casts"),
          supabase.functions.invoke("fetch-twitter-posts"),
        ]);

        // Re-fetch from DB
        const [freshCasts, freshTweets] = await Promise.all([
          supabase.from("farcaster_casts").select("*").order("published_at", { ascending: false }).limit(6),
          supabase.from("twitter_tweets").select("*").order("published_at", { ascending: false }).limit(6),
        ]);

        const fresh: FeedItem[] = [];
        if (freshCasts.data) {
          for (const c of freshCasts.data) {
            fresh.push({ id: c.id, text: cleanMarkdownText(c.cast_text), url: c.cast_url || "https://warpcast.com/rizzle", source: "farcaster", published_at: c.published_at });
          }
        }
        if (freshTweets.data) {
          for (const t of freshTweets.data) {
            fresh.push({ id: t.id, text: cleanMarkdownText(t.tweet_text), url: t.tweet_url || "https://x.com/NFTland", source: "twitter", published_at: t.published_at });
          }
        }
        fresh.sort((a, b) => {
          const da = a.published_at ? new Date(a.published_at).getTime() : 0;
          const db = b.published_at ? new Date(b.published_at).getTime() : 0;
          return db - da;
        });
        const validFresh = fresh.filter((i) => i.text.length > 10);
        if (validFresh.length > 0) setItems(validFresh.slice(0, 10));
      }
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const formatTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Latest Activity</h2>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-card/30 p-4 animate-pulse">
                <div className="h-4 bg-muted/50 rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted/50 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Latest Activity</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <a href="https://warpcast.com/rizzle" target="_blank" rel="noopener noreferrer" className="hover:text-[#8A63D2] transition-colors flex items-center gap-1">
                  <FarcasterIcon className="h-3.5 w-3.5" /> Farcaster
                </a>
                <span>·</span>
                <a href="https://x.com/NFTland" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <XIcon className="h-3.5 w-3.5" /> X
                </a>
              </div>
            </div>
            <button
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
              title="Refresh feed"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Feed list */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 rounded-xl border border-border/50 bg-card/30 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card/60"
                >
                  {item.source === "farcaster" ? (
                    <FarcasterIcon className="h-4 w-4 mt-1 shrink-0 text-[#8A63D2] opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <XIcon className="h-4 w-4 mt-1 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3">
                      {item.text}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{item.source === "twitter" ? "X" : "Farcaster"}</span>
                      {item.published_at && (
                        <>
                          <span>·</span>
                          <span>{formatTimeAgo(item.published_at)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-1 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                </a>
              </motion.div>
            ))}
          </div>

          {/* View more links */}
          <div className="mt-4 flex justify-center gap-6">
            <a
              href="https://warpcast.com/rizzle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#8A63D2] transition-colors"
            >
              <FarcasterIcon className="h-3.5 w-3.5" /> Warpcast
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://x.com/NFTland"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon className="h-3.5 w-3.5" /> X / Twitter
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActivityFeed;
