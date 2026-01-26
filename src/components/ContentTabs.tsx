import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Projects from "./Projects";
import CryptoArt from "./CryptoArt";

const ContentTabs = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "art">("projects");

  return (
    <div className="relative px-6 py-8">
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
            <Link
              to="/guests"
              className="relative flex items-center gap-2 px-5 py-2 text-sm font-medium transition-colors rounded-full text-muted-foreground hover:text-foreground"
            >
              <Users className="relative z-10 h-4 w-4" />
              <span className="relative z-10">Guests</span>
            </Link>
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
    description: "Babacci is a generative unique 3D collectible NFT. Download the model as a .glb file by opening it in a new window and pressing S, use it across the metaverse. Fully onchain.",
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
    description: "Generative PFP NFTs stored entirely onchain. Est. 2020. Pioneering avatar art that actually meant something.",
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
  },
  {
    name: "ZeroOne Gallery",
    description: "Curated digital art exploring AI and imagination.",
    link: "https://zeroone.art/profile/rizzle",
    logo: ZeroOneLogo,
  },
];

const collectedCollections = [
  {
    name: "ZeroOne Gallery",
    description: "Curated collection of digital art on ZeroOne.",
    link: "https://zeroone.art/profile/rizzle",
    logo: ZeroOneLogo,
  },
  {
    name: "OpenSea (Rizzle)",
    description: "Primary collection of curated cryptoart pieces.",
    link: "https://opensea.io/Rizzle",
    logo: OpenSeaLogo,
  },
  {
    name: "OpenSea (Vault)",
    description: "Extended vault of collected digital art.",
    link: "https://opensea.io/Rizzlevault",
    logo: OpenSeaLogo,
  },
  {
    name: "Objkt (Tezos)",
    description: "Tezos-based art collection on Objkt.",
    link: "https://objkt.com/@rizzle/owned",
    logo: ObjktLogo,
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
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <collection.logo className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <h4 className="mb-1 font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {collection.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {collection.description}
                  </p>
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
