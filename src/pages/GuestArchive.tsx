import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import TopNav from "@/components/TopNav";
import { Input } from "@/components/ui/input";
import wipLogo from "@/assets/wip-logo.gif";
import marsLogo from "@/assets/mattandrizz.jpeg";
import tokensmartLogo from "@/assets/tokensmart.png";
import { guestData, guestVideoLinks } from "@/data/guestData";
import { useExtractedGuests, mergeGuestData } from "@/hooks/useExtractedGuests";
import GuestChip from "@/components/GuestChip";
import RandomEpisodeButton from "@/components/RandomEpisodeButton";

const GuestArchive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: extractedGuests = [] } = useExtractedGuests();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Merge static guest list with dynamically extracted guests
  const allGuests = useMemo(() => {
    const mergedLinks = mergeGuestData(guestVideoLinks, extractedGuests);
    // Combine static guest names with any new names from database
    const allNames = new Set([...guestData, ...Object.keys(mergedLinks)]);
    return Array.from(allNames).sort((a, b) => a.localeCompare(b));
  }, [extractedGuests]);

  const filteredGuests = useMemo(() => {
    if (!searchQuery.trim()) return allGuests;
    return allGuests.filter(guest =>
      guest.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allGuests]);

  // Group guests by first letter
  const groupedGuests = useMemo(() => {
    const groups: Record<string, string[]> = {};
    filteredGuests.forEach(guest => {
      const firstChar = guest[0].toUpperCase();
      const key = /[A-Z]/.test(firstChar) ? firstChar : "#";
      if (!groups[key]) groups[key] = [];
      groups[key].push(guest);
    });
    return groups;
  }, [filteredGuests]);

  const sortedKeys = Object.keys(groupedGuests).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header with logos */}
      <header className="relative overflow-hidden border-b border-border/50">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />
        <div className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        <div className="pointer-events-none absolute right-1/4 top-0 h-48 w-48 rounded-full bg-accent/10 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
          {/* Back link */}
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Logos showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Triple logo display */}
            <div className="mb-8 flex items-center justify-center gap-4 sm:gap-8">
              <motion.a
                href="https://thewipmeetup.com/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl group-hover:from-primary/40 group-hover:via-accent/40 group-hover:to-primary/40 transition-all" />
                <img
                  src={wipLogo}
                  alt="The WIP Meetup"
                  className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-full border-2 border-primary/30 group-hover:border-primary/60 shadow-lg transition-all"
                />
              </motion.a>

              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-2xl sm:text-3xl text-muted-foreground"
              >
                ×
              </motion.span>

              <motion.a
                href="https://www.youtube.com/playlist?list=PLaEMvzi1A8c9xU0pw1CZJOTAsrwfydGNK"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 blur-xl group-hover:from-accent/40 group-hover:via-primary/40 group-hover:to-accent/40 transition-all" />
                <img
                  src={marsLogo}
                  alt="The Matthew & Rizzle Show"
                  className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-2xl border-2 border-accent/30 group-hover:border-accent/60 shadow-lg object-cover transition-all"
                />
              </motion.a>

              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="text-2xl sm:text-3xl text-muted-foreground"
              >
                ×
              </motion.span>

              <motion.a
                href="https://open.spotify.com/show/6JH4a7vdHnravKJdWPua21"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-primary/20 to-yellow-500/20 blur-xl group-hover:from-yellow-500/40 group-hover:via-primary/40 group-hover:to-yellow-500/40 transition-all" />
                <img
                  src={tokensmartLogo}
                  alt="TokenSmart Podcast"
                  className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-2xl border-2 border-yellow-500/30 group-hover:border-yellow-500/60 shadow-lg object-cover transition-all"
                />
              </motion.a>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-3 text-center font-display text-4xl font-bold text-foreground sm:text-5xl"
            >
              Guest Archive
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-2 text-center text-muted-foreground max-w-lg"
            >
              A directory of legendary guests and collaborators from
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-2 text-sm"
            >
              <a
                href="https://thewipmeetup.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary/10 px-3 py-1 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all cursor-pointer"
              >
                The WIP Meetup
              </a>
              <span className="text-muted-foreground">&</span>
              <a
                href="https://www.youtube.com/playlist?list=PLaEMvzi1A8c9xU0pw1CZJOTAsrwfydGNK"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent/10 px-3 py-1 text-accent border border-accent/30 hover:bg-accent/20 hover:border-accent/50 transition-all cursor-pointer"
              >
                The Matthew & Rizzle Show
              </a>
              <span className="text-muted-foreground">&</span>
              <a
                href="https://open.spotify.com/show/6JH4a7vdHnravKJdWPua21"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all cursor-pointer"
              >
                TokenSmart Podcast
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Users className="h-4 w-4 text-primary" />
              <span>{allGuests.length}+ verified guests since 2020</span>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Search and guest list */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Search bar and Random button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
              />
            </div>
            <RandomEpisodeButton />
          </div>
          {searchQuery && (
            <p className="text-center text-sm text-muted-foreground mt-3">
              {filteredGuests.length} result{filteredGuests.length !== 1 ? 's' : ''} found
            </p>
          )}
        </motion.div>

        {/* Guest directory */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="space-y-8"
        >
          {sortedKeys.map((letter) => (
            <div key={letter}>
              <div className="sticky top-0 z-20 mb-4 flex items-center gap-3 bg-background/90 py-2">
                <span className="font-display text-2xl font-bold text-primary">
                  {letter}
                </span>
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground">
                  {groupedGuests[letter].length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {groupedGuests[letter].map((guest) => (
                  <GuestChip key={guest} guest={guest} />
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {filteredGuests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No guests found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default GuestArchive;
