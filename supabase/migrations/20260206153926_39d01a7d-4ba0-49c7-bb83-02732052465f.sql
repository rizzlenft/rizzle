-- Create table to store automatically extracted guest appearances
CREATE TABLE public.guest_appearances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  video_id TEXT NOT NULL,
  video_title TEXT,
  extracted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(guest_name, video_id)
);

-- Enable RLS (public read, admin write via edge functions)
ALTER TABLE public.guest_appearances ENABLE ROW LEVEL SECURITY;

-- Allow public read access for the guest archive
CREATE POLICY "Guest appearances are publicly readable"
ON public.guest_appearances
FOR SELECT
USING (true);

-- Create index for efficient lookups
CREATE INDEX idx_guest_appearances_video_id ON public.guest_appearances(video_id);
CREATE INDEX idx_guest_appearances_guest_name ON public.guest_appearances(guest_name);