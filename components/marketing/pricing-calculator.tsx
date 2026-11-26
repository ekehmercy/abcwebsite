"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { getRegion, regions, type RegionCode } from "@/config/regions";
import { baseAllowanceBilling, companyTypes, marketModels, plans, type BillingArrangement, type CompanyTypeId, type PlanId } from "@/config/pricing";
import {
  calculateBaseQuote, calculateQuote, formatMoney, isBaseAllowance, suggestPlan, type RateCard,
} from "@/lib/pricing-engine";
import { useRegion } from "@/lib/use-region";
import { track } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const MAX_SLIDER = 600;

const fieldLabel = "block text-[13px] font-medium text-n-800";
const selectClass =
  "mt-2 h-11 w-full appearance-none rounded-md bg-white px-3 text-[15px] text-n-900 shadow-[0_0_0_1px_var(--n-200)] hover:shadow-[0_0_0_1px_var(--n-300)]";
const numberClass = "h-10 w-28 rounded-md bg-white px-3 text-right text-[15px] tabular-nums text-n-900 shadow-[0_0_0_1px_var(--n-200)]";

const rank = (id: PlanId) => plans.findIndex((p) => p.id === id);

function suggestFor(workers: number, projects: number): PlanId {
  const byWorkers = suggestPlan(Math.max(1, workers), plans) as PlanId;
  const byProjects = (plans.find((p) => projects >= p.suggestedProjects[0] && (p.suggestedProjects[1] === null || projects <= p.suggestedProjects[1]))?.id ?? "enterprise") as PlanId;
  return rank(byProjects) > rank(byWorkers) ? byProjects : byWorkers;
}

export function PricingCalculator({ rateCards, preview }: { rateCards: RateCard[]; preview: boolean }) {
  const [regionCode, setRegion] = useRegion();
  const region = getRegion(regionCode);
  const [companyType, setCompanyType] = useState<CompanyTypeId>("gc");
  const [ownCrews, setOwnCrews] = useState(true);
  const [workers, setWorkers] = useState(60);
  const [projects, setProjects] = useState(3);
  const [planOverride, setPlanOverride] = useState<PlanId | null>(null);
  const [billingId, setBillingId] = useState<string>("commitment-monthly");
  const tracked = useRef(false);

  const interact = () => {
    if (tracked.current) return;
    tracked.current = true;
    track("pricing_calculator_used", { region: region.code });
  };

  const type = companyTypes.find((t) => t.id === companyType)!;
  const hasCrews = type.crews === "always" || ownCrews;
  const effectiveWorkers = hasCrews ? workers : 0;

  const card = rateCards.find((c) => c.region === region.code);
  const billingOptions: BillingArrangement[] =
    card?.model === "base-plus-allowance" ? baseAllowanceBilling : (marketModels[region.code]?.billing ?? []);

  const suggested = suggestFor(effectiveWorkers, projects);
  const planId = planOverride ?? suggested;
  const plan = plans.find((p) => p.id === planId)!;
  const billing = billingOptions.find((b) => b.id === billingId) ?? billingOptions[0] ?? null;
  const rates = card?.plans[planId];

  const quote = useMemo(() => {
    if (!rates || !billing) return null;
    if (isBaseAllowance(rates)) {
      const q = calculateBaseQuote({
        ...rates,
        projects,
        workers: effectiveWorkers,
        billing: billing.invoicing === "annual" ? "annual" : "monthly",
        annualBaseDiscount: card?.annualBaseDiscount,
      });
      return {
        kind: "base" as const,
        headline: billing.invoicing === "annual" ? q.annualBase ?? 0 : q.monthlyCharge,
        headlineLabel: `${rates.indicative ? "From · " : ""}${billing.invoicing === "annual" ? "Base, paid annually in advance" : "Per month"}`,
        rows: [
          ["Base subscription", formatMoney(q.base, region.currency.code) + " / month"],
          [`Additional projects (${q.extraProjects})`, formatMoney(q.projectAdditions, region.currency.code) + " / month"],
          [`Additional workers (${q.extraWorkers})`, formatMoney(q.workerAdditions, region.currency.code) + " / month"],
          ["Effective monthly, year one", formatMoney(q.effectiveMonthly, region.currency.code)],
          ["Year-one total", formatMoney(q.yearOne, region.currency.code)],
        ],
        note: rates.indicative
          ? `Enterprise starts from ${rates.includedProjects} company-managed projects and ${rates.includedWorkers} of your own workers. This estimate is indicative — capacity and terms are confirmed in your quote.`
          : `${plan.name} includes ${rates.includedProjects} company-managed projects and ${rates.includedWorkers} of your own workers.${billing.invoicing === "annual" ? " Additional projects and workers are invoiced monthly." : ""}`,
      };
    }
    const q = calculateQuote({
      workers: effectiveWorkers,
      perWorkerMonthly: rates.perWorkerMonthly,
      minimumMonthly: rates.minimumMonthly,
      multiplier: billing.multiplier,
      invoicing: billing.invoicing,
    });
    return {
      kind: "workers" as const,
      headline: q.perInvoice,
      headlineLabel: billing.invoicing === "annual" ? "Per annual invoice" : "Per month",
      rows: [
        ["Monthly equivalent", formatMoney(q.monthly, region.currency.code)],
        ["Annual total", formatMoney(q.annualTotal, region.currency.code)],
        ["Effective per worker", formatMoney(q.effectivePerWorker, region.currency.code)],
      ],
      note: q.minimumApplied ? `The ${plan.name} plan minimum applies at this team size.` : null,
    };
  }, [rates, billing, effectiveWorkers, projects, card, plan.name, region.currency.code]);

  const adjustment = billing && card?.model !== "base-plus-allowance"
    ? billing.multiplier === 1
      ? "Standard rate"
      : billing.multiplier > 1
        ? `+${Math.round((billing.multiplier - 1) * 100)}% vs standard`
        : `−${Math.round((1 - billing.multiplier) * 100)}% vs standard`
    : null;

  const quoteHref = `/demo?${new URLSearchParams({
    interest: "pricing",
    business: companyType,
    type: type.short,
    plan: planId,
    workers: String(effectiveWorkers),
    projects: String(projects),
    ...(type.crews === "ask" ? { crews: ownCrews ? "yes" : "no" } : {}),
    region: region.code,
    ...(billing ? { billing: billing.id } : {}),
  }).toString()}`;

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(Number.isFinite(v) ? v : min)));
  const setW = (v: number) => {
    interact();
    setWorkers(clamp(v, 1, 10000));
  };
  const setP = (v: number) => {
    interact();
    setProjects(clamp(v, 0, 500));
  };

  return (
    <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_var(--n-150),var(--shadow-card)] lg:grid-cols-[1.1fr_1fr]">
      {/* Inputs */}
      <form className="space-y-7 p-6 sm:p-8" onSubmit={(e) => e.preventDefault()} aria-label="Pricing calculator">
        <fieldset>
          <legend className={fieldLabel}>Your company</legend>
          <div className="mt-2 grid gap-1 rounded-lg bg-n-100 p-1 sm:grid-cols-3">
            {companyTypes.map((t) => (
              <label
                key={t.id}
                className={cn(
                  "relative flex min-h-10 cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-center text-[13.5px] font-medium leading-tight transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-500",
                  t.id === companyType ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-150)]" : "text-n-600 hover:text-n-900",
                )}
              >
                <input
                  type="radio"
                  name="calc-type"
                  value={t.id}
                  checked={t.id === companyType}
                  onChange={() => {
                    interact();
                    setCompanyType(t.id);
                    setPlanOverride(null);
                  }}
                  className="sr-only"
                />
                {t.label}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-n-500">{type.sizing}</p>
        </fieldset>

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

        {type.crews === "ask" && (
          <fieldset>
            <legend className={fieldLabel}>Do you employ your own site crews?</legend>
            <div className="mt-2 inline-flex rounded-lg bg-n-100 p-1">
              {[
                [true, "Yes"],
                [false, "No"],
              ].map(([v, l]) => (
                <label
                  key={String(v)}
                  className={cn(
                    "relative flex h-9 min-w-16 cursor-pointer items-center justify-center rounded-md px-4 text-[14px] font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-500",
                    ownCrews === v ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-150)]" : "text-n-600 hover:text-n-900",
                  )}
                >
                  <input
                    type="radio"
                    name="calc-crews"
                    checked={ownCrews === v}
                    onChange={() => {
                      interact();
                      setOwnCrews(v as boolean);
                      setPlanOverride(null);
                    }}
                    className="sr-only"
                  />
                  {l as string}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {hasCrews ? (
          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="calc-workers" className={fieldLabel}>Your own active workers</label>
              <input id="calc-workers" type="number" inputMode="numeric" min={1} max={10000} value={workers} onChange={(e) => setW(Number(e.target.value))} className={numberClass} />
            </div>
            <input
              type="range"
              min={1}
              max={MAX_SLIDER}
              value={Math.min(workers, MAX_SLIDER)}
              onChange={(e) => setW(Number(e.target.value))}
              aria-label="Your own active workers"
              aria-valuetext={`${workers} workers`}
              className="mt-4 h-2 w-full cursor-pointer accent-[var(--brand-600)]"
            />
            <p className="mt-1.5 flex justify-between text-[12.5px] text-n-500"><span>1</span><span>{MAX_SLIDER}+ — type a larger number above</span></p>
            <p className="mt-2 text-[13px] text-n-500">Your own employees who record time or activity in Axtara during the month. Partner companies&apos; workers belong to their own employer.</p>
          </div>
        ) : (
          <p className="rounded-lg bg-n-50 p-3.5 text-[14px] leading-6 text-n-600 shadow-[0_0_0_1px_var(--n-150)]">
            Without your own crews, your plan is sized by the projects you manage. Partners you invite record their crews in their own company accounts.
          </p>
        )}

        <div className="flex items-end justify-between gap-4">
          <div>
            <label htmlFor="calc-projects" className={fieldLabel}>Active projects your company manages</label>
            <p className="mt-1 text-[13px] text-n-500">Projects you&apos;re invited to by a GC aren&apos;t included here.</p>
          </div>
          <input id="calc-projects" type="number" inputMode="numeric" min={0} max={500} value={projects} onChange={(e) => setP(Number(e.target.value))} className={numberClass} />
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
                Suggested for your size: {plans.find((p) => p.id === suggested)!.name}.{" "}
                <button type="button" className="font-medium text-brand-700 underline underline-offset-2" onClick={() => setPlanOverride(null)}>Use suggestion</button>
              </>
            ) : (
              <>Suggested for {projects} project{projects === 1 ? "" : "s"}{hasCrews ? ` and ${workers} own workers` : ""}.</>
            )}
          </p>
        </fieldset>

        <fieldset>
          <legend className={fieldLabel}>Billing arrangement</legend>
          {billingOptions.length ? (
            <div className="mt-2 space-y-2">
              {billingOptions.map((b) => (
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
              Your billing arrangement for {region.name} is agreed with you and set out in your order form.
            </p>
          )}
        </fieldset>
      </form>

      {/* Summary */}
      <div className="flex flex-col border-t border-n-150 bg-n-25 p-6 sm:p-8 lg:border-l lg:border-t-0" aria-live="polite">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-medium text-n-900">Your Axtara quote</h3>
          {preview && card && !card.approved && <span className="rounded-sm bg-bad-bg px-1.5 py-0.5 text-[11.5px] font-medium text-bad">Internal preview — unapproved rates</span>}
        </div>

        <dl className="mt-5 divide-y divide-n-150 text-[14.5px]">
          {[
            ["Company", type.label],
            ["Country", `${region.name} · ${region.currency.code}`],
            ["Plan", plan.name],
            ["Projects you manage", projects.toLocaleString("en")],
            ["Your own active workers", hasCrews ? workers.toLocaleString("en") : "None"],
            ["Billing", billing?.name ?? "Agreed in your order form"],
            ...(adjustment ? [["Rate adjustment", adjustment]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5">
              <dt className="text-n-500">{k}</dt>
              <dd className="text-right font-medium text-n-900">{v}</dd>
            </div>
          ))}
        </dl>

        {quote ? (
          <div className="mt-6 rounded-xl bg-white p-5 shadow-[0_0_0_1px_var(--n-150)]">
            <p className="text-[13px] text-n-500">{quote.headlineLabel}</p>
            <p className="mt-1 text-[34px] font-semibold tracking-[-0.03em] text-n-950 tabular-nums">{formatMoney(quote.headline, region.currency.code)}</p>
            <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-[13.5px]">
              {quote.rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-n-500">{k}</dt>
                  <dd className="text-right tabular-nums text-n-900">{v}</dd>
                </div>
              ))}
            </dl>
            {quote.note && (
              <p className="mt-3 flex gap-2 rounded-md bg-n-50 p-2.5 text-[13px] text-n-600"><Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{quote.note}</p>
            )}
            <p className="mt-3 text-[12.5px] text-n-500">Excludes implementation, third-party software and applicable taxes.</p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-white p-5 shadow-[0_0_0_1px_var(--n-150)]">
            <p className="text-[16px] font-medium text-n-950">
              {plan.quotedOnly
                ? "Enterprise is priced for your organisation."
                : `${plan.name} for ${projects} project${projects === 1 ? "" : "s"}${hasCrews ? ` and ${workers.toLocaleString("en")} of your own workers` : ""}, quoted in ${region.currency.code}.`}
            </p>
            <p className="mt-2 text-[14px] leading-6 text-n-600">
              Your subscription is sized by the projects your company manages and your own active workers{adjustment && billing && billing.multiplier !== 1 ? `, with ${adjustment.replace(" vs standard", "")} applied for ${billing.name.toLowerCase()}` : ""}. Send us these details and we&apos;ll reply with a written {region.currency.code} quote.
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Link href={quoteHref} className={buttonClass("primary", "md")}>{quote && !(rates && isBaseAllowance(rates) && rates.indicative) ? "Request a Demo" : `Get your ${region.currency.code} quote`}</Link>
          <Link href="/roi" className={buttonClass("secondary", "md")}>Estimate the value</Link>
        </div>
      </div>
    </div>
  );
}
