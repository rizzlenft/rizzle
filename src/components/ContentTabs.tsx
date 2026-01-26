import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Sparkles } from "lucide-react";
import Projects from "./Projects";
import CryptoArt from "./CryptoArt";

const ContentTabs = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "art">("projects");

  return (
    <div className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header with inline toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          {/* Inline toggle */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/30 p-1.5 backdrop-blur-sm mb-6">
            <button
              onClick={() => setActiveTab("projects")}
              className={`relative flex items-center gap-2 px-5 py-2 text-sm font-medium transition-colors rounded-full ${
                activeTab === "projects"
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "projects" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Briefcase className="relative z-10 h-4 w-4" />
              <span className="relative z-10">Projects</span>
            </button>
            <button
              onClick={() => setActiveTab("art")}
              className={`relative flex items-center gap-2 px-5 py-2 text-sm font-medium transition-colors rounded-full ${
                activeTab === "art"
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "art" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Sparkles className="relative z-10 h-4 w-4" />
              <span className="relative z-10">CryptoArt</span>
            </button>
          </div>

          {/* Dynamic title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
                {activeTab === "projects" ? "Projects" : "CryptoArt"}
              </h2>
              <p className="mx-auto max-w-lg text-muted-foreground">
                {activeTab === "projects" 
                  ? "Building across the metaverse, one weird idea at a time"
                  : "Early AI experiments and a curated collection of digital art"
                }
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Tab content - rendered without section wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "projects" ? <ProjectsContent /> : <CryptoArtContent />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Inline Projects content (without section wrapper and header)
import ProjectCard from "./ProjectCard";
import wipMeetupImg from "@/assets/wip-logo.gif";
import marsPodcastImg from "@/assets/mattandrizz.jpeg";
import avastarsImg from "@/assets/avastars.avif";
import onchainchainImg from "@/assets/onchainchain.png";
import flyfrog3dImg from "@/assets/flyfrog.jpg";
import tokensmartImg from "@/assets/tokensmart.png";
import metalympicsImg from "@/assets/metalympics-new.jpeg";
import rizzlefestImg from "@/assets/rizzlefest.gif";
import babacciImg from "@/assets/babacci-new.jpeg";

const projects = [
  {
    name: "The WIP Meetup",
    description: "Every Thursday at 3pm ET — community gatherings exploring web3, metaverse, and digital culture. Free gifts, WIPcoin, and controlled chaos.",
    emoji: "🎙️",
    link: "https://twitter.com/theWIPmeetup",
    secondaryLink: "https://discord.gg/PmDbSQ4Uwp",
    secondaryLinkLabel: "Discord",
    featured: true,
    image: wipMeetupImg,
  },
  {
    name: "Babacci",
    description: "BABACCIO is a generative unique 3D collectible NFT. Download the model as a .glb file by opening it in a new window and pressing S, use it across the metaverse. Fully onchain.",
    emoji: "🎨",
    link: "https://opensea.io/collection/babacci",
    image: babacciImg,
  },
  {
    name: "OnChainChain",
    description: "Whimsical high-end metaverse fashion pushing web3 interoperability. Wearable chains across multiple NFTs & platforms.",
    emoji: "⛓️",
    link: "https://www.artblocks.io/collection/onchainchain-by-rizzle-sebi-miguelgarest",
    image: onchainchainImg,
  },
  {
    name: "Rizzlefest",
    description: "A legendary, recurrent web3 camping retreat bringing the community together IRL for adventure, connection, and unforgettable vibes in the great outdoors.",
    emoji: "🏕️",
    link: "https://twitter.com/hashtag/rizzlefest",
    image: rizzlefestImg,
  },
  {
    name: "The Matthew & Rizzle Show",
    description: "One of web3's earliest podcasts (2019-2026). Iconic guests, real talk, and five years of cutting through the noise. Now concluded.",
    emoji: "🎧",
    link: "https://www.youtube.com/playlist?list=PLaEMvzi1A8c9xU0pw1CZJOTAsrwfydGNK",
    image: marsPodcastImg,
  },
  {
    name: "Fly Frogs",
    description: "Joined forces with Josh & Molly's 2021 NFT project post-launch. Sold through 10k NFTs and built the foundation of the Fly Frogs brand.",
    emoji: "🐸",
    link: "https://flyfrogs.xyz/",
    secondaryLink: "https://opensea.io/collection/fly-frogs",
    image: flyfrog3dImg,
  },
  {
    name: "TokenSmart",
    description: "One of the largest early web3 communities (2019-2021). Led a full program of daily/weekly events featuring builders and creators, growing to over 20,000 Discord members.",
    emoji: "🧠",
    link: "https://twitter.com/nftsmart",
    image: tokensmartImg,
  },
  {
    name: "Metalympics",
    description: "In 2020, the Metalympics was a 3-month metaverse event attracting 20+ web3 sponsors, hundreds of competitors, and became one of the largest cutting-edge web3 events to date.",
    emoji: "🏆",
    link: "https://twitter.com/metalympics",
    image: metalympicsImg,
  },
  {
    name: "Avastars",
    description: "Pioneering generative avatar NFT project. Onchain art that actually meant something.",
    emoji: "👾",
    link: "https://opensea.io/collection/avastar",
    image: avastarsImg,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ProjectsContent = () => {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <motion.div
            key={project.name}
            variants={itemVariants}
            className={project.featured ? "sm:col-span-2 lg:col-span-2" : ""}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Inline CryptoArt content (without section wrapper and header)
import { ExternalLink, Palette, Heart } from "lucide-react";
import truthMagazineImg from "@/assets/truth-magazine.png";

const createdCollections = [
  {
    name: "Manifold Collection",
    description: "AI-generated experiments featuring frogs, avocados, and surreal creatures.",
    link: "https://studio.manifold.xyz/contracts/1027361008",
  },
  {
    name: "ZeroOne Gallery",
    description: "Curated digital art exploring AI and imagination.",
    link: "https://zeroone.art/profile/rizzle",
  },
];

const collectedCollections = [
  {
    name: "OpenSea (Rizzle)",
    description: "Primary collection of curated cryptoart pieces.",
    link: "https://opensea.io/Rizzle",
  },
  {
    name: "OpenSea (Vault)",
    description: "Extended vault of collected digital art.",
    link: "https://opensea.io/Rizzlevault",
  },
  {
    name: "Objkt (Tezos)",
    description: "Tezos-based art collection on Objkt.",
    link: "https://objkt.com/@rizzle/owned",
  },
];

const CryptoArtContent = () => {
  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* Featured image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <img
            src={truthMagazineImg}
            alt="Featured on Living 202 Magazine cover"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
              Featured on Living 202 Magazine Cover
            </span>
          </div>
        </div>
      </motion.div>

      {/* Created section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 mb-6">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-display text-xl font-semibold text-foreground">Created</h3>
          <span className="text-sm text-muted-foreground">— 100s of editions collected</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {createdCollections.map((collection) => (
            <a
              key={collection.name}
              href={collection.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="mb-1 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {collection.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {collection.description}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Collected section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-5 w-5 text-primary" />
          <h3 className="font-display text-xl font-semibold text-foreground">Collected</h3>
          <span className="text-sm text-muted-foreground">— art enthusiast & collector</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {collectedCollections.map((collection) => (
            <a
              key={collection.name}
              href={collection.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="mb-1 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {collection.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {collection.description}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContentTabs;
