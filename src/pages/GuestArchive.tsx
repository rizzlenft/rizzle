import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, Users, Play, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import wipLogo from "@/assets/wip-logo.gif";
import marsLogo from "@/assets/mattandrizz.jpeg";
import { guestData, getGuestVideoUrl, hasDirectLink } from "@/data/guestData";

// Guest chip component with copy functionality
const GuestChip = ({ guest }: { guest: string }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const url = getGuestVideoUrl(guest);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: `YouTube link for ${guest} copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`group inline-flex items-center gap-1.5 rounded-full border bg-card/30 px-3 py-1.5 text-sm text-foreground hover:bg-card/60 transition-all ${
        hasDirectLink(guest) 
          ? "border-primary/30 hover:border-primary" 
          : "border-border/50 hover:border-primary/50"
      }`}
    >
      <Play className="h-3 w-3 opacity-40 group-hover:opacity-80 transition-opacity" />
      <span>{guest}</span>
      <button
        onClick={handleCopy}
        className="ml-1 p-0.5 rounded hover:bg-primary/20 transition-colors"
        title="Copy YouTube link"
      >
        {copied ? (
          <Check className="h-3 w-3 text-primary" />
        ) : (
          <Copy className="h-3 w-3 opacity-40 group-hover:opacity-80 transition-opacity" />
        )}
      </button>
    </motion.div>
  );
};

const GuestArchive = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredGuests = useMemo(() => {
    if (!searchQuery.trim()) return guestData;
    return guestData.filter(guest =>
      guest.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
            {/* Dual logo display */}
            <div className="mb-8 flex items-center justify-center gap-6 sm:gap-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl" />
                <img
                  src={wipLogo}
                  alt="The WIP Meetup"
                  className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-full border-2 border-primary/30 shadow-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-3xl sm:text-4xl">×</span>
                <span className="font-mono text-xs text-muted-foreground">featuring</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 blur-xl" />
                <img
                  src={marsLogo}
                  alt="The Matthew & Rizzle Show"
                  className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-2xl border-2 border-accent/30 shadow-lg object-cover"
                />
              </motion.div>
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
              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary border border-primary/30">
                The WIP Meetup
              </span>
              <span className="text-muted-foreground">&</span>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-accent border border-accent/30">
                The Matthew & Rizzle Show
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Users className="h-4 w-4 text-primary" />
              <span>{guestData.length}+ verified guests since 2020</span>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Search and guest list */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-10"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
            />
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
              <div className="sticky top-0 z-10 mb-4 flex items-center gap-3 bg-background/80 backdrop-blur-sm py-2">
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
