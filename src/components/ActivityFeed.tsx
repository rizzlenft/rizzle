import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

type FeedTab = "farcaster" | "x";

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
    // Load Twitter widget script
    const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.head.appendChild(script);
    } else {
      // If script already loaded, re-render widgets
      (window as any).twttr?.widgets?.load(containerRef.current);
    }

    // Re-render when script loads
    const interval = setInterval(() => {
      if ((window as any).twttr?.widgets) {
        (window as any).twttr.widgets.load(containerRef.current);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="mx-auto max-w-lg overflow-hidden rounded-xl">
      <a
        className="twitter-timeline"
        data-theme="dark"
        data-chrome="noheader nofooter noborders transparent"
        data-tweet-limit="5"
        data-width="100%"
        href="https://twitter.com/NFTland"
      >
        Loading posts from @NFTland...
      </a>
    </div>
  );
};

const FarcasterEmbed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Warpcast doesn't have a timeline embed widget, so we use individual cast embeds
  // via their embed URL format: https://warpcast.com/~/embed?url=<cast_url>
  // For a profile feed, we'll use an iframe approach
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div ref={containerRef} className="mx-auto max-w-lg overflow-hidden rounded-xl">
      {loaded && (
        <iframe
          src="https://warpcast.com/rizzle"
          title="Rizzle's Farcaster Feed"
          className="w-full border-0 rounded-xl bg-card/30"
          style={{ height: "600px", colorScheme: "dark" }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      )}
    </div>
  );
};

const ActivityFeed = () => {
  const [activeTab, setActiveTab] = useState<FeedTab>("farcaster");

  const tabs: { id: FeedTab; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "farcaster",
      label: "Farcaster",
      icon: <FarcasterIcon className="h-4 w-4" />,
      color: "text-[#8A63D2]",
    },
    {
      id: "x",
      label: "X / Twitter",
      icon: <XIcon className="h-4 w-4" />,
      color: "text-foreground",
    },
  ];

  return (
    <section id="activity-feed" className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
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
              Posts, takes & updates from around the web
            </p>
          </div>

          {/* Tab switcher */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-xl border border-border/60 bg-card/40 p-1 backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? `${tab.color} bg-card shadow-sm border border-border/50`
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feed content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px]"
          >
            {activeTab === "x" ? <TwitterEmbed /> : <FarcasterEmbed />}
          </motion.div>

          {/* Profile links */}
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <a
              href="https://warpcast.com/rizzle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-[#8A63D2]"
            >
              <FarcasterIcon className="h-3.5 w-3.5" />
              @rizzle on Warpcast
            </a>
            <a
              href="https://x.com/NFTland"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <XIcon className="h-3.5 w-3.5" />
              @NFTland on X
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActivityFeed;
