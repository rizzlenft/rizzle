import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MessageCircle } from "lucide-react";

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

const TwitterEmbed = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.head.appendChild(script);
    } else {
      (window as any).twttr?.widgets?.load(containerRef.current);
    }

    const interval = setInterval(() => {
      if ((window as any).twttr?.widgets) {
        (window as any).twttr.widgets.load(containerRef.current);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-xl">
      <a
        className="twitter-timeline"
        data-theme="dark"
        data-chrome="noheader nofooter noborders transparent"
        data-tweet-limit="1"
        data-width="100%"
        href="https://twitter.com/NFTland"
      >
        Loading latest post…
      </a>
    </div>
  );
};

const FarcasterEmbed = () => (
  <div className="overflow-hidden rounded-xl">
    <iframe
      src="https://warpcast.com/rizzle"
      title="Rizzle's latest cast"
      className="w-full border-0 rounded-xl bg-card/30"
      style={{ height: "320px", colorScheme: "dark" }}
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
  </div>
);

const ActivityFeed = () => {
  return (
    <section id="activity-feed" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Section header */}
          <div className="mb-8 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-mono text-primary">
              <MessageCircle className="h-3 w-3" />
              LIVE FEED
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Latest Activity
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Most recent posts from across the web
            </p>
          </div>

          {/* Side-by-side feeds */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Farcaster */}
            <div className="flex flex-col rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3">
                <FarcasterIcon className="h-4 w-4 text-[#8A63D2]" />
                <span className="text-sm font-medium text-foreground">Farcaster</span>
                <span className="text-xs text-muted-foreground">@rizzle</span>
              </div>
              <div className="flex-1 min-h-[280px]">
                <FarcasterEmbed />
              </div>
              <div className="border-t border-border/40 px-5 py-3">
                <a
                  href="https://warpcast.com/rizzle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#8A63D2]"
                >
                  See more on Warpcast
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* X / Twitter */}
            <div className="flex flex-col rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3">
                <XIcon className="h-4 w-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">X</span>
                <span className="text-xs text-muted-foreground">@NFTland</span>
              </div>
              <div className="flex-1 min-h-[280px]">
                <TwitterEmbed />
              </div>
              <div className="border-t border-border/40 px-5 py-3">
                <a
                  href="https://x.com/NFTland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  See more on X
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActivityFeed;
