#!/usr/bin/env node
/**
 * Build Web3 Whack-a-Mole from source and copy into public/games/whack-a-mole/.
 *
 * Source repo (default): ../Web3-Whack-a-Mole (sibling of rizzle)
 * Override: WHACK_REPO=/path/to/Web3-Whack-a-Mole
 *
 * Workflow:
 *   1. Edit game in Web3-Whack-a-Mole (Cursor or GitHub)
 *   2. From rizzle repo: npm run sync:whack-a-mole
 *   3. Commit + push rizzle to deploy to rizzle.io
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rizzleRoot = path.resolve(__dirname, "..");
const whackRepo =
  process.env.WHACK_REPO ||
  path.resolve(rizzleRoot, "../Web3-Whack-a-Mole");
const buildOut = path.join(
  whackRepo,
  "artifacts/whack-a-mole/dist/public",
);
const destDir = path.join(rizzleRoot, "public/games/whack-a-mole");

if (!fs.existsSync(path.join(whackRepo, "package.json"))) {
  console.error(`Whack-a-Mole repo not found at: ${whackRepo}`);
  console.error("Clone it: git clone https://github.com/rizzlenft/Web3-Whack-a-Mole.git");
  console.error("Or set WHACK_REPO to your local path.");
  process.exit(1);
}

const pnpm = process.env.PNPM ?? "pnpm";
console.log(`Building from ${whackRepo} …`);
execSync(`${pnpm} build:game:rizzle`, {
  cwd: whackRepo,
  stdio: "inherit",
  env: { ...process.env, BASE_PATH: "/games/whack-a-mole/" },
});

if (!fs.existsSync(path.join(buildOut, "index.html"))) {
  console.error(`Build output missing at ${buildOut}`);
  process.exit(1);
}

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else fs.copyFileSync(from, to);
  }
}

rmrf(destDir);
copyTree(buildOut, destDir);
console.log(`Synced to ${destDir}`);
