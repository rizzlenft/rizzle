interface GameLogoProps {
  src: string;
  title: string;
  /** "square" for tab icons; "wide" for landscape logos */
  variant?: "square" | "wide";
  size?: "sm" | "md" | "lg";
  /** How the artwork fills the frame */
  fit?: "contain" | "cover";
  /** Tailwind scale utility, e.g. scale-125 */
  zoom?: string;
  /** Inner padding around the artwork */
  pad?: "none" | "xs" | "sm";
  /** Light frame for dark artwork (Whack-a-Mole) */
  brightFrame?: boolean;
  /** Dark arcade-style frame for neon artwork */
  darkFrame?: boolean;
}

const sizeClass = {
  sm: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
  md: "h-20 w-20",
  lg: "h-24 w-24",
};

const padClass = {
  none: "p-0",
  xs: "p-0.5 sm:p-1",
  sm: "p-1.5 sm:p-2",
};

/**
 * High-contrast logo frame for game selector cards — light backing so
 * neon/busy artwork stays readable on the dark Arcade page.
 */
const GameLogo = ({
  src,
  title,
  variant = "square",
  size = "sm",
  fit = "contain",
  zoom = "scale-100",
  pad = "xs",
  brightFrame = false,
  darkFrame = false,
}: GameLogoProps) => (
  <div
    className={`relative shrink-0 overflow-hidden rounded-xl ring-2 shadow-lg ${sizeClass[size]} ${
      darkFrame ? "ring-primary/30" : brightFrame ? "ring-white/20" : "ring-white/10"
    } ${variant === "wide" ? "aspect-[3/2] w-auto max-w-[5.5rem]" : "aspect-square"}`}
    style={{
      background: darkFrame
        ? "linear-gradient(145deg, #1a1030 0%, #0c0818 55%, #120820 100%)"
        : brightFrame
          ? "linear-gradient(145deg, #fafafa 0%, #f0f0f2 40%, #e8e8ec 100%)"
          : "linear-gradient(145deg, #f4f4f5 0%, #e4e4e7 45%, #d4d4d8 100%)",
    }}
  >
    {!darkFrame && (
      <div
        className={`absolute inset-0 ${
          brightFrame
            ? "bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,1),transparent_65%)]"
            : "bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.9),transparent_70%)]"
        }`}
      />
    )}
    {darkFrame && (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,0,180,0.12),transparent_62%)]" />
    )}
    <img
      src={src}
      alt=""
      className={`relative z-[1] h-full w-full ${padClass[pad]} ${zoom} ${
        fit === "cover" ? "object-cover object-center" : "object-contain object-center"
      }`}
      loading="lazy"
      decoding="async"
    />
    <span className="sr-only">{title}</span>
  </div>
);

export default GameLogo;
