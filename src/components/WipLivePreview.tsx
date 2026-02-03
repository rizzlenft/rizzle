import { Play } from "lucide-react";
import { useLatestWipVideo } from "@/hooks/useLatestWipVideo";

const WipLivePreview = () => {
  const { video, isLoading, error } = useLatestWipVideo();

  if (isLoading) {
    return (
      <div className="relative aspect-video w-full max-w-[180px] animate-pulse rounded-lg bg-muted/50" />
    );
  }

  if (error || !video) {
    return null;
  }

  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="group/preview relative block aspect-video w-20 overflow-hidden rounded border border-white/20 shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-primary/20"
    >
      {/* Thumbnail */}
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="h-full w-full object-cover"
      />
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors duration-300 group-hover/preview:bg-black/20">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
          <Play className="h-2.5 w-2.5 fill-current" />
        </div>
      </div>
      
      {/* "Live" indicator dot */}
      <div className="absolute left-1 top-1 h-2 w-2 animate-pulse rounded-full bg-destructive shadow-sm shadow-destructive/50" />
    </a>
  );
};

export default WipLivePreview;
