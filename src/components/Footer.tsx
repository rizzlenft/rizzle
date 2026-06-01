import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { START_HERE_PATH, STRIPE_CONSULT_LINK, TRINITY_LABS_URL } from "@/lib/site-links";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10" aria-label="Site footer">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="page-container"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="text-2xl" aria-hidden="true">🐸</span>
          <span className="font-display text-xl font-bold text-foreground">RIZZLE</span>
          <span className="text-2xl" aria-hidden="true">🏴‍☠️</span>
        </div>

        {/* Internal nav — improves crawlability and gives users a tail-of-page hub */}
        <nav
          aria-label="Footer navigation"
          className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
        >
          <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
            Projects
          </Link>
          <Link to="/?tab=art" className="text-muted-foreground transition-colors hover:text-primary">
            CryptoArt
          </Link>
          <Link to="/guests" className="text-muted-foreground transition-colors hover:text-primary">
            Network
          </Link>
          <Link to="/games" className="text-muted-foreground transition-colors hover:text-primary">
            Arcade
          </Link>
          <Link to={START_HERE_PATH} className="text-muted-foreground transition-colors hover:text-primary">
            Start Here
          </Link>
          <a
            href={TRINITY_LABS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Trinity Labs
          </a>
          <a
            href={STRIPE_CONSULT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Strategy Sprint
          </a>
        </nav>

        <p className="mb-2 text-center text-sm text-muted-foreground">
          Crypto ecosystem operator since 2019 — building onchain products, communities, and culture.
        </p>
        <p className="text-center text-xs text-muted-foreground/70">
          © {year} Rizzle. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
