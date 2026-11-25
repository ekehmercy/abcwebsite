import { cn } from "@/lib/cn";

/**
 * PROVISIONAL wordmark. Replace with the approved Axtara logo asset
 * (place it in /public/brand/ and swap this component's markup).
 */
export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
        <rect width="24" height="24" rx="6" fill={dark ? "#fff" : "var(--ink-900)"} />
        <path d="M6.2 18 L12 5.8 L17.8 18" fill="none" stroke={dark ? "var(--ink-900)" : "#fff"} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.6 13.6 H15.4" stroke="var(--brand-400)" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
      <span className={cn("text-[17px] font-semibold tracking-[-0.03em]", dark ? "text-white" : "text-n-950")}>axtara</span>
    </span>
  );
}
