"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Check, FileText, HardHat, Layers } from "lucide-react";
import { cn } from "@/lib/cn";
import { adjacentOrder, adjacentTools, fitRoles, type Stage } from "@/content/lifecycle";

type Perspective = "gc" | "sub";

/**
 * Lifecycle explorer: choose a stage (arrow keys move between stages) and a
 * perspective; see what each company does, what happens on site, the records
 * produced and the specialist tools that sit alongside.
 */
export function LifecycleExplorer({ stages }: { stages: Stage[] }) {
  const [i, setI] = useState(() => Math.max(0, stages.findIndex((s) => s.id === "execute")));
  const [p, setP] = useState<Perspective>("gc");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const s = stages[i];

  // On narrow screens the stage list scrolls horizontally: bring the initial stage into view without moving the page.
  useEffect(() => {
    const list = listRef.current;
    const tab = refs.current[i];
    if (list && tab && list.scrollWidth > list.clientWidth) list.scrollLeft = tab.offsetLeft - list.offsetLeft - 16;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const n = stages.length;

  const select = (k: number, focus = false) => {
    setI(k);
    if (focus) {
      refs.current[k]?.focus();
      refs.current[k]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in map) {
      e.preventDefault();
      select((i + map[e.key] + n) % n, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(n - 1, true);
    }
  };

  const tools = adjacentOrder.filter((t) => s.adjacent.includes(t));
  const role = fitRoles[s.role];
  const me = p === "gc" ? { label: "GC or developer", does: s.gcDoes, challenge: s.challenge.gc, value: s.value.gc } : { label: "Subcontractor", does: s.subDoes, challenge: s.challenge.sub, value: s.value.sub };
  const other = p === "gc" ? { label: "Your subcontractors", does: s.subDoes } : { label: "Your GC or developer", does: s.gcDoes };

  return (
    <div>
      {/* Perspective */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Choose a perspective" className="inline-flex rounded-lg bg-n-100 p-1">
          {([
            ["gc", "GC or developer"],
            ["sub", "Subcontractor"],
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
        <p className="text-[13.5px] text-n-500">Use the arrow keys to move between stages.</p>
      </div>

      {/* Stage selector */}
      <div ref={listRef} role="tablist" aria-label="Construction project stages" onKeyDown={onKey} className="-mx-4 mt-6 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:grid lg:grid-cols-8">
        {stages.map((st, k) => (
          <button
            key={st.id}
            ref={(el) => {
              refs.current[k] = el;
            }}
            type="button"
            role="tab"
            id={`stage-tab-${st.id}`}
            aria-selected={k === i}
            aria-controls="stage-panel"
            tabIndex={k === i ? 0 : -1}
            onClick={() => select(k)}
            className={cn(
              "flex min-w-[132px] shrink-0 flex-col items-start rounded-lg px-3 py-2.5 text-left transition-[background-color,box-shadow] lg:min-w-0",
              k === i ? "bg-white shadow-[0_0_0_1px_var(--brand-300),var(--shadow-card)]" : "bg-n-50 hover:bg-white hover:shadow-[0_0_0_1px_var(--n-150)]",
            )}
          >
            <span className={cn("font-mono text-[12px]", k === i ? "text-brand-700" : "text-n-400")}>0{st.n}</span>
            <span className={cn("mt-1 text-[14px] font-medium leading-5", k === i ? "text-n-950" : "text-n-700")}>{st.short}</span>
            <span className="mt-0.5 text-[11.5px] leading-4 text-n-500">{fitRoles[st.role].label}</span>
          </button>
        ))}
      </div>

      {/* Stage detail */}
      <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${s.id}`} key={`${s.id}-${p}`} className="anim-fade mt-6 grid gap-6 rounded-2xl bg-white p-6 shadow-[0_0_0_1px_var(--n-150)] sm:p-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-n-500">
            Stage {s.n} of 8
            <span className="inline-flex items-center gap-1 rounded-[5px] bg-brand-50 px-1.5 py-[3px] text-[12px] text-brand-800">{role.label}</span>
          </p>
          <h3 className="t-h3 mt-3 text-n-950">{s.title}</h3>
          <p className="mt-2 text-[14px] leading-6 text-n-500">{role.text}</p>

          <div className="mt-6 border-t border-n-150 pt-5">
            <h4 className="text-[13px] font-medium text-n-500">The problem today · {me.label}</h4>
            <p className="mt-1.5 text-[15.5px] leading-7 text-n-800">{me.challenge}</p>
          </div>
          <div className="mt-5 border-t border-n-150 pt-5">
            <h4 className="text-[13px] font-medium text-brand-700">What you do in Axtara</h4>
            <p className="mt-1.5 text-[15.5px] leading-7 text-n-900">{me.does}</p>
            <p className="mt-3 flex gap-2 text-[15px] leading-6 text-n-700"><ArrowRight className="mt-1 size-4 shrink-0 text-brand-600" aria-hidden="true" />{me.value}</p>
          </div>
          <div className="mt-5 grid gap-5 border-t border-n-150 pt-5 sm:grid-cols-2">
            <div>
              <h4 className="flex items-center gap-1.5 text-[13px] font-medium text-n-500"><Layers className="size-3.5" aria-hidden="true" />{other.label}</h4>
              <p className="mt-1.5 text-[14.5px] leading-6 text-n-700">{other.does}</p>
            </div>
            <div>
              <h4 className="flex items-center gap-1.5 text-[13px] font-medium text-n-500"><HardHat className="size-3.5" aria-hidden="true" />On site</h4>
              <p className="mt-1.5 text-[14.5px] leading-6 text-n-700">{s.field ?? "Nothing happens on site yet at this stage."}</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl bg-n-25 p-5 shadow-[0_0_0_1px_var(--n-150)]">
            <h4 className="flex items-center gap-1.5 text-[13px] font-medium text-n-500"><FileText className="size-3.5" aria-hidden="true" />Records produced</h4>
            <ul className="mt-3 space-y-2">
              {s.records.map((r) => (
                <li key={r} className="flex gap-2 text-[14.5px] leading-6 text-n-800"><Check className="mt-1 size-3.5 shrink-0 text-brand-600" aria-hidden="true" />{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-medium text-n-500">Works alongside</h4>
            <ul className="mt-3 space-y-3">
              {tools.map((t) => (
                <li key={t} className="border-l-2 border-n-200 pl-3.5">
                  <p className="text-[14.5px] font-medium text-n-900">{adjacentTools[t].name}</p>
                  <p className="mt-0.5 text-[13.5px] leading-5 text-n-600">{adjacentTools[t].note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Adjacent tools band (desktop) */}
      <div className="mt-10 hidden lg:block" aria-label="Specialist tools across the project lifecycle">
        <h3 className="text-[13px] font-medium text-n-500">Specialist tools across the lifecycle</h3>
        <div className="mt-3 grid grid-cols-[repeat(10,minmax(0,1fr))] gap-x-1.5 text-[11.5px] text-n-500">
          <span className="px-1">Before</span>
          {Array.from({ length: 8 }).map((_, k) => (
            <span key={k} className={cn("px-1 font-mono", stages[i]?.n === k + 1 && "font-semibold text-brand-700")}>0{k + 1}</span>
          ))}
          <span className="px-1">After</span>
        </div>
        <div className="relative mt-1.5 space-y-1.5">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 grid w-full grid-cols-[repeat(10,minmax(0,1fr))] gap-x-1.5">
            {Array.from({ length: 10 }).map((_, k) => (
              <span key={k} className={cn("rounded-md", k === s.n ? "bg-brand-50" : "")} />
            ))}
          </div>
          {adjacentOrder.map((t) => {
            const [a, b] = adjacentTools[t].span;
            const on = s.adjacent.includes(t);
            return (
              <div key={t} className="relative grid grid-cols-[repeat(10,minmax(0,1fr))] gap-x-1.5">
                <span
                  className={cn("truncate rounded-[5px] px-2 py-1 text-[12px] font-medium transition-colors", on ? "bg-ink-900 text-white" : "bg-n-100 text-n-600")}
                  style={{ gridColumn: `${a + 1} / ${b + 2}` }}
                  title={adjacentTools[t].note}
                >
                  {adjacentTools[t].name}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] text-n-500">Highlighted tools sit alongside the selected stage. Axtara exchanges records with them; it doesn't replace them.</p>
      </div>
    </div>
  );
}
