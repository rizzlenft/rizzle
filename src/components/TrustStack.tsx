import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import wipLogo from "@/assets/wip-logo.webp";
import avastarsImg from "@/assets/avastars.avif";
import onchainchainImg from "@/assets/onchainchain.webp";
import miniappsImg from "@/assets/rizzle-miniapps.webp";

const trustItems = [
  {
    title: "The WIP Meetup",
    led: "I founded and still run this recurring web3 community program (since 2019).",
    changed: "Kept a consistent weekly cadence of guests, programming, and ecosystem activations across multiple cycles.",
    linkLabel: "Visit The WIP Meetup",
    linkHref: "https://thewipmeetup.com/",
    image: wipLogo,
    imagePosition: "center",
  },
  {
    title: "nft42 + Avastars",
    led: "Co-founded nft42, an NFT studio focused on fully onchain metadata, with Avastars as an early flagship.",
    changed: "Helped grow the studio into high-profile launches, while Avastars reached 4,000+ ETH in secondary volume.",
    linkLabel: "View Avastars Collection",
    linkHref: "https://opensea.io/collection/avastar",
    image: avastarsImg,
    imagePosition: "center",
  },
  {
    title: "OnChainChain",
    led: "Co-led a generative Ethereum launch with a multi-creator team.",
    changed: "Shipped a 2,000-edition Art Blocks release with onchain metadata and strong collector follow-through.",
    linkLabel: "View Art Blocks Listing",
    linkHref: "https://www.artblocks.io/collection/onchainchain-by-rizzle-sebi-miguelgarest",
    image: onchainchainImg,
    imagePosition: "center 35%",
  },
  {
    title: "Shipping in Public",
    led: "I keep shipping products, integrations, and growth experiments in public.",
    changed: "Turned strategy into shipped work across this site, miniapps, and game leaderboard systems.",
    linkLabel: "View GitLab Activity",
    linkHref: "https://gitlab.com/rizzlenft",
    image: miniappsImg,
    imagePosition: "center 35%",
  },
];

const TrustStack = () => {
  return (
    <section className="relative z-20 -mt-3 pb-12 pt-7 sm:-mt-4 sm:pb-14 sm:pt-8" aria-label="Selected highlights">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45 }}
          className="mb-6 text-center sm:mb-7"
        >
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Selected Highlights
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            A quick tour of work, outcomes, and links.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {trustItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.38, delay: index * 0.05 }}
              className="surface-glass-strong group relative overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.14)]"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: item.imagePosition }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display text-xl font-semibold text-foreground drop-shadow">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="relative p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">My role: </span>
                  {item.led}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Result: </span>
                  {item.changed}
                </p>
                <a
                  href={item.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {item.linkLabel}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStack;
