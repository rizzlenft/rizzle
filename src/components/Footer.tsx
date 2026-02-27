import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl text-center"
      >
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-2xl">🐸</span>
          <span className="font-display text-xl font-bold text-foreground">RIZZLE</span>
          <span className="text-2xl">🏴‍☠️</span>
        </div>
        
        <p className="mb-6 text-sm text-muted-foreground">
          web3 founder since 2019 • building the metaverse • calling out grifters
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
