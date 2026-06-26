#!/usr/bin/env bash
set -euo pipefail

PROJECT="/Users/rizzle/Projects/rizzle"
LOG="/tmp/clawpatch-run.log"
exec > >(tee -a "$LOG") 2>&1

echo "=== clawpatch run started $(date) ==="

resolve_clawpatch() {
  if command -v clawpatch >/dev/null 2>&1; then
    echo "clawpatch"
    return
  fi
  if npx --yes clawpatch --version >/dev/null 2>&1; then
    echo "npx --yes clawpatch"
    return
  fi
  if [ ! -d /tmp/clawpatch ]; then
    git clone --depth 1 https://github.com/openclaw/clawpatch.git /tmp/clawpatch
  fi
  cd /tmp/clawpatch
  if [ ! -d node_modules ]; then
    (pnpm install || npm install)
  fi
  if [ ! -f dist/cli.js ]; then
    (pnpm run build || npm run build)
  fi
  echo "node /tmp/clawpatch/dist/cli.js"
}

CLAW=$(resolve_clawpatch)
echo "Using: $CLAW"

cd "$PROJECT"
echo "Git status before:"
git status -sb

$CLAW doctor || true

PROVIDER="cursor"
if ! $CLAW doctor 2>&1 | grep -qi "cursor.*ok\|cursor.*available\|cursor.*ready"; then
  PROVIDER="codex"
fi
echo "Provider: $PROVIDER"

$CLAW init 2>/dev/null || true
$CLAW map
$CLAW status
$CLAW review --provider "$PROVIDER" --jobs 3 || $CLAW review --provider codex --jobs 3
$CLAW report -o clawpatch-report.md

FIXES=0
while [ "$FIXES" -lt 15 ]; do
  NEXT_OUT=$($CLAW next 2>/dev/null || true)
  ID=$(echo "$NEXT_OUT" | grep -Eo '[a-f0-9-]{36}|[a-zA-Z0-9_-]{8,}' | head -1 || true)
  if [ -z "$ID" ]; then
    echo "No more findings."
    break
  fi
  echo "=== Fixing finding $ID ==="
  $CLAW show --finding "$ID" || break
  $CLAW fix --finding "$ID" --provider "$PROVIDER" || $CLAW fix --finding "$ID" --provider codex || break
  npm run build
  npm run test
  npm run lint || true
  $CLAW revalidate --finding "$ID" || true
  FIXES=$((FIXES + 1))
done

echo "=== Done. Fixes applied: $FIXES ==="
$CLAW report -o clawpatch-report-final.md
git status -sb
git diff --stat
