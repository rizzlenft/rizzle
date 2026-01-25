import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

// Import project images
import wipMeetupImg from "@/assets/wip-logo.gif";
import marsPodcastImg from "@/assets/mars-podcast.jpg";
import avastarsImg from "@/assets/avastars.svg";
import onchainchainImg from "@/assets/onchainchain.jpg";
import flyfrog3dImg from "@/assets/flyfrog3d.jpg";
import nftsmartImg from "@/assets/nftsmart.jpg";
import metalympicsImg from "@/assets/metalympics.jpg";
import babacciImg from "@/assets/babacci.jpg";

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
    name: "Matt & Rizz Show",
    description: "Web3 podcast cutting through the noise. Real talk, no fluff, calling out grifters.",
    emoji: "🎧",
    link: "https://twitter.com/mattandrizzshow",
    image: marsPodcastImg,
  },
  {
    name: "Avastars",
    description: "Pioneering generative avatar NFT project. On-chain art that actually meant something.",
    emoji: "👾",
    link: "https://twitter.com/avastarsnft",
    image: avastarsImg,
  },
  {
    name: "OnChainChain",
    description: "Building for the blockchain, staying true to decentralization principles.",
    emoji: "⛓️",
    link: "https://twitter.com/onchainchain",
    image: onchainchainImg,
  },
  {
    name: "FlyFrog3D",
    description: "3D metaverse experiences and assets. Making virtual worlds more interesting.",
    emoji: "🐸",
    link: "https://twitter.com/flyfrog3d",
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
    description: "Competitive gaming meets the metaverse. Sports for the digital age.",
    emoji: "🏆",
    link: "https://twitter.com/metalympics",
    image: metalympicsImg,
  },
  {
    name: "Babacci",
    description: "Art collective pushing boundaries. Weird, wonderful, and unapologetically creative.",
    emoji: "🎨",
    link: "https://twitter.com/hashtag/babacci",
    image: babacciImg,
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
