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
  isSpotifyOnlyGuest,
} from "@/data/guestData";
import tokensmartThumbnail from "@/assets/tokensmart-thumbnail.png";

interface GuestChipProps {
  guest: string;
}

const GuestChip = ({ guest }: GuestChipProps) => {
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
    // Only needed to drive the desktop hover preview.
    isOpen: isHovering,
  });

  const currentUrl = currentVideoId
    ? `https://youtube.com/watch?v=${currentVideoId}`
    : url;

  // On first open (especially on mobile), `currentVideoId` may still be null for a render.
  // Use a deterministic fallback so the modal can render immediately.
  const previewVideoId = currentVideoId || videoIds[0] || "";

  // Use a reliable default thumbnail quality for the initial render.
  // The modal itself will still attempt higher-quality fallbacks.
  // For Spotify-only guests, use the TokenSmart thumbnail
  const isSpotifyOnly = isSpotifyOnlyGuest(guest);
  const currentThumbnailUrl = isSpotifyOnly
    ? tokensmartThumbnail
    : previewVideoId
      ? getYouTubeThumbnail(previewVideoId, "hq")
      : null;

  // Debug logging for Spotify guests
  if (isSpotifyOnly && isHovering) {
    console.log(`[GuestChip] ${guest}: isSpotifyOnly=${isSpotifyOnly}, thumbnailUrl=${currentThumbnailUrl?.substring(0, 50)}...`);
  }

  const showDesktopPreview = !isMobileViewport && isHovering;

  const openVideo = (videoUrl?: string) => {
    const targetUrl = videoUrl || currentUrl;
    const win = window.open(targetUrl, "_blank", "noopener,noreferrer");
    if (!win) window.location.assign(targetUrl);
  };

  const handleChipClick = () => {
    // Mobile thumbnails are disabled; always open the correct YouTube link.
    openVideo();
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

      {/* Thumbnail preview modal - show for YouTube guests or Spotify-only guests */}
      {(currentThumbnailUrl && showDesktopPreview) && (
        <GuestPreviewModal
          guest={guest}
          thumbnailUrl={currentThumbnailUrl}
          currentIndex={currentIndex}
          episodeCount={episodeCount}
          hasMultipleEpisodes={hasMultipleEpisodes}
          currentVideoId={previewVideoId}
          isMobile={isMobileViewport}
          isSpotifyOnly={isSpotifyOnly}
          onClose={() => {
            // Desktop-only: hover drives visibility
          }}
          onWatchNow={() => openVideo()}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onGoToIndex={goToIndex}
        />
      )}
    </>
  );
};

export default GuestChip;
