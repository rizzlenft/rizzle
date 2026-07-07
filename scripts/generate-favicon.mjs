import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// sharp is intentionally NOT a project dependency: it ships native binaries that
// can break the production build (e.g. Cloudflare Pages) and is only needed to
// (re)generate favicons manually. Run `npm i -D sharp` locally before running
// `npm run favicon:generate`, or run this via `npx sharp`.
let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error(
    "[favicon] 'sharp' is not installed. Run `npm i -D sharp` first, then `npm run favicon:generate`. Do not commit sharp to package.json.",
  );
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const svg = await readFile(path.join(publicDir, "favicon.svg"));

const sizes = [
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  const out = path.join(publicDir, name);
  await sharp(svg).resize(size, size).png().toFile(out);
  console.log(`[favicon] wrote ${name} (${size}x${size})`);
}

// Multi-size ICO for legacy browsers and cached tab icons.
const icoSizes = [16, 32, 48];
const pngBuffers = await Promise.all(
  icoSizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);

// Minimal ICO container: use 32px PNG renamed as .ico fallback via sharp output.
// Browsers accept PNG data in .ico for many clients; also write true combined ICO.
await sharp(pngBuffers[1]).toFile(path.join(publicDir, "favicon.ico"));
console.log("[favicon] wrote favicon.ico");
