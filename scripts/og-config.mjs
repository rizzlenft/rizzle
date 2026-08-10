/** Shared Open Graph image URLs — keep in sync with useSeo() page configs. */
export const OG = {
  home: {
    url: "https://rizzle.io/og/share-home.jpg",
    alt: "Rizzle — Web3 & AI Strategist",
    file: "share-home.jpg",
  },
  guests: {
    url: "https://rizzle.io/og/share-guests.jpg",
    alt: "Rizzle Network — WIP Meetup, Matt & Rizz, TokenSmart",
    file: "share-guests.jpg",
  },
  games: {
    url: "https://rizzle.io/og/share-games.jpg",
    alt: "Rizzle Arcade — browser games and live leaderboards",
    file: "share-games.jpg",
  },
  work: {
    url: "https://rizzle.io/og/share-work.jpg",
    alt: "Work With Rizzle — hire, partner, or invest",
    file: "share-work.jpg",
  },
  book: {
    url: "https://rizzle.io/og/share-book.jpg",
    alt: "Strategy Sprint — 45-minute Web3 session with Rizzle",
    file: "share-book.jpg",
  },
};

export const OG_FILES = Object.values(OG).map((entry) => entry.file);

export const PRERENDER_OG_CHECKS = [
  { html: "index.html", image: OG.home.url },
  { html: "guests/index.html", image: OG.guests.url },
  { html: "games/index.html", image: OG.games.url },
  { html: "work-with-rizzle/index.html", image: OG.work.url },
];

/** Legacy Lovable AI filenames — redirect to branded assets. */
export const LEGACY_OG_REDIRECTS = [
  ["/og/og-home.jpg", "/og/share-home.jpg"],
  ["/og/og-guests.jpg", "/og/share-guests.jpg"],
  ["/og/og-games.jpg", "/og/share-games.jpg"],
  ["/og/og-work.jpg", "/og/share-work.jpg"],
  ["/og/og-book.jpg", "/og/share-book.jpg"],
];
