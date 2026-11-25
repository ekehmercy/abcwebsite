import Image from "next/image";
import { media } from "@/content/media";
import { cn } from "@/lib/cn";

const showBriefs = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_MEDIA_BRIEFS === "true";

/**
 * Renders a licensed photograph from the media registry, or — until one is
 * supplied — a restrained architectural placeholder (never unlicensed stock).
 */
export function EditorialImage({
  slot,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  variant = 0,
}: {
  slot: keyof typeof media | string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  variant?: number;
}) {
  const m = media[slot];
  const pos = /(^|\s)absolute(\s|$)/.test(className ?? "") ? "" : "relative";
  if (m?.src) {
    return (
      <div className={cn(pos, "overflow-hidden bg-n-100", className)}>
        <Image src={m.src} alt={m.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div role="img" aria-label={m?.alt ?? "Construction site"} className={cn(pos, "overflow-hidden bg-[#061F29]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_0%,#0F4A52_0%,#061F29_55%,#02102B_100%)]" />
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full opacity-[0.55]" aria-hidden="true">
        <g stroke="#5FD0D2" strokeWidth="0.8" fill="none" opacity="0.55">
          {variant % 2 === 0 ? (
            <>
              {/* building frame */}
              {[0, 1, 2, 3, 4].map((f) => <line key={f} x1="70" x2="330" y1={260 - f * 42} y2={260 - f * 42} />)}
              {[70, 135, 200, 265, 330].map((x) => <line key={x} x1={x} x2={x} y1="92" y2="260" />)}
              <line x1="330" x2="330" y1="20" y2="260" strokeWidth="1.2" />
              <line x1="190" x2="372" y1="28" y2="28" strokeWidth="1.2" />
              <line x1="330" x2="372" y1="20" y2="28" />
              <line x1="350" x2="350" y1="28" y2="74" strokeDasharray="2 3" />
              <rect x="342" y="74" width="16" height="10" />
            </>
          ) : (
            <>
              {/* road / corridor */}
              <path d="M0 260 L170 150 L230 150 L400 260" />
              <path d="M200 150 L200 260" strokeDasharray="6 8" />
              <path d="M40 240 L140 175" opacity=".6" />
              <path d="M360 240 L260 175" opacity=".6" />
              <rect x="250" y="190" width="50" height="22" />
              <line x1="300" y1="196" x2="330" y2="170" />
              <line x1="330" y1="170" x2="345" y2="190" />
            </>
          )}
        </g>
        <rect x="0" y="260" width="400" height="40" fill="#02102B" />
      </svg>
      {showBriefs && m && (
        <p className="absolute inset-x-3 top-3 rounded-md bg-black/50 px-2.5 py-1.5 text-[11.5px] leading-4 text-white/80 backdrop-blur">
          Photography slot · {m.brief}
        </p>
      )}
    </div>
  );
}
