import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  player_name: string;
  campaign_total: number;
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
    const { data } = await supabase
      .from("game_scores")
      .select("player_name, level, score")
      .eq("game_id", gameId)
      .order("score", { ascending: false })
      .limit(500);

    if (!data) {
      setEntries([]);
      setLoading(false);
      return;
    }

    // For each player, find their best score on each level, then sum those
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
      <div className="border-b border-border/50 bg-card/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Leaderboard</h3>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
          Your <strong>Campaign Total</strong> = the sum of your <em>best</em> score on each level. Only your highest score per level counts — replay levels to beat your personal best and climb the board!
        </p>
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
              {entry.campaign_total.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLeaderboard;
