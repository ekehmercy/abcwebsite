"use client";

import { useMemo, useState } from "react";
import { integrationCategories, integrationStatusLabels, type Integration, type IntegrationCategory, type IntegrationStatus } from "@/config/integrations";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const statusTone: Record<IntegrationStatus | "confirm", string> = {
  available: "bg-ok-bg text-ok",
  confirm: "bg-n-100 text-n-600",
  planned: "bg-brand-50 text-brand-700",
  "under-evaluation": "bg-n-100 text-n-700",
  "customer-requested": "bg-accent-100/70 text-accent-700",
};

export function IntegrationDirectory({ items, strict }: { items: Integration[]; strict: boolean }) {
  const [cat, setCat] = useState<IntegrationCategory | "all">("all");
  const [status, setStatus] = useState<IntegrationStatus | "all">("all");

  const shown = useMemo(() => items.filter((i) => (cat === "all" || i.category === cat) && (status === "all" || i.status === status)), [items, cat, status]);
  const chip = (active: boolean) =>
    cn(
      "h-9 shrink-0 whitespace-nowrap rounded-md px-3 text-[14px] font-medium transition-colors",
      active ? "bg-ink-900 text-white" : "bg-white text-n-700 shadow-[0_0_0_1px_var(--n-200)] hover:text-n-950",
    );
  const label = (i: Integration) => (i.status === "available" && !i.verified && strict ? "Confirm in demo" : integrationStatusLabels[i.status]);
  const tone = (i: Integration) => statusTone[i.status === "available" && !i.verified && strict ? "confirm" : i.status];

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>All categories</button>
          {integrationCategories.map((c) => (
            <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)} className={chip(cat === c.id)}>{c.name}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="int-status" className="text-[14px] text-n-600">Status</label>
          <select id="int-status" value={status} onChange={(e) => setStatus(e.target.value as IntegrationStatus | "all")} className="h-9 rounded-md bg-white px-3 text-[14px] text-n-800 shadow-[0_0_0_1px_var(--n-200)]">
            <option value="all">All statuses</option>
            {(Object.keys(integrationStatusLabels) as IntegrationStatus[]).map((s) => <option key={s} value={s}>{integrationStatusLabels[s]}</option>)}
          </select>
        </div>
      </div>

      <p className="mt-6 text-[13.5px] text-n-500" aria-live="polite">{shown.length} {shown.length === 1 ? "entry" : "entries"}</p>
      {shown.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-n-200 p-10 text-center">
          <p className="text-[15px] font-medium text-n-900">Nothing matches these filters yet.</p>
          <p className="mt-1 text-[14px] text-n-600">Tell us what you need using the request form below.</p>
        </div>
      ) : (
        <ul className="mt-3 grid gap-px overflow-hidden rounded-xl bg-n-150 shadow-[0_0_0_1px_var(--n-150)] md:grid-cols-2 md:[&>li:last-child:nth-child(odd)]:col-span-2">
          {shown.map((i) => {
            const c = integrationCategories.find((x) => x.id === i.category)!;
            return (
              <li key={i.id} className="flex gap-4 bg-white p-5 sm:p-6">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-n-50 text-brand-600 shadow-[0_0_0_1px_var(--n-150)]">
                  <Icon name={c.icon} className="size-4" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <h3 className="text-[15.5px] font-medium text-n-950">{i.name}</h3>
                    <span className={cn("rounded px-1.5 py-0.5 text-[11.5px] font-medium", tone(i))}>{label(i)}</span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-n-500">{c.name}</p>
                  <p className="mt-2 text-[14.5px] leading-6 text-n-600">{i.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
