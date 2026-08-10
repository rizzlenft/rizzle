import { useState, useEffect, useCallback, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Gamepad2, Maximize2, Minimize2, Expand } from "lucide-react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import GameLeaderboard from "@/components/GameLeaderboard";
import GameLogo from "@/components/games/GameLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSeo } from "@/hooks/useSeo";
import { OG } from "@/lib/og-images";
import { track } from "@/lib/analytics";

interface GameEntry {
  id: string;
  title: string;
  description: string;
  logo: string;
  /** Square icon optimized for small tab cards */
  logoThumb?: string;
  logoVariant?: "square" | "wide";
  logoFit?: "contain" | "cover";
  logoZoom?: string;
  logoPad?: "none" | "xs" | "sm";
  logoBrightFrame?: boolean;
  logoDarkFrame?: boolean;
  path: string;
  status: "playable" | "coming-soon";
  leaderboardMode?: "campaign" | "high-score";
  viewport: "landscape" | "arcade";
  embed?: boolean;
  expandHint?: string;
}

const games: GameEntry[] = [
  {
    id: "rizzle-dash",
    title: "Rizzle Dash",
    description: "Endless runner — 10 levels. Tap, click, or press space to jump.",
    logo: "/games/logos/rizzle-dash-tab.png",
    logoThumb: "/games/logos/rizzle-dash-tab.png",
    logoVariant: "square",
    logoFit: "contain",
    logoZoom: "scale-[1.22]",
    logoPad: "none",
    path: "/games/rizzle-dash",
    status: "playable",
    leaderboardMode: "campaign",
    viewport: "landscape",
    embed: true,
  },
  {
    id: "whack-a-mole",
    title: "Web3 Whack-a-Mole",
    description: "Bonk scammers in 30s rounds — golden bonks, flying rugs, skull traps.",
    logo: "/games/logos/whack-a-mole-tab.png",
    logoThumb: "/games/logos/whack-a-mole-tab.png",
    logoVariant: "square",
    logoFit: "cover",
    logoZoom: "scale-[1.08]",
    logoPad: "none",
    logoDarkFrame: true,
    path: "/games/whack-a-mole/",
    status: "playable",
    leaderboardMode: "high-score",
    viewport: "arcade",
    embed: true,
    expandHint: "Tap Expand for the full arcade cabinet experience.",
  },
  {
    id: "capyrizzle",
    title: "CapyRizzle Rush",
    description: "Fire-chief capybara endless sprint — tap to jump every fire, soak the crowd.",
    logo: "/games/logos/capyrizzle-tab.png",
    logoThumb: "/games/logos/capyrizzle-tab.png",
    logoVariant: "square",
    logoFit: "cover",
    logoZoom: "scale-[1.05]",
    logoPad: "none",
    path: "/games/capyrizzle/",
    status: "playable",
    viewport: "landscape",
    embed: true,
  },
];

function gameIframeSrc(game: GameEntry) {
  if (!game.embed) return game.path;
  const sep = game.path.includes("?") ? "&" : "?";
  return `${game.path}${sep}embed=1`;
}

const viewportClass: Record<GameEntry["viewport"], string> = {
  landscape:
    "aspect-video w-full min-h-[200px] max-h-[50vh] sm:min-h-[280px] sm:max-h-[420px]",
  arcade:
    "aspect-[3/4] w-full min-h-[min(62dvh,520px)] max-h-[min(78dvh,720px)] sm:min-h-[520px] md:min-h-[560px]",
};

const Games = () => {
  const tabsId = useId();
  const viewportRef = useRef<HTMLElement>(null);
  const [activeGame, setActiveGame] = useState<GameEntry | null>(games[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingScore, setPendingScore] = useState<{ level: number; score: number; campaignTotal: number } | null>(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("rd_player") || "");
  const [submitting, setSubmitting] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  useSeo({
    title: "Arcade | Rizzle Dash, CapyRizzle Rush & Web3 Mini-Games",
    description:
      "Play Rizzle Dash, CapyRizzle Rush, and Web3 Whack-a-Mole — free browser arcade games with live leaderboards. Built by Rizzle.",
    canonical: "https://rizzle.io/games",
    image: OG.games.url,
    imageAlt: OG.games.alt,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://rizzle.io/" },
            { "@type": "ListItem", position: 2, name: "Arcade", item: "https://rizzle.io/games" },
          ],
        },
        {
          "@type": "VideoGame",
          name: "Rizzle Dash",
          url: "https://rizzle.io/games/rizzle-dash",
          gamePlatform: ["Web Browser", "Mobile Web"],
          applicationCategory: "Game",
          operatingSystem: "Any",
          author: { "@id": "https://rizzle.io/#person" },
          description: "A fast-paced endless runner with 10 levels and leaderboards.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "VideoGame",
          name: "Web3 Whack-a-Mole",
          url: "https://rizzle.io/games/whack-a-mole/",
          gamePlatform: ["Web Browser", "Mobile Web"],
          applicationCategory: "Game",
          operatingSystem: "Any",
          author: { "@id": "https://rizzle.io/#person" },
          description: "Bonk scammers in 30-second arcade rounds with high-score leaderboards.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "VideoGame",
          name: "CapyRizzle Rush",
          url: "https://rizzle.io/games/capyrizzle/",
          gamePlatform: ["Web Browser", "Mobile Web"],
          applicationCategory: "Game",
          operatingSystem: "Any",
          author: { "@id": "https://rizzle.io/#person" },
          description: "One-button capybara fire-truck sprint through a burning city. Tap to jump every fire.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      ],
    },
  });

  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  const selectGame = (game: GameEntry) => {
    if (game.status !== "playable") return;
    track("game_started", { game_id: game.id, title: game.title });
    setActiveGame(game);
    setIsFullscreen(false);
    requestAnimationFrame(() => {
      viewportRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const handleScoreMessage = useCallback((e: MessageEvent) => {
    if (e.origin !== window.location.origin) return;

    if (e.data?.type === "whack-score") {
      const score = e.data.score;
      if (Number.isInteger(score) && score >= 0 && score <= 99_999) {
        setLeaderboardKey((k) => k + 1);
      }
      return;
    }

    if (e.data?.type !== "rizzle-score") return;

    const { level, levelScore, campaignTotal } = e.data;
    const validLevel = Number.isInteger(level) && level >= 1 && level <= 10;
    const validScore = Number.isInteger(levelScore) && levelScore >= 0 && levelScore <= 100_000;
    const validTotal = Number.isInteger(campaignTotal) && campaignTotal >= 0 && campaignTotal <= 1_000_000;
    if (!validLevel || !validScore || !validTotal) return;

    setPendingScore({ level, score: levelScore, campaignTotal });
    const saved = localStorage.getItem("rd_player");
    if (saved) {
      submitScore(saved, level, levelScore, campaignTotal);
    } else {
      setShowNamePrompt(true);
    }
  }, []);

  const submitScore = async (name: string, level: number, score: number, campaignTotal: number) => {
    setSubmitting(true);
    const { error } = await supabase.from("game_scores").insert({
      player_name: name,
      game_id: "rizzle-dash",
      level,
      score: score,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to save score");
    } else {
      toast.success(`Level ${level} clear! Campaign total: ${campaignTotal.toLocaleString()}`);
      setLeaderboardKey((k) => k + 1);
    }
    setShowNamePrompt(false);
    setPendingScore(null);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed || !pendingScore) return;
    localStorage.setItem("rd_player", trimmed);
    submitScore(trimmed, pendingScore.level, pendingScore.score, pendingScore.campaignTotal);
  };

  useEffect(() => {
    window.addEventListener("message", handleScoreMessage);
    return () => window.removeEventListener("message", handleScoreMessage);
  }, [handleScoreMessage]);

  useEffect(() => {
    if (!showNamePrompt) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowNamePrompt(false);
        setPendingScore(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showNamePrompt]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const iframeSrc = activeGame ? gameIframeSrc(activeGame) : "";

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <TopNav activeTab="games" />

        <main className="page-container section-y pb-10" id="main-content">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 text-center sm:mb-6"
          >
            <h1 className="flex items-center justify-center gap-2.5 font-display text-3xl font-bold text-foreground sm:gap-3 sm:text-4xl">
              <Gamepad2 className="h-7 w-7 text-primary sm:h-8 sm:w-8" aria-hidden />
              Arcade
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Free mini-games with leaderboards. Pick a game, play, climb the board.
            </p>
          </motion.header>

          <div className="mx-auto max-w-4xl space-y-4 sm:space-y-5">
            <div
              role="tablist"
              aria-label="Choose a game"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {games.map((game) => {
                const selected = activeGame?.id === game.id;
                const tabId = `${tabsId}-${game.id}`;
                return (
                  <button
                    key={game.id}
                    id={tabId}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`${tabsId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectGame(game)}
                    disabled={game.status === "coming-soon"}
                    className={`min-h-[88px] surface-glass p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[96px] sm:p-4 ${
                      selected
                        ? "border-primary bg-primary/10 shadow-[0_0_24px_hsl(var(--primary)/0.15)]"
                        : "hover:border-primary/35 hover:bg-card/55"
                    } ${game.status === "coming-soon" ? "cursor-not-allowed opacity-50" : "cursor-pointer active:scale-[0.99]"}`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <GameLogo
                        src={game.logoThumb ?? game.logo}
                        title={game.title}
                        variant={game.logoVariant ?? "square"}
                        size="sm"
                        fit={game.logoFit}
                        zoom={game.logoZoom}
                        pad={game.logoPad}
                        brightFrame={game.logoBrightFrame}
                        darkFrame={game.logoDarkFrame}
                      />
                      <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-semibold leading-tight text-foreground sm:text-base">
                          {game.title}
                        </h2>
                        <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm sm:leading-relaxed">
                          {game.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {activeGame && !isFullscreen && (
              <section
                ref={viewportRef}
                id={`${tabsId}-panel`}
                role="tabpanel"
                aria-labelledby={`${tabsId}-${activeGame.id}`}
                aria-label={`${activeGame.title} game`}
                className="space-y-3"
              >
                {activeGame.expandHint && (
                  <div className="surface-glass flex items-stretch gap-2 border-primary/25 bg-primary/5 p-2 sm:items-center sm:justify-between sm:px-3 sm:py-2.5">
                    <p className="flex flex-1 items-center gap-2 px-1 text-xs leading-snug text-muted-foreground sm:text-sm">
                      <Expand className="hidden h-4 w-4 shrink-0 text-primary sm:block" aria-hidden />
                      <span>{activeGame.expandHint}</span>
                    </p>
                    <Button type="button" variant="cta-primary" onClick={toggleFullscreen} className="shrink-0">
                      <Maximize2 className="h-4 w-4" aria-hidden />
                      Expand
                    </Button>
                  </div>
                )}

                <div
                  className={`relative mx-auto overflow-hidden rounded-xl border border-border/50 bg-black shadow-2xl ${viewportClass[activeGame.viewport]}`}
                >
                  {!activeGame.expandHint && (
                    <div className="absolute right-2 top-2 z-10">
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg bg-black/75 px-3 text-xs text-foreground/90 backdrop-blur-sm transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={`Expand ${activeGame.title} to fullscreen`}
                      >
                        <Maximize2 className="h-4 w-4" aria-hidden />
                        <span className="hidden sm:inline">Fullscreen</span>
                      </button>
                    </div>
                  )}
                  <iframe
                    key={activeGame.id}
                    src={iframeSrc}
                    title={activeGame.title}
                    className="h-full w-full border-0 touch-manipulation"
                    allow="autoplay; fullscreen"
                    loading="lazy"
                  />
                </div>
              </section>
            )}

            {activeGame?.leaderboardMode && (
              <GameLeaderboard
                key={`${leaderboardKey}-${activeGame.id}`}
                gameId={activeGame.id}
                mode={activeGame.leaderboardMode}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>

      {showNamePrompt && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
          <motion.form
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onSubmit={handleNameSubmit}
            className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl"
            aria-labelledby="score-modal-title"
          >
            <h2 id="score-modal-title" className="text-lg font-bold text-foreground">
              New high score!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your name for the leaderboard
            </p>
            <Label htmlFor="player-name" className="sr-only">
              Player name
            </Label>
            <Input
              id="player-name"
              autoFocus
              maxLength={20}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              className="mt-4"
            />
            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                onClick={() => { setShowNamePrompt(false); setPendingScore(null); }}
                variant="cta-secondary"
                className="flex-1"
              >
                Skip
              </Button>
              <Button
                type="submit"
                disabled={!playerName.trim() || submitting}
                variant="cta-primary"
                className="flex-1"
              >
                {submitting ? "Saving…" : "Submit"}
              </Button>
            </div>
          </motion.form>
        </div>
      )}

      {isFullscreen && activeGame && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black supports-[height:100dvh]:h-[100dvh] h-screen"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeGame.title} fullscreen`}
        >
          <div className="absolute left-0 right-0 top-0 z-10 flex justify-end p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex min-h-[44px] items-center gap-2 rounded-lg bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Exit fullscreen"
            >
              <Minimize2 className="h-5 w-5" aria-hidden />
              Exit
            </button>
          </div>
          <iframe
            key={`fs-${activeGame.id}`}
            src={iframeSrc}
            title={activeGame.title}
            className="h-full w-full border-0 touch-manipulation"
            allow="autoplay; fullscreen"
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default Games;
