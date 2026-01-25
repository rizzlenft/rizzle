import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  name: string;
  description: string;
  emoji: string;
  link?: string;
  featured?: boolean;
}

const ProjectCard = ({ name, description, emoji, link, featured }: ProjectCardProps) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:box-glow-sm ${
        featured ? "md:col-span-2 box-glow border-primary/30" : ""
      }`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between">
          <span className="text-3xl">{emoji}</span>
          {link && (
            <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          )}
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
