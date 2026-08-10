import { mkdir, writeFile } from "node:fs/promises";
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

async function buildHomeOg() {
  const sigPath = path.join(assetsDir, "rizzle-sig-v2.png");
  const pfpPath = path.join(assetsDir, "rizzlepfp.webp");

  const sig = await sharp(sigPath)
    .resize({ width: 720, withoutEnlargement: true })
    .negate({ alpha: false })
    .png()
    .toBuffer();

  const pfp = await sharp(pfpPath)
    .resize(280, 280, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  const taglineSvg = Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="orb" cx="80%" cy="30%" r="45%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${BG}"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect width="100%" height="100%" fill="url(#orb)"/>
  <g opacity="0.08" stroke="${ACCENT}" stroke-width="1">
    ${Array.from({ length: 25 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${HEIGHT}"/>`).join("")}
    ${Array.from({ length: 13 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${WIDTH}" y2="${i * 50}"/>`).join("")}
  </g>
  <text x="72" y="470" fill="${ACCENT}" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="42" font-weight="700" letter-spacing="0.02em">
    Web3 &amp; AI Strategist
  </text>
  <text x="72" y="520" fill="#a3a3a3" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="24" font-weight="500">
    Launching progressive companies and projects
  </text>
</svg>`);

  const base = sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: BG,
    },
  });

  const sigMeta = await sharp(sig).metadata();
  const sigTop = Math.round(HEIGHT * 0.18);
  const sigLeft = 72;
  const pfpLeft = WIDTH - 72 - 280;
  const pfpTop = Math.round((HEIGHT - 280) / 2) - 10;

  await mkdir(ogDir, { recursive: true });

  const outPath = path.join(ogDir, "og-home.jpg");
  await base
    .composite([
      { input: taglineSvg, top: 0, left: 0 },
      { input: sig, top: sigTop, left: sigLeft },
      {
        input: await sharp(pfp)
          .extend({
            top: 6,
            bottom: 6,
            left: 6,
            right: 6,
            background: { r: 204, g: 255, b: 0, alpha: 0.35 },
          })
          .png()
          .toBuffer(),
        top: pfpTop - 6,
        left: pfpLeft - 6,
      },
      {
        input: await sharp({
          create: {
            width: 280,
            height: 280,
            channels: 4,
            background: { r: 10, g: 10, b: 10, alpha: 1 },
          },
        })
          .composite([{ input: pfp, top: 0, left: 0 }])
          .png()
          .toBuffer(),
        top: pfpTop,
        left: pfpLeft,
      },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);

  const stats = await sharp(outPath).metadata();
  console.log(
    `[og] wrote og-home.jpg (${stats.width}x${stats.height}) — signature + PFP, no autogen template`,
  );
}

await buildHomeOg();
