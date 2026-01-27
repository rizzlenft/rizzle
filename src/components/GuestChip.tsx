import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useEpisodeNavigation } from "@/hooks/useEpisodeNavigation";
import GuestPreviewModal from "./GuestPreviewModal";
import {
  getGuestVideoUrl,
  hasDirectLink,
  getGuestEpisodeCount,
  getAllGuestVideoIds,
  getYouTubeThumbnail,
} from "@/data/guestData";

interface GuestChipProps {
  guest: string;
}

const GuestChip = ({ guest }: GuestChipProps) => {
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { toast } = useToast();
  
  // Use direct viewport check for reliable mobile detection
  const [isMobileViewport, setIsMobileViewport] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const videoIds = getAllGuestVideoIds(guest);
  const episodeCount = getGuestEpisodeCount(guest);
  const url = getGuestVideoUrl(guest);

  const {
    currentIndex,
    currentVideoId,
    hasMultipleEpisodes,
    goToPrevious,
    goToNext,
    goToIndex,
  } = useEpisodeNavigation({
    videoIds,
    isOpen: showMobilePreview || isHovering,
  });

  const currentUrl = currentVideoId
    ? `https://youtube.com/watch?v=${currentVideoId}`
    : url;

  // On first open (especially on mobile), `currentVideoId` may still be null for a render.
  // Use a deterministic fallback so the modal can render immediately.
  const previewVideoId = currentVideoId || videoIds[0] || "";

  // Use a reliable default thumbnail quality for the initial render.
  // The modal itself will still attempt higher-quality fallbacks.
  const currentThumbnailUrl = previewVideoId
    ? getYouTubeThumbnail(previewVideoId, "hq")
    : null;

  const showPreview = showMobilePreview || isHovering;

  // Close mobile preview when clicking outside
  useEffect(() => {
    if (!showMobilePreview || !isMobileViewport) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-mobile-preview]") &&
        !target.closest("[data-guest-chip]")
      ) {
        setShowMobilePreview(false);
      }
    };

    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobilePreview, isMobileViewport]);

  const openVideo = (videoUrl?: string) => {
    const targetUrl = videoUrl || currentUrl;
    const win = window.open(targetUrl, "_blank", "noopener,noreferrer");
    if (!win) window.location.assign(targetUrl);
  };

  const handleChipClick = () => {
    const isCurrentlyMobile = window.innerWidth < 768;
    // On mobile, always open the preview when we have at least one video.
    // (Do not gate on thumbnail URL existence/quality; the modal handles fallbacks.)
    if (isCurrentlyMobile && videoIds.length > 0) {
      setShowMobilePreview(true);
    } else {
      openVideo();
    }
  };

  const handleWatchNow = () => {
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
          if (e.key === "Enter" || e.key === " ") {
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

      {/* Thumbnail preview modal */}
      {currentThumbnailUrl && showPreview && (
        <GuestPreviewModal
          guest={guest}
          thumbnailUrl={currentThumbnailUrl}
          currentIndex={currentIndex}
          episodeCount={episodeCount}
          hasMultipleEpisodes={hasMultipleEpisodes}
          currentVideoId={previewVideoId}
          isMobile={isMobileViewport}
          onClose={() => setShowMobilePreview(false)}
          onWatchNow={handleWatchNow}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onGoToIndex={goToIndex}
        />
      )}
    </>
  );
};

export default GuestChip;
