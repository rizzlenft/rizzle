import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const url = getGuestVideoUrl(guest);
  const episodeCount = getGuestEpisodeCount(guest);
  const videoIds = getAllGuestVideoIds(guest);
  const thumbnailUrl = videoIds.length > 0 ? getYouTubeThumbnail(videoIds[0], 'hq') : null;

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
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`group relative inline-flex items-center gap-1.5 rounded-full border bg-card/30 px-3 py-1.5 text-sm text-foreground hover:bg-card/60 transition-all ${
        hasDirectLink(guest) 
          ? "border-primary/30 hover:border-primary" 
          : "border-border/50 hover:border-primary/50"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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

      {/* Thumbnail preview on hover */}
      {thumbnailUrl && isHovering && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 pointer-events-none"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30 bg-card">
            <img
              src={thumbnailUrl}
              alt={`${guest} episode thumbnail`}
              className="w-72 md:w-80 lg:w-96 h-auto"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white text-sm md:text-base font-semibold truncate drop-shadow-lg">{guest}</p>
              {episodeCount > 1 && (
                <p className="text-white/80 text-xs md:text-sm">{episodeCount} episodes</p>
              )}
            </div>
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                <Play className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground ml-0.5" fill="currentColor" />
              </div>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default GuestChip;
