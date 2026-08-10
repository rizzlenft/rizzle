/** Shared Open Graph image URLs — keep in sync with useSeo() page configs. */
export const OG = {
  home: {
    url: "https://rizzle.io/og/og-home.jpg",
    alt: "Rizzle — Web3 & AI Strategist",
    file: "og-home.jpg",
  },
  guests: {
    url: "https://rizzle.io/og/og-guests.jpg",
    alt: "Rizzle Network — WIP Meetup, Matt & Rizz, TokenSmart",
    file: "og-guests.jpg",
  },
  games: {
    url: "https://rizzle.io/og/og-games.jpg",
    alt: "Rizzle Arcade — browser games and live leaderboards",
    file: "og-games.jpg",
  },
  work: {
    url: "https://rizzle.io/og/og-work.jpg",
    alt: "Work With Rizzle — hire, partner, or invest",
    file: "og-work.jpg",
  },
  book: {
    url: "https://rizzle.io/og/og-book.jpg",
    alt: "Strategy Sprint — 45-minute Web3 session with Rizzle",
    file: "og-book.jpg",
  },
};

export const OG_FILES = Object.values(OG).map((entry) => entry.file);

export const PRERENDER_OG_CHECKS = [
  { html: "index.html", image: OG.home.url },
  { html: "guests/index.html", image: OG.guests.url },
  { html: "games/index.html", image: OG.games.url },
  { html: "work-with-rizzle/index.html", image: OG.work.url },
];
