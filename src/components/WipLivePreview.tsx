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
      className="group/preview relative block aspect-video w-full max-w-[180px] overflow-hidden rounded-lg border border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Thumbnail */}
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover/preview:scale-105"
      />
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-300 group-hover/preview:bg-black/20">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform duration-300 group-hover/preview:scale-110">
          <Play className="h-5 w-5 fill-current" />
        </div>
      </div>
      
      {/* "Latest" badge */}
      <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-destructive/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive-foreground" />
        Latest
      </div>
    </a>
  );
};

export default WipLivePreview;
