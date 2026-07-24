import { motion } from "framer-motion";
import crowdsurfingGif from "@/assets/crowdsurfing-rizzle.webp";
import { track } from "@/lib/analytics";
import {
  GITHUB_PROFILE_URL,
  GITLAB_PROFILE_URL,
  START_HERE_PATH,
  STRIPE_CONSULT_LINK,
  TRINITY_LABS_URL,
} from "@/lib/site-links";

// Custom brand icons as SVG components
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FarcasterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M3.5 3h17v18h-3v-5.25c0-1.5-.5-2.75-2.25-2.75s-2.25 1.25-2.25 2.75V21h-3v-5.25c0-1.5-.5-2.75-2.25-2.75S5.5 14.25 5.5 15.75V21h-2V3zm2 2v7h2V5h-2zm10 0v7h2V5h-2z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const HireIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const SprintIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const LabsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v7.3L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.3V2" />
    <path d="M8 2h8" />
    <path d="M8 14h8" />
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const GitLabIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.955 13.182l-1.342-4.135-2.664-8.189a.455.455 0 0 0-.867 0L16.418 9.045H7.582L4.919.858a.455.455 0 0 0-.867 0L1.386 9.047.044 13.182a.924.924 0 0 0 .331 1.023L12 23.054l11.625-8.849a.924.924 0 0 0 .33-1.023" />
  </svg>
);

const socials = [
  {
    name: "X",
    handle: "@NFTland",
    href: "https://twitter.com/NFTland",
    icon: XIcon,
    color: "group-hover:text-foreground",
  },
  {
    name: "Farcaster",
    handle: "@rizzle",
    href: "https://warpcast.com/rizzle",
    icon: FarcasterIcon,
    color: "group-hover:text-[#8A63D2]",
  },
  {
    name: "Discord",
    handle: "_rizzle",
    href: "https://discord.com/users/_rizzle",
    icon: DiscordIcon,
    color: "group-hover:text-[#5865F2]",
  },
  {
    name: "GitHub",
    handle: "@rizzlenft",
    href: GITHUB_PROFILE_URL,
    icon: GitHubIcon,
    color: "group-hover:text-foreground",
  },
  {
    name: "GitLab",
    handle: "@rizzlenft",
    href: GITLAB_PROFILE_URL,
    icon: GitLabIcon,
    color: "group-hover:text-foreground",
  },
  {
    name: "Start Here",
    handle: "hire / partner / invest",
    href: START_HERE_PATH,
    icon: HireIcon,
    color: "group-hover:text-primary",
  },
  {
    name: "Trinity Labs",
    handle: "current project",
    href: TRINITY_LABS_URL,
    icon: LabsIcon,
    color: "group-hover:text-primary",
  },
  {
    name: "Book Strategy Sprint",
    handle: "paid 45-minute call",
    href: STRIPE_CONSULT_LINK,
    icon: SprintIcon,
    color: "group-hover:text-primary",
  },
];

const Socials = () => {
  return (
    <section className="relative section-y-lg overflow-hidden">
      {/* Background gif */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${crowdsurfingGif})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Gradient overlay for better text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/60" />
      
      <div className="page-container relative max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          {/* Signature-style Connect heading */}
          <h2 className="mb-3 font-display text-5xl font-bold text-primary text-glow sm:text-6xl md:text-7xl italic tracking-tight">
            Connect
          </h2>
          <p className="text-primary/70 text-sm max-w-md mx-auto">
            Reach out for roles, collaborations, or investor conversations.
          </p>
        </motion.div>
        
        {/* Social cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6"
        >
          {socials.map((social, index) => {
            const isInternal = social.href.startsWith("/");
            return (
            <motion.a
              key={social.name}
              href={social.href}
              target={isInternal ? undefined : "_blank"}
              rel={isInternal ? undefined : "noopener noreferrer"}
              onClick={() => {
                if (social.name === "Book Strategy Sprint") {
                  track("consult_cta_clicked", { location: "socials" });
                } else if (social.name === "Start Here") {
                  track("opportunity_cta_clicked", { location: "socials" });
                } else if (social.name === "Trinity Labs") {
                  track("project_link_clicked", { project: "Trinity Labs", location: "socials" });
                } else {
                  track("social_link_clicked", { network: social.name });
                }
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="surface-glass-strong group relative flex flex-col items-center gap-3 px-6 py-5 sm:px-8 sm:py-6 transition-all duration-300 hover:border-primary/50 hover:bg-card/60 hover:box-glow-sm"
            >
              {/* Icon */}
              <div className={`transition-colors duration-300 text-muted-foreground ${social.color}`}>
                <social.icon className="h-10 w-10" />
              </div>
              
              {/* Name & Handle */}
              <div className="text-center">
                <div className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {social.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {social.handle}
                </div>
              </div>
              
              {/* Hover glow effect */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.a>
          );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Socials;
