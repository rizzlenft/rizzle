import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GuestAppearance {
  guest_name: string;
  video_id: string;
  video_title: string | null;
  confirmed: boolean;
}

export function useExtractedGuests() {
  return useQuery({
    queryKey: ["extracted-guests"],
    queryFn: async (): Promise<GuestAppearance[]> => {
      const { data, error } = await supabase
        .from("guest_appearances")
        .select("guest_name, video_id, video_title, confirmed")
        .eq("confirmed", true)
        .order("extracted_at", { ascending: false });

      if (error) {
        console.error("Error fetching extracted guests:", error);
        return [];
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Merges extracted guest appearances with the static guestVideoLinks.
 * Returns a combined record where database entries take precedence for new episodes.
 */
export function mergeGuestData(
  staticData: Record<string, string | string[]>,
  extractedGuests: GuestAppearance[]
): Record<string, string | string[]> {
  const merged = { ...staticData };

  // Group extracted guests by name
  const extractedByName = new Map<string, string[]>();
  for (const appearance of extractedGuests) {
    const existing = extractedByName.get(appearance.guest_name) || [];
    if (!existing.includes(appearance.video_id)) {
      existing.push(appearance.video_id);
    }
    extractedByName.set(appearance.guest_name, existing);
  }

  // Merge into static data
  for (const [guestName, videoIds] of extractedByName) {
    const existingEntry = merged[guestName];
    
    if (!existingEntry) {
      // New guest not in static data
      merged[guestName] = videoIds.length === 1 ? videoIds[0] : videoIds;
    } else {
      // Merge with existing entries
      const existingIds = Array.isArray(existingEntry) ? existingEntry : [existingEntry];
      const allIds = [...new Set([...videoIds, ...existingIds])];
      merged[guestName] = allIds.length === 1 ? allIds[0] : allIds;
    }
  }

  return merged;
}
