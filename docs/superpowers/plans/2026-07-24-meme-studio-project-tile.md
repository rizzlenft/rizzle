# Meme Studio Project Tile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a normal Projects card for the pump.fun Meme Studio at `https://memes.rizzle.io`, with a cropped banner, without changing MiniApps.

**Architecture:** Additive data change in the existing `projects` array plus one new WebP asset. Sort via `projectPriority`. Optional URL constant in `site-links.ts`. No routes, embeds, or MiniApps edits.

**Tech Stack:** Vite + React + Tailwind; Pillow for crop/WebP; existing `ProjectCard` / `ContentTabs` patterns.

**Spec:** `docs/superpowers/specs/2026-07-24-meme-studio-project-tile-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `src/assets/meme-studio.webp` | Cropped banner (~3:1, Pepe + wordmark) |
| `src/lib/site-links.ts` | `MEMES_RIZZLE_URL` constant |
| `src/components/ContentTabs.tsx` | Import image, project entry, sort priority |

---

### Task 1: Create cropped banner asset

**Files:**
- Create: `src/assets/meme-studio.webp`
- Source: `/Users/rizzle/.cursor/projects/Users-rizzle-Projects-rizzle/assets/memestudio-d75c1158-a915-4a93-83fa-49bc82b6fe57.png` (1024×682 JPEG despite `.png` name)

- [ ] **Step 1: Crop and export WebP with Pillow**

Crop a wide ~3:1 strip (full width, vertical band centered on the wordmark / Pepe), resize to ~1200×400, save WebP quality ~80.

```bash
python3 <<'PY'
from PIL import Image
src = "/Users/rizzle/.cursor/projects/Users-rizzle-Projects-rizzle/assets/memestudio-d75c1158-a915-4a93-83fa-49bc82b6fe57.png"
out = "src/assets/meme-studio.webp"
im = Image.open(src).convert("RGB")
w, h = im.size  # 1024, 682
crop_h = int(w / 3)  # ~341 for 3:1
# Bias upward so wordmark stays clear of the card bottom gradient
top = max(0, (h - crop_h) // 2 - 40)
bottom = min(h, top + crop_h)
top = max(0, bottom - crop_h)
cropped = im.crop((0, top, w, bottom))
banner = cropped.resize((1200, 400), Image.Resampling.LANCZOS)
banner.save(out, "WEBP", quality=80, method=6)
print("wrote", out, banner.size, "from y", top, bottom)
PY
```

Expected: `src/assets/meme-studio.webp` exists (~1200×400).

- [ ] **Step 2: Visually sanity-check the crop**

Open `src/assets/meme-studio.webp` (Read tool or Preview). Confirm “meme studio” wordmark and Pepe are visible and not cut off. If not, adjust `top` bias (±20–60px) and re-export.

- [ ] **Step 3: Commit asset**

```bash
git add src/assets/meme-studio.webp
git commit -m "Add Meme Studio project tile banner asset."
```

---

### Task 2: Add URL constant and project tile

**Files:**
- Modify: `src/lib/site-links.ts`
- Modify: `src/components/ContentTabs.tsx`

- [ ] **Step 1: Add `MEMES_RIZZLE_URL`**

In `src/lib/site-links.ts`, after `TRINITY_LABS_URL`:

```ts
export const MEMES_RIZZLE_URL = "https://memes.rizzle.io";
```

- [ ] **Step 2: Wire tile into `ContentTabs.tsx`**

1. Import `MEMES_RIZZLE_URL` from `@/lib/site-links`.
2. Import `memeStudioImg` from `@/assets/meme-studio.webp`.
3. Insert this object into the `projects` array (placement in the array does not control display order; priority does — put it after Trinity Labs entry for readability):

```ts
{
  name: "Meme Studio",
  description:
    "Create, customize, and deploy memes to pump.fun — a standalone meme launch platform by Rizzle.",
  emoji: "🎨",
  image: memeStudioImg,
  imagePosition: "center 45%",
  links: [
    { label: "Website", emoji: "🌐", href: MEMES_RIZZLE_URL },
  ],
},
```

4. Replace `projectPriority` with:

```ts
const projectPriority: Record<string, number> = {
  "The WIP Meetup": 1,
  nft42: 2,
  "Meme Studio": 3,
  "Trinity Labs": 4,
  OnChainChain: 5,
  Avastars: 6,
};
```

**Do not** edit the MiniApps entry or its Farcaster Meme Studio chip.

- [ ] **Step 3: Typecheck / build smoke**

```bash
npm run build
```

Expected: build succeeds; no missing-module errors for the new asset.

- [ ] **Step 4: Manual UI check**

Run `npm run dev` if needed. On Projects tab confirm order:

WIP → nft42 → Meme Studio → Trinity Labs → OnChainChain → Avastars → …

Confirm Website chip opens `https://memes.rizzle.io`, banner looks good, MiniApps unchanged.

If wordmark sits too low under the card fade, tweak `imagePosition` (e.g. `"center 35%"` or `"center 55%"`) and rebuild.

- [ ] **Step 5: Commit**

```bash
git add src/lib/site-links.ts src/components/ContentTabs.tsx
git commit -m "Add Meme Studio project tile linking to memes.rizzle.io."
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Dedicated tile → memes.rizzle.io | Task 2 |
| Description / emoji / single Website link | Task 2 |
| Normal card (`featured` omitted/false) | Task 2 |
| Sort: WIP → nft42 → Meme Studio → Trinity → OnChainChain → Avastars | Task 2 |
| Cropped banner WebP | Task 1 |
| MiniApps untouched | Explicit non-edit in Task 2 |
| Optional site-links constant | Task 2 Step 1 |
