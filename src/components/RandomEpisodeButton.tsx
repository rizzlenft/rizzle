import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, ExternalLink, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getRandomEpisode, getYouTubeThumbnail } from "@/data/guestData";
import { useGuestLinks } from "@/contexts/GuestLinksContext";

const RandomEpisodeButton = () => {
  const guestLinks = useGuestLinks();
  const [randomResult, setRandomResult] = useState<{
    guest: string;
    videoId: string;
    url: string;
  } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const pickRandom = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const result = getRandomEpisode(guestLinks);
      if (!result) {
        toast({
          title: "No episodes found",
          description: "Try again in a moment.",
          variant: "destructive",
        });
        setIsSpinning(false);
        return;
      }
      setRandomResult(result);
      setIsSpinning(false);
    }, 400);
  };

  const handleCopy = async () => {
    if (!randomResult) return;
    try {
      await navigator.clipboard.writeText(randomResult.url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "YouTube link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
        onClick={pickRandom}
        variant="outline"
        className="group min-h-[44px] gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
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
          <>
            {/* Mobile: fixed bottom sheet style */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 sm:hidden"
              onClick={handleClose}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-full sm:mt-4 sm:w-72"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                <div className="relative aspect-video">
                  <img
                    src={getYouTubeThumbnail(randomResult.videoId, "hq")}
                    alt={`${randomResult.guest} episode`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-2 right-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-lg font-bold truncate">{randomResult.guest}</p>
                    <p className="text-white/70 text-sm">Random Episode</p>
                  </div>
                </div>
                <div className="p-3 flex gap-2">
                  <a
                    href={randomResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full min-h-[44px] gap-2" size="sm">
                      <ExternalLink className="w-4 h-4" />
                      Watch Now
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="min-h-[44px] min-w-[44px] gap-2"
                    aria-label="Copy link"
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
                    onClick={pickRandom}
                    className="min-h-[44px] min-w-[44px] gap-2"
                    disabled={isSpinning}
                    aria-label="Pick another"
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RandomEpisodeButton;
