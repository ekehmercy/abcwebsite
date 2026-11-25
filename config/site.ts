/**
 * Core site and company information. Business facts live here — not in components.
 * Values marked `null` are awaiting approval and the UI degrades gracefully.
 */

export const site = {
  name: "Axtara",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.axtara.com",
  tagline: "The connected workforce and project operations platform",
  description:
    "Axtara connects your people, field operations and projects — from clock-in on site to approval, cost visibility and payroll preparation — for construction and project-driven businesses.",
  shortDescription:
    "Workforce and project operations for construction and project-driven businesses.",
  parentCompany: "Anchor Bridge",
  locale: "en",
} as const;

/** Customer-facing contact details. `null` = not yet approved for publication. */
export const contact = {
  salesEmail: process.env.NEXT_PUBLIC_SALES_EMAIL || null,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || null,
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || null,
  securityEmail: process.env.NEXT_PUBLIC_SECURITY_EMAIL || null,
} as const;

/** Product application URLs. */
export const appUrls = {
  /** Customer sign-in URL for the Axtara web application. */
  login: process.env.NEXT_PUBLIC_APP_LOGIN_URL || null,
  /** App store listings — buttons only render when a real listing URL exists. */
  appStore: process.env.NEXT_PUBLIC_APP_STORE_URL || null,
  googlePlay: process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || null,
} as const;
