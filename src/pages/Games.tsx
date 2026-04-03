import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Maximize2, Minimize2 } from "lucide-react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

interface GameEntry {
  id: string;
  title: string;
  description: string;
  emoji: string;
  path: string;
  status: "playable" | "coming-soon";
}

const games: GameEntry[] = [
  {
    id: "rizzle-dash",
    title: "Rizzle Dash",
    description: "A fast-paced endless runner with 10 levels, castle sequences, and a pumping soundtrack. Tap/click/space to jump!",
    emoji: "🏃‍♂️",
    path: "/games/rizzle-dash.html",
    status: "playable",
  },
];

const Games = () => {
  const [activeGame, setActiveGame] = useState<GameEntry | null>(games[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <TopNav activeTab="games" />

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Header */}
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

          {/* Game viewport */}
          {activeGame && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative mx-auto overflow-hidden rounded-xl border border-border/50 bg-black shadow-2xl ${
                isFullscreen
                  ? "fixed inset-0 z-[100] rounded-none border-0"
                  : "aspect-video max-w-4xl"
              }`}
            >
              {/* Controls bar */}
              <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="rounded-md bg-black/60 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              <iframe
                src={activeGame.path}
                title={activeGame.title}
                className="h-full w-full border-0"
                allow="autoplay"
                sandbox="allow-scripts allow-same-origin"
              />
            </motion.div>
          )}

          {/* Game selector grid — ready for future games */}
          {games.length > 1 && (
            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => game.status === "playable" && setActiveGame(game)}
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
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Games;
