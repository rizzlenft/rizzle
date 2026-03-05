CREATE TABLE public.farcaster_casts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cast_text text NOT NULL,
  cast_url text,
  author_username text NOT NULL DEFAULT 'rizzle',
  published_at timestamp with time zone,
  scraped_at timestamp with time zone NOT NULL DEFAULT now(),
  hash text UNIQUE
);

ALTER TABLE public.farcaster_casts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farcaster casts are publicly readable"
  ON public.farcaster_casts
  FOR SELECT
  TO anon, authenticated
  USING (true);