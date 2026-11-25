/**
 * Axtara brand tokens — single source of truth.
 *
 * ⚠️  PROVISIONAL PALETTE
 * The official Axtara brand colours could not be extracted from
 * https://www.axtara.com/ during this build (the host was not reachable from
 * the build environment). The values below are a provisional palette chosen to
 * fit the "Operational Clarity" direction. They are NOT official Axtara colours.
 *
 * To apply the verified palette: replace the HEX values in `palette` below,
 * set `paletteVerified` to true and record the source. Every colour on the
 * website (marketing surfaces and product demonstrations) is derived from these
 * values through CSS custom properties, so no component changes are needed.
 */

export const paletteVerified = false;
export const paletteSource =
  "Provisional — awaiting verified HEX values from the existing Axtara brand assets.";

export const palette = {
  /** Primary brand scale (provisional). */
  brand: {
    50: "#EEF3FF",
    100: "#DCE6FF",
    200: "#B9CCFF",
    300: "#8AA8FB",
    400: "#5A80F2",
    500: "#3460E6",
    600: "#244BCC",
    700: "#1E3CA3",
    800: "#1C337F",
    900: "#172A63",
    950: "#0E1A3F",
  },
  /** Secondary accent used sparingly for field / attention moments (provisional). */
  accent: {
    100: "#FDF0D9",
    300: "#F6C873",
    500: "#E39B2D",
    600: "#C27F17",
    700: "#9A6312",
  },
  /** Neutral ramp — slightly warm, for an editorial feel. */
  neutral: {
    0: "#FFFFFF",
    25: "#FBFBFA",
    50: "#F6F6F4",
    100: "#EEEEEB",
    150: "#E5E5E1",
    200: "#D9D9D4",
    300: "#BDBDB7",
    400: "#93948F",
    500: "#6C6E6A",
    600: "#51534F",
    700: "#3A3C39",
    800: "#252725",
    900: "#161817",
    950: "#0C0D0D",
  },
  /** Dark immersive surfaces. */
  ink: {
    950: "#070A12",
    900: "#0B1020",
    850: "#10162A",
    800: "#151C33",
    700: "#222A45",
    600: "#343D5C",
  },
  /** Semantic status colours (always paired with text/icon — never colour alone). */
  status: {
    success: "#16794A",
    successBg: "#E6F4EC",
    warning: "#A15C07",
    warningBg: "#FDF1DE",
    danger: "#B4321F",
    dangerBg: "#FCE9E5",
    info: "#244BCC",
    infoBg: "#EAF0FF",
    neutral: "#51534F",
    neutralBg: "#EEEEEB",
  },
} as const;

export const radii = { xs: "4px", sm: "6px", md: "8px", lg: "12px", xl: "16px" } as const;

export const motion = {
  fast: "140ms",
  base: "220ms",
  slow: "420ms",
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

/** Builds the :root CSS custom properties from the token config. */
export function brandCssVariables(): string {
  const lines: string[] = [];
  const add = (name: string, value: string) => lines.push(`--${name}:${value};`);
  for (const [k, v] of Object.entries(palette.brand)) add(`brand-${k}`, v);
  for (const [k, v] of Object.entries(palette.accent)) add(`accent-${k}`, v);
  for (const [k, v] of Object.entries(palette.neutral)) add(`n-${k}`, v);
  for (const [k, v] of Object.entries(palette.ink)) add(`ink-${k}`, v);
  for (const [k, v] of Object.entries(palette.status)) add(`st-${k}`, v);
  for (const [k, v] of Object.entries(radii)) add(`r-${k}`, v);
  add("dur-fast", motion.fast);
  add("dur-base", motion.base);
  add("dur-slow", motion.slow);
  add("ease-out", motion.easeOut);
  add("ease-in-out", motion.easeInOut);
  return `:root{${lines.join("")}}`;
}
