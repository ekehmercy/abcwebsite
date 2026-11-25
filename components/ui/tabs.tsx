"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation).
 * Panels are rendered on the server and passed in, so switching tabs ships
 * almost no JavaScript — inactive panels are simply hidden.
 */
export function Tabs({
  tabs,
  panels,
  label,
  listClassName,
  tabClass,
  tabActiveClass,
  tabInactiveClass,
  panelClassName,
  layoutClassName,
  trackEvent,
}: {
  tabs: { id: string; label: ReactNode }[];
  panels: ReactNode[];
  label: string;
  listClassName?: string;
  /** Class strings (not functions) so server components can configure styling. */
  tabClass?: string;
  tabActiveClass?: string;
  tabInactiveClass?: string;
  panelClassName?: string;
  layoutClassName?: string;
  /** Optional analytics event fired on first interaction. */
  trackEvent?: "product_tour_started" | "pricing_calculator_used";
}) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tracked = useRef(false);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (trackEvent && !tracked.current) {
      tracked.current = true;
      track(trackEvent, { source: label });
    }
    if (focus) {
      refs.current[i]?.focus();
      refs.current[i]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = tabs.length;
    const map: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in map) {
      e.preventDefault();
      select((active + map[e.key] + n) % n, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(n - 1, true);
    }
  };

  return (
    <div className={layoutClassName}>
      <div role="tablist" aria-label={label} className={listClassName} onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className={cn(tabClass, i === active ? tabActiveClass : tabInactiveClass)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div
          key={tabs[i].id}
          role="tabpanel"
          id={`${uid}-panel-${tabs[i].id}`}
          aria-labelledby={`${uid}-tab-${tabs[i].id}`}
          hidden={i !== active}
          tabIndex={0}
          className={cn(panelClassName, i === active && "anim-fade")}
        >
          {p}
        </div>
      ))}
    </div>
  );
}
