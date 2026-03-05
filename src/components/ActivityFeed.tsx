import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ExternalLink, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Cast {
  id: string;
  cast_text: string;
  cast_url: string | null;
  author_username: string;
  published_at: string | null;
  scraped_at: string;
}

const FarcasterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M3.5 3h17v18h-3v-5.25c0-1.5-.5-2.75-2.25-2.75s-2.25 1.25-2.25 2.75V21h-3v-5.25c0-1.5-.5-2.75-2.25-2.75S5.5 14.25 5.5 15.75V21h-2V3zm2 2v7h2V5h-2zm10 0v7h2V5h-2z" />
  </svg>
);

const ActivityFeed = () => {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCasts = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);

      // First try cached data from DB
      const { data: cachedCasts } = await supabase
        .from("farcaster_casts")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(8);

      if (cachedCasts && cachedCasts.length > 0 && !forceRefresh) {
        setCasts(cachedCasts);
        setLoading(false);
        return;
      }

      // Trigger edge function to scrape fresh data
      const { data, error } = await supabase.functions.invoke("fetch-farcaster-casts");
      
      if (error) {
        console.error("Edge function error:", error);
        // Still use cached if available
        if (cachedCasts && cachedCasts.length > 0) {
          setCasts(cachedCasts);
        }
      } else if (data?.casts) {
        setCasts(data.casts);
      }
    } catch (err) {
      console.error("Failed to fetch casts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCasts();
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
            <FarcasterIcon className="h-5 w-5 text-[#8A63D2]" />
            <h2 className="font-display text-2xl font-bold text-foreground">Latest Casts</h2>
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

  if (casts.length === 0) return null;

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
              <FarcasterIcon className="h-5 w-5 text-[#8A63D2]" />
              <h2 className="font-display text-2xl font-bold text-foreground">Latest Casts</h2>
              <a
                href="https://warpcast.com/rizzle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-[#8A63D2] transition-colors"
              >
                @rizzle
              </a>
            </div>
            <button
              onClick={() => fetchCasts(true)}
              disabled={refreshing}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
              title="Refresh casts"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Cast list */}
          <div className="space-y-3">
            {casts.map((cast, index) => (
              <motion.div
                key={cast.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <a
                  href={cast.cast_url || "https://warpcast.com/rizzle"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 rounded-xl border border-border/50 bg-card/30 p-4 transition-all duration-300 hover:border-[#8A63D2]/30 hover:bg-card/60"
                >
                  <MessageCircle className="h-4 w-4 mt-1 shrink-0 text-muted-foreground group-hover:text-[#8A63D2] transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3">
                      {cast.cast_text}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      {cast.published_at && (
                        <span>{formatTimeAgo(cast.published_at)}</span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-1 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                </a>
              </motion.div>
            ))}
          </div>

          {/* View more link */}
          <div className="mt-4 text-center">
            <a
              href="https://warpcast.com/rizzle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#8A63D2] transition-colors"
            >
              View all on Warpcast
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActivityFeed;
