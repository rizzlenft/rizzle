import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  player_name: string;
  best_score: number;
  highest_level: number;
}

interface GameLeaderboardProps {
  gameId: string;
}

const RANK_ICONS = [
  <Trophy className="h-4 w-4 text-yellow-400" />,
  <Medal className="h-4 w-4 text-gray-300" />,
  <Award className="h-4 w-4 text-amber-600" />,
];

const GameLeaderboard = ({ gameId }: GameLeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    // Get all scores for this game, then aggregate client-side
    // Best campaign total per player (highest score entry)
    const { data } = await supabase
      .from("game_scores")
      .select("player_name, level, score")
      .eq("game_id", gameId)
      .order("score", { ascending: false })
      .limit(200);

    if (!data) {
      setEntries([]);
      setLoading(false);
      return;
    }

    // Group by player - take their best score and highest level reached
    const playerMap = new Map<string, LeaderboardEntry>();
    for (const row of data) {
      const existing = playerMap.get(row.player_name);
      if (!existing) {
        playerMap.set(row.player_name, {
          player_name: row.player_name,
          best_score: row.score,
          highest_level: row.level,
        });
      } else {
        if (row.score > existing.best_score) existing.best_score = row.score;
        if (row.level > existing.highest_level) existing.highest_level = row.level;
      }
    }

    const sorted = Array.from(playerMap.values())
      .sort((a, b) => b.best_score - a.best_score)
      .slice(0, 20);

    setEntries(sorted);
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        Loading scores…
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/30 p-6 text-center">
        <Trophy className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No scores yet — be the first on the board!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card/30 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border/50 bg-card/50 px-4 py-3">
        <Trophy className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Leaderboard</h3>
        <span className="ml-auto text-[10px] text-muted-foreground uppercase tracking-wider">Campaign Total</span>
      </div>
      <div className="divide-y divide-border/30">
        {entries.map((entry, i) => (
          <div
            key={entry.player_name}
            className="flex items-center gap-3 px-4 py-2.5 text-sm"
          >
            <span className="w-6 text-center">
              {i < 3 ? RANK_ICONS[i] : (
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              )}
            </span>
            <span className="flex-1 truncate font-medium text-foreground">
              {entry.player_name}
            </span>
            <span className="text-xs text-muted-foreground">Lv{entry.highest_level}</span>
            <span className="font-mono text-sm font-semibold text-primary">
              {entry.best_score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLeaderboard;
