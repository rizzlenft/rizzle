import { motion } from "framer-motion";
import { Briefcase, Gamepad2, Sparkles, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { track } from "@/lib/analytics";

interface TopNavProps {
  activeTab?: "projects" | "art" | "guests" | "games";
  onTabChange?: (tab: "projects" | "art") => void;
}

const TopNav = ({ activeTab = "projects", onTabChange }: TopNavProps) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: "projects" | "art") => {
    track("tab_switched", { tab });
    if (onTabChange) {
      onTabChange(tab);
    } else {
      navigate(tab === "art" ? "/?tab=art" : "/");
    }
  };

  const tabClass = (tab: string) =>
    `relative flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 xs:px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
      activeTab === tab
        ? "text-background"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const activeIndicator = (tab: string) =>
    activeTab === tab ? (
      <motion.div
        layoutId="navTabBg"
        className="absolute inset-0 bg-primary rounded-full"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    ) : null;

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2 py-2 sm:px-6">
        {/* Left — tagline pill (hidden on very small screens) */}
        <Link
          to="/"
          className="hidden xs:flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary hover:bg-primary/15 transition-colors"
        >
          <span className="text-sm">🏴‍☠️</span>
          <span className="hidden sm:inline">web3 founder since 2019</span>
          <span className="sm:hidden">since 2019</span>
          <span className="text-sm">🐸</span>
        </Link>

        {/* Right — tab toggle (centered on small screens) */}
        <div className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full border border-border/50 bg-card/30 p-1 backdrop-blur-sm mx-auto xs:mx-0 xs:ml-auto">
          <button
            type="button"
            onClick={() => handleTabClick("projects")}
            className={tabClass("projects")}
            aria-current={activeTab === "projects" ? "page" : undefined}
          >
            {activeIndicator("projects")}
            <Briefcase className="relative z-10 h-4 w-4" />
            <span className="relative z-10 hidden xs:inline">Projects</span>
          </button>
          <Link to="/guests" className={tabClass("guests")} aria-current={activeTab === "guests" ? "page" : undefined}>
            {activeIndicator("guests")}
            <Users className="relative z-10 h-4 w-4" />
            <span className="relative z-10 hidden xs:inline">Network</span>
          </Link>
          <button
            type="button"
            onClick={() => handleTabClick("art")}
            className={tabClass("art")}
            aria-current={activeTab === "art" ? "page" : undefined}
          >
            {activeIndicator("art")}
            <Sparkles className="relative z-10 h-4 w-4" />
            <span className="relative z-10 hidden xs:inline">CryptoArt</span>
          </button>
          <Link to="/games" className={tabClass("games")} aria-current={activeTab === "games" ? "page" : undefined}>
            {activeIndicator("games")}
            <Gamepad2 className="relative z-10 h-4 w-4" />
            <span className="relative z-10 hidden xs:inline">Games</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
