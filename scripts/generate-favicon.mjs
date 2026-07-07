import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// sharp is intentionally NOT a project dependency: it ships native binaries that
// can break the production build (e.g. Cloudflare Pages) and is only needed to
// (re)generate favicons manually. Run `npm i -D sharp` locally before running
// `npm run favicon:generate`.
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
const sourcePath = path.join(publicDir, "favicon-source.png");

function resizeCover(input, size) {
  return sharp(input).resize(size, size, { fit: "cover", position: "centre" }).png();
}

const sizes = [
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  const out = path.join(publicDir, name);
  await resizeCover(sourcePath, size).toFile(out);
  console.log(`[favicon] wrote ${name} (${size}x${size})`);
}

const png32 = await resizeCover(sourcePath, 32).toBuffer();
await sharp(png32).toFile(path.join(publicDir, "favicon.ico"));
console.log("[favicon] wrote favicon.ico (from 32px PNG)");

const png64 = await resizeCover(sourcePath, 64).toBuffer();
const b64 = png64.toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" role="img" aria-label="Rizzle">
  <image width="64" height="64" href="data:image/png;base64,${b64}"/>
</svg>
`;
await writeFile(path.join(publicDir, "favicon.svg"), svg, "utf8");
console.log("[favicon] wrote favicon.svg (64x64 embedded PNG)");
