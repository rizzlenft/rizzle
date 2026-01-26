import { useState } from "react";
import { motion } from "framer-motion";
import Projects from "./Projects";
import CryptoArt from "./CryptoArt";

const ContentTabs = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "art">("projects");

  return (
    <div>
      {/* Tab navigation */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex gap-1 py-4">
            <button
              onClick={() => setActiveTab("projects")}
              className={`relative px-6 py-2 text-sm font-medium transition-colors rounded-lg ${
                activeTab === "projects"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Projects
              {activeTab === "projects" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("art")}
              className={`relative px-6 py-2 text-sm font-medium transition-colors rounded-lg ${
                activeTab === "art"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CryptoArt
              {activeTab === "art" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "projects" ? <Projects /> : <CryptoArt />}
      </motion.div>
    </div>
  );
};

export default ContentTabs;
