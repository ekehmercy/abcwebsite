/**
 * AXTARA DESIGN TOKENS — single source of truth for colour.
 *
 * BRAND PALETTE (specified by Axtara, screenshot-derived — applied as mandatory):
 *   Primary teal      #009DA5     Bright turquoise  #00BEC4
 *   Deep teal         #07575E     Brand navy        #02102B
 *   Warm off-white    #F7F7F2     White             #FFFFFF
 *   Primary text      #111111     Secondary text    #242424
 * SUPPORTING UI (specified):
 *   Dark teal hover   #007C84     Light teal surface #E6F7F7
 *   Pale turquoise    #C3EBE8     Muted text        #64748B
 *   Subtle border     #DDE7E7     Dark section bg   #061F29
 *
 * Accessibility adjustments (documented in docs/BRAND-COLOUR-REPORT.md):
 *   • White text on #009DA5 is 3.3:1 (fails WCAG AA for normal text), so filled
 *     buttons and small interactive labels use #007C84 (4.98:1) as their base,
 *     with #066A71 / deep teal on hover. #009DA5 is used for brand accents,
 *     icons, charts, focus rings and large display elements.
 *   • #64748B on #F7F7F2 is 4.43:1, so small muted text uses #5F6F84 (AA);
 *     #64748B remains the semantic "muted" value on white surfaces.
 */

export const paletteVerified = true;
export const paletteSource = "Axtara-specified brand palette (screenshot-derived), supplied by Axtara.";

/** BRAND SOURCE VALUES */
export const brandSource = {
  primary: "#009DA5",
  brightTurquoise: "#00BEC4",
  deepTeal: "#07575E",
  navy: "#02102B",
  offWhite: "#F7F7F2",
  white: "#FFFFFF",
  textPrimary: "#111111",
  textSecondary: "#242424",
  darkTealHover: "#007C84",
  lightTeal: "#E6F7F7",
  paleTurquoise: "#C3EBE8",
  muted: "#64748B",
  border: "#DDE7E7",
  darkSection: "#061F29",
  /** Kept for compatibility with older references. */
  accent: "#00BEC4",
  secondary: "#07575E" as string | null,
};

/* ── colour maths for intermediate steps only ── */
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

const B = brandSource;

export const palette = {
  /**
   * Brand teal scale. 500 = primary teal; 600 = dark teal (accessible base for
   * filled buttons and links); 800 = deep teal; 50/100 = light teal / pale turquoise.
   */
  brand: {
    50: B.lightTeal,
    100: B.paleTurquoise,
    200: mix(B.paleTurquoise, B.brightTurquoise, 0.35),
    300: mix(B.paleTurquoise, B.brightTurquoise, 0.7),
    400: B.brightTurquoise,
    500: B.primary,
    600: B.darkTealHover,
    700: mix(B.darkTealHover, B.deepTeal, 0.5),
    800: B.deepTeal,
    900: mix(B.deepTeal, B.navy, 0.35),
    950: mix(B.deepTeal, B.navy, 0.7),
  },
  /** Accent = bright turquoise, used sparingly for live / highlight moments. */
  accent: {
    100: B.lightTeal,
    300: mix(B.brightTurquoise, "#FFFFFF", 0.4),
    500: B.brightTurquoise,
    600: B.primary,
    700: B.darkTealHover,
  },
  /** NEUTRALS — off-white base, teal-grey borders, specified text colours. */
  neutral: {
    0: B.white,
    25: B.offWhite,
    50: "#F0F2ED",
    100: "#E8EEEC",
    150: B.border,
    200: "#CBD7D7",
    300: "#A8B5B8",
    400: "#8391A0",
    500: "#5F6F84",
    600: "#3D4653",
    700: "#2E333A",
    800: B.textSecondary,
    900: "#1A1A1A",
    950: B.textPrimary,
  },
  /** DARK SURFACES — navy and the specified dark section background. */
  ink: {
    950: B.navy,
    900: B.darkSection,
    850: mix(B.darkSection, B.deepTeal, 0.12),
    800: mix(B.darkSection, B.deepTeal, 0.22),
    700: mix(B.darkSection, B.deepTeal, 0.4),
    600: mix(B.darkSection, B.deepTeal, 0.6),
  },
  /** FUNCTIONAL STATUS — newly designed. Always paired with text/icon, never colour alone. */
  status: {
    success: "#16794A",
    successBg: "#E6F4EC",
    warning: "#A15C07",
    warningBg: "#FDF1DE",
    danger: "#B4321F",
    dangerBg: "#FCE9E5",
    info: B.darkTealHover,
    infoBg: B.lightTeal,
    neutral: "#3D4653",
    neutralBg: "#E8EEEC",
  },
};

/**
 * SEMANTIC TOKENS — what components should reach for.
 * `source`: "brand" = specified Axtara value; "designed" = derived or functional value.
 */
export const semantic = {
  primary: { value: B.primary, source: "brand" },
  primaryHover: { value: B.darkTealHover, source: "brand" },
  primaryActive: { value: B.deepTeal, source: "brand" },
  secondary: { value: B.deepTeal, source: "brand" },
  accent: { value: B.brightTurquoise, source: "brand" },
  navy: { value: B.navy, source: "brand" },
  tint: { value: B.lightTeal, source: "brand" },
  paleTint: { value: B.paleTurquoise, source: "brand" },
  shade: { value: B.deepTeal, source: "brand" },
  background: { value: B.offWhite, source: "brand" },
  backgroundAlt: { value: B.white, source: "brand" },
  backgroundDark: { value: B.darkSection, source: "brand" },
  textPrimary: { value: B.textPrimary, source: "brand" },
  textSecondary: { value: B.textSecondary, source: "brand" },
  textMuted: { value: B.muted, source: "brand" },
  border: { value: B.border, source: "brand" },
  divider: { value: "#E8EEEC", source: "designed" },
  success: { value: "#16794A", source: "designed" },
  warning: { value: "#A15C07", source: "designed" },
  error: { value: "#B4321F", source: "designed" },
  info: { value: B.darkTealHover, source: "brand" },
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
