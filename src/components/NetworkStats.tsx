import { useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Play, Calendar } from "lucide-react";
import { guestVideoLinks, guestSpotifyLinks } from "@/data/guestData";

interface NetworkStatsProps {
  totalGuests: number;
  extractedVideoIds?: string[];
}

const NetworkStats = ({ totalGuests, extractedVideoIds = [] }: NetworkStatsProps) => {
  const totalEpisodes = useMemo(() => {
    const ids = new Set<string>();
    // Count unique video IDs from static data
    for (const value of Object.values(guestVideoLinks)) {
      if (Array.isArray(value)) {
        value.forEach(id => ids.add(id));
      } else {
        ids.add(value);
      }
    }
    // Add extracted video IDs from database
    extractedVideoIds.forEach(id => ids.add(id));
    // Add Spotify episodes
    const spotifyCount = new Set(Object.values(guestSpotifyLinks)).size;
    return ids.size + spotifyCount;
  }, [extractedVideoIds]);

  const stats = [
    { label: "Total Guests", value: `${totalGuests}+`, icon: Users, delay: 0.2 },
    { label: "Total Episodes", value: `${totalEpisodes}+`, icon: Play, delay: 0.3 },
    { label: "Years Active", value: "8+", icon: Calendar, delay: 0.4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 max-w-2xl mx-auto"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: stat.delay, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="relative group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 text-center overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-sm" />

          <div className="relative z-10">
            <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
            <p className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NetworkStats;
