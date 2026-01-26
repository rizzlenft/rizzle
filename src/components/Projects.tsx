import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

// Import project images
import wipMeetupImg from "@/assets/wip-logo.gif";
import marsPodcastImg from "@/assets/mattandrizz.jpeg";
import avastarsImg from "@/assets/avastars.avif";
import onchainchainImg from "@/assets/onchainchain.png";
import flyfrog3dImg from "@/assets/flyfrog.jpg";
import nftsmartImg from "@/assets/nftsmart.jpg";
import metalympicsImg from "@/assets/metalympics-new.jpeg";
import babacciImg from "@/assets/babacci-new.jpeg";

const projects = [
  {
    name: "The WIP Meetup",
    description: "Weekly community gatherings exploring the cutting edge of web3, metaverse, and digital culture. Free gifts, WIPcoin, and controlled chaos.",
    emoji: "🎙️",
    link: "https://twitter.com/theWIPmeetup",
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
    name: "Avastars",
    description: "Pioneering generative avatar NFT project. Onchain art that actually meant something.",
    emoji: "👾",
    link: "https://opensea.io/collection/avastar",
    image: avastarsImg,
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
    name: "NFT Smart",
    description: "Education and insights for the NFT space. Helping people navigate web3.",
    emoji: "🧠",
    link: "https://twitter.com/nftsmart",
    image: nftsmartImg,
  },
  {
    name: "Metalympics",
    description: "In 2020, the Metalympics was a 3-month metaverse event attracting 20+ web3 sponsors, hundreds of competitors, and became one of the largest cutting-edge web3 events to date.",
    emoji: "🏆",
    link: "https://twitter.com/metalympics",
    image: metalympicsImg,
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

const Projects = () => {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Projects
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Building across the metaverse, one weird idea at a time
          </p>
        </motion.div>
        
        {/* Projects grid */}
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
    </section>
  );
};

export default Projects;
