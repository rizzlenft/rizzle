import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award, RefreshCw } from "lucide-react";

interface LeaderboardEntry {
  player_name: string;
  campaign_total: number;
  highest_level: number;
}

interface GameLeaderboardProps {
  gameId: string;
  mode?: "campaign" | "high-score";
}

const RANK_ICONS = [
  <Trophy className="h-4 w-4 text-yellow-400" aria-hidden />,
  <Medal className="h-4 w-4 text-gray-300" aria-hidden />,
  <Award className="h-4 w-4 text-amber-600" aria-hidden />,
];

const GameLeaderboard = ({ gameId, mode = "campaign" }: GameLeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchScores = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const { data } = await supabase
      .from("game_scores")
      .select("player_name, level, score")
      .eq("game_id", gameId)
      .order("score", { ascending: false })
      .limit(mode === "high-score" ? 20 : 500);

    if (!data) {
      setEntries([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (mode === "high-score") {
      const bestByPlayer = new Map<string, number>();
      for (const row of data) {
        const current = bestByPlayer.get(row.player_name) ?? 0;
        if (row.score > current) bestByPlayer.set(row.player_name, row.score);
      }
      const sorted = [...bestByPlayer.entries()]
        .map(([player_name, score]) => ({
          player_name,
          campaign_total: score,
          highest_level: 1,
        }))
        .sort((a, b) => b.campaign_total - a.campaign_total)
        .slice(0, 20);
      setEntries(sorted);
    } else {
      const playerLevels = new Map<string, Map<number, number>>();
      for (const row of data) {
        let levels = playerLevels.get(row.player_name);
        if (!levels) {
          levels = new Map();
          playerLevels.set(row.player_name, levels);
        }
        const current = levels.get(row.level) || 0;
        if (row.score > current) levels.set(row.level, row.score);
      }

      const sorted: LeaderboardEntry[] = [];
      for (const [player_name, levels] of playerLevels) {
        let campaign_total = 0;
        let highest_level = 0;
        for (const [level, score] of levels) {
          campaign_total += score;
          if (level > highest_level) highest_level = level;
        }
        sorted.push({ player_name, campaign_total, highest_level });
      }
      sorted.sort((a, b) => b.campaign_total - a.campaign_total);
      setEntries(sorted.slice(0, 20));
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchScores();
  }, [gameId, mode]);

  if (loading) {
    return (
      <div
        className="rounded-xl border border-border/50 bg-card/30 px-4 py-10 text-center text-sm text-muted-foreground"
        aria-live="polite"
      >
        Loading scores…
      </div>
    );
  }

  return (
    <section
      className="rounded-xl border border-border/50 bg-card/30 overflow-hidden"
      aria-labelledby={`leaderboard-${gameId}`}
    >
      <div className="border-b border-border/50 bg-card/50 px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" aria-hidden />
            <h3 id={`leaderboard-${gameId}`} className="text-sm font-semibold text-foreground sm:text-base">
              Leaderboard
            </h3>
          </div>
          <button
            type="button"
            onClick={() => fetchScores(true)}
            disabled={refreshing}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            aria-label="Refresh leaderboard"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {mode === "campaign"
            ? "Campaign total = sum of your best score on each level."
            : "Top bonks from 30-second rounds."}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="px-4 py-10 text-center sm:px-5">
          <Trophy className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden />
          <p className="mt-2 text-sm text-muted-foreground">
            No scores yet — be the first on the board!
          </p>
        </div>
      ) : (
        <ol className="divide-y divide-border/30">
          {entries.map((entry, i) => (
            <li
              key={`${entry.player_name}-${i}`}
              className="flex min-h-[48px] items-center gap-3 px-4 py-3 text-sm sm:px-5"
            >
              <span className="flex w-7 shrink-0 justify-center" aria-hidden>
                {i < 3 ? RANK_ICONS[i] : (
                  <span className="text-xs font-medium text-muted-foreground">{i + 1}</span>
                )}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                {entry.player_name}
              </span>
              {mode === "campaign" && (
                <span className="shrink-0 text-xs text-muted-foreground">Lv{entry.highest_level}</span>
              )}
              <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-primary sm:text-base">
                {mode === "high-score"
                  ? (entry.campaign_total ?? 0).toString().padStart(4, "0")
                  : (entry.campaign_total ?? 0).toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default GameLeaderboard;
