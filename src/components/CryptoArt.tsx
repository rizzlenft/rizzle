import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import truthMagazineImg from "@/assets/truth-magazine.png";

const collections = [
  {
    name: "Manifold Collection",
    description: "AI-generated experiments featuring frogs, avocados, and surreal creatures. 100s of editions collected.",
    link: "https://studio.manifold.xyz/contracts/1027361008",
  },
  {
    name: "ZeroOne Gallery",
    description: "Curated digital art collection exploring the intersection of AI and imagination.",
    link: "https://zeroone.art/profile/rizzle",
  },
];

const CryptoArt = () => {
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
            CryptoArt
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Early AI experiments with frogs, avocados, and surreal creatures — 100s of editions collected
          </p>
        </motion.div>

        {/* Featured image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
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

        {/* Collection links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {collections.map((collection) => (
            <a
              key={collection.name}
              href={collection.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-2 font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {collection.description}
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CryptoArt;
