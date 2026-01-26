import { useState, useCallback, useEffect } from "react";

interface UseEpisodeNavigationOptions {
  videoIds: string[];
  isOpen: boolean;
}

export function useEpisodeNavigation({ videoIds, isOpen }: UseEpisodeNavigationOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset episode index when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : videoIds.length - 1));
  }, [videoIds.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < videoIds.length - 1 ? prev + 1 : 0));
  }, [videoIds.length]);

  const currentVideoId = videoIds[currentIndex] || videoIds[0];
  const episodeCount = videoIds.length;
  const hasMultipleEpisodes = episodeCount > 1;

  return {
    currentIndex,
    currentVideoId,
    episodeCount,
    hasMultipleEpisodes,
    goToPrevious,
    goToNext,
  };
}
