"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

export type JourneyStep = { title: string; actor: string; person: string; detail: string };

const STEP_MS = 5200;

/**
 * Signature interactive walkthrough. Visuals are server-rendered and passed in;
 * this component only controls which one is shown.
 */
export function Journey({ steps, visuals }: { steps: JourneyStep[]; visuals: ReactNode[] }) {
  const [i, setI] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  useEffect(() => {
    setVisited((v) => (v.has(i) ? v : new Set(v).add(i)));
  }, [i]);
  const [playing, setPlaying] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const started = useRef(false);
  const completed = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const n = steps.length;

  const go = (next: number, fromUser = true) => {
    const v = Math.max(0, Math.min(n - 1, next));
    setI(v);
    setProgressKey((k) => k + 1);
    if (fromUser && !started.current) {
      started.current = true;
      track("product_tour_started", { source: "journey" });
    }
    if (v === n - 1 && !completed.current) {
      completed.current = true;
      track("product_tour_completed", { source: "journey" });
    }
  };

  // Autoplay begins when the section is in view (not under reduced motion); stops at the last step.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setPlaying((p) => (e.isIntersecting ? p || !started.current : false)), { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (i >= n - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => go(i + 1, false), STEP_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, playing, n]);

  const userGo = (next: number) => {
    setPlaying(false);
    go(next);
  };

  const s = steps[i];

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12">
      {/* Step rail */}
      <div>
        <ol className="relative space-y-1" aria-label="Journey steps">
          {steps.map((st, k) => (
            <li key={st.title}>
              <button
                type="button"
                onClick={() => userGo(k)}
                aria-current={k === i ? "step" : undefined}
                className={cn(
                  "group relative flex w-full items-start gap-3.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                  k === i ? "bg-white shadow-[0_0_0_1px_var(--n-150),var(--shadow-card)]" : "hover:bg-n-50",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold tabular-nums transition-colors",
                    k === i ? "bg-brand-600 text-white" : k < i ? "bg-brand-100 text-brand-700" : "bg-n-100 text-n-500",
                  )}
                >
                  {k + 1}
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-[15px] font-medium leading-6", k === i ? "text-n-950" : "text-n-600")}>{st.title}</span>
                  <span className="block text-[13px] text-n-500">{st.actor}</span>
                  {k === i && (
                    <span className="relative mt-2 block h-0.5 w-full overflow-hidden rounded-full bg-n-100">
                      <span
                        key={progressKey}
                        className="absolute inset-y-0 left-0 bg-brand-500"
                        style={{ width: playing ? "100%" : "0%", transition: playing ? `width ${STEP_MS}ms linear` : "none" }}
                      />
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Stage */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-n-600" aria-live="polite">
            <span className="font-medium text-n-950">Step {i + 1} of {n}</span> · {s.person}
          </p>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => userGo(i - 1)} disabled={i === 0} className="inline-flex size-9 items-center justify-center rounded-md bg-white text-n-700 shadow-[0_0_0_1px_var(--n-200)] hover:text-n-950 disabled:opacity-40" aria-label="Previous step">
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (i === n - 1) go(0);
                setPlaying((p) => !p);
                if (!started.current) {
                  started.current = true;
                  track("product_tour_started", { source: "journey-play" });
                }
              }}
              className="inline-flex size-9 items-center justify-center rounded-md bg-white text-n-700 shadow-[0_0_0_1px_var(--n-200)] hover:text-n-950"
              aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
            >
              {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => userGo(i + 1)} disabled={i === n - 1} className="inline-flex size-9 items-center justify-center rounded-md bg-white text-n-700 shadow-[0_0_0_1px_var(--n-200)] hover:text-n-950 disabled:opacity-40" aria-label="Next step">
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => userGo(0)} className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-[13.5px] font-medium text-n-600 hover:bg-n-100 hover:text-n-950" aria-label="Restart walkthrough">
              <RotateCcw className="size-3.5" aria-hidden="true" />Restart
            </button>
          </div>
        </div>

        <div className="relative mt-4 flex min-h-[460px] flex-col justify-center overflow-hidden rounded-2xl bg-n-100/70 p-3 shadow-[inset_0_0_0_1px_var(--n-150)] sm:p-6 lg:min-h-[600px]">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          {visuals.map((v, k) => (
            <div key={k} hidden={k !== i} className={cn("relative", k === i && "anim-fade")}>
              {visited.has(k) ? v : null}
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-[15px] leading-6 text-n-600">{s.detail}</p>
      </div>
    </div>
  );
}
