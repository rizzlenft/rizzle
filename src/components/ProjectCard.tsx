import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  name: string;
  description: string;
  emoji: string;
  link?: string;
  secondaryLink?: string;
  featured?: boolean;
  image?: string;
}

const ProjectCard = ({ name, description, emoji, link, secondaryLink, featured, image }: ProjectCardProps) => {
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
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
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
                OpenSea
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
