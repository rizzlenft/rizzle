const MAX_NAME_LEN = 80;
const MAX_EMAIL_LEN = 160;
const MAX_MESSAGE_LEN = 4000;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const rateBuckets = new Map();

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function normalizeIntent(rawIntent) {
  const intent = typeof rawIntent === "string" ? rawIntent.trim().toLowerCase() : "";
  if (intent === "hire" || intent === "partner" || intent === "invest") return intent;
  return "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (rateBuckets.get(ip) || []).filter((ts) => now - ts < WINDOW_MS);
  if (recent.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    rateBuckets.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(ip, recent);
  return false;
}

async function verifyTurnstile(secret, token, remoteip) {
  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip,
  });

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.success;
}

async function sendViaResend(env, payload) {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  const from = env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return {
      ok: false,
      status: 503,
      error:
        "Contact endpoint not configured. Missing RESEND_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `[rizzle.io] ${payload.intent.toUpperCase()} inquiry from ${payload.name}`,
      text: payload.text,
    }),
  });

  if (!res.ok) {
    const reason = await res.text();
    return { ok: false, status: 502, error: `Email provider failed: ${reason}` };
  }
  return { ok: true };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";
  if (isRateLimited(ip)) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }

  const intent = normalizeIntent(body.intent);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken : "";

  if (website) {
    return json({ ok: true }, 200);
  }
  if (!intent) return json({ error: "Please select a valid inquiry type." }, 400);
  if (!name || name.length > MAX_NAME_LEN) return json({ error: "Invalid name." }, 400);
  if (!email || email.length > MAX_EMAIL_LEN || !isValidEmail(email)) {
    return json({ error: "Invalid email address." }, 400);
  }
  if (!message || message.length > MAX_MESSAGE_LEN) {
    return json({ error: "Message is required and must be under 4000 characters." }, 400);
  }

  if (context.env.TURNSTILE_SECRET_KEY) {
    const validTurnstile = await verifyTurnstile(context.env.TURNSTILE_SECRET_KEY, turnstileToken, ip);
    if (!validTurnstile) return json({ error: "Security check failed. Please try again." }, 400);
  }

  const attribution = body.attribution && typeof body.attribution === "object" ? body.attribution : {};
  const userAgent = context.request.headers.get("User-Agent") || "unknown";
  const text = [
    `Intent: ${intent}`,
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
    "",
    "Attribution:",
    JSON.stringify(attribution, null, 2),
    "",
    `IP: ${ip}`,
    `User-Agent: ${userAgent}`,
    `Sent at: ${new Date().toISOString()}`,
  ].join("\n");

  const sent = await sendViaResend(context.env, { intent, name, email, text });
  if (!sent.ok) {
    console.error("[contact] send failed", sent.error);
    return json({ error: "Contact service unavailable. Please try again shortly." }, sent.status || 503);
  }

  return json({ ok: true }, 201);
}
