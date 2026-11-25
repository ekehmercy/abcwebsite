import type { Capability } from "@/config/features";
import { displayStatus, displayStatusLabel } from "@/lib/claims";
import { cn } from "@/lib/cn";

/** Shows a capability's availability, derived from the feature register. Renders nothing for verified, available features. */
export function AvailabilityBadge({ cap, dark }: { cap: Pick<Capability, "status" | "verified">; dark?: boolean }) {
  const s = displayStatus(cap);
  const label = displayStatusLabel[s];
  if (!label) return null;
  const tone =
    s === "confirm"
      ? dark ? "text-white/70 ring-white/20" : "text-n-600 ring-n-200 bg-n-50"
      : s === "integration-required"
        ? dark ? "text-accent-300 ring-accent-300/30" : "text-accent-700 ring-accent-300/60 bg-accent-100/50"
        : dark ? "text-brand-200 ring-brand-300/30" : "text-brand-700 ring-brand-200 bg-brand-50";
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-sm px-1.5 py-0.5 text-[11.5px] font-medium ring-1 ring-inset", tone)}>
      {label}
    </span>
  );
}
