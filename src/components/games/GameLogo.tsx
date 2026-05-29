interface GameLogoProps {
  src: string;
  title: string;
  /** "square" for tab icons; "wide" for landscape logos */
  variant?: "square" | "wide";
  size?: "sm" | "md" | "lg";
}

const sizeClass = {
  sm: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
  md: "h-20 w-20",
  lg: "h-24 w-24",
};

/**
 * High-contrast logo frame for game selector cards — light backing so
 * neon/busy artwork stays readable on the dark Arcade page.
 */
const GameLogo = ({ src, title, variant = "square", size = "sm" }: GameLogoProps) => (
  <div
    className={`relative shrink-0 overflow-hidden rounded-xl ring-2 ring-white/10 shadow-lg ${sizeClass[size]} ${
      variant === "wide" ? "aspect-[3/2] w-auto max-w-[5.5rem]" : "aspect-square"
    }`}
    style={{
      background: "linear-gradient(145deg, #f4f4f5 0%, #e4e4e7 45%, #d4d4d8 100%)",
    }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.9),transparent_70%)]" />
    <img
      src={src}
      alt=""
      className={`relative z-[1] h-full w-full p-1.5 sm:p-2 ${
        variant === "wide" ? "object-contain object-center" : "object-cover object-center scale-110"
      }`}
      loading="lazy"
      decoding="async"
    />
    <span className="sr-only">{title}</span>
  </div>
);

export default GameLogo;
