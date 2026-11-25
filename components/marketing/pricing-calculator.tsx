"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { getRegion, regions, type RegionCode } from "@/config/regions";
import { marketModels, plans, type BillingId, type PlanId } from "@/config/pricing";
import { calculateQuote, formatMoney, suggestPlan, type RateCard } from "@/lib/pricing-engine";
import { useRegion } from "@/lib/use-region";
import { track } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const MAX_SLIDER = 600;

const fieldLabel = "block text-[13px] font-medium text-n-800";
const selectClass =
  "mt-2 h-11 w-full appearance-none rounded-md bg-white px-3 text-[15px] text-n-900 shadow-[0_0_0_1px_var(--n-200)] hover:shadow-[0_0_0_1px_var(--n-300)]";

export function PricingCalculator({ rateCards, preview }: { rateCards: RateCard[]; preview: boolean }) {
  const [regionCode, setRegion] = useRegion();
  const region = getRegion(regionCode);
  const model = marketModels[region.code];
  const [workers, setWorkers] = useState(60);
  const [planOverride, setPlanOverride] = useState<PlanId | null>(null);
  const [billingId, setBillingId] = useState<BillingId>("commitment-monthly");
  const tracked = useRef(false);

  const interact = () => {
    if (tracked.current) return;
    tracked.current = true;
    track("pricing_calculator_used", { region: region.code });
  };

  const suggested = suggestPlan(workers, plans) as PlanId;
  const planId = planOverride ?? suggested;
  const plan = plans.find((p) => p.id === planId)!;
  const billing = model?.billing.find((b) => b.id === billingId) ?? model?.billing[0] ?? null;

  const card = rateCards.find((c) => c.region === region.code);
  const rates = plan.quotedOnly ? undefined : card?.plans[planId as "core" | "scale"];

  const quote = useMemo(() => {
    if (!rates || !billing) return null;
    return calculateQuote({
      workers,
      perWorkerMonthly: rates.perWorkerMonthly,
      minimumMonthly: rates.minimumMonthly,
      multiplier: billing.multiplier,
      invoicing: billing.invoicing,
    });
  }, [rates, billing, workers]);

  const adjustment = billing
    ? billing.multiplier === 1
      ? "Standard rate"
      : billing.multiplier > 1
        ? `+${Math.round((billing.multiplier - 1) * 100)}% vs standard`
        : `−${Math.round((1 - billing.multiplier) * 100)}% vs standard`
    : null;

  const quoteHref = `/demo?${new URLSearchParams({
    interest: "pricing",
    plan: planId,
    workers: String(workers),
    region: region.code,
    ...(billing ? { billing: billing.id } : {}),
  }).toString()}`;

  const setW = (v: number) => {
    interact();
    setWorkers(Math.max(1, Math.min(10000, Math.round(Number.isFinite(v) ? v : 1))));
  };

  return (
    <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_var(--n-150),var(--shadow-card)] lg:grid-cols-[1.1fr_1fr]">
      {/* Inputs */}
      <form className="space-y-7 p-6 sm:p-8" onSubmit={(e) => e.preventDefault()} aria-label="Pricing calculator">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="calc-region" className={fieldLabel}>Country</label>
            <div className="relative">
            <select
              id="calc-region"
              className={cn(selectClass, "pr-9")}
              value={region.code}
              onChange={(e) => {
                interact();
                setRegion(e.target.value as RegionCode);
                setBillingId("commitment-monthly");
              }}
            >
              {regions.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-[calc(50%+4px)] size-4 -translate-y-1/2 text-n-500" aria-hidden="true" />
            </div>
          </div>
          <div>
            <p className={fieldLabel} id="calc-currency-label">Currency</p>
            <p className="mt-2 flex h-11 items-center rounded-md bg-n-50 px-3 text-[15px] text-n-700 shadow-[0_0_0_1px_var(--n-150)]" aria-labelledby="calc-currency-label">
              {region.currency.code} · {region.currency.name}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <label htmlFor="calc-workers" className={fieldLabel}>Active workers</label>
            <input
              id="calc-workers"
              type="number"
              inputMode="numeric"
              min={1}
              max={10000}
              value={workers}
              onChange={(e) => setW(Number(e.target.value))}
              className="h-10 w-28 rounded-md bg-white px-3 text-right text-[15px] tabular-nums text-n-900 shadow-[0_0_0_1px_var(--n-200)]"
            />
          </div>
          <input
            type="range"
            min={1}
            max={MAX_SLIDER}
            value={Math.min(workers, MAX_SLIDER)}
            onChange={(e) => setW(Number(e.target.value))}
            aria-label="Active workers slider"
            aria-valuetext={`${workers} workers`}
            className="mt-4 h-2 w-full cursor-pointer accent-[var(--brand-600)]"
          />
          <p className="mt-1.5 flex justify-between text-[12.5px] text-n-500"><span>1</span><span>{MAX_SLIDER}+ — type a larger number above</span></p>
          <p className="mt-2 text-[13px] text-n-500">An active worker is anyone who records time or activity in Axtara during the billing month.</p>
        </div>

        <fieldset>
          <legend className={fieldLabel}>Plan</legend>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-n-100 p-1">
            {plans.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "relative flex h-10 cursor-pointer items-center justify-center rounded-md text-[14px] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-500",
                  p.id === planId ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-150)]" : "text-n-600 hover:text-n-900",
                )}
              >
                <input
                  type="radio"
                  name="calc-plan"
                  value={p.id}
                  checked={p.id === planId}
                  onChange={() => {
                    interact();
                    setPlanOverride(p.id);
                  }}
                  className="sr-only"
                />
                {p.name}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-n-500" aria-live="polite">
            {planOverride && planOverride !== suggested ? (
              <>
                Suggested for {workers} workers: {plans.find((p) => p.id === suggested)!.name}.{" "}
                <button type="button" className="font-medium text-brand-700 underline underline-offset-2" onClick={() => setPlanOverride(null)}>Use suggestion</button>
              </>
            ) : (
              <>Suggested for {workers} workers based on typical team size.</>
            )}
          </p>
        </fieldset>

        <fieldset>
          <legend className={fieldLabel}>Billing arrangement</legend>
          {model ? (
            <div className="mt-2 space-y-2">
              {model.billing.map((b) => (
                <label
                  key={b.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg p-3.5 transition-shadow",
                    b.id === billing?.id ? "bg-brand-50/50 shadow-[0_0_0_1.5px_var(--brand-400)]" : "shadow-[0_0_0_1px_var(--n-200)] hover:shadow-[0_0_0_1px_var(--n-300)]",
                  )}
                >
                  <input
                    type="radio"
                    name="calc-billing"
                    value={b.id}
                    checked={b.id === billing?.id}
                    onChange={() => {
                      interact();
                      setBillingId(b.id);
                    }}
                    className="mt-1 size-4 accent-[var(--brand-600)]"
                  />
                  <span>
                    <span className="block text-[14.5px] font-medium text-n-900">{b.name}</span>
                    <span className="block text-[13.5px] leading-5 text-n-600">{b.description}</span>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-2 rounded-lg bg-n-50 p-3.5 text-[14px] leading-6 text-n-600 shadow-[0_0_0_1px_var(--n-150)]">
              Billing arrangements for {region.name} are being set as part of our market launch. We&apos;ll confirm options with you directly.
            </p>
          )}
        </fieldset>
      </form>

      {/* Summary */}
      <div className="flex flex-col border-t border-n-150 bg-n-25 p-6 sm:p-8 lg:border-l lg:border-t-0" aria-live="polite">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-medium text-n-900">Your estimate</h3>
          {model?.status === "proposed" && <span className="rounded-sm bg-accent-100/70 px-1.5 py-0.5 text-[11.5px] font-medium text-accent-700 ring-1 ring-inset ring-accent-300/60">Proposed model</span>}
          {region.pricingModel === "under-review" && <span className="rounded-sm bg-n-100 px-1.5 py-0.5 text-[11.5px] font-medium text-n-600 ring-1 ring-inset ring-n-200">Under review</span>}
          {preview && card && !card.approved && <span className="rounded-sm bg-bad-bg px-1.5 py-0.5 text-[11.5px] font-medium text-bad">Internal preview — unapproved rates</span>}
        </div>

        <dl className="mt-5 divide-y divide-n-150 text-[14.5px]">
          {[
            ["Country", `${region.name} · ${region.currency.code}`],
            ["Plan", plan.name],
            ["Active workers", workers.toLocaleString("en")],
            ["Billing", billing?.name ?? "To be confirmed"],
            ["Rate adjustment", adjustment ?? "—"],
            ["Invoiced", billing ? (billing.invoicing === "annual" ? "Once a year, in advance" : "Monthly") : "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5">
              <dt className="text-n-500">{k}</dt>
              <dd className="text-right font-medium text-n-900">{v}</dd>
            </div>
          ))}
        </dl>

        {quote ? (
          <div className="mt-6 rounded-xl bg-white p-5 shadow-[0_0_0_1px_var(--n-150)]">
            <p className="text-[13px] text-n-500">{billing?.invoicing === "annual" ? "Per annual invoice" : "Per month"}</p>
            <p className="mt-1 text-[34px] font-semibold tracking-[-0.03em] text-n-950 tabular-nums">{formatMoney(quote.perInvoice, region.currency.code)}</p>
            <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-[13.5px]">
              <dt className="text-n-500">Monthly equivalent</dt><dd className="text-right tabular-nums text-n-900">{formatMoney(quote.monthly, region.currency.code)}</dd>
              <dt className="text-n-500">Annual total</dt><dd className="text-right tabular-nums text-n-900">{formatMoney(quote.annualTotal, region.currency.code)}</dd>
              <dt className="text-n-500">Effective per worker</dt><dd className="text-right tabular-nums text-n-900">{formatMoney(quote.effectivePerWorker, region.currency.code)}</dd>
            </dl>
            {quote.minimumApplied && (
              <p className="mt-3 flex gap-2 rounded-md bg-n-50 p-2.5 text-[13px] text-n-600"><Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />The {plan.name} plan minimum applies at this team size.</p>
            )}
            <p className="mt-3 text-[12.5px] text-n-500">Excludes implementation, third-party software and applicable taxes.</p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-white p-5 shadow-[0_0_0_1px_var(--n-150)]">
            <p className="text-[16px] font-medium text-n-950">
              {plan.quotedOnly
                ? "Enterprise is quoted for each organisation."
                : region.pricingModel === "under-review"
                  ? `The commercial model for ${region.name} is under review.`
                  : `Pricing for ${region.name} is being finalised.`}
            </p>
            <p className="mt-2 text-[14px] leading-6 text-n-600">
              Your subscription is the greater of your active workers multiplied by the plan&apos;s per-worker rate, or the plan&apos;s monthly minimum{adjustment && billing && billing.multiplier !== 1 ? `, with ${adjustment.replace(" vs standard", "")} applied for ${billing.name.toLowerCase()}` : ""}. We&apos;ll send a written quote for {workers.toLocaleString("en")} workers on {plan.name}.
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Link href={quoteHref} className={buttonClass("primary", "md")}>Get a quote</Link>
          <Link href="/demo?interest=pricing" className={buttonClass("secondary", "md")}>Request a Demo</Link>
        </div>
      </div>
    </div>
  );
}
