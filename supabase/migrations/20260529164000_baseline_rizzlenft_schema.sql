-- Baseline schema for the rizzlenft-owned Supabase project (nzenbrrraoxmtiugbwob).
-- The live project was provisioned manually on 2026-05-29; this file documents
-- the current intended shape for fresh installs / disaster recovery.
--
-- Tables intentionally omitted: bookings, twitter_tweets, farcaster_casts
-- (dead features removed in the May 2026 independence migration).

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.game_scores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  game_id     text NOT NULL,
  level       integer NOT NULL DEFAULT 1,
  score       integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.wip_video_cache (
  id            text PRIMARY KEY DEFAULT 'latest',
  video_id      text NOT NULL,
  title         text NOT NULL,
  thumbnail_url text NOT NULL,
  video_url     text NOT NULL,
  published_at  text,
  cached_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.wip_video_cache ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.guest_appearances (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name   text NOT NULL,
  video_id     text NOT NULL,
  video_title  text,
  extracted_at timestamptz NOT NULL DEFAULT now(),
  confirmed    boolean NOT NULL DEFAULT false,
  UNIQUE(guest_name, video_id)
);
ALTER TABLE public.guest_appearances ENABLE ROW LEVEL SECURITY;

-- Policies (idempotent)
DO $$ BEGIN
  CREATE POLICY "Scores are publicly readable" ON public.game_scores FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Anyone can submit scores" ON public.game_scores FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Anyone can read wip video cache" ON public.wip_video_cache FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Guest appearances are publicly readable" ON public.guest_appearances FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_game_scores_leaderboard ON public.game_scores (game_id, level, score DESC);
CREATE INDEX IF NOT EXISTS idx_guest_appearances_video_id ON public.guest_appearances(video_id);
CREATE INDEX IF NOT EXISTS idx_guest_appearances_guest_name ON public.guest_appearances(guest_name);
