import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { track } from "@/lib/analytics";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/9B65kF3CTbyH5Eh0XM63K00";

const SiteHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-background/60 border-b border-border/50"
    >
      <a href="/" className="font-display text-lg font-bold text-primary text-glow-sm">
        rizzle
      </a>
      
      <a
        href={STRIPE_PAYMENT_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("consult_cta_clicked", { location: "site_header" })}
        className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 font-mono text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:box-glow animate-[song-pulse_3s_ease-in-out_infinite]"
      >
        <Zap className="h-4 w-4 transition-transform group-hover:scale-110" />
        Hire a Rizzle
      </a>
    </motion.header>
  );
};

export default SiteHeader;
