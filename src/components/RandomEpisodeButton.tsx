import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, ExternalLink, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getRandomEpisode, getYouTubeThumbnail } from "@/data/guestData";

const RandomEpisodeButton = () => {
  const [randomResult, setRandomResult] = useState<{
    guest: string;
    videoId: string;
    url: string;
  } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleRandomClick = () => {
    setIsSpinning(true);
    
    // Add a small delay for the animation effect
    setTimeout(() => {
      const result = getRandomEpisode();
      setRandomResult(result);
      setIsSpinning(false);
    }, 500);
  };

  const handleCopy = async () => {
    if (!randomResult) return;
    try {
      await navigator.clipboard.writeText(randomResult.url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: `YouTube link copied to clipboard`,
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

  const handleClose = () => {
    setRandomResult(null);
    setCopied(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={handleRandomClick}
        variant="outline"
        className="group gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
        disabled={isSpinning}
      >
        <motion.div
          animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Shuffle className="h-4 w-4 text-primary" />
        </motion.div>
        <span>Feeling Lucky</span>
      </Button>

      <AnimatePresence>
        {randomResult && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 w-72"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-card">
              {/* Thumbnail */}
              <div className="relative aspect-video">
                <img
                  src={getYouTubeThumbnail(randomResult.videoId, 'hq')}
                  alt={`${randomResult.guest} episode`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Guest name overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-lg font-bold">{randomResult.guest}</p>
                  <p className="text-white/70 text-sm">Random Episode</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-3 flex gap-2">
                <a
                  href={randomResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full gap-2" size="sm">
                    <ExternalLink className="w-4 h-4" />
                    Watch Now
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomClick}
                  className="gap-2"
                  disabled={isSpinning}
                >
                  <motion.div
                    animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Shuffle className="w-4 h-4" />
                  </motion.div>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RandomEpisodeButton;
