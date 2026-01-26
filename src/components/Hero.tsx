import { motion } from "framer-motion";
import rizzleSig from "@/assets/rizzlesig.png";

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
        
        {/* Signature - draws in quickly */}
        <motion.div
          className="mb-8 overflow-visible"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img 
            src={rizzleSig} 
            alt="Rizzle" 
            className="h-32 w-auto sm:h-40 md:h-52"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              filter: [
                "drop-shadow(0 0 10px rgba(0,255,136,0.3))",
                "drop-shadow(0 0 25px rgba(0,255,136,0.5)) drop-shadow(0 0 50px rgba(0,255,136,0.25))",
              ]
            }}
            transition={{
              opacity: { delay: 0.3, duration: 0.3 },
              filter: { delay: 0.9, duration: 0.5 }
            }}
          />
        </motion.div>
        
        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          <span className="text-primary font-semibold">Web3 Founder & Strategist</span> — Building the metaverse, one project at a time. 
          Expert in community growth, NFT launches, and virtual world development. 
          Available for <span className="text-primary">consulting & advisory</span> roles.
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
