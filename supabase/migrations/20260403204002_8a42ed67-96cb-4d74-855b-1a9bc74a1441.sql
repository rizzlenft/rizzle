
CREATE TABLE public.game_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  game_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scores are publicly readable"
ON public.game_scores
FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit scores"
ON public.game_scores
FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_game_scores_leaderboard ON public.game_scores (game_id, level, score DESC);
