
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  meeting_link text DEFAULT 'https://meet.google.com/placeholder',
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(booking_date, start_time)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings are publicly readable" ON public.bookings
  FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can insert bookings" ON public.bookings
  FOR INSERT TO public WITH CHECK (true);
