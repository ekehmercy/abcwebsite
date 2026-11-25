"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { OverviewScreen, type HeroStage } from "@/components/product-demo/screens";
import { MobileClockIn, type ClockStage } from "@/components/product-demo/mobile-screens";
import { PhoneFrame } from "@/components/product-demo/primitives";
import { cn } from "@/lib/cn";

/** Timeline: [phone stage, desktop stage, active caption step, duration ms] */
const timeline: [ClockStage, HeroStage, number, number][] = [
  [0, 0, 0, 1800],
  [1, 0, 0, 1400],
  [2, 1, 1, 2600],
  [2, 2, 2, 2400],
  [2, 3, 3, 3400],
];

const captions = ["Worker clocks in on site", "Record enters the review queue", "Supervisor approves", "Dashboard updates"];

export function HeroDemo() {
  const [i, setI] = useState(timeline.length - 1);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(rm.matches);
    if (!rm.matches) {
      setI(0);
      setPlaying(true);
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    const t = window.setTimeout(() => setI((x) => (x + 1) % timeline.length), timeline[i][3]);
    return () => window.clearTimeout(t);
  }, [i, playing, visible]);

  const [phone, desk, step] = timeline[i];
  const flowing = i === 2;

  return (
    <div ref={rootRef} className="relative">
      {/* Composition */}
      <div className="relative mx-auto max-w-[1180px] lg:pl-[218px]">
        {/* Mobile: the field app leads, the management view follows */}
        <div className="mb-5 flex justify-center sm:hidden">
          <PhoneFrame label="Axtara mobile app: Kemar Williams clocks in at Harbour Point, Block B" className="w-[224px]">
            <MobileClockIn stage={phone} />
          </PhoneFrame>
        </div>
        <div className="relative">
          <OverviewScreen stage={desk} className="min-h-[420px]" />
        </div>

        {/* Phone: stacked above on mobile, overlapping the dashboard on large screens */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 hidden -translate-x-1/2 sm:block lg:bottom-[-48px] lg:left-0 lg:translate-x-0">
          <PhoneFrame label="Axtara mobile app: Kemar Williams clocks in at Harbour Point, Block B" className="w-[218px] lg:w-[236px]">
            <MobileClockIn stage={phone} />
          </PhoneFrame>
        </div>

        {/* Data path from phone to the review queue (desktop only) */}
        <svg className="pointer-events-none absolute left-[226px] top-[214px] hidden h-[140px] w-[110px] overflow-visible lg:block" viewBox="0 0 110 140" aria-hidden="true">
          <path id="hero-path" d="M0 132 C 40 132, 50 30, 106 18" fill="none" stroke="var(--brand-400)" strokeWidth="1.5" strokeDasharray="3 4" opacity={flowing ? 0.9 : 0.35} style={{ transition: "opacity 400ms" }} />
          {flowing && !reduced && (
            <circle r="4" fill="var(--brand-600)" style={{ offsetPath: "path('M0 132 C 40 132, 50 30, 106 18')", animation: "travel 1100ms var(--ease-in-out) both" }} />
          )}
        </svg>
      </div>

      {/* Caption + controls */}
      <div className="relative mx-auto mt-6 flex max-w-[1180px] flex-col gap-3 sm:mt-16 lg:mt-20 lg:flex-row lg:items-center lg:justify-between lg:pl-[218px]">
        <ol className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 xl:flex xl:flex-nowrap" aria-label="What this demonstration shows">
          {captions.map((c, n) => (
            <li key={c} className={cn("flex items-center gap-2 text-[13.5px] transition-colors duration-300", n === step ? "text-n-950" : "text-n-400", "whitespace-nowrap")}>
              <span className={cn("flex size-5 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors duration-300", n === step ? "bg-brand-600 text-white" : n < step ? "bg-brand-100 text-brand-700" : "bg-n-100 text-n-500")}>{n + 1}</span>
              {c}
            </li>
          ))}
        </ol>
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap text-[12.5px] text-n-500">Illustrative · fictional data</p>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex size-8 items-center justify-center rounded-full bg-white text-n-700 shadow-[0_0_0_1px_var(--n-200)] hover:text-n-950"
              aria-label={playing ? "Pause demonstration" : "Play demonstration"}
            >
              {playing ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live={playing ? "off" : "polite"}>{`Step ${step + 1} of 4: ${captions[step]}`}</p>
    </div>
  );
}
