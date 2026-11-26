/**
 * Privacy-conscious analytics configuration. Analytics is OFF unless a provider
 * is configured. Non-essential tracking never loads before consent.
 *
 * Supported providers out of the box:
 *   plausible — cookieless; set NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible and NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 *   custom    — events are dispatched as `axtara:analytics` DOM events and pushed to window.dataLayer
 */
export const analyticsConfig = {
  provider: (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || "none") as "none" | "plausible" | "custom",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
  plausibleSrc: process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.tagged-events.js",
  /** Whether a consent decision is required before analytics loads. */
  requireConsent: process.env.NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT !== "false",
};

export type AnalyticsEvent =
  | "demo_cta_clicked"
  | "demo_form_started"
  | "demo_form_submitted"
  | "product_tour_started"
  | "product_tour_completed"
  | "pricing_calculator_used"
  | "feature_page_viewed"
  | "industry_page_viewed"
  | "integration_request_submitted"
  | "contact_form_submitted"
  | "partner_enquiry_submitted"
  | "roi_calculator_used";
