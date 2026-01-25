import { motion } from "framer-motion";
import { Twitter, MessageCircle, Link2 } from "lucide-react";
import SocialLink from "./SocialLink";

const Socials = () => {
  return (
    <section className="relative px-6 py-24">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Connect
          </h2>
          <p className="text-muted-foreground">
            Find me across the decentralized web
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <SocialLink
            href="https://twitter.com/NFTland"
            icon={Twitter}
            label="Twitter"
            handle="@NFTland"
          />
          <SocialLink
            href="https://warpcast.com/rizzle"
            icon={MessageCircle}
            label="Farcaster"
            handle="@rizzle"
          />
          <SocialLink
            href="https://linktr.ee/rizzlethings"
            icon={Link2}
            label="Linktree"
            handle="All Links"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Socials;
