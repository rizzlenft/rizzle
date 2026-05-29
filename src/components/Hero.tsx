import { motion } from "framer-motion";
import { useState } from "react";
import { Music, Play, X } from "lucide-react";
import rizzleSig from "@/assets/rizzle-sig-v2.png";
import rizzlePfp from "@/assets/rizzlepfp.webp";
import { STRIPE_CONSULT_LINK } from "@/lib/site-links";
import { track } from "@/lib/analytics";

const Hero = () => {
  const [showPlayer, setShowPlayer] = useState(false);



  return (
    <section className="relative flex flex-col items-center justify-center px-6 py-8">
      {/* Prominent PFP hero background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] sm:h-[72vh] overflow-hidden">
        <img
          src={rizzlePfp}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover object-top sm:object-center opacity-35"
          loading="eager"
          decoding="async"
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
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl text-center"
      >
        {/* Spacer for removed tagline */}
        <div className="-mb-8 sm:-mb-24" />
        
        {/* Signature — wrapped as H1 for SEO without disturbing visual layout */}
        <motion.h1
          className="-mb-4 sm:-mb-28 pointer-events-none select-none m-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <span className="sr-only">Rizzle — Web3 Founder & Builder Since 2019</span>
          <img
            src={rizzleSig}
            alt=""
            aria-hidden="true"
            className="mx-auto h-[12rem] w-auto sm:h-[26rem] md:h-[34rem] lg:h-[42rem] invert"
            style={{
              imageRendering: 'auto',
              WebkitFontSmoothing: 'antialiased'
            }}
            loading="eager"
            decoding="sync"
          />
        </motion.h1>
        
        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          <span className="text-primary font-semibold">Web3 Founder & Builder</span> — Been in the game since before the hype. 
          Community strategy, product launches, growth — if it's onchain, I've probably shipped it. 
          My biggest edge is getting projects from zero to traction.
        </motion.p>
        
        {/* Stats row — 3 stats on mobile (consult promoted to its own CTA below) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-6 grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-8"
        >
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-primary text-glow-sm">10+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-border" />
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-primary text-glow-sm">19K</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-border" />
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-primary text-glow-sm">8+</div>
            <div className="text-sm text-muted-foreground">Years in Web3</div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-border" />
          <a
            href={STRIPE_CONSULT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("consult_cta_clicked", { location: "hero_stats" })}
            className="hidden sm:block group text-center transition-all duration-300 hover:scale-105"
          >
            <div className="font-display text-3xl font-bold text-primary text-glow-sm">◎</div>
            <div className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Book a Consult</div>
          </a>
        </motion.div>

        {/* Mobile-only Book a Consult CTA — full width, clear it's an action */}
        <motion.a
          href={STRIPE_CONSULT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("consult_cta_clicked", { location: "hero_mobile" })}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mt-5 sm:hidden mx-auto inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 font-mono text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          <span className="text-base leading-none">◎</span>
          Book a Consult
        </motion.a>

        {/* Song A Day Mann feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8"
        >
          {!showPlayer ? (
            <button
              onClick={() => setShowPlayer(true)}
              className="group mx-auto flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:box-glow-sm animate-[song-pulse_3s_ease-in-out_infinite]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 transition-colors group-hover:bg-primary/30">
                <Play className="h-3.5 w-3.5 fill-primary text-primary ml-0.5" />
              </span>
              <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="text-primary">@songadaymann</span> The Legend of Rizzle
              </span>
              <Music className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
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
    </section>
  );
};

export default Hero;
