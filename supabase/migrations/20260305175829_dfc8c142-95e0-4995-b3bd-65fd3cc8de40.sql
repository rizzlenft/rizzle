
CREATE TABLE public.twitter_tweets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tweet_text text NOT NULL,
  tweet_url text,
  author_username text NOT NULL DEFAULT 'NFTland',
  published_at timestamptz,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  hash text
);

ALTER TABLE public.twitter_tweets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Twitter tweets are publicly readable" ON public.twitter_tweets
  FOR SELECT USING (true);

CREATE UNIQUE INDEX twitter_tweets_hash_unique ON public.twitter_tweets (hash) WHERE hash IS NOT NULL;
