/** Shared Open Graph image URLs — keep in sync with scripts/og-config.mjs. */
export const OG = {
  home: {
    url: "https://rizzle.io/og/og-home.jpg",
    alt: "Rizzle — Web3 & AI Strategist",
  },
  guests: {
    url: "https://rizzle.io/og/og-guests.jpg",
    alt: "Rizzle Network — WIP Meetup, Matt & Rizz, TokenSmart",
  },
  games: {
    url: "https://rizzle.io/og/og-games.jpg",
    alt: "Rizzle Arcade — browser games and live leaderboards",
  },
  work: {
    url: "https://rizzle.io/og/og-work.jpg",
    alt: "Work With Rizzle — hire, partner, or invest",
  },
  book: {
    url: "https://rizzle.io/og/og-book.jpg",
    alt: "Strategy Sprint — 45-minute Web3 session with Rizzle",
  },
} as const;

export const OG_WIDTH = "1200";
export const OG_HEIGHT = "630";
