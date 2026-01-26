import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Copy, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  getGuestVideoUrl, 
  hasDirectLink, 
  getGuestEpisodeCount, 
  getAllGuestVideoIds,
  getYouTubeThumbnail 
} from "@/data/guestData";

interface GuestChipProps {
  guest: string;
}

const GuestChip = ({ guest }: GuestChipProps) => {
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const episodeCount = getGuestEpisodeCount(guest);
  const videoIds = getAllGuestVideoIds(guest);
  
  // Swipe gesture state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  
  // Get current episode's video ID and URL
  const currentVideoId = videoIds[currentEpisodeIndex] || videoIds[0];
  const currentUrl = currentVideoId ? `https://youtube.com/watch?v=${currentVideoId}` : getGuestVideoUrl(guest);
  const currentThumbnailUrl = currentVideoId ? getYouTubeThumbnail(currentVideoId, 'maxres') : null;
  
  // For chip click, use first episode URL
  const url = getGuestVideoUrl(guest);

  const previewWidth = useMemo(() => {
    if (typeof window === "undefined") return 500;
    if (isMobile) return Math.min(340, window.innerWidth - 32);
    return Math.min(560, Math.max(320, window.innerWidth * 0.4));
  }, [isMobile]);

  const showPreview = isMobile ? showMobilePreview : isHovering;

  // Reset episode index when preview closes
  useEffect(() => {
    if (!showPreview) {
      setCurrentEpisodeIndex(0);
    }
  }, [showPreview]);

  const openVideo = (videoUrl?: string) => {
    const targetUrl = videoUrl || currentUrl;
    const win = window.open(targetUrl, "_blank", "noopener,noreferrer");
    if (!win) window.location.assign(targetUrl);
  };

  const goToPreviousEpisode = () => {
    setCurrentEpisodeIndex((prev) => (prev > 0 ? prev - 1 : videoIds.length - 1));
  };

  const goToNextEpisode = () => {
    setCurrentEpisodeIndex((prev) => (prev < videoIds.length - 1 ? prev + 1 : 0));
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || episodeCount <= 1) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only trigger swipe if horizontal movement is greater than vertical (prevents accidental swipes during scroll)
    const minSwipeDistance = 50;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        goToPreviousEpisode();
      } else {
        // Swipe left - go to next
        goToNextEpisode();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleArrowClick = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.stopPropagation();
    if (direction === 'prev') {
      goToPreviousEpisode();
    } else {
      goToNextEpisode();
    }
  };

  useEffect(() => {
    if (!showPreview || !currentThumbnailUrl) {
      setPreviewStyle(null);
      return;
    }

    const margin = isMobile ? 16 : 24;

    if (isMobile) {
      // Center on mobile with proper viewport handling
      setPreviewStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `min(${previewWidth}px, calc(100vw - 32px))`,
        maxWidth: "90vw",
        zIndex: 1000,
      });
    } else {
      // Top-right on desktop
      setPreviewStyle({
        position: "fixed",
        top: margin,
        right: margin,
        width: previewWidth,
        zIndex: 1000,
        pointerEvents: "none",
      });
    }
  }, [showPreview, currentThumbnailUrl, previewWidth, isMobile]);

  // Close mobile preview when clicking outside
  useEffect(() => {
    if (!showMobilePreview || !isMobile) return;
    
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-mobile-preview]') && !target.closest('[data-guest-chip]')) {
        setShowMobilePreview(false);
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobilePreview, isMobile]);

  const handleChipClick = () => {
    if (isMobile && currentThumbnailUrl) {
      // On mobile, show preview first
      setShowMobilePreview(true);
    } else {
      // On desktop, open directly
      openVideo();
    }
  };

  const handleWatchNow = () => {
    // Open first to keep the action firmly in the user-gesture stack.
    openVideo();
    setShowMobilePreview(false);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: `YouTube link for ${guest} copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <motion.div
        ref={chipRef}
        data-guest-chip
        whileHover={{ scale: 1.05 }}
        className={`group relative inline-flex items-center gap-1.5 rounded-full border bg-card/30 px-3 py-1.5 text-sm text-foreground hover:bg-card/60 transition-all cursor-pointer ${
          hasDirectLink(guest) 
            ? "border-primary/30 hover:border-primary" 
            : "border-border/50 hover:border-primary/50"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleChipClick}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleChipClick();
          }
        }}
      >
      <Play className="h-3 w-3 opacity-40 group-hover:opacity-80 transition-opacity" />
      <span>{guest}</span>
      
      {/* Episode count badge */}
      {episodeCount > 1 && (
        <span className="ml-0.5 inline-flex items-center justify-center rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
          ×{episodeCount}
        </span>
      )}
      
      <button
        onClick={handleCopy}
        className="ml-1 p-0.5 rounded hover:bg-primary/20 transition-colors"
        title="Copy YouTube link"
      >
        {copied ? (
          <Check className="h-3 w-3 text-primary" />
        ) : (
          <Copy className="h-3 w-3 opacity-40 group-hover:opacity-80 transition-opacity" />
        )}
      </button>

      </motion.div>

      {/* Thumbnail preview (hover on desktop, tap on mobile) */}
      {currentThumbnailUrl && showPreview && previewStyle &&
        createPortal(
          <>
            {/* Backdrop for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-[999]"
                onClick={() => setShowMobilePreview(false)}
              />
            )}
            <motion.div
              data-mobile-preview
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={previewStyle}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30 bg-card">
                {/* Close button for mobile */}
                {isMobile && (
                  <button
                    onClick={() => setShowMobilePreview(false)}
                    className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentVideoId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    src={currentThumbnailUrl}
                    alt={`${guest} episode ${currentEpisodeIndex + 1} thumbnail`}
                    className={isMobile ? "w-full h-auto cursor-pointer select-none" : "w-full h-auto"}
                    loading="lazy"
                    onClick={isMobile ? handleWatchNow : undefined}
                    draggable={false}
                  />
                </AnimatePresence>
                
                {/* Episode navigation arrows */}
                {episodeCount > 1 && (
                  <>
                    <button
                      onClick={(e) => handleArrowClick(e, 'prev')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      aria-label="Previous episode"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleArrowClick(e, 'next')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      aria-label="Next episode"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                  <div className="inline-flex w-fit max-w-full flex-col rounded-md bg-black/60 px-2 py-1">
                    <p className="text-white text-sm md:text-base font-semibold truncate">{guest}</p>
                    {episodeCount > 1 && (
                      <p className="text-white/80 text-xs md:text-sm leading-tight">
                        Episode {currentEpisodeIndex + 1} of {episodeCount}
                        {isMobile && <span className="ml-1 opacity-70">• Swipe to browse</span>}
                      </p>
                    )}
                  </div>
                  {/* Watch Now button for mobile */}
                  {isMobile && (
                    <button
                      onClick={handleWatchNow}
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
          </>,
          document.body
        )}
    </>
  );
};

export default GuestChip;
