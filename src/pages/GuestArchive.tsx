import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, Users, Play, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import wipLogo from "@/assets/wip-logo.gif";
import marsLogo from "@/assets/mattandrizz.jpeg";

// YouTube video links for verified guests (extracted from actual video titles in CSV)
const guestVideoLinks: Record<string, string | string[]> = {
  // WIP Meetup guests (verified from CSV titles)
  "Aavegotchi": "oa-ZHgUfsC0",
  "Al Crego": "tpzk6lcpBj8",
  "Al Morris": "i1VdV6GrjAo",
  "Alex Salnikov": "1y0J6NCRqfM",
  "AlottaMoney": ["E03MpEELYJA", "HjBXgYHEB1I", "eYeaMJXk_eU", "qYL2vJks3Zg"],
  "Alimo": "hdRL4QM02DE",
  "Andrew Steinwold": "EDkxw8lVpuo",
  "Antara": "01lf9fUSFS0",
  "Arthr": ["8-LCrUvySiM", "HcGrK-orekM"],
  "AtBarbieLove": "f31_yDKN5TI",
  "Azeem": "6Ub7ReUdQRA",
  "Bay Backner": ["S10exnY4JX8", "DC7eh7wJEJo", "dc1cuikwxCE", "5pq8laex-eI", "MWHQ_U3Wjr8", "p74132sdDDM", "ZgUNO5dOuPE", "1nOODItFZjE", "qP428JKJ4Zw"],
  "Bihoz": "a9dxB06qlfY",
  "Bitpixi": "wSd2lPKJHhY",
  "Bryan Brinkman": ["lPiv6MZRMjw", "eRlUfTQSmWg"],
  "BullyMeow": "5WZOfAQKt5w",
  "Caty Tedman": "lZ8PLAuuUyo",
  "Charl3s": ["tKPN9prPj3M", "lPiv6MZRMjw"],
  "Chris Dawe": "K2BXSSmSPN4",
  "Colborn": "cbfb6cQ13p8",
  "Coldie": ["PXGvdekJB_E", "1hwIKxuh-5s", "tuk_IC8f_jY"],
  "CollectPods": "gxTxocxRegw",
  "Conlan": ["irP60587Rdo", "sRPd0GBhnfQ"],
  "Connie Digital": "VIzO6rWB6lE",
  "Cryptograph": "fKT5WBYs9zA",
  "CryptoMotors": ["07Pzun67qBg", "6k5bddZlY90"],
  "Cryptonatrix": "VEMCfwuNSZM",
  "Cryptoyuna": "KhN6AzXfUJ0",
  "CyberBrokers": "GxY2deF2k5Y",
  "Cypherdudes": ["5aQT2AAbLhk", "sZ53ckyx5dY"],
  "Dannie Chu": "IlqyXSEvmfo",
  "DankVR": ["n74Nu9HIjHE", "cbfb6cQ13p8", "E-h72NwQivQ"],
  "DeFi Dad": "hBfCzxzI0Lw",
  "Devin Finzer": "L-okxuih1FQ",
  "Dirk Lueth": "ecuZdbM2Vzg",
  "Dragonate": "Jm9F_ribTnY",
  "Drew Harding": "txdo8WCCgOY",
  "Dverso": "hHh1t_n0KD0",
  "Eclectic Method": ["zmSDyAc_fJE", "eYeaMJXk_eU"],
  "Edmotions": "M1Dle6oB38o",
  "ElatedPixel": "HjBXgYHEB1I",
  "Esther": "d12iZ6W0BjU",
  "Ethlings": ["fC-u3LrFxac", "3hv56xVFYHM"],
  "Ezincrypto": ["JiAGx8tgesk", "g8JJJOrr0AA", "BwZwJlM8Lvg", "E-h72NwQivQ", "EDkxw8lVpuo"],
  "Fabiano Speziari": ["RGaE-Q1cUgQ", "IVMSINiEQTY", "-fQWgh5TVLk", "vn5DMZ6gFlY"],
  "FelixFelixFelix": "5aQT2AAbLhk",
  "FlexasaurusRex": "HcGrK-orekM",
  "FlyFrogs": ["8Il7I-m2MeA", "YF-jMFgKSkU", "t6zjNtvSFys"],
  "Foxyoga": ["4eVGh0W0Qi8", "FrACLNjrStc"],
  "Fractilians": ["5OijqTDWELI", "qP428JKJ4Zw"],
  "FrankyNeedles": ["CHagVifGhW4", "AxU6b7_inck"],
  "George Boya": ["clhTmPoGK_o", "Sfh9nHoS-_s"],
  "Green Giant": "NYdconr9nvc",
  "Hackatao": "G3acrDmxp10",
  "Han": "3t7rClPeJAI",
  "HerStoryDAO": "O6Ay-4dFb08",
  "HiddenForces": ["f31_yDKN5TI", "BfLmmIHU_7M", "GpRRg_qCu5o", "jbpX6i3s1QQ", "Sfh9nHoS-_s"],
  "Hool": "-JzGzliM5Gs",
  "HPrivakos": "HjBXgYHEB1I",
  "HubzzHQ": ["5tZeX03dilE", "W3s0D-ABu3U"],
  "Hugh McDonaugh": "fKT5WBYs9zA",
  "Jeremy Cowart": "RToHXm9WGCk",
  "Jess Sloss": "yTCIhAsl9kQ",
  "Jesse Johnson": "UF-7NYeVDrk",
  "Jiho": ["ozIJSXowfMQ", "zo9pnsqK-NQ", "EDkxw8lVpuo"],
  "Jin": ["cbfb6cQ13p8", "n74Nu9HIjHE"],
  "JisuArtist": "wXvhk5RnzcI",
  "Johan Unger": ["4Q9FaZxGeK0", "cZhVDS563-Y", "PyehQOdaSE4", "0WnLwQ8_Nbs", "GpRRg_qCu5o", "EDkxw8lVpuo"],
  "John Crain": "lPwgSt3ukfY",
  "Jonathan Mann": "1TdbOJGjdVg",
  "Josie Bellini": ["10EeXXZLQMI", "SfYrkuSZyeo"],
  "JoyWorld": "U6_2Yv6kjLM",
  "Kane Mayfield": ["GiW4ZkntnaU", "hjNqub1P6mE"],
  "Kim Currier": ["MWHQ_U3Wjr8", "j1uhC602saE"],
  "Kitty Bast": ["EXqF4lrD6xo", "RL6W35v2LUE"],
  "LapinMignon": "oa-ZHgUfsC0",
  "Latashá": "r8XB4RGbgDI",
  "Leandro": ["07Pzun67qBg", "PSMVxROZP6U"],
  "Leo Da Gotchi": "uZA3Lly__Ak",
  "Lin Dai": "YUWcLZ-x0pQ",
  "Lucidhouse": "1yayIHlpcmQ",
  "Lucho Poletti": ["oSlQEwxTWu4", "4Ngg1e03E-g"],
  "Ludovica": "LTAWDWheGkg",
  "MarbleCards": ["Jj_QfbmM6zQ", "HYlk9qcxjLg"],
  "Matt Kane": "mDYfRnMPy5M",
  "Matty DCLBlogger": "l6cRYQfiHCQ",
  "Meme.com": ["8qhml6uqpEw", "JiAGx8tgesk", "CQiVx-SZ-xw", "GpRRg_qCu5o", "HYlk9qcxjLg"],
  "MetaRick": "_-nQ06AYRqA",
  "Metageist": ["HFhqKFfejcs", "mBHuMLWTDHU", "AP3ogxMp3wY", "BfLmmIHU_7M", "yoEjYKLN_U4", "rwYLDnJSnPA"],
  "Micah Johnson": "FB_XbS2fCjE",
  "Mike Casey": "B9tYZUJ1Gqs",
  "MovieShots": "ZHYKOzJStw8",
  "MrRichi": "HuoAEEohUoo",
  "Nate Alex": "lXPdR_OLprY",
  "Nate Geier": ["TSk-1f_2X6A", "PCMzW_Jnokw"],
  "Nifty Island": ["tKPN9prPj3M", "lPiv6MZRMjw", "a9dxB06qlfY", "t6zjNtvSFys"],
  "Niftytime": ["JdTLmDsQg9U", "hgmILcTKzx8", "ZgUNO5dOuPE"],
  "Ol1y Art": "-fQWgh5TVLk",
  "OnChainChain": "lYame5c0EdM",
  "Oona": "WHl7672Q6zo",
  "OpenVoxels": "n74Nu9HIjHE",
  "Osinachi": "PuQYoVxIlKM",
  "Paradoxx": ["rR84beVlHvs", "FaUneAAh-Lw", "f31_yDKN5TI", "051ZyBBMoEM", "sjUhfA6R8pg"],
  "Patricio W.": ["ufPl2-WCiV0", "tZuomhC2O7s"],
  "Pointshark": "UkjgracmlyE",
  "Proof of Beauty": "5FhAWTKtLrc",
  "Reneil": ["cbfb6cQ13p8", "A2Rur2ona48", "3Kv4JyLdQwU"],
  "Richard F. Yates": "aY4WtbBx5sI",
  "Robi C.": "e1j5xYLargQ",
  "Roham": "J9_pz7F7Qmg",
  "Roneil": "9B-8JpTYHpc",
  "Roustan": ["odVsoispuwg", "8jLOVvAbgLU"],
  "RussFranky": ["W3s0D-ABu3U", "3hv56xVFYHM"],
  "Sasha Ivanov": "mSrCtW0I3-A",
  "Sekud Beats": "-94aqm26KME",
  "Sho": ["rtvKtRET-Vg", "KVV2QiGllEo"],
  "Sid Kalla": "TGnlGkPLcrI",
  "Simona Pop": "Qt4GQI21csA",
  "Snowfro": ["IWoiDjjLs7M", "eeW35ZeJc0s"],
  "Snail0x": "tpzk6lcpBj8",
  "Stefan Große Halbuer": "9l7DsSO7mUw",
  "Steve K.": ["HmCLtF9HifE", "raJZj-cn6Hc"],
  "Steve McGarry": "8ezYt7lnYQI",
  "Stina Jones": ["Jj_QfbmM6zQ", "E-h72NwQivQ", "k4dbYmA08Jo", "zgJjx7vPXrE"],
  "Supahmarbler": "uZA3Lly__Ak",
  "SuperRare": "T3gw4bAiw2w",
  "Terra Virtua": "rUXjHg0vQng",
  "The Sandbox": "b3tJeG6Ftug",
  "TheBeatMiner": ["uDBrYHUgTKk", "vCvetj59TaY", "a_C4vr5m1fc"],
  "TheSarahShow": "yny_xjTYvqA",
  "Thomas Dylan Daniel": "j-nqf2b0CBY",
  "Toxsam": ["tj4wQOsFNhU", "U_nLdzyLYGw", "MWHQ_U3Wjr8"],
  "Trislit": "cbfb6cQ13p8",
  "Twobadour": ["1tCF_qc6xDc", "2hEJrbxNFiw"],
  "UrBen": "F0rOo8e3DwU",
  "Viktor Radchenko": "na-u-RVF7WM",
  "VIPE": ["U_nLdzyLYGw", "yoEjYKLN_U4"],
  "VjDelaria": "j1uhC602saE",
  "WhaleShark": ["beoGBvDgvTI", "T3gw4bAiw2w"],
  "WizardX": "CQiVx-SZ-xw",
  "WoodenCyclops": "qXNS9QuDEbo",
  "YRDGZ": "hiIqIzzgNGM",
  "Young & Sick": "lPiv6MZRMjw",
  "ZCreativeMedia": "l1fFf2B4M58",
  "Zeroone": "LTAWDWheGkg",
};

// Get YouTube URL for a guest - returns first video if multiple, or search if not found
const getGuestVideoUrl = (name: string): string => {
  const videoId = guestVideoLinks[name];
  if (videoId) {
    const id = Array.isArray(videoId) ? videoId[0] : videoId;
    return `https://youtube.com/watch?v=${id}`;
  }
  // Fallback to YouTube search for the show
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " WIP Meetup OR Matthew Rizzle")}`;
};

// Check if guest has a direct video link
const hasDirectLink = (name: string) => !!guestVideoLinks[name];

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

// Verified guest list - only guests who actually appear in video titles from CSV
const guestData = [
  // A
  "Aavegotchi", "Al Crego", "Al Morris", "Alex Salnikov", "Alimo", "AlottaMoney", 
  "Andrew Steinwold", "Antara", "Arthr", "AtBarbieLove", "Azeem",
  // B
  "Bay Backner", "Bihoz", "Bitpixi", "Bryan Brinkman", "BullyMeow",
  // C
  "Caty Tedman", "Charl3s", "Chris Dawe", "Colborn", "Coldie", "CollectPods", 
  "Conlan", "Connie Digital", "Cryptograph", "CryptoMotors", "Cryptonatrix", 
  "Cryptoyuna", "CyberBrokers", "Cypherdudes",
  // D
  "DankVR", "Dannie Chu", "DeFi Dad", "Devin Finzer", "Dirk Lueth", "Dragonate", 
  "Drew Harding", "Dverso",
  // E
  "Eclectic Method", "Edmotions", "ElatedPixel", "Esther", "Ethlings", "Ezincrypto",
  // F
  "Fabiano Speziari", "FelixFelixFelix", "FlexasaurusRex", "FlyFrogs", "Foxyoga", 
  "Fractilians", "FrankyNeedles",
  // G
  "George Boya", "Green Giant",
  // H
  "Hackatao", "Han", "HerStoryDAO", "HiddenForces", "Hool", "HPrivakos", 
  "HubzzHQ", "Hugh McDonaugh",
  // J
  "Jeremy Cowart", "Jess Sloss", "Jesse Johnson", "Jiho", "Jin", "JisuArtist", 
  "Johan Unger", "John Crain", "Jonathan Mann", "Josie Bellini", "JoyWorld",
  // K
  "Kane Mayfield", "Kim Currier", "Kitty Bast",
  // L
  "LapinMignon", "Latashá", "Leandro", "Leo Da Gotchi", "Lin Dai", "Lucidhouse", 
  "Lucho Poletti", "Ludovica",
  // M
  "MarbleCards", "Matt Kane", "Matty DCLBlogger", "Meme.com", "MetaRick", 
  "Metageist", "Micah Johnson", "Mike Casey", "MovieShots", "MrRichi",
  // N
  "Nate Alex", "Nate Geier", "Nifty Island", "Niftytime",
  // O
  "Ol1y Art", "OnChainChain", "Oona", "OpenVoxels", "Osinachi",
  // P
  "Paradoxx", "Patricio W.", "Pointshark", "Proof of Beauty",
  // R
  "Reneil", "Richard F. Yates", "Robi C.", "Roham", "Roneil", "Roustan", "RussFranky",
  // S
  "Sasha Ivanov", "Sekud Beats", "Sho", "Sid Kalla", "Simona Pop", "Snail0x", 
  "Snowfro", "Stefan Große Halbuer", "Steve K.", "Steve McGarry", "Stina Jones", 
  "Supahmarbler", "SuperRare",
  // T
  "Terra Virtua", "The Sandbox", "TheBeatMiner", "TheSarahShow", 
  "Thomas Dylan Daniel", "Toxsam", "Trislit", "Twobadour",
  // U-V
  "UrBen", "Viktor Radchenko", "VIPE", "VjDelaria",
  // W
  "WhaleShark", "WizardX", "WoodenCyclops",
  // Y-Z
  "Young & Sick", "YRDGZ", "ZCreativeMedia", "Zeroone",
];

const GuestArchive = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
