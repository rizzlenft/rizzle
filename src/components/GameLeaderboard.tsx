import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

interface ScoreEntry {
  id: string;
  player_name: string;
  level: number;
  score: number;
  created_at: string;
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
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    const { data } = await supabase
      .from("game_scores")
      .select("id, player_name, level, score, created_at")
      .eq("game_id", gameId)
      .order("score", { ascending: false })
      .limit(20);
    setScores((data as ScoreEntry[]) || []);
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

  if (scores.length === 0) {
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
      </div>
      <div className="divide-y divide-border/30">
        {scores.map((s, i) => (
          <div
            key={s.id}
            className="flex items-center gap-3 px-4 py-2.5 text-sm"
          >
            <span className="w-6 text-center">
              {i < 3 ? RANK_ICONS[i] : (
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              )}
            </span>
            <span className="flex-1 truncate font-medium text-foreground">
              {s.player_name}
            </span>
            <span className="text-xs text-muted-foreground">Lv{s.level}</span>
            <span className="font-mono text-sm font-semibold text-primary">
              {s.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLeaderboard;
