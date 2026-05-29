import { useState, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Gamepad2, Maximize2, Minimize2, Expand } from "lucide-react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import GameLeaderboard from "@/components/GameLeaderboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSeo } from "@/hooks/useSeo";
import { track } from "@/lib/analytics";

interface GameEntry {
  id: string;
  title: string;
  description: string;
  emoji: string;
  path: string;
  status: "playable" | "coming-soon";
  leaderboardMode?: "campaign" | "high-score";
  /** landscape = 16:9 runner; arcade = taller cabinet-style embed */
  viewport: "landscape" | "arcade";
  embed?: boolean;
  expandHint?: string;
}

const games: GameEntry[] = [
  {
    id: "rizzle-dash",
    title: "Rizzle Dash",
    description: "Endless runner — 10 levels, tap or space to jump.",
    emoji: "🏃‍♂️",
    path: "/games/rizzle-dash.html",
    status: "playable",
    leaderboardMode: "campaign",
    viewport: "landscape",
  },
  {
    id: "whack-a-mole",
    title: "Web3 Whack-a-Mole",
    description: "Bonk scammers in 30s arcade rounds — golden bonks, flying rugs, skull traps.",
    emoji: "🐀",
    path: "/games/whack-a-mole/",
    status: "playable",
    leaderboardMode: "high-score",
    viewport: "arcade",
    embed: true,
    expandHint: "Expand for the full arcade cabinet — or tap Play and bonk away.",
  },
];

function gameIframeSrc(game: GameEntry) {
  if (!game.embed) return game.path;
  const sep = game.path.includes("?") ? "&" : "?";
  return `${game.path}${sep}embed=1`;
}

const viewportClass: Record<GameEntry["viewport"], string> = {
  landscape: "aspect-video min-h-[220px] sm:min-h-[280px]",
  arcade: "aspect-[3/4] min-h-[420px] sm:min-h-[520px] md:min-h-[560px] max-h-[min(72vh,680px)]",
};

const Games = () => {
  const tabsId = useId();
  const [activeGame, setActiveGame] = useState<GameEntry | null>(games[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingScore, setPendingScore] = useState<{ level: number; score: number; campaignTotal: number } | null>(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("rd_player") || "");
  const [submitting, setSubmitting] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  useSeo({
    title: "Arcade | Rizzle Dash, Whack-a-Mole & Web3 Mini-Games",
    description:
      "Play Rizzle Dash and Web3 Whack-a-Mole — silly arcade games with leaderboards. More coming soon.",
    canonical: "https://rizzle.io/games",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: "Rizzle Dash",
      url: "https://rizzle.io/games",
      gamePlatform: ["Web Browser", "Mobile Web"],
      applicationCategory: "Game",
      operatingSystem: "Any",
      author: { "@id": "https://rizzle.io/#person" },
      description:
        "A fast-paced endless runner with 10 levels, castle sequences, and a pumping soundtrack.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  });

  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  const selectGame = (game: GameEntry) => {
    if (game.status !== "playable") return;
    track("game_started", { game_id: game.id, title: game.title });
    setActiveGame(game);
    setIsFullscreen(false);
  };

  const handleScoreMessage = useCallback((e: MessageEvent) => {
    if (e.origin !== window.location.origin) return;
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

  const iframeSrc = activeGame ? gameIframeSrc(activeGame) : "";

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <TopNav activeTab="games" />

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6" id="main-content">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-foreground sm:text-4xl">
              <Gamepad2 className="h-8 w-8 text-primary" aria-hidden />
              Arcade
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Free mini-games with leaderboards. Pick a game, play, climb the board.
            </p>
          </motion.header>

          <div className="mx-auto max-w-4xl space-y-4">
            {/* Game selector — tabs at top */}
            <div
              role="tablist"
              aria-label="Choose a game"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
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
                    className={`group rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      selected
                        ? "border-primary bg-primary/10 shadow-[0_0_24px_hsl(var(--primary)/0.12)]"
                        : "border-border/50 bg-card/30 hover:border-primary/30"
                    } ${game.status === "coming-soon" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl leading-none" aria-hidden>
                        {game.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-semibold text-foreground">{game.title}</h2>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {game.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Game viewport */}
            {activeGame && !isFullscreen && (
              <section
                id={`${tabsId}-panel`}
                role="tabpanel"
                aria-labelledby={`${tabsId}-${activeGame.id}`}
                aria-label={`${activeGame.title} game`}
                className="space-y-2"
              >
                {activeGame.expandHint && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 bg-card/40 px-3 py-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Expand className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                      {activeGame.expandHint}
                    </span>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="shrink-0 rounded-md bg-primary/15 px-2.5 py-1 font-medium text-primary transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Expand
                    </button>
                  </div>
                )}

                <div
                  className={`relative overflow-hidden rounded-xl border border-border/50 bg-black shadow-2xl ${viewportClass[activeGame.viewport]}`}
                >
                  <div className="absolute right-2 top-2 z-10">
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1.5 text-xs text-foreground/80 backdrop-blur-sm transition-colors hover:bg-black/90 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Expand ${activeGame.title} to fullscreen`}
                    >
                      <Maximize2 className="h-4 w-4" aria-hidden />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </button>
                  </div>
                  <iframe
                    key={activeGame.id}
                    src={iframeSrc}
                    title={activeGame.title}
                    className="h-full w-full border-0"
                    allow="autoplay; fullscreen"
                    loading="lazy"
                  />
                </div>
              </section>
            )}

            {/* Leaderboard */}
            {activeGame && (
              <GameLeaderboard
                key={`${leaderboardKey}-${activeGame.id}`}
                gameId={activeGame.id}
                mode={activeGame.leaderboardMode ?? "campaign"}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>

      {showNamePrompt && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onSubmit={handleNameSubmit}
            className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl"
            aria-labelledby="score-modal-title"
          >
            <h2 id="score-modal-title" className="text-lg font-bold text-foreground">
              🏆 New High Score!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your name for the leaderboard
            </p>
            <label htmlFor="player-name" className="sr-only">
              Player name
            </label>
            <input
              id="player-name"
              autoFocus
              maxLength={20}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => { setShowNamePrompt(false); setPendingScore(null); }}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={!playerName.trim() || submitting}
                className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {submitting ? "Saving…" : "Submit"}
              </button>
            </div>
          </motion.form>
        </div>
      )}

      {isFullscreen && activeGame && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black" role="dialog" aria-modal="true" aria-label={`${activeGame.title} fullscreen`}>
          <div className="absolute right-3 top-3 z-10">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex items-center gap-2 rounded-md bg-black/70 px-3 py-2 text-sm text-white/80 backdrop-blur-sm transition-colors hover:bg-black/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
            className="h-full w-full border-0"
            allow="autoplay; fullscreen"
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default Games;
