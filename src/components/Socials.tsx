import { motion } from "framer-motion";
import crowdsurfingGif from "@/assets/crowdsurfing-rizzle.webp";
import { track } from "@/lib/analytics";
import { STRIPE_CONSULT_LINK } from "@/lib/site-links";

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
    name: "Hire a Rizzle",
    handle: "web3 consultation",
    href: STRIPE_CONSULT_LINK,
    icon: HireIcon,
    color: "group-hover:text-primary",
  },
];

const Socials = () => {
  return (
    <section className="relative px-6 py-16 overflow-hidden">
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
      
      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          {/* Signature-style Connect heading */}
          <h2 className="mb-3 font-display text-6xl font-bold text-primary text-glow sm:text-7xl md:text-8xl italic tracking-tight">
            Connect
          </h2>
          <p className="text-primary/70 text-sm max-w-md mx-auto">
            Schedule a Web3 Consultation with Rizzle to build something real.
          </p>
        </motion.div>
        
        {/* Social cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (social.name === "Hire a Rizzle") {
                  track("consult_cta_clicked", { location: "socials" });
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
              className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/30 px-8 py-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/60 hover:box-glow-sm"
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
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Socials;
