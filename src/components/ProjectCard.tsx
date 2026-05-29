import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import WipLivePreview from "./WipLivePreview";
import { track } from "@/lib/analytics";

interface ProjectLink {
  label: string;
  href: string;
  emoji?: string;
}

/** Compact outbound pill stacked under the WIP live preview (top-right of card image). */
interface PreviewAction {
  label: string;
  href: string;
  emoji?: string;
}

interface ProjectCardProps {
  name: string;
  description: string;
  emoji: string;
  /** Optional list of links rendered as chips at the bottom of the card. */
  links?: ProjectLink[];
  featured?: boolean;
  image?: string;
  showLivePreview?: boolean;
  /** Shown below the WIP video preview — e.g. Trinity Labs project link. */
  previewActions?: PreviewAction[];
  imagePosition?: string;
}

const ProjectCard = ({
  name,
  description,
  emoji,
  links,
  featured,
  image,
  showLivePreview,
  previewActions,
  imagePosition,
}: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:box-glow-sm ${
        featured ? "md:col-span-2 box-glow border-primary/30" : ""
      }`}
    >
      {/* Image */}
      {image && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          {/* Live preview overlay in top-right corner */}
          {showLivePreview && (
            <div className="absolute right-2 top-2 z-10 flex flex-col items-end gap-1.5">
              <WipLivePreview />
              {previewActions?.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    track("project_preview_action_clicked", {
                      project: name,
                      link_label: action.label,
                      href: action.href,
                    });
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/70 px-2 py-1 text-[10px] font-semibold text-white shadow-lg backdrop-blur-sm transition-all hover:border-primary/60 hover:bg-black/85"
                >
                  {action.emoji && <span className="text-[11px] leading-none">{action.emoji}</span>}
                  <span>{action.label}</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-80" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-1 flex-col p-5">
        {/* Title row with inline emoji — eliminates empty space above title */}
        <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
          <span className="text-2xl leading-none">{emoji}</span>
          <span>{name}</span>
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Unified link chips — same style across every card */}
        {links && links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {links.map((m) => (
              <a
                key={m.href}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("project_link_clicked", {
                    project: name,
                    link_label: m.label,
                    href: m.href,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-foreground/90 backdrop-blur-sm transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
              >
                {m.emoji && <span>{m.emoji}</span>}
                <span>{m.label}</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
