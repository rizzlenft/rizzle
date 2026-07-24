# Meme Studio project tile (pump.fun platform)

**Date:** 2026-07-24  
**Status:** Approved for implementation planning  
**Site:** rizzle.io (`/Users/rizzle/Projects/rizzle`)

## Goal

Surface the standalone Meme Studio platform at [https://memes.rizzle.io](https://memes.rizzle.io) on the portfolio site as a normal project tile, without embedding the app or changing unrelated projects.

## Context

- Portfolio project cards live in `src/components/ContentTabs.tsx` and render via `src/components/ProjectCard.tsx`.
- Almost all project links are external (`target="_blank"`).
- Banner slot is fixed `h-40` with `object-cover` and optional `imagePosition`.
- **Two different products share a similar name:**
  - Farcaster **MiniApps** chip “Meme Studio” → Farcaster miniapp (leave unchanged).
  - New tile **Meme Studio** → `https://memes.rizzle.io` (pump.fun deploy platform).

## Approach

Additive tile only: one new asset + one new `projects` entry + sort-priority update. No new routes, iframes, proxies, or MiniApps edits.

## Tile content

| Field | Value |
|--------|--------|
| `name` | `Meme Studio` |
| `emoji` | `🎨` |
| `description` | `Create, customize, and deploy memes to pump.fun — a standalone meme launch platform by Rizzle.` |
| `featured` | `false` |
| `image` | New webp under `src/assets/` (e.g. `meme-studio.webp`) |
| `links` | Single chip: Website → `https://memes.rizzle.io` |

Optional: add `MEMES_RIZZLE_URL` (or equivalent) in `src/lib/site-links.ts` and use it from the tile — nice-to-have, not required.

## Sort order

Update `projectPriority` in `ProjectsContent` so the grid order is:

1. The WIP Meetup  
2. nft42  
3. **Meme Studio**  
4. Trinity Labs  
5. OnChainChain  
6. Avastars  
7. Remaining projects (unchanged relative order among unranked)

## Banner asset

- **Source:** Provided lab illustration (saved under Cursor project assets; `1024×682` PNG).
- **Treatment:** Pre-crop to a wide ~3:1 strip focused on Pepe (left) + “meme studio” wordmark (center). Avoid relying on the full busy lab so the `h-40` crop does not hide the title.
- **Export:** WebP in `src/assets/`, size/quality in line with existing project banners.
- **Tuning:** Set `imagePosition` if the card gradient/crop still clips the logo after import.

## Explicit non-goals

- Do not change the MiniApps tile or its Meme Studio Farcaster chip.
- Do not add TrustStack / highlights entries unless requested later.
- Do not iframe, proxy, or route `memes.rizzle.io` through rizzle.io.
- Do not merge the Meme Studio app into this repo.

## Files expected to change

- `src/components/ContentTabs.tsx` — project entry + priority map
- `src/assets/meme-studio.webp` (or similar) — new banner
- Optionally `src/lib/site-links.ts` — URL constant

## Success criteria

- New Meme Studio card appears in Projects with banner and one external Website link.
- Sort order matches the list above.
- MiniApps behavior and links are identical before/after.
- No routing or build regressions on the portfolio site.
