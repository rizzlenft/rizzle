import { Play } from "lucide-react";
import { useLatestWipVideo } from "@/hooks/useLatestWipVideo";

const WipLivePreview = () => {
  const { video, isLoading, error } = useLatestWipVideo();

  if (isLoading) {
    return (
      <div className="relative aspect-video w-28 animate-pulse rounded bg-muted/50" />
    );
  }

  if (error || !video) {
    return null;
  }

  // Format the date if available
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(video.publishedAt);

  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="group/preview relative block aspect-video w-28 overflow-hidden rounded border border-white/30 shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-primary/20"
    >
      {/* Thumbnail */}
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="h-full w-full object-cover"
      />
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors duration-300 group-hover/preview:bg-black/20">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
          <Play className="h-3 w-3 fill-current" />
        </div>
      </div>
      
      {/* "Latest" badge with date */}
      <div className="absolute left-1 top-1 flex items-center gap-1 rounded bg-destructive/90 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-destructive-foreground shadow-sm">
        <span className="h-1 w-1 animate-pulse rounded-full bg-destructive-foreground" />
        Latest{formattedDate ? ` · ${formattedDate}` : ''}
      </div>
    </a>
  );
};

export default WipLivePreview;
