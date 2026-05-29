import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Gamepad2, Maximize2, Minimize2 } from "lucide-react";
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
}

const games: GameEntry[] = [
  {
    id: "rizzle-dash",
    title: "Rizzle Dash",
    description: "A fast-paced endless runner with 10 levels, castle sequences, and a pumping soundtrack. Tap/click/space to jump!",
    emoji: "🏃‍♂️",
    path: "/games/rizzle-dash.html",
    status: "playable",
    leaderboardMode: "campaign",
  },
  {
    id: "whack-a-mole",
    title: "Web3 Whack-a-Mole",
    description: "Bonk the scammers, save the chain. 30-second arcade rounds with golden bonks, flying rugs, and skull traps.",
    emoji: "🐀",
    path: "/games/whack-a-mole/",
    status: "playable",
    leaderboardMode: "high-score",
  },
];

const Games = () => {
  const [activeGame, setActiveGame] = useState<GameEntry | null>(games[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingScore, setPendingScore] = useState<{ level: number; score: number; campaignTotal: number } | null>(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("rd_player") || "");
  const [submitting, setSubmitting] = useState(false);
  const leaderboardRef = useRef<{ refresh: () => void } | null>(null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  useSeo({
    title: "Arcade | Rizzle Dash, Whack-a-Mole & Web3 Mini-Games",
    description:
      "Play Rizzle Dash and Web3 Whack-a-Mole — silly arcade games with leaderboards. More coming soon.",
    canonical: "https://rizzle.io/games",
    // No game-specific OG image — falls back to the default og-home.jpg set
    // in index.html. The old og-games.jpg promised "EARN REWARDS ONCHAIN"
    // which doesn't match the actual game (free leaderboard, no rewards).
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

  const handleScoreMessage = useCallback((e: MessageEvent) => {
    // Reject messages from any other origin. The game iframe is served from
    // the same domain as the page, so legitimate score events always arrive
    // with e.origin === window.location.origin. Anything else (an attacker
    // embedding our page, a browser extension, etc.) is dropped.
    if (e.origin !== window.location.origin) return;
    if (e.data?.type !== "rizzle-score") return;

    const { level, levelScore, campaignTotal } = e.data;
    // Light input validation — the game caps at 10 levels, scores are
    // small positive integers in practice. This isn't a substitute for
    // server-side validation (that'd require an Edge Function) but it
    // prevents the obvious junk-injection from a buggy or hostile client.
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

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <TopNav activeTab="games" />

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-foreground sm:text-4xl">
              <Gamepad2 className="h-8 w-8 text-primary" />
              Arcade
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Silly games built for fun. More coming soon.
            </p>
          </motion.div>

          <div className="mx-auto max-w-4xl space-y-6">
            {/* Game selector */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    if (game.status === "playable") {
                      track("game_started", { game_id: game.id, title: game.title });
                      setActiveGame(game);
                    }
                  }}
                  className={`group rounded-lg border p-4 text-left transition-all ${
                    activeGame?.id === game.id
                      ? "border-primary bg-primary/10"
                      : "border-border/50 bg-card/30 hover:border-primary/30"
                  } ${game.status === "coming-soon" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  <span className="text-2xl">{game.emoji}</span>
                  <h3 className="mt-1 text-sm font-semibold text-foreground">{game.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{game.description}</p>
                  {game.status === "coming-soon" && (
                    <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Coming Soon
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Game viewport */}
            {activeGame && !isFullscreen && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-black shadow-2xl sm:aspect-[16/9]">
                <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="rounded-md bg-black/60 p-1.5 text-foreground/70 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-foreground"
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
                <iframe
                  src={activeGame.path}
                  title={activeGame.title}
                  className="h-full w-full border-0"
                  allow="autoplay; fullscreen"
                />
              </div>
            )}

            {/* Leaderboard */}
            {activeGame && (
              <GameLeaderboard
                key={leaderboardKey}
                gameId={activeGame.id}
                mode={activeGame.leaderboardMode ?? "campaign"}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Name prompt modal — z-index above fullscreen portal */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onSubmit={handleNameSubmit}
            className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-foreground">🏆 New High Score!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your name for the leaderboard
            </p>
            <input
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

      {/* Fullscreen portal — rendered outside overflow-hidden ancestors */}
      {isFullscreen && activeGame && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black">
          <div className="absolute right-2 top-2 z-10">
            <button
              onClick={toggleFullscreen}
              className="rounded-md bg-black/60 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
              title="Exit fullscreen"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          </div>
          <iframe
            src={activeGame.path}
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
