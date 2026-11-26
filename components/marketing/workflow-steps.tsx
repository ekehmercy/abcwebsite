"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/** Compact interactive workflow: click a step (or use the arrows) to focus it. */
export function WorkflowSteps({ steps }: { steps: { actor: string; action: string }[] }) {
  const [i, setI] = useState(0);
  const n = steps.length;
  return (
    <div>
      <ol className="relative grid gap-3 md:grid-flow-col md:auto-cols-fr md:gap-0">
        {steps.map((s, k) => (
          <li key={k} className="relative md:pr-4">
            {k < n - 1 && <span aria-hidden="true" className={cn("absolute left-[15px] top-8 h-[calc(100%-8px)] w-px md:left-8 md:top-[15px] md:h-px md:w-[calc(100%-32px)]", k < i ? "bg-brand-400" : "bg-n-200")} />}
            <button
              type="button"
              onClick={() => setI(k)}
              aria-current={k === i ? "step" : undefined}
              className="group relative flex w-full gap-3 text-left md:flex-col"
            >
              <span className={cn("relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums ring-4 ring-n-25 transition-colors", k === i ? "bg-brand-600 text-white" : k < i ? "bg-brand-100 text-brand-700" : "bg-white text-n-500 shadow-[0_0_0_1px_var(--n-200)]")}>{k + 1}</span>
              <span className={cn("block rounded-lg p-0 transition-colors md:mt-1", k === i ? "" : "opacity-70 group-hover:opacity-100")}>
                <span className="block text-[12.5px] font-medium text-brand-700">{s.actor}</span>
                <span className="mt-1 block text-[15px] leading-6 text-n-800">{s.action}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex items-center gap-2">
        <button type="button" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0} aria-label="Previous step" className="inline-flex size-9 items-center justify-center rounded-md bg-white shadow-[0_0_0_1px_var(--n-200)] disabled:opacity-40"><ChevronLeft className="size-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => setI((x) => Math.min(n - 1, x + 1))} disabled={i === n - 1} aria-label="Next step" className="inline-flex size-9 items-center justify-center rounded-md bg-white shadow-[0_0_0_1px_var(--n-200)] disabled:opacity-40"><ChevronRight className="size-4" aria-hidden="true" /></button>
        <p className="ml-2 text-[13.5px] text-n-500" aria-live="polite">Step {i + 1} of {n}</p>
      </div>
    </div>
  );
}
