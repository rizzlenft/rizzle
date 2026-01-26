import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, Users, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import wipLogo from "@/assets/wip-logo.gif";
import marsLogo from "@/assets/mattandrizz.jpeg";

// Known Twitter/X handles (add more as needed)
const twitterHandles: Record<string, string> = {
  "Beeple": "beeple",
  "Gary Vee": "garyvee",
  "Steve Aoki": "steveaoki",
  "Paris Hilton": "ParisHilton",
  "Serena Williams": "serenawilliams",
  "Kevin Rose": "kevinrose",
  "Tyler Winklevoss": "tyler",
  "Kimbal Musk": "kimikibal",
  "Rob Gronkowski": "RobGronkowski",
  "Waka Flocka Flame": "WakaFlocka",
  "DJ 3LAU": "3aborLAU",
  "Don Diablo": "DonDiablo",
  "Pharrell": "Pharrell",
  "Snowfro": "snowfro",
  "XCOPY": "XCOPYART",
  "Pranksy": "praboranksy",
  "Fvckrender": "fvckrender",
  "gmoney": "gabormoneyeth",
  "Farokh": "farokh",
  "Tyler Hobbs": "tylerxhoabbs",
  "Sam Spratt": "SamSpratt",
  "Coldie": "Coldie",
  "Hackatao": "Hackatao",
  "Slimesunday": "slimesunday",
  "Gremplin": "gremplin",
  "WhaleShark": "WhaleShark_Pro",
  "DCinvestor": "iamDCinvestor",
  "Devin Finzer": "daborefinzer",
  "Andrew Steinwold": "AndrewSteinwold",
  "Alexis Ohanian": "alexisohanian",
  "Richerd": "richerd",
  "Cool Cats": "coolcats",
  "Deadfellaz": "Deadfellaz",
  "Pudgy Penguins": "pudaborgypenguins",
  "Boss Beauties": "BossBeauties",
  "Luca Netz": "LucaNetz",
  "Keith Grossman": "KeithGrossman",
  "Robbie Ferguson": "roabbie",
  "Fewocious": "faborewocious",
  "Jason Bailey": "artnome",
  "Jen Stark": "JenStark",
  "Yam Karkai": "YKaborarkai",
  "Hasan Piker": "hasanthehun",
};

// Get Twitter URL - direct profile if known, search if not
const getTwitterUrl = (name: string) => {
  const handle = twitterHandles[name];
  if (handle) {
    return `https://x.com/${handle}`;
  }
  return `https://x.com/search?q=${encodeURIComponent(name)}&src=typed_query&f=user`;
};

// Check if guest has a known handle
const hasKnownHandle = (name: string) => !!twitterHandles[name];

// Comprehensive guest list extracted from WIP Meetup and Matthew & Rizzle Show
const guestData = [
  "Aavegotchi", "Aaron McDonald", "Adam Hollander", "AI Gods", "Alan Smithson",
  "Alexis Ohanian", "AlottaMoney", "Ana Berman", "Andrew Steinwold", "Angela Dalton",
  "AngelBaby", "AngryBirbs", "Arsonist", "Artie Handz", "AVASTARS",
  "Badger", "Barely Sociable", "Batsoupyum", "Beeple", "Ben Lakoff",
  "BigHeadClub", "BigPappa", "Bitange", "BitBoy", "Bored Ape Yacht Club",
  "Boss Beauties", "Bradley Gaskin", "BrandonZ", "Brett Shear", "Bryan Pellegrino",
  "Burned Toast", "Caitlin Disipio", "Callme.eth", "Captain", "Carly Reilly",
  "Charlotte Taylor", "Chase Chapman", "Chris Cantino", "Chris Clay", "Chris Young",
  "CL", "ClubNFT", "Coldie", "Colin Goltra", "Conor", "Cool Cats",
  "Courtyard.io", "Crayz", "CryptoBarista", "CryptoChrome", "CryptoGarga",
  "CryptoPunks", "CryptoStache", "DavidKim", "DCinvestor", "Dead Ringers",
  "Deadfellaz", "Debbie Soon", "Devin Finzer", "DevonZuegel", "Diana Chen",
  "DirtyRobot", "DJ 3LAU", "Don Diablo", "DrNickA", "Elle Hughes",
  "ElusiveAce", "Emily Yang", "Entropia Universe", "Evan Kuo", "Eve Aharon",
  "Farokh", "Fewocious", "FingerprintsDAO", "Flamingo DAO", "Fvckrender",
  "Gary Vee", "Gemma", "Ghxsts", "Gideon", "gmoney",
  "Godsolmon", "Grant Yun", "Gremplin", "Hackatao", "Hasan Piker",
  "HeyMint", "Hop Exchange", "HYPEBEAST", "Illestrater", "Isaac Wright",
  "Jake Udell", "Jake Vartanian", "James Bong", "Jason Bailey", "Jcook",
  "Jen Stark", "Jennifer Wong", "Jeremy Booth", "Jesse Johnson", "Jimmy McNelis",
  "Jin", "Jiwa", "JN Silva", "Jo Lupo", "John Crain",
  "John Egan", "Johnny Glitch", "Jonty Wareing", "Josh Ong", "JRNYclub",
  "Kaiser", "Keith Grossman", "Kevin Rose", "Kimbal Musk", "Kingship",
  "Lady Phe0nix", "Left Gallery", "Logik", "Lord Tachanka", "Loopify",
  "LordTinfoil", "Luca Netz", "Ludo", "Maker DAO", "Marc Weinstein",
  "Marchetti", "Mario Gabriele", "Mark Beylin", "Matt Galligan", "Matthew Liu",
  "Max Sansing", "Metakey", "Metaplex", "Michael Yamashita", "Midwit Millie",
  "Mike Cessario", "Mike Winkelmann", "Mocaverse", "Molly", "Motion Markup",
  "Muddy Mudskipper", "Murat Pak", "Mushroom Cats", "Nate Rivers", "ngl.eth",
  "Nouns DAO", "NTmre", "Ovie Faruq", "Osinachi", "OSF",
  "Pankaj Patel", "PaperclipMax", "Paris Hilton", "Patrick Mahomes", "Pepsi",
  "Pete Argent", "Pharrell", "Pixelord", "PleasrDAO", "Pranksy",
  "Prima Art", "Proof Collective", "Prtm", "Pudgy Penguins", "PunkApep",
  "PUNKS Comic", "PUNX Productions", "Pyxis", "Rainbowpoo2", "Rekt Dog",
  "Richard Chen", "Richerd", "Rob Gronkowski", "Robbie Ferguson", "Robness",
  "Roland Sands", "Rowdy", "Rudy", "Sam Spratt", "Sarah Meyohas",
  "Seerlight", "Seneca", "Serena Williams", "ShiLLa Mintwood", "Slimesunday",
  "Snowfro", "Sol Solana", "Sophia the Robot", "Sotheby's", "SpaceYacht",
  "Spartan", "Steve Aoki", "SugarMynt", "SuperRare", "Surgeon",
  "Swagg", "Switcheo Labs", "Tako", "Terraforms", "The Sandbox",
  "Tim Kang", "Token Gamer", "Toli Makedon", "Tomahawk", "TradingMind",
  "Treyo", "Truth Labs", "Twobadour", "Tyler Hobbs", "Tyler Winklevoss",
  "Universe", "Vendetta", "Ven Graphite", "Vini Jr", "Vinnie Hager",
  "VIV3", "VonMises", "Waka Flocka Flame", "Wang-Huei", "Waxbound",
  "Way2Lazy", "WebstersRat", "WhaleShark", "Will Papper", "Wolf Skull Jack",
  "WorldWideWebb3", "Wrecked", "XCOPY", "XenoCat", "Yam Karkai",
  "Yat", "Yayoi Kusama", "Yesports", "Yosnier", "Zancan", "Zipcy"
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
              <span>{guestData.length}+ notable guests since 2019</span>
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
                  <motion.a
                    key={guest}
                    href={getTwitterUrl(guest)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className={`group inline-flex items-center gap-1.5 rounded-full border bg-card/30 px-3 py-1.5 text-sm text-foreground hover:bg-card/60 transition-all cursor-pointer ${
                      hasKnownHandle(guest) 
                        ? "border-primary/30 hover:border-primary" 
                        : "border-border/50 hover:border-primary/50"
                    }`}
                  >
                    <span>{guest}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </motion.a>
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
