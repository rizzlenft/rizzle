import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import WipLivePreview from "./WipLivePreview";

interface MiniLink {
  label: string;
  href: string;
  emoji?: string;
}

interface ProjectCardProps {
  name: string;
  description: string;
  emoji: string;
  link?: string;
  secondaryLink?: string;
  secondaryLinkLabel?: string;
  featured?: boolean;
  image?: string;
  showLivePreview?: boolean;
  miniappLinks?: MiniLink[];
  imagePosition?: string;
}

const ProjectCard = ({ name, description, emoji, link, secondaryLink, secondaryLinkLabel, featured, image, showLivePreview, miniappLinks, imagePosition }: ProjectCardProps) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:box-glow-sm ${
        featured ? "md:col-span-2 box-glow border-primary/30" : ""
      }`}
    >
      {/* Image */}
      {image && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={name}
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          {/* Live preview overlay in top-right corner */}
          {showLivePreview && (
            <div className="absolute right-2 top-2 z-10">
              <WipLivePreview />
            </div>
          )}
        </div>
      )}
      
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10 p-6">
        <div className="mb-4 flex items-start justify-between">
          <span className="text-3xl">{emoji}</span>
          <div className="flex items-center gap-2">
            {secondaryLink && (
              <a 
                href={secondaryLink} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {secondaryLinkLabel || "OpenSea"}
              </a>
            )}
            {link && (
              <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            )}
          </div>
        </div>
        
        <h3 className="mb-2 font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>
        
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {miniappLinks && miniappLinks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {miniappLinks.map((m) => (
              <a
                key={m.href}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
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

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  return content;
};

export default ProjectCard;
