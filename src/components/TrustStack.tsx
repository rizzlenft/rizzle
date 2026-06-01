import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import wipLogo from "@/assets/wip-logo.webp";
import avastarsImg from "@/assets/avastars.avif";
import onchainchainImg from "@/assets/onchainchain.webp";
import miniappsImg from "@/assets/rizzle-miniapps.webp";

const trustItems = [
  {
    title: "The WIP Meetup",
    led: "Founded and operated a recurring web3 community program since 2019.",
    changed: "Sustained weekly programming, guests, and ecosystem activations over multiple cycles.",
    linkLabel: "Visit The WIP Meetup",
    linkHref: "https://thewipmeetup.com/",
    image: wipLogo,
    imagePosition: "center",
  },
  {
    title: "nft42 + Avastars",
    led: "Co-founded NFT studio initiatives and helped lead flagship collection launches.",
    changed: "Scaled an early fully onchain PFP ecosystem with 4,000+ ETH in secondary volume.",
    linkLabel: "View Avastars Collection",
    linkHref: "https://opensea.io/collection/avastar",
    image: avastarsImg,
    imagePosition: "center",
  },
  {
    title: "OnChainChain",
    led: "Co-led a generative launch with a multi-creator team on Ethereum.",
    changed: "Delivered a 2,000-edition Art Blocks release with onchain metadata and collector traction.",
    linkLabel: "View Art Blocks Listing",
    linkHref: "https://www.artblocks.io/collection/onchainchain-by-rizzle-sebi-miguelgarest",
    image: onchainchainImg,
    imagePosition: "center 35%",
  },
  {
    title: "Shipping in Public",
    led: "Continue shipping products, integrations, and growth experiments in public.",
    changed: "Turn strategy into shipped artifacts across site, miniapps, and game/leaderboard workflows.",
    linkLabel: "View GitHub Activity",
    linkHref: "https://github.com/rizzlenft",
    image: miniappsImg,
    imagePosition: "center 35%",
  },
];

const TrustStack = () => {
  return (
    <section className="relative z-20 -mt-3 px-6 pb-12 pt-7 sm:-mt-4 sm:pb-14 sm:pt-8" aria-label="Selected highlights">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-7 text-center"
        >
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Selected Highlights
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            A quick visual tour of projects, results, and direct links.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {trustItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.14)]"
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
