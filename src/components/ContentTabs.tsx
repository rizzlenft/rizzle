import { motion, AnimatePresence } from "framer-motion";

interface ContentTabsProps {
  activeTab: "projects" | "art";
  setActiveTab: (tab: "projects" | "art") => void;
}

const ContentTabs = ({ activeTab }: ContentTabsProps) => {
  return (
    <section className="relative section-y" aria-label={activeTab === "projects" ? "Projects" : "CryptoArt"}>
      <div className="page-container">
        {/* Dynamic title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center sm:mb-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <h2 className="mb-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
                {activeTab === "projects" ? "Projects" : "CryptoArt"}
              </h2>
              <p className="mx-auto max-w-lg text-muted-foreground">
                {activeTab === "projects" 
                  ? "A focused look at launches, communities, and products I've helped build."
                  : "Early AI experiments plus a curated digital art collection"
                }
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          {activeTab === "projects" ? <ProjectsContent /> : <CryptoArtContent />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

// Inline Projects content (without section wrapper and header)
import ProjectCard from "./ProjectCard";
import {
  GITHUB_WIP_ARCHIVE_HUB_URL,
  START_HERE_PATH,
  TRINITY_LABS_URL,
} from "@/lib/site-links";
import wipMeetupImg from "@/assets/wip-logo.webp";
import marsPodcastImg from "@/assets/mattandrizz.webp";
import avastarsImg from "@/assets/avastars.avif";
import onchainchainImg from "@/assets/onchainchain.webp";
import flyfrog3dImg from "@/assets/flyfrog.webp";
import tokensmartImg from "@/assets/tokensmart.webp";
import metalympicsImg from "@/assets/metalympics-new.webp";
import rizzlefestImg from "@/assets/rizzlefest.webp";
import babacciImg from "@/assets/babacci-new.webp";
import nft42Img from "@/assets/nft42.webp";
import rizzleMiniappsImg from "@/assets/rizzle-miniapps.webp";
import trinityLabsImg from "@/assets/trinity-labs.webp";

const projects = [
  {
    name: "The WIP Meetup",
    description: "Founded in 2019 and still running: a weekly web3 meetup with live sessions, guests, and community-led experiments.",
    emoji: "🎙️",
    featured: true,
    image: wipMeetupImg,
    showLivePreview: true,
    links: [
      { label: "Website", emoji: "🌐", href: "https://thewipmeetup.com/" },
      { label: "Source", emoji: "💻", href: GITHUB_WIP_ARCHIVE_HUB_URL },
      { label: "Work together", emoji: "🤝", href: START_HERE_PATH },
    ],
  },
  {
    name: "Trinity Labs",
    description:
      "Current venture focused on multi-pool token liquidity on Base, built to make launches cleaner, fairer, and easier to sustain.",
    emoji: "⚗️",
    image: trinityLabsImg,
    imagePosition: "center 40%",
    links: [
      { label: "Website", emoji: "🌐", href: TRINITY_LABS_URL },
      { label: "Work together", emoji: "🤝", href: START_HERE_PATH },
    ],
  },
  {
    name: "MiniApps",
    description: "A growing set of Farcaster miniapps built for real usage, repeat engagement, and playful community moments.",
    emoji: "📱",
    image: rizzleMiniappsImg,
    imagePosition: "center 30%",
    links: [
      { label: "WIP Meetup", emoji: "🎙️", href: "https://farcaster.xyz/miniapps/yDcoJ9X6iJ2G/the-wip-meetup-miniapp" },
      { label: "Meme Studio", emoji: "🎨", href: "https://farcaster.xyz/miniapps/L6eTiFxvy99r/meme-studio" },
    ],
  },
  {
    name: "Babacci",
    description: "A generative 3D collection of unique creatures, fully onchain on Base, with downloadable assets for virtual worlds.",
    emoji: "🎨",
    image: babacciImg,
    links: [
      { label: "OpenSea", emoji: "⛵", href: "https://opensea.io/collection/babacci" },
    ],
  },
  {
    name: "OnChainChain",
    description: "Co-led a generative Ethereum launch from concept to public mint with a multi-creator team and strong collector narrative.",
    emoji: "⛓️",
    featured: true,
    image: onchainchainImg,
    links: [
      { label: "Art Blocks", emoji: "🎨", href: "https://www.artblocks.io/collection/onchainchain-by-rizzle-sebi-miguelgarest" },
      { label: "Work together", emoji: "🤝", href: START_HERE_PATH },
    ],
  },
  {
    name: "Rizzlefest",
    description: "A recurring web3 camping retreat built to bring internet-native communities together offline.",
    emoji: "🏕️",
    image: rizzlefestImg,
    links: [
      { label: "#rizzlefest", emoji: "🐦", href: "https://twitter.com/hashtag/rizzlefest" },
    ],
  },
  {
    name: "The Matthew & Rizzle Show",
    description: "One of web3's early podcasts (2019-2026), known for sharp conversations and long-form interviews across multiple market cycles.",
    emoji: "🎧",
    image: marsPodcastImg,
    imagePosition: "center 25%",
    links: [
      { label: "YouTube", emoji: "📺", href: "https://www.youtube.com/playlist?list=PLaEMvzi1A8c9xU0pw1CZJOTAsrwfydGNK" },
    ],
  },
  {
    name: "Fly Frogs",
    description: "Joined post-launch in 2021 and helped push Fly Frogs through key growth phases, including sellout and brand development.",
    emoji: "🐸",
    image: flyfrog3dImg,
    links: [
      { label: "Website", emoji: "🌐", href: "https://flyfrogs.xyz/" },
      { label: "OpenSea", emoji: "⛵", href: "https://opensea.io/collection/fly-frogs" },
    ],
  },
  {
    name: "TokenSmart",
    description: "One of the larger early web3 communities (2019-2021), with recurring events and podcast content that grew to 20,000+ Discord members.",
    emoji: "🧠",
    image: tokensmartImg,
    links: [
      { label: "Twitter", emoji: "🐦", href: "https://twitter.com/nftsmart" },
      { label: "Podcast", emoji: "🎧", href: "https://creators.spotify.com/pod/profile/tokensmart" },
    ],
  },
  {
    name: "Metalympics",
    description: "A three-month 2020 metaverse event with 20+ sponsors and hundreds of participants across community competitions.",
    emoji: "🏆",
    image: metalympicsImg,
    links: [
      { label: "Twitter", emoji: "🐦", href: "https://twitter.com/metalympics" },
    ],
  },
  {
    name: "Avastars",
    description: "Co-founded and launched one of the earliest fully onchain generative PFP projects; secondary volume surpassed 4,000 ETH.",
    emoji: "👾",
    image: avastarsImg,
    links: [
      { label: "OpenSea", emoji: "⛵", href: "https://opensea.io/collection/avastar" },
      { label: "Work together", emoji: "🤝", href: START_HERE_PATH },
    ],
  },
  {
    name: "nft42",
    description: "Co-founded a pioneering NFT studio (2019-2022) focused on fully onchain metadata and high-profile creator launches.",
    emoji: "✨",
    featured: true,
    image: nft42Img,
    links: [
      { label: "Website", emoji: "🌐", href: "https://nft42.com" },
      { label: "Work together", emoji: "🤝", href: START_HERE_PATH },
    ],
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
  const projectPriority: Record<string, number> = {
    "The WIP Meetup": 1,
    nft42: 2,
    OnChainChain: 3,
    "Trinity Labs": 4,
    Avastars: 5,
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const aRank = projectPriority[a.name] ?? 999;
    const bRank = projectPriority[b.name] ?? 999;
    return aRank - bRank;
  });

  return (
    <div className="page-container">
      <p className="mb-5 text-center text-sm text-muted-foreground sm:mb-6 sm:text-base">
        Flagship work first, then experiments and side quests.
      </p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>*]:!col-span-1 [&>*]:[grid-column:span_1/span_1]"
      >
        {sortedProjects.map((project) => (
          <motion.div key={project.name} variants={itemVariants}>
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Inline CryptoArt content (without section wrapper and header)
import { ExternalLink, Palette, Heart } from "lucide-react";
import truthMagazineImg from "@/assets/truth-magazine.webp";
import manifoldArtImg from "@/assets/manifold-art.webp";
import zerooneArtImg from "@/assets/zeroone-art.webp";
import openseaRizzleImg from "@/assets/opensea-vault.webp";
import openseaVaultImg from "@/assets/opensea-vault.webp";
import zerooneCollectedImg from "@/assets/zeroone-collected.webp";
import objktArtImg from "@/assets/objkt-art.webp";
// Platform logo components
const OpenSeaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 90 90" className={className} fill="currentColor">
    <path d="M45 0C20.151 0 0 20.151 0 45c0 24.849 20.151 45 45 45 24.849 0 45-20.151 45-45C90 20.151 69.849 0 45 0zM22.203 46.512l.178-.312 11.707-18.323c.166-.26.52-.235.652.049 1.957 4.161 3.645 9.335 2.854 12.563-.336 1.313-1.253 3.092-2.293 4.716-.134.262-.285.519-.449.767-.074.117-.19.177-.318.177H22.494c-.312 0-.504-.343-.291-.637zm49.047 6.225c0 .223-.134.419-.336.504-1.203.504-5.313 2.414-7.027 4.8-4.378 6.09-7.724 14.793-15.193 14.793H32.878c-11.086 0-20.079-9.018-20.079-20.14v-.356c0-.268.218-.487.487-.487h13.232c.311 0 .541.285.516.596-.091.789.067 1.595.475 2.313.814 1.436 2.311 2.326 3.927 2.326h6.163v-4.623h-6.096c-.319 0-.508-.367-.319-.617.073-.1.152-.206.236-.323.615-.86 1.495-2.195 2.37-3.698.596-1.024 1.171-2.119 1.628-3.22.091-.201.166-.407.241-.607.127-.352.258-.68.359-1.008.101-.277.185-.563.261-.84.226-.907.32-1.862.32-2.849 0-.39-.017-.797-.05-1.188-.017-.424-.067-.848-.118-1.272-.033-.378-.101-.755-.168-1.14a15.066 15.066 0 00-.302-1.408l-.042-.176c-.084-.327-.151-.638-.252-.965a45.503 45.503 0 00-.873-2.848c-.134-.407-.285-.797-.436-1.188-.223-.596-.454-1.155-.677-1.68-.109-.251-.235-.486-.344-.737-.126-.285-.26-.562-.378-.84-.084-.193-.185-.377-.26-.562l-.755-1.377c-.101-.185.075-.403.277-.336l4.712 1.274h.017l.621.176.68.193.252.067v-2.899c0-1.322 1.062-2.393 2.377-2.393.657 0 1.255.269 1.683.705.428.436.693 1.04.693 1.688v4.306l.504.143s.034.008.05.017c.135.109.327.26.572.461.193.16.403.361.663.579.512.436 1.129 1.008 1.803 1.663.185.176.361.361.537.554.873.89 1.847 1.931 2.77 3.087.261.327.512.663.772 1.016.26.352.537.705.78 1.057.319.461.672.94.973 1.436.143.235.302.478.428.721.378.68.697 1.377.965 2.074.109.294.218.613.294.923.226.823.361 1.68.378 2.537.016.285.016.554 0 .84-.017.344-.05.68-.101 1.024-.034.294-.084.596-.151.89-.067.31-.168.63-.26.948-.185.596-.42 1.188-.697 1.746a11.06 11.06 0 01-.453.856c-.168.31-.352.621-.537.914-.134.218-.285.428-.428.638-.16.235-.336.47-.504.68-.235.31-.478.612-.73.89-.151.193-.319.394-.487.579-.168.193-.344.377-.504.553-.26.285-.504.537-.73.764l-.47.453c-.084.084-.193.134-.31.134h-3.745v4.623h4.71c1.058 0 2.066-.378 2.882-1.058.277-.235 1.494-1.293 2.932-2.857.05-.058.117-.1.193-.117l14.256-4.111c.26-.076.529.126.529.403z"/>
  </svg>
);

const ManifoldLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

const ZeroOneLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="15" y="7" width="4" height="10" rx="1"/>
  </svg>
);

const ObjktLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

const createdCollections = [
  {
    name: "Manifold Collection",
    description: "AI-generated experiments featuring frogs, avocados, and surreal creatures.",
    link: "https://studio.manifold.xyz/contracts/1027361008",
    logo: ManifoldLogo,
    image: manifoldArtImg,
  },
  {
    name: "ZeroOne Gallery",
    description: "Curated digital art exploring AI and imagination.",
    link: "https://zeroone.art/profile/rizzle",
    logo: ZeroOneLogo,
    image: zerooneArtImg,
  },
];

const collectedCollections = [
  {
    name: "ZeroOne Gallery",
    description: "Curated collection of digital art on ZeroOne.",
    link: "https://zeroone.art/profile/rizzle",
    logo: ZeroOneLogo,
    image: zerooneCollectedImg,
  },
  {
    name: "OpenSea (Rizzle)",
    description: "Primary collection of curated cryptoart pieces.",
    link: "https://opensea.io/Rizzle",
    logo: OpenSeaLogo,
    image: openseaRizzleImg,
  },
  {
    name: "OpenSea (Vault)",
    description: "Extended vault of collected digital art.",
    link: "https://opensea.io/Rizzlevault",
    logo: OpenSeaLogo,
    image: openseaVaultImg,
  },
  {
    name: "Objkt (Tezos)",
    description: "Tezos-based art collection on Objkt.",
    link: "https://objkt.com/@rizzle/owned",
    logo: ObjktLogo,
    image: objktArtImg,
  },
];

const CryptoArtContent = () => {
  return (
    <div className="page-container">
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
            loading="lazy"
            decoding="async"
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
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
            >
              {collection.image && (
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <collection.logo className="h-8 w-8 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="flex-1">
                    <h4 className="mb-1 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {collection.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {collection.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collectedCollections.map((collection) => (
            <a
              key={collection.name}
              href={collection.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
            >
              {collection.image && (
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
              )}
              <div className="p-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <collection.logo className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div>
                    <h4 className="mb-1 font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {collection.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContentTabs;
