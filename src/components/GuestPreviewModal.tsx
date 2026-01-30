import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

interface GuestPreviewModalProps {
  guest: string;
  thumbnailUrl: string;
  currentIndex: number;
  episodeCount: number;
  hasMultipleEpisodes: boolean;
  currentVideoId: string;
  isMobile: boolean;
  isSpotifyOnly?: boolean;
  onClose: () => void;
  onWatchNow: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onGoToIndex: (index: number) => void;
}

const GuestPreviewModal = ({
  guest,
  thumbnailUrl,
  currentIndex,
  episodeCount,
  hasMultipleEpisodes,
  currentVideoId,
  isMobile,
  isSpotifyOnly = false,
  onClose,
  onWatchNow,
  onPrevious,
  onNext,
  onGoToIndex,
}: GuestPreviewModalProps) => {
  const { handleTouchStart, handleTouchEnd } = useSwipeGesture({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    enabled: hasMultipleEpisodes,
  });

  // Thumbnail quality fallback - many YouTube videos don't have maxresdefault
  // Only used for YouTube guests, not Spotify-only guests
  const [thumbFallbackStep, setThumbFallbackStep] = useState(0);

  // Reset fallback when video changes
  useEffect(() => {
    setThumbFallbackStep(0);
  }, [currentVideoId]);

  // Build thumbnail URL with fallback quality levels
  // For Spotify-only guests, always use the provided thumbnailUrl (TokenSmart logo)
  const resolvedThumbnailUrl = useMemo(() => {
    if (isSpotifyOnly || !currentVideoId) return thumbnailUrl;
    const base = `https://i.ytimg.com/vi/${currentVideoId}`;
    if (thumbFallbackStep === 0) return `${base}/maxresdefault.jpg`;
    if (thumbFallbackStep === 1) return `${base}/hqdefault.jpg`;
    return `${base}/mqdefault.jpg`;
  }, [currentVideoId, thumbFallbackStep, thumbnailUrl, isSpotifyOnly]);

  const handleThumbnailError = () => {
    // Don't fallback for Spotify-only guests
    if (isSpotifyOnly) return;
    if (thumbFallbackStep < 2) {
      setThumbFallbackStep((prev) => prev + 1);
    }
  };
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasMultipleEpisodes) {
        e.preventDefault();
        onPrevious();
      } else if (e.key === "ArrowRight" && hasMultipleEpisodes) {
        e.preventDefault();
        onNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleEpisodes, onPrevious, onNext, onClose]);

  const handleArrowClick = (e: React.MouseEvent, direction: "prev" | "next") => {
    e.stopPropagation();
    if (direction === "prev") {
      onPrevious();
    } else {
      onNext();
    }
  };

  // Calculate preview style based on viewport
  const getPreviewStyle = (): React.CSSProperties => {
    if (typeof window === "undefined") {
      return { position: "fixed", zIndex: 1000 };
    }

    const viewportWidth = window.innerWidth;
    const isCurrentlyMobile = viewportWidth < 768;

    if (isCurrentlyMobile) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: Math.min(340, viewportWidth - 32),
        maxWidth: "calc(100vw - 32px)",
        zIndex: 1000,
      };
    }

    return {
      position: "fixed",
      top: 24,
      right: 24,
      width: Math.min(560, Math.max(320, viewportWidth * 0.4)),
      zIndex: 1000,
      pointerEvents: "none",
    };
  };

  return createPortal(
    <>
      {/* Backdrop for mobile */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[999]"
          onClick={onClose}
        />
      )}
      {/*
        IMPORTANT:
        Keep the centering translate() on a non-animated wrapper.
        Framer Motion animates via `transform` and would otherwise overwrite
        `translate(-50%, -50%)`, causing the modal to be off-center on mobile.
      */}
      <div
        data-mobile-preview
        style={getPreviewStyle()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30 bg-card">
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentVideoId}-${thumbFallbackStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              src={resolvedThumbnailUrl}
              alt={`${guest} episode ${currentIndex + 1} thumbnail`}
              className={isMobile ? "w-full h-auto cursor-pointer select-none" : "w-full h-auto"}
              loading="lazy"
              onClick={isMobile ? onWatchNow : undefined}
              draggable={false}
              onError={handleThumbnailError}
            />
          </AnimatePresence>

          {/* Episode navigation arrows */}
          {hasMultipleEpisodes && (
            <>
              <button
                onClick={(e) => handleArrowClick(e, "prev")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                aria-label="Previous episode"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => handleArrowClick(e, "next")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                aria-label="Next episode"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
            <div className="inline-flex w-fit max-w-full flex-col rounded-md bg-black/60 px-2 py-1">
              <p className="text-white text-sm md:text-base font-semibold truncate">
                {guest}
              </p>
              {hasMultipleEpisodes && (
                <p className="text-white/80 text-xs md:text-sm leading-tight">
                  Episode {currentIndex + 1} of {episodeCount}
                  {isMobile && <span className="ml-1 opacity-70">• Swipe to browse</span>}
                </p>
              )}
            </div>

            {/* Episode dot indicators */}
            {hasMultipleEpisodes && (
              <div className="flex items-center justify-center gap-1.5">
                {Array.from({ length: episodeCount }).map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onGoToIndex(index);
                    }}
                    initial={false}
                    animate={{
                      scale: index === currentIndex ? 1.4 : 1,
                      opacity: index === currentIndex ? 1 : 0.5,
                      backgroundColor: index === currentIndex 
                        ? "hsl(var(--primary))" 
                        : "rgba(255, 255, 255, 0.5)",
                    }}
                    whileHover={{ 
                      scale: index === currentIndex ? 1.4 : 1.2,
                      opacity: 0.9,
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                    }}
                    className="w-2 h-2 rounded-full"
                    aria-label={`Go to episode ${index + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Watch Now button for mobile */}
            {isMobile && (
              <button
                onClick={onWatchNow}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm shadow-lg hover:bg-primary/90 transition-colors"
              >
                <Play className="w-4 h-4" fill="currentColor" />
                Watch Now
              </button>
            )}
          </div>

          {/* Play icon overlay (desktop only) */}
          {!isMobile && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center shadow-md">
                <Play className="w-4 h-4 text-primary-foreground ml-0.5" fill="currentColor" />
              </div>
            </div>
          )}
          </div>
        </motion.div>
      </div>
    </>,
    document.body
  );
};

export default GuestPreviewModal;
