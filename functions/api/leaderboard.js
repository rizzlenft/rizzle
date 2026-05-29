/**
 * Whack-a-Mole leaderboard API — replaces the Replit backend.
 * Stores scores in the existing Supabase game_scores table (game_id: whack-a-mole).
 *
 * Env (Cloudflare Pages → Settings → Environment variables):
 *   VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
 */

const GAME_ID = "whack-a-mole";
const MAX_NAME_LEN = 20;
const MAX_SCORE = 99_999;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function supabaseConfig(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function fetchTopScores(env, limit) {
  const cfg = supabaseConfig(env);
  if (!cfg) return null;

  const params = new URLSearchParams({
    select: "id,player_name,score",
    game_id: `eq.${GAME_ID}`,
    order: "score.desc",
    limit: String(limit),
  });

  const res = await fetch(`${cfg.url}/rest/v1/game_scores?${params}`, {
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
    },
  });

  if (!res.ok) return null;
  const rows = await res.json();
  return rows.map((row) => ({
    id: row.id,
    playerName: row.player_name,
    score: row.score,
  }));
}

async function insertScore(env, playerName, score) {
  const cfg = supabaseConfig(env);
  if (!cfg) return false;

  const res = await fetch(`${cfg.url}/rest/v1/game_scores`, {
    method: "POST",
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      player_name: playerName,
      game_id: GAME_ID,
      level: 1,
      score,
    }),
  });

  return res.ok;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestGet(context) {
  const limitRaw = new URL(context.request.url).searchParams.get("limit");
  const limit = Math.min(Math.max(parseInt(limitRaw ?? "10", 10) || 10, 1), 50);

  const scores = await fetchTopScores(context.env, limit);
  if (!scores) return json({ error: "Leaderboard unavailable" }, 503);
  return json(scores);
}

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const playerName = typeof body.playerName === "string" ? body.playerName.trim() : "";
  const score = body.score;

  if (!playerName || playerName.length > MAX_NAME_LEN) {
    return json({ error: "Invalid player name" }, 400);
  }
  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    return json({ error: "Invalid score" }, 400);
  }

  const ok = await insertScore(context.env, playerName, score);
  if (!ok) return json({ error: "Failed to save score" }, 503);
  return json({ ok: true }, 201);
}
