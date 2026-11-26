"use client";

import { useState } from "react";
import { Eye, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { VisibilityRow } from "@/content/collaboration";

type Perspective = "gc" | "sub";

/**
 * "What can the GC see?" — toggle between the general contractor's and the
 * subcontractor's point of view. Shared vs private is always shown with an
 * icon and a text label, never colour alone.
 */
export function VisibilityExplorer({ rows, gcName, subName }: { rows: VisibilityRow[]; gcName: string; subName: string }) {
  const [p, setP] = useState<Perspective>("sub");
  const shared = rows.filter((r) => r.state === "shared");
  const priv = rows.filter((r) => r.state === "private");

  const sharedLabel = p === "sub" ? `${gcName} can see` : `You can see from ${subName}`;
  const privLabel = p === "sub" ? "Stays private to you" : `Stays private to ${subName}`;
  return (
    <div>
      <div role="group" aria-label="Choose a point of view" className="inline-flex rounded-lg bg-n-100 p-1">
        {([
          ["sub", "I'm the subcontractor"],
          ["gc", "I'm the general contractor"],
        ] as const).map(([k, l]) => (
          <button
            key={k}
            type="button"
            aria-pressed={p === k}
            onClick={() => setP(k)}
            className={cn(
              "h-9 rounded-md px-3.5 text-[14px] font-medium transition-[background-color,color,box-shadow] duration-200",
              p === k ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-150),0_1px_2px_rgb(0_0_0/0.05)]" : "text-n-600 hover:text-n-900",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <div key={p} className="anim-fade mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12" aria-live="polite">
        {[
          { title: sharedLabel, list: shared, Icon: Eye, state: "Shared" },
          { title: privLabel, list: priv, Icon: Lock, state: "Private" },
        ].map(({ title, list, Icon, state }) => (
          <div key={state}>
            <h3 className="flex items-center gap-2 text-[15px] font-medium text-n-950">
              <span className={cn("flex size-7 items-center justify-center rounded-md", state === "Shared" ? "bg-brand-50 text-brand-700" : "bg-n-100 text-n-700")}>
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              {title}
            </h3>
            <ul className="mt-4 border-t border-n-200">
              {list.map((r) => (
                <li key={r.item} className="grid grid-cols-[1fr_auto] items-start gap-4 border-b border-n-150 py-3.5">
                  <span>
                    <span className="block text-[15px] text-n-900">{p === "sub" ? r.item : r.gcItem}</span>
                    <span className="mt-0.5 block text-[13.5px] text-n-500">{p === "sub" ? r.note : r.gcNote}</span>
                  </span>
                  <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-[5px] px-1.5 py-[3px] text-[12px] font-medium", state === "Shared" ? "bg-brand-50 text-brand-800" : "bg-n-100 text-n-700")}>
                    <Icon className="size-3" aria-hidden="true" />{state}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
