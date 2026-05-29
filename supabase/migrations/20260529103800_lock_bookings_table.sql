-- Lock down public read access to the bookings table.
--
-- Background:
-- The bookings table contains client names, emails, and meeting links
-- for paid consultations. The original RLS policy created in migration
-- 20260311153525 made these rows readable by anyone holding the Supabase
-- anon (publishable) key — which ships in the client-side JS bundle and
-- is therefore effectively public. That exposed PII to any visitor who
-- ran `supabase.from('bookings').select('*')` in the browser console.
--
-- After this migration, the table can only be read with the service_role
-- key (i.e. server-side from Supabase Edge Functions, or via the Supabase
-- dashboard by the project owner). The React app never reads from this
-- table, so dropping the public SELECT policy is a no-op for the website.
--
-- Insert remains blocked (no INSERT policy exists for anon, per the
-- earlier migration which dropped it). The table is now properly locked.

DROP POLICY IF EXISTS "Bookings are publicly readable" ON public.bookings;
