/**
 * AXTARA DESIGN TOKENS — single source of truth for colour.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ BRAND COLOUR STATUS: AWAITING VERIFIED EXTRACTION                   │
 * │ The official reference is https://www.axtara.com/. It could not be  │
 * │ reached from the build environment (DNS / proxy blocked), and no    │
 * │ original Axtara logo or brand asset exists in this repository.      │
 * │ `brandSource.primary` and `brandSource.accent` below are therefore  │
 * │ PROVISIONAL placeholders — not official Axtara colours.             │
 * │                                                                     │
 * │ To apply the verified colours:                                      │
 * │   node scripts/extract-brand-colours.cjs   (needs network access    │
 * │   to www.axtara.com) → docs/BRAND-COLOUR-REPORT.md                  │
 * │ then set the two HEX values below and `paletteVerified = true`.     │
 * │ Every brand tint, shade, hover and active state is derived from     │
 * │ them automatically.                                                 │
 * └─────────────────────────────────────────────────────────────────────┘
 */

export const paletteVerified = false;
export const paletteSource =
  "Provisional — official values pending extraction from www.axtara.com (site unreachable from build environment).";

/** BRAND (extracted values go here). */
export const brandSource = {
  /** Axtara primary brand colour. Provisional until extracted. */
  primary: "#244BCC",
  /** Axtara accent colour, used sparingly (field / attention moments). Provisional until extracted. */
  accent: "#E39B2D",
  /** Secondary brand colour, if the extraction finds one. null = not used. */
  secondary: null as string | null,
};

/* ── colour maths: derive tints / shades from a single brand HEX ── */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}
function rgbToHex([r, g, b]: number[]): string {
  return "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("").toUpperCase();
}
/** Mix `hex` with `target` by `amount` (0–1). */
export function mix(hex: string, target: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return rgbToHex(a.map((v, i) => v + (b[i] - v) * amount));
}
function scaleFrom(base: string) {
  const w = "#FFFFFF";
  const k = "#0A0D18";
  return {
    50: mix(base, w, 0.93),
    100: mix(base, w, 0.86),
    200: mix(base, w, 0.72),
    300: mix(base, w, 0.52),
    400: mix(base, w, 0.3),
    500: mix(base, w, 0.12),
    600: base,
    700: mix(base, k, 0.18),
    800: mix(base, k, 0.34),
    900: mix(base, k, 0.5),
    950: mix(base, k, 0.68),
  } as const;
}

export const palette = {
  /** Derived from brandSource.primary. */
  brand: scaleFrom(brandSource.primary),
  /** Derived from brandSource.accent. */
  accent: {
    100: mix(brandSource.accent, "#FFFFFF", 0.84),
    300: mix(brandSource.accent, "#FFFFFF", 0.4),
    500: brandSource.accent,
    600: mix(brandSource.accent, "#000000", 0.15),
    700: mix(brandSource.accent, "#000000", 0.32),
  },
  /** NEUTRALS — newly designed (not brand colours). Slightly warm, editorial. */
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
  /** DARK SURFACES — newly designed, tinted toward the brand primary. */
  ink: {
    950: mix(brandSource.primary, "#05070D", 0.93),
    900: mix(brandSource.primary, "#090D1A", 0.9),
    850: mix(brandSource.primary, "#0E1326", 0.88),
    800: mix(brandSource.primary, "#131A31", 0.86),
    700: mix(brandSource.primary, "#212842", 0.84),
    600: mix(brandSource.primary, "#333B58", 0.82),
  },
  /** FUNCTIONAL STATUS — newly designed. Always paired with text/icon, never colour alone. */
  status: {
    success: "#16794A",
    successBg: "#E6F4EC",
    warning: "#A15C07",
    warningBg: "#FDF1DE",
    danger: "#B4321F",
    dangerBg: "#FCE9E5",
    info: brandSource.primary,
    infoBg: mix(brandSource.primary, "#FFFFFF", 0.92),
    neutral: "#51534F",
    neutralBg: "#EEEEEB",
  },
};

/**
 * SEMANTIC TOKENS — what components should reach for.
 * `source`: "brand" = derived from extracted brand values; "designed" = new neutral/functional value.
 */
export const semantic = {
  primary: { value: palette.brand[600], source: "brand" },
  primaryHover: { value: palette.brand[700], source: "brand" },
  primaryActive: { value: palette.brand[800], source: "brand" },
  secondary: { value: brandSource.secondary ?? palette.ink[900], source: brandSource.secondary ? "brand" : "designed" },
  accent: { value: palette.accent[500], source: "brand" },
  tint: { value: palette.brand[50], source: "brand" },
  shade: { value: palette.brand[900], source: "brand" },
  background: { value: palette.neutral[25], source: "designed" },
  backgroundAlt: { value: palette.neutral[0], source: "designed" },
  backgroundDark: { value: palette.ink[900], source: "designed" },
  textPrimary: { value: palette.neutral[950], source: "designed" },
  textSecondary: { value: palette.neutral[600], source: "designed" },
  textMuted: { value: palette.neutral[500], source: "designed" },
  border: { value: palette.neutral[150], source: "designed" },
  divider: { value: palette.neutral[100], source: "designed" },
  success: { value: palette.status.success, source: "designed" },
  warning: { value: palette.status.warning, source: "designed" },
  error: { value: palette.status.danger, source: "designed" },
  info: { value: palette.status.info, source: "brand" },
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
  for (const [k, v] of Object.entries(semantic)) add(`ax-${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`, v.value);
  add("dur-fast", motion.fast);
  add("dur-base", motion.base);
  add("dur-slow", motion.slow);
  add("ease-out", motion.easeOut);
  add("ease-in-out", motion.easeInOut);
  return `:root{${lines.join("")}}`;
}
