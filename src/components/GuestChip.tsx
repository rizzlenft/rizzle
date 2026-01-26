import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Play, Copy, Check, X } from "lucide-react";
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
  const chipRef = useRef<HTMLDivElement | null>(null);
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const url = getGuestVideoUrl(guest);
  const episodeCount = getGuestEpisodeCount(guest);
  const videoIds = getAllGuestVideoIds(guest);
  const thumbnailUrl = videoIds.length > 0 ? getYouTubeThumbnail(videoIds[0], 'maxres') : null;

  const previewWidth = useMemo(() => {
    if (typeof window === "undefined") return 500;
    if (isMobile) return Math.min(340, window.innerWidth - 32);
    return Math.min(560, Math.max(320, window.innerWidth * 0.4));
  }, [isMobile]);

  const showPreview = isMobile ? showMobilePreview : isHovering;

  useEffect(() => {
    if (!showPreview || !thumbnailUrl) {
      setPreviewStyle(null);
      return;
    }

    const margin = isMobile ? 16 : 24;

    if (isMobile) {
      // Center on mobile
      setPreviewStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: previewWidth,
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
  }, [showPreview, thumbnailUrl, previewWidth, isMobile]);

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
    if (isMobile && thumbnailUrl) {
      // On mobile, show preview first
      setShowMobilePreview(true);
    } else {
      // On desktop, open directly
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWatchNow = () => {
    setShowMobilePreview(false);
    window.open(url, '_blank', 'noopener,noreferrer');
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
      {thumbnailUrl && showPreview && previewStyle &&
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
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              style={previewStyle}
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
                <img
                  src={thumbnailUrl}
                  alt={`${guest} episode thumbnail`}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                  <div className="inline-flex w-fit max-w-full flex-col rounded-md bg-black/60 px-2 py-1">
                    <p className="text-white text-sm md:text-base font-semibold truncate">{guest}</p>
                    {episodeCount > 1 && (
                      <p className="text-white/80 text-xs md:text-sm leading-tight">{episodeCount} episodes</p>
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
