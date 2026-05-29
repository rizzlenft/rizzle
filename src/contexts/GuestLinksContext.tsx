import { createContext, useContext, type ReactNode } from "react";
import { guestVideoLinks, type GuestVideoLinksMap } from "@/data/guestData";

/**
 * Carries the per-guest video-link map down the tree. Pages compose this
 * map from two sources:
 *
 *   1. The static `guestVideoLinks` constant in src/data/guestData.ts
 *      (the original Lovable-era list, manually maintained)
 *
 *   2. The `guest_appearances` table in Supabase, populated weekly by the
 *      extract-wip-guests Edge Function (Gemini reads YouTube descriptions
 *      and pulls guest names + video IDs)
 *
 * `mergeGuestData()` in useExtractedGuests combines them; we put the result
 * into this context so any descendent (notably GuestChip) can resolve a
 * guest name to the correct episode URL without re-doing the merge.
 *
 * Default value is just the static map, so any component that happens to
 * render outside a provider still works exactly like before.
 */
const GuestLinksContext = createContext<GuestVideoLinksMap>(guestVideoLinks);

export const GuestLinksProvider = ({
  links,
  children,
}: {
  links: GuestVideoLinksMap;
  children: ReactNode;
}) => <GuestLinksContext.Provider value={links}>{children}</GuestLinksContext.Provider>;

export const useGuestLinks = () => useContext(GuestLinksContext);
