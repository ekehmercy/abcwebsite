"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { adjacentTools, integrationCategories, type Integration, type IntegrationCategory } from "@/config/integrations";
import { Icon } from "@/components/ui/icon";
import { LeadForm } from "@/components/forms/lead-form";
import { cn } from "@/lib/cn";

const REQUEST_EVENT = "axtara:integration-request";

/** Pre-selects a category in the enquiry form and scrolls to it. */
function requestConnection(categoryName: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("category", categoryName);
  url.hash = "request";
  window.history.replaceState(null, "", url.toString());
  window.dispatchEvent(new Event(REQUEST_EVENT));
  document.getElementById("request")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function IntegrationDirectory({ available }: { available: Integration[] }) {
  const [cat, setCat] = useState<IntegrationCategory | "all">("all");
  const shown = integrationCategories.filter((c) => cat === "all" || c.id === cat);
  const chip = (active: boolean) =>
    cn(
      "h-9 shrink-0 whitespace-nowrap rounded-md px-3 text-[14px] font-medium transition-colors",
      active ? "bg-ink-900 text-white" : "bg-white text-n-700 shadow-[0_0_0_1px_var(--n-200)] hover:text-n-950",
    );

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>All categories</button>
        {integrationCategories.map((c) => (
          <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)} className={chip(cat === c.id)}>{c.name}</button>
        ))}
      </div>

      <ul className="mt-8 border-t border-n-150" aria-live="polite">
        {shown.map((c) => {
          const items = available.filter((i) => i.category === c.id);
          return (
            <li key={c.id} className="grid gap-5 border-b border-n-150 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] md:items-start md:gap-10">
              <div className="flex items-start gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-600 shadow-[0_0_0_1px_var(--n-150)]">
                  <Icon name={c.icon} className="size-4" />
                </span>
                <div>
                  <h3 className="text-[17px] font-medium tracking-[-0.01em] text-n-950">{c.name}</h3>
                  <p className="mt-1 text-[14px] text-n-500">{c.outcome}</p>
                </div>
              </div>
              <div>
                <p className="text-[15px] leading-6 text-n-600">{c.description}</p>
                <dl className="mt-4 grid gap-3 text-[14px] leading-6 sm:grid-cols-2">
                  <div className="rounded-lg bg-n-50 px-3.5 py-3">
                    <dt className="text-[12.5px] font-medium text-n-500">Stays in your {c.name.toLowerCase()} tool</dt>
                    <dd className="mt-0.5 text-n-800">{c.stays}</dd>
                  </div>
                  <div className="rounded-lg bg-brand-50 px-3.5 py-3">
                    <dt className="text-[12.5px] font-medium text-brand-800">Moves with Axtara</dt>
                    <dd className="mt-0.5 text-n-800">{c.flows}</dd>
                  </div>
                </dl>
                {items.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {items.map((i) => (
                      <li key={i.id} className="flex items-start gap-3 rounded-lg bg-white p-3.5 shadow-[0_0_0_1px_var(--n-150)]">
                        <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-2 text-[14.5px] font-medium text-n-900">
                            {i.name}
                            <span className="rounded bg-ok-bg px-1.5 py-0.5 text-[11.5px] font-medium text-ok">Available</span>
                          </span>
                          <span className="mt-0.5 block text-[14px] leading-6 text-n-600">{i.description}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={() => requestConnection(c.name)}
                className="inline-flex h-10 items-center gap-1.5 justify-self-start whitespace-nowrap rounded-md bg-white px-3.5 text-[14px] font-medium text-n-900 shadow-[0_0_0_1px_var(--n-200)] transition-colors hover:bg-n-25 hover:shadow-[0_0_0_1px_var(--n-300)]"
              >
                Request this connection <ArrowRight className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-12">
        <h3 className="text-[17px] font-medium tracking-[-0.01em] text-n-950">Also alongside your specialist tools</h3>
        <p className="mt-1.5 max-w-2xl text-[14.5px] leading-6 text-n-600">Axtara keeps the field and project record. The specialist work stays where it belongs.</p>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-xl bg-n-150 md:grid-cols-3">
          {adjacentTools.map((t) => (
            <li key={t.name} className="bg-white p-5">
              <p className="text-[15px] font-medium text-n-950">{t.name}</p>
              <p className="mt-2 text-[13.5px] leading-5 text-n-500">Stays there: {t.stays}</p>
              <p className="mt-2 text-[14px] leading-6 text-n-700">In Axtara: {t.axtara}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** The integration enquiry form. Remounts (re-reading URL pre-fill) when a category is requested above. */
export function IntegrationRequestForm({ fallbackEmail }: { fallbackEmail: string | null }) {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const onRequest = () => setKey((k) => k + 1);
    window.addEventListener(REQUEST_EVENT, onRequest);
    return () => window.removeEventListener(REQUEST_EVENT, onRequest);
  }, []);
  return <LeadForm key={key} form="integration-request" fallbackEmail={fallbackEmail} />;
}
