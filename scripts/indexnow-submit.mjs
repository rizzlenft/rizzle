const HOST = "rizzle.io";
const KEY = "9c6b5e2f0d844d7b9cf1e90a94e7d3f1";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  "https://rizzle.io/",
  "https://rizzle.io/guests",
  "https://rizzle.io/games",
  "https://rizzle.io/games/rizzle-dash",
  "https://rizzle.io/work-with-rizzle",
  "https://rizzle.io/?tab=art",
];

async function submitIndexNow() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`IndexNow failed (${res.status}): ${text}`);
  }

  console.log(`[indexnow] submitted ${URLS.length} URLs (${res.status})`);
  if (text) console.log(`[indexnow] response: ${text}`);
}

submitIndexNow().catch((err) => {
  console.error("[indexnow] submit failed", err);
  process.exit(1);
});
