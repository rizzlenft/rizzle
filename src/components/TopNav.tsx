import { motion } from "framer-motion";
import { Briefcase, Gamepad2, Sparkles, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface TopNavProps {
  activeTab?: "projects" | "art" | "guests" | "games";
  onTabChange?: (tab: "projects" | "art") => void;
}

const TopNav = ({ activeTab = "projects", onTabChange }: TopNavProps) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: "projects" | "art") => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      navigate(tab === "art" ? "/?tab=art" : "/");
    }
  };

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        {/* Left — tagline pill */}
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary hover:bg-primary/15 transition-colors"
        >
          <span className="text-sm">🏴‍☠️</span>
          <span className="hidden sm:inline">web3 founder since 2019</span>
          <span className="sm:hidden">since 2019</span>
          <span className="text-sm">🐸</span>
        </Link>

        {/* Right — tab toggle */}
        <div className="inline-flex items-center gap-0 sm:gap-1 rounded-full border border-border/50 bg-card/30 p-0.5 sm:p-1 backdrop-blur-sm">
          <button
            onClick={() => handleTabClick("projects")}
            className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 text-[11px] sm:text-sm font-medium transition-colors rounded-full ${
              activeTab === "projects"
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === "projects" && (
              <motion.div
                layoutId="navTabBg"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Briefcase className="relative z-10 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="relative z-10 hidden xs:inline">Projects</span>
          </button>
          <button
            onClick={() => handleTabClick("art")}
            className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 text-[11px] sm:text-sm font-medium transition-colors rounded-full ${
              activeTab === "art"
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === "art" && (
              <motion.div
                layoutId="navTabBg"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Sparkles className="relative z-10 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="relative z-10 hidden xs:inline">CryptoArt</span>
          </button>
          <Link
            to="/guests"
            className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 text-[11px] sm:text-sm font-medium transition-colors rounded-full ${
              activeTab === "guests"
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === "guests" && (
              <motion.div
                layoutId="navTabBg"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Users className="relative z-10 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="relative z-10 hidden xs:inline">Network</span>
          </Link>
          <Link
            to="/games"
            className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 text-[11px] sm:text-sm font-medium transition-colors rounded-full ${
              activeTab === "games"
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === "games" && (
              <motion.div
                layoutId="navTabBg"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Gamepad2 className="relative z-10 h-3.5 w-3.5" />
            <span className="relative z-10">Games</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
