import type { Capability, FeatureStatus } from "@/config/features";

/**
 * Strict claims mode: only capabilities that are `available` AND `verified`
 * are presented as available. Defaults to ON for production builds; set
 * CLAIMS_MODE=preview to review unverified copy without badges.
 */
export const strictClaims =
  (process.env.NEXT_PUBLIC_CLAIMS_MODE ?? (process.env.NODE_ENV === "production" ? "strict" : "preview")) ===
  "strict";

export type DisplayStatus = FeatureStatus | "confirm";

export function displayStatus(cap: Pick<Capability, "status" | "verified">): DisplayStatus {
  if (cap.status === "available" && !cap.verified && strictClaims) return "confirm";
  return cap.status;
}

export const displayStatusLabel: Record<DisplayStatus, string | null> = {
  available: null,
  confirm: "Confirm in demo",
  "in-development": "In development",
  planned: "Planned",
  "integration-required": "Integration required",
};
