# rizzle.io

Personal site for [Rizzle](https://rizzle.io) — Web3 founder, builder, and host of The WIP Meetup.

## Stack

- **Frontend:** Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- **Backend:** Supabase (leaderboard, guest cache, WIP video cache)
- **Hosting:** Cloudflare Pages (`npm run build` → `dist/`)
- **Analytics:** PostHog (optional, production only)

## Local development

```sh
# Requires Node.js 20+ (Volta recommended)
npm install
npm run dev        # http://localhost:8080
npm run build      # production bundle → dist/
npm run preview    # serve dist/ locally
```

Copy `.env.example` to `.env` and fill in your Supabase project URL + anon key.

## Supabase

Project: `nzenbrrraoxmtiugbwob` (rizzlenft-owned).

**Edge Functions** (deploy with Supabase CLI):

- `get-latest-wip-video` — caches latest WIP Meetup YouTube video (cron every 6h)
- `extract-wip-guests` — extracts guest names from episode descriptions via Gemini (cron weekly)

**Secrets required on the project:**

- `GEMINI_API_KEY` — Google AI Studio (free tier)
- `EXTRACT_WIP_GUESTS_CRON_SECRET` — shared secret; cron job sends it in `x-cron-secret`

```sh
export PATH="$HOME/.local/share/supabase:$PATH"
supabase link --project-ref nzenbrrraoxmtiugbwob
supabase functions deploy get-latest-wip-video extract-wip-guests --no-verify-jwt
```

## Deploying

Pushes to `main` auto-deploy via Cloudflare Pages. PRs get preview URLs.

**Environment variables:** Vite bakes `VITE_*` vars in at build time. This repo commits `.env` with the Supabase URL + anon key (publishable only). To rotate keys without a code change, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Cloudflare Pages dashboard instead and remove them from `.env`.

SPA routing is handled by `public/_redirects` (`/* /index.html 200`).

## Project structure

```
src/pages/          Route components (Index, Games, GuestArchive, …)
src/components/     UI building blocks
src/hooks/          Data fetching (WIP video, guests, SEO)
src/data/           Static guest directory
public/games/       Rizzle Dash (self-contained HTML game)
supabase/functions/ Edge Functions
```
