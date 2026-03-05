import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FarcasterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M3.5 3h17v18h-3v-5.25c0-1.5-.5-2.75-2.25-2.75s-2.25 1.25-2.25 2.75V21h-3v-5.25c0-1.5-.5-2.75-2.25-2.75S5.5 14.25 5.5 15.75V21h-2V3zm2 2v7h2V5h-2zm10 0v7h2V5h-2z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface PostData {
  text: string;
  url: string;
  timeAgo: string;
  imageUrl?: string;
}

const cleanText = (raw: string) =>
  raw
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();

const formatTimeAgo = (dateStr: string | null) => {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const PostCard = ({
  post,
  icon,
  label,
  handle,
  handleColor,
  moreUrl,
  moreLabel,
}: {
  post: PostData | null;
  icon: React.ReactNode;
  label: string;
  handle: string;
  handleColor: string;
  moreUrl: string;
  moreLabel: string;
}) => (
  <div className="flex flex-col rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
    <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3">
      {icon}
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className={`text-xs ${handleColor}`}>{handle}</span>
    </div>
    <div className="flex-1 p-5">
      {post ? (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <p className="text-sm leading-relaxed text-foreground/90 line-clamp-5 group-hover:text-foreground transition-colors">
            {post.text}
          </p>
          {post.imageUrl && (
            <div className="mt-3 overflow-hidden rounded-lg border border-border/30">
              <img
                src={post.imageUrl}
                alt=""
                className="w-full object-cover max-h-48 transition-transform group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            {post.timeAgo && <span>{post.timeAgo}</span>}
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      ) : (
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted/40" />
          <div className="h-4 w-1/2 rounded bg-muted/40" />
        </div>
      )}
    </div>
    <div className="border-t border-border/40 px-5 py-3">
      <a
        href={moreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:${handleColor}`}
      >
        {moreLabel}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  </div>
);

const ActivityFeed = () => {
  const [farcasterPost, setFarcasterPost] = useState<PostData | null>(null);
  const [twitterPost, setTwitterPost] = useState<PostData | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Farcaster: get latest from DB
        const { data: casts } = await supabase
          .from("farcaster_casts")
          .select("cast_text, cast_url, published_at")
          .order("published_at", { ascending: false })
          .limit(1);

        if (casts && casts.length > 0) {
          const cleaned = cleanText(casts[0].cast_text);
          if (cleaned.length > 10) {
            setFarcasterPost({
              text: cleaned,
              url: casts[0].cast_url || "https://warpcast.com/rizzle",
              timeAgo: formatTimeAgo(casts[0].published_at),
            });
          }
        }

        // If no Farcaster data, trigger scrape
        if (!casts || casts.length === 0) {
          await supabase.functions.invoke("fetch-farcaster-casts");
          const { data: freshCasts } = await supabase
            .from("farcaster_casts")
            .select("cast_text, cast_url, published_at")
            .order("published_at", { ascending: false })
            .limit(1);
          if (freshCasts && freshCasts.length > 0) {
            const cleaned = cleanText(freshCasts[0].cast_text);
            if (cleaned.length > 10) {
              setFarcasterPost({
                text: cleaned,
                url: freshCasts[0].cast_url || "https://warpcast.com/rizzle",
                timeAgo: formatTimeAgo(freshCasts[0].published_at),
              });
            }
          }
        }

        // Twitter: get latest from DB
        const { data: tweets } = await supabase
          .from("twitter_tweets")
          .select("tweet_text, tweet_url, published_at")
          .order("published_at", { ascending: false })
          .limit(1);

        if (tweets && tweets.length > 0) {
          const cleaned = cleanText(tweets[0].tweet_text);
          if (cleaned.length > 10) {
            setTwitterPost({
              text: cleaned,
              url: tweets[0].tweet_url || "https://x.com/NFTland",
              timeAgo: formatTimeAgo(tweets[0].published_at),
            });
          }
        }

        // If no Twitter data, trigger scrape
        if (!tweets || tweets.length === 0) {
          await supabase.functions.invoke("fetch-twitter-posts");
          const { data: freshTweets } = await supabase
            .from("twitter_tweets")
            .select("tweet_text, tweet_url, published_at")
            .order("published_at", { ascending: false })
            .limit(1);
          if (freshTweets && freshTweets.length > 0) {
            const cleaned = cleanText(freshTweets[0].tweet_text);
            if (cleaned.length > 10) {
              setTwitterPost({
                text: cleaned,
                url: freshTweets[0].tweet_url || "https://x.com/NFTland",
                timeAgo: formatTimeAgo(freshTweets[0].published_at),
              });
            }
          }
        }

        // Fallback if twitter still empty
        if (!tweets || tweets.length === 0) {
          setTwitterPost({
            text: "Follow @NFTland on X for the latest web3 takes, community updates, and project launches.",
            url: "https://x.com/NFTland",
            timeAgo: "",
          });
        }
      } catch (err) {
        console.error("Failed to load activity posts:", err);
        // Set fallbacks
        if (!farcasterPost) {
          setFarcasterPost({
            text: "Follow @rizzle on Farcaster for the latest casts.",
            url: "https://warpcast.com/rizzle",
            timeAgo: "",
          });
        }
        if (!twitterPost) {
          setTwitterPost({
            text: "Follow @NFTland on X for the latest web3 takes.",
            url: "https://x.com/NFTland",
            timeAgo: "",
          });
        }
      }
    };

    loadPosts();
  }, []);

  return (
    <section id="activity-feed" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Latest Activity
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Most recent posts from across the web
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PostCard
              post={farcasterPost}
              icon={<FarcasterIcon className="h-4 w-4 text-[#8A63D2]" />}
              label="Farcaster"
              handle="@rizzle"
              handleColor="text-[#8A63D2]"
              moreUrl="https://warpcast.com/rizzle"
              moreLabel="See more on Warpcast"
            />
            <PostCard
              post={twitterPost}
              icon={<XIcon className="h-4 w-4 text-foreground" />}
              label="X"
              handle="@NFTland"
              handleColor="text-foreground"
              moreUrl="https://x.com/NFTland"
              moreLabel="See more on X"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActivityFeed;
