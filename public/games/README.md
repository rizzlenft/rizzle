# Games on rizzle.io

## Web3 Whack-a-Mole

| What | Where |
|------|--------|
| **Source (edit here)** | [github.com/rizzlenft/Web3-Whack-a-Mole](https://github.com/rizzlenft/Web3-Whack-a-Mole) |
| **Local clone** | `~/Projects/Web3-Whack-a-Mole` |
| **Live embed** | `https://rizzle.io/games` → Web3 Whack-a-Mole |
| **Static files** | `public/games/whack-a-mole/` (built output — do not edit by hand) |

### Update the game on rizzle.io

```bash
# 1. Edit game source
cd ~/Projects/Web3-Whack-a-Mole
pnpm dev                    # http://localhost:5173

# 2. Build + copy into rizzle
cd ~/Projects/rizzle
npm run sync:whack-a-mole

# 3. Deploy
git add public/games/whack-a-mole
git commit -m "Update Whack-a-Mole build"
git push
```

Leaderboard scores go to Supabase (`game_id: whack-a-mole`) via `functions/api/leaderboard.js` on Cloudflare Pages — not Replit Postgres.

See `Web3-Whack-a-Mole/LOCAL.md` for full game dev setup.

## Rizzle Dash

Single-file game at `public/games/rizzle-dash.html`. Scores use the same Supabase `game_scores` table with `game_id: rizzle-dash`.
