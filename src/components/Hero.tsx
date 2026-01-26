import { motion } from "framer-motion";
import rizzleSig from "@/assets/rizzle-sig-v2.png";

const Hero = () => {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-20">
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
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-sm text-primary"
        >
          <span className="text-lg">🏴‍☠️</span>
          <span>web3 founder since 2019</span>
          <span className="text-lg">🐸</span>
        </motion.div>
        
        {/* Signature */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <img 
            src={rizzleSig} 
            alt="Rizzle" 
            className="mx-auto h-[10rem] w-auto sm:h-[14rem] md:h-[18rem] lg:h-[22rem] invert"
            style={{ 
              imageRendering: 'auto',
              WebkitFontSmoothing: 'antialiased'
            }}
            loading="eager"
            decoding="sync"
          />
        </motion.div>
        
        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          <span className="text-primary font-semibold">Web3 Founder & Builder</span> — Been in the game since before the hype. 
          Community strategy, NFT launches, metaverse builds — if it's onchain, I've probably shipped it. 
          Open to <span className="text-primary">consulting & advisory</span> if you're building something real.
        </motion.p>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-8"
        >
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-primary text-glow-sm">8+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-primary text-glow-sm">19K</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-primary text-glow-sm">6+</div>
            <div className="text-sm text-muted-foreground">Years in Web3</div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">scroll</span>
          <div className="h-6 w-px bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
