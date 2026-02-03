-- Create a cache table for the WIP video
CREATE TABLE public.wip_video_cache (
  id TEXT PRIMARY KEY DEFAULT 'latest',
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  published_at TEXT,
  cached_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Allow public read access (no auth needed for this cache)
ALTER TABLE public.wip_video_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wip video cache"
ON public.wip_video_cache
FOR SELECT
USING (true);