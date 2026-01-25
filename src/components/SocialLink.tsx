import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SocialLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  handle?: string;
}

const SocialLink = ({ href, icon: Icon, label, handle }: SocialLinkProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="group flex items-center gap-3 rounded-lg border border-border bg-card/50 px-5 py-3 transition-all duration-300 hover:border-primary/50 hover:bg-card hover:box-glow-sm"
    >
      <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {handle && (
          <span className="text-xs text-muted-foreground">{handle}</span>
        )}
      </div>
    </motion.a>
  );
};

export default SocialLink;
