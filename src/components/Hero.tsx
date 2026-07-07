import { motion } from "framer-motion";
import { useState } from "react";
import { Music, Play, X } from "lucide-react";
import rizzleSig from "@/assets/rizzle-sig-v2.png";
import rizzlePfp from "@/assets/rizzlepfp.webp";
import { Button } from "@/components/ui/button";
import { START_HERE_PATH, STRIPE_CONSULT_LINK } from "@/lib/site-links";
import { track } from "@/lib/analytics";

const Hero = () => {
  const [showPlayer, setShowPlayer] = useState(false);



  return (
    <section className="relative section-y flex flex-col items-center justify-center">
      {/* Prominent PFP hero background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] sm:h-[72vh] overflow-hidden">
        <img
          src={rizzlePfp}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover object-top sm:object-center opacity-35"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* Background grid pattern */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="page-container relative z-10 w-full max-w-4xl"
      >
        {/* Spacer for signature overlap */}
        <div className="-mb-4 sm:-mb-12" />
        
        {/* Signature — wrapped as H1 for SEO without disturbing visual layout */}
        <motion.h1
          className="-mb-2 sm:-mb-14 pointer-events-none m-0 select-none text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
        >
          <span className="sr-only">Rizzle — Web3 & AI Strategist</span>
          <img
            src={rizzleSig}
            alt=""
            aria-hidden="true"
            className="mx-auto h-[10rem] w-auto sm:h-[17rem] md:h-[22rem] lg:h-[26rem] invert"
            width={1200}
            height={400}
            style={{
              imageRendering: 'auto',
              WebkitFontSmoothing: 'antialiased'
            }}
            loading="eager"
            decoding="async"
          />
        </motion.h1>
        
        {/* Positioning */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mx-auto max-w-3xl text-center text-[clamp(1.8rem,4vw,2.6rem)] font-display font-bold leading-tight text-primary"
        >
          Web3 & AI Strategist
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.23, duration: 0.42 }}
          className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Launching progressive companies and projects utilizing the most cutting-edge tech
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.42 }}
          className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm"
        >
          <span className="rounded-full border border-border/45 bg-background/30 px-3 py-1">10+ launches</span>
          <span className="rounded-full border border-border/45 bg-background/30 px-3 py-1">19K audience</span>
          <span className="rounded-full border border-border/45 bg-background/30 px-3 py-1">8+ years</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.42 }}
          className="mt-4 flex flex-col items-center justify-center gap-2"
        >
          <Button
            asChild
            variant="cta-primary"
            size="pill"
            className="min-w-[260px] px-7"
          >
            <a
              href={START_HERE_PATH}
              onClick={() => track("opportunity_cta_clicked", { location: "hero" })}
            >
              Start Here
            </a>
          </Button>
          <a
            href={STRIPE_CONSULT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("consult_cta_clicked", { location: "hero_primary" })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary sm:text-sm"
          >
            <span className="text-primary">◎</span>
            Or book a strategy sprint call
          </a>
        </motion.div>

        {/* Song A Day Mann feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.42 }}
          className="mt-3"
        >
          {!showPlayer ? (
            <button
              onClick={() => setShowPlayer(true)}
              className="group mx-auto flex items-center gap-2.5 rounded-full border border-border/60 bg-card/35 px-4 py-2 text-xs transition-all duration-300 hover:border-primary/40 hover:bg-primary/8"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 transition-colors group-hover:bg-primary/25">
                <Play className="ml-0.5 h-3 w-3 fill-primary text-primary" />
              </span>
              <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                <span className="text-primary">@songadaymann</span> The Legend of Rizzle
              </span>
              <Music className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-primary" />
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-md overflow-hidden rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm box-glow-sm"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                <span className="font-mono text-xs text-muted-foreground">
                  🎵 Song by <a href="https://x.com/songadaymann" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@songadaymann</a>
                </span>
                <button
                  onClick={() => setShowPlayer(false)}
                  className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/Ww7U1H3Ekhg?autoplay=1"
                  title="Song A Day Mann - Rizzle"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <div className="pointer-events-none relative z-10 mt-6 h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background/70" />
    </section>
  );
};

export default Hero;
