import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Optional dev dependency — same pattern as favicon generation.
let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error(
    "[og] 'sharp' is not installed. Run `npm i -D sharp` first, then `npm run og:generate`.",
  );
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "src", "assets");
const ogDir = path.join(root, "public", "og");

const WIDTH = 1200;
const HEIGHT = 630;
const BG = "#0a0a0a";
const ACCENT = "#ccff00";
const MUTED = "#a3a3a3";
const FONT = "system-ui, -apple-system, Segoe UI, sans-serif";

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function gridLines() {
  const vertical = Array.from(
    { length: 25 },
    (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${HEIGHT}"/>`,
  ).join("");
  const horizontal = Array.from(
    { length: 13 },
    (_, i) => `<line x1="0" y1="${i * 50}" x2="${WIDTH}" y2="${i * 50}"/>`,
  ).join("");
  return `<g opacity="0.08" stroke="${ACCENT}" stroke-width="1">${vertical}${horizontal}</g>`;
}

function backgroundSvg({ orbCx = "80%", orbCy = "30%" } = {}) {
  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="orb" cx="${orbCx}" cy="${orbCy}" r="45%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${BG}"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect width="100%" height="100%" fill="url(#orb)"/>
  ${gridLines()}
</svg>`);
}

function textOverlaySvg(lines) {
  const body = lines
    .map(({ x, y, text, fill, size, weight = "600" }) =>
      `<text x="${x}" y="${y}" fill="${fill}" font-family="${FONT}" font-size="${size}" font-weight="${weight}">${escapeXml(text)}</text>`,
    )
    .join("\n  ");

  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  ${body}
</svg>`);
}

async function loadSignature(width) {
  return sharp(path.join(assetsDir, "rizzle-sig-v2.png"))
    .resize({ width, withoutEnlargement: true })
    .negate({ alpha: false })
    .png()
    .toBuffer();
}

async function loadPfp(size) {
  return sharp(path.join(assetsDir, "rizzlepfp.webp"))
    .resize(size, size, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
}

async function framedPfp(size, { left, top }) {
  const pfp = await loadPfp(size);
  const glow = await sharp(pfp)
    .extend({
      top: 6,
      bottom: 6,
      left: 6,
      right: 6,
      background: { r: 204, g: 255, b: 0, alpha: 0.35 },
    })
    .png()
    .toBuffer();

  const framed = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 10, g: 10, b: 10, alpha: 1 },
    },
  })
    .composite([{ input: pfp, top: 0, left: 0 }])
    .png()
    .toBuffer();

  return [
    { input: glow, top: top - 6, left: left - 6 },
    { input: framed, top, left },
  ];
}

async function loadLogo(filename, maxWidth, maxHeight) {
  return sharp(path.join(assetsDir, filename))
    .resize(maxWidth, maxHeight, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
}

async function writeOg(filename, layers) {
  await mkdir(ogDir, { recursive: true });
  const outPath = path.join(ogDir, filename);

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: BG,
    },
  })
    .composite(layers)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);

  const stats = await sharp(outPath).metadata();
  console.log(`[og] wrote ${filename} (${stats.width}x${stats.height})`);
}

async function buildHomeOg() {
  const sig = await loadSignature(720);
  const pfpLeft = WIDTH - 72 - 280;
  const pfpTop = Math.round((HEIGHT - 280) / 2) - 10;

  await writeOg("og-home.jpg", [
    { input: backgroundSvg(), top: 0, left: 0 },
    {
      input: textOverlaySvg([
        {
          x: 72,
          y: 470,
          text: "Web3 & AI Strategist",
          fill: ACCENT,
          size: 42,
          weight: "700",
        },
        {
          x: 72,
          y: 520,
          text: "Launching progressive companies and projects",
          fill: MUTED,
          size: 24,
          weight: "500",
        },
      ]),
      top: 0,
      left: 0,
    },
    { input: sig, top: Math.round(HEIGHT * 0.18), left: 72 },
    ...(await framedPfp(280, { left: pfpLeft, top: pfpTop })),
  ]);
}

async function buildGuestsOg() {
  const sig = await loadSignature(520);
  const wip = await loadLogo("wip-logo.webp", 180, 100);
  const mars = await loadLogo("mattandrizz.webp", 220, 90);
  const tokensmart = await loadLogo("tokensmart.webp", 200, 100);

  const wipMeta = await sharp(wip).metadata();
  const marsMeta = await sharp(mars).metadata();
  const tokenMeta = await sharp(tokensmart).metadata();

  const logoY = HEIGHT - 120;
  const gap = 48;
  const totalLogoWidth =
    (wipMeta.width ?? 0) + (marsMeta.width ?? 0) + (tokenMeta.width ?? 0) + gap * 2;
  let logoX = Math.round((WIDTH - totalLogoWidth) / 2);

  const logoLayers = [
    { buf: wip, meta: wipMeta },
    { buf: mars, meta: marsMeta },
    { buf: tokensmart, meta: tokenMeta },
  ].map(({ buf, meta }) => {
    const layer = { input: buf, top: logoY, left: logoX };
    logoX += (meta.width ?? 0) + gap;
    return layer;
  });

  await writeOg("og-guests.jpg", [
    { input: backgroundSvg({ orbCx: "25%", orbCy: "70%" }), top: 0, left: 0 },
    {
      input: textOverlaySvg([
        {
          x: 72,
          y: 300,
          text: "Network",
          fill: ACCENT,
          size: 72,
          weight: "800",
        },
        {
          x: 72,
          y: 360,
          text: "Guests & collaborators across Rizzle's shows",
          fill: MUTED,
          size: 28,
          weight: "500",
        },
        {
          x: 72,
          y: 410,
          text: "The WIP Meetup · Matt & Rizz · TokenSmart",
          fill: "#d4d4d4",
          size: 24,
          weight: "500",
        },
      ]),
      top: 0,
      left: 0,
    },
    { input: sig, top: 56, left: 72 },
    ...logoLayers,
  ]);
}

async function buildBookOg() {
  const sig = await loadSignature(600);
  const pfpLeft = WIDTH - 72 - 240;
  const pfpTop = Math.round((HEIGHT - 240) / 2);

  await writeOg("og-book.jpg", [
    { input: backgroundSvg({ orbCx: "70%", orbCy: "65%" }), top: 0, left: 0 },
    {
      input: textOverlaySvg([
        {
          x: 72,
          y: 360,
          text: "Strategy Sprint",
          fill: ACCENT,
          size: 56,
          weight: "800",
        },
        {
          x: 72,
          y: 420,
          text: "45-minute Web3 strategy session with Rizzle",
          fill: MUTED,
          size: 26,
          weight: "500",
        },
        {
          x: 72,
          y: 470,
          text: "Launch planning · growth · partnerships",
          fill: "#d4d4d4",
          size: 22,
          weight: "500",
        },
      ]),
      top: 0,
      left: 0,
    },
    { input: sig, top: 72, left: 72 },
    ...(await framedPfp(240, { left: pfpLeft, top: pfpTop })),
  ]);
}

await buildHomeOg();
await buildGuestsOg();
await buildBookOg();
