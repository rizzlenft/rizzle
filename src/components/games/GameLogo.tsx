interface GameLogoProps {
  src: string;
  title: string;
  /** "square" for tab icons; "wide" for landscape logos */
  variant?: "square" | "wide";
  size?: "sm" | "md" | "lg";
  /** Extra zoom + contrast for dark/busy artwork at tab size */
  boost?: boolean;
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
const GameLogo = ({ src, title, variant = "square", size = "sm", boost = false }: GameLogoProps) => (
  <div
    className={`relative shrink-0 overflow-hidden rounded-xl ring-2 shadow-lg ${sizeClass[size]} ${
      boost ? "ring-white/20" : "ring-white/10"
    } ${variant === "wide" ? "aspect-[3/2] w-auto max-w-[5.5rem]" : "aspect-square"}`}
    style={{
      background: boost
        ? "linear-gradient(145deg, #fafafa 0%, #f0f0f2 40%, #e8e8ec 100%)"
        : "linear-gradient(145deg, #f4f4f5 0%, #e4e4e7 45%, #d4d4d8 100%)",
    }}
  >
    <div className={`absolute inset-0 ${boost ? "bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,1),transparent_65%)]" : "bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.9),transparent_70%)]"}`} />
    <img
      src={src}
      alt=""
      className={`relative z-[1] h-full w-full ${
        boost ? "p-0.5 sm:p-1 object-cover object-center scale-[1.35] brightness-110 contrast-115 saturate-125" : "p-1.5 sm:p-2 object-cover object-center scale-110"
      } ${variant === "wide" && !boost ? "object-contain object-center" : ""}`}
      loading="lazy"
      decoding="async"
    />
    <span className="sr-only">{title}</span>
  </div>
);

export default GameLogo;
