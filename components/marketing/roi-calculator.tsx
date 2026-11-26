"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus, RotateCcw, X } from "lucide-react";
import {
  computeRoi, formatAmount, formatHours, roiCurrencies, roiFromPreset, roiPresets, type RoiInput, type RoiPresetId,
} from "@/lib/roi";
import { track } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const label = "block text-[13px] font-medium text-n-800";
const inputBase =
  "h-10 w-full rounded-md bg-white px-3 text-[15px] tabular-nums text-n-900 shadow-[0_0_0_1px_var(--n-200)] hover:shadow-[0_0_0_1px_var(--n-300)]";
const invalid = "shadow-[0_0_0_1.5px_var(--st-danger)] hover:shadow-[0_0_0_1.5px_var(--st-danger)]";

function NumField({
  id, labelText, value, onChange, error, suffix, hint, className,
}: {
  id: string;
  labelText: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  suffix?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={label}>{labelText}</label>
      <div className="relative mt-2">
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined}
          className={cn(inputBase, suffix && "pr-14", error && invalid)}
        />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-n-500">{suffix}</span>}
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-[12.5px] text-n-500">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1.5 text-[13px] text-bad">{error}</p>}
    </div>
  );
}

export function RoiCalculator() {
  const uid = useId();
  const [preset, setPreset] = useState<RoiPresetId>("gc");
  const [cur, setCur] = useState<(typeof roiCurrencies)[number]>("JMD");
  const [v, setV] = useState<RoiInput>(() => roiFromPreset("gc"));
  const [showOneOff, setShowOneOff] = useState(false);
  const tracked = useRef(false);

  const touch = () => {
    if (tracked.current) return;
    tracked.current = true;
    track("roi_calculator_used", { preset });
  };
  const set = (k: keyof Omit<RoiInput, "activities">, val: string) => {
    touch();
    setV((p) => ({ ...p, [k]: val }));
  };
  const setAct = (id: string, field: "hours" | "label", val: string) => {
    touch();
    setV((p) => ({ ...p, activities: p.activities.map((a) => (a.id === id ? { ...a, [field]: val } : a)) }));
  };

  const { errors, hoursOnly, result } = useMemo(() => computeRoi(v), [v]);
  const moneyMissing = !v.rate.trim() || !v.subscription.trim();

  const max = result ? Math.max(result.value, result.subscription, 1) : 1;

  return (
    <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_var(--n-150),var(--shadow-card)] lg:grid-cols-[1.15fr_1fr]">
      <form className="space-y-7 p-6 sm:p-8" onSubmit={(e) => e.preventDefault()} aria-label="Value estimate" noValidate>
        <fieldset>
          <legend className={label}>Your business</legend>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-n-100 p-1">
            {(Object.keys(roiPresets) as RoiPresetId[]).map((k) => (
              <label
                key={k}
                className={cn(
                  "relative flex min-h-10 cursor-pointer items-center justify-center rounded-md px-2 text-center text-[13.5px] font-medium leading-tight transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-500",
                  k === preset ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-150)]" : "text-n-600 hover:text-n-900",
                )}
              >
                <input
                  type="radio"
                  name={`${uid}-preset`}
                  checked={k === preset}
                  onChange={() => {
                    touch();
                    setPreset(k);
                    setV((p) => roiFromPreset(k, p));
                  }}
                  className="sr-only"
                />
                {roiPresets[k].label}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-n-500">Focus: {roiPresets[preset].focus.toLowerCase()}.</p>
        </fieldset>

        <fieldset>
          <legend className={label}>Monthly admin hours on this work</legend>
          <p className="mt-1 text-[12.5px] text-n-500">Illustrative starting figures — replace with your own.</p>
          <ul className="mt-3 space-y-2">
            {v.activities.map((a, i) => {
              const err = errors[`act:${a.id}`];
              return (
                <li key={a.id}>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`${uid}-act-${a.id}`} className="sr-only">Hours a month for {a.label || `activity ${i + 1}`}</label>
                    {a.id.startsWith("custom") ? (
                      <input
                        aria-label={`Activity ${i + 1} name`}
                        value={a.label}
                        placeholder="Describe the activity"
                        onChange={(e) => setAct(a.id, "label", e.target.value)}
                        className={cn(inputBase, "min-w-0 flex-1 text-[14px]")}
                      />
                    ) : (
                      <span className="min-w-0 flex-1 text-[14px] leading-5 text-n-700">{a.label}</span>
                    )}
                    <div className="relative w-28 shrink-0">
                      <input
                        id={`${uid}-act-${a.id}`}
                        inputMode="decimal"
                        value={a.hours}
                        onChange={(e) => setAct(a.id, "hours", e.target.value)}
                        aria-invalid={err ? true : undefined}
                        aria-describedby={err ? `${uid}-act-${a.id}-err` : undefined}
                        className={cn(inputBase, "pr-8 text-right", err && invalid)}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-n-500">h</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        touch();
                        setV((p) => ({ ...p, activities: p.activities.filter((x) => x.id !== a.id) }));
                      }}
                      disabled={v.activities.length === 1}
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-n-500 hover:bg-n-100 hover:text-n-900 disabled:opacity-30"
                      aria-label={`Remove ${a.label || "activity"}`}
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  {err && <p id={`${uid}-act-${a.id}-err`} className="mt-1 text-[13px] text-bad">{err}</p>}
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                touch();
                setV((p) => ({ ...p, activities: [...p.activities, { id: `custom-${Date.now()}`, label: "", hours: "0" }] }));
              }}
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-brand-700 hover:underline"
            >
              <Plus className="size-4" aria-hidden="true" />Add an activity
            </button>
            <button
              type="button"
              onClick={() => setV((p) => roiFromPreset(preset, p))}
              className="inline-flex items-center gap-1.5 text-[13.5px] text-n-600 hover:text-n-950"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />Reset activities
            </button>
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-cur`} className={label}>Currency</label>
            <div className="relative mt-2">
              <select id={`${uid}-cur`} value={cur} onChange={(e) => { touch(); setCur(e.target.value as typeof cur); }} className={cn(inputBase, "h-10 appearance-none pr-9")} aria-describedby={`${uid}-cur-hint`}>
                {roiCurrencies.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-n-500" aria-hidden="true" />
            </div>
            <p id={`${uid}-cur-hint`} className="mt-1.5 text-[12.5px] text-n-500">Labels your amounts. Nothing is converted.</p>
          </div>
          <NumField id={`${uid}-red`} labelText="Hours you expect to recover" value={v.reduction} onChange={(x) => set("reduction", x)} error={errors.reduction} suffix="%" hint="A figure you could defend" />
          <NumField id={`${uid}-rate`} labelText="Average hourly staff cost" value={v.rate} onChange={(x) => set("rate", x)} error={v.rate.trim() ? errors.rate : undefined} suffix={cur} hint="Pay plus on-costs" />
          <NumField id={`${uid}-sub`} labelText="Monthly subscription" value={v.subscription} onChange={(x) => set("subscription", x)} error={v.subscription.trim() ? errors.subscription : undefined} suffix={cur} hint="From your Axtara quote" />
        </div>

        <div className="border-t border-n-150 pt-5">
          <button
            type="button"
            aria-expanded={showOneOff}
            aria-controls={`${uid}-oneoff`}
            onClick={() => setShowOneOff((s) => !s)}
            className="flex w-full items-center justify-between text-left text-[14.5px] font-medium text-n-900"
          >
            One-off costs (optional)
            <ChevronDown className={cn("size-4 text-n-500 transition-transform", showOneOff && "rotate-180")} aria-hidden="true" />
          </button>
          <div id={`${uid}-oneoff`} hidden={!showOneOff} className="mt-4 grid gap-5 sm:grid-cols-2">
            <NumField id={`${uid}-setup`} labelText="Implementation and setup" value={v.setupCost} onChange={(x) => set("setupCost", x)} error={errors.setupCost} suffix={cur} />
            <NumField id={`${uid}-train`} labelText="Internal training time" value={v.trainingHours} onChange={(x) => set("trainingHours", x)} error={errors.trainingHours} suffix="h" hint="Valued at your hourly staff cost" />
          </div>
        </div>
      </form>

      <div className="flex flex-col border-t border-n-150 bg-n-25 p-6 sm:p-8 lg:border-l lg:border-t-0">
        <h3 className="text-[15px] font-medium text-n-900">Your estimate</h3>
        <p className="mt-1 text-[13px] text-n-500">An estimate based on your inputs, not a guaranteed saving.</p>

        <div aria-live="polite" className="mt-5">
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white p-4 shadow-[0_0_0_1px_var(--n-150)]">
              <dt className="text-[13px] text-n-500">Hours recovered a month</dt>
              <dd className="mt-1 text-[26px] font-semibold tracking-[-0.02em] text-n-950 tabular-nums">{hoursOnly ? formatHours(hoursOnly.recoveredHours) : "—"}</dd>
              {hoursOnly && <dd className="text-[12.5px] text-n-500">of {formatHours(hoursOnly.baselineHours)} at {v.reduction}%</dd>}
            </div>
            <div className="rounded-xl bg-white p-4 shadow-[0_0_0_1px_var(--n-150)]">
              <dt className="text-[13px] text-n-500">Value of recovered time</dt>
              <dd className="mt-1 text-[26px] font-semibold tracking-[-0.02em] text-n-950 tabular-nums">{result ? formatAmount(cur, result.value) : "—"}</dd>
              <dd className="text-[12.5px] text-n-500">a month</dd>
            </div>
          </dl>

          {result ? (
            <>
              <div className={cn("mt-3 rounded-xl p-5", result.monthlyNet >= 0 ? "bg-ink-900 text-white" : "bg-white shadow-[0_0_0_1px_var(--n-150)]")}>
                <p className={cn("text-[13px]", result.monthlyNet >= 0 ? "text-brand-200" : "text-n-500")}>Net value a month, after subscription</p>
                <p className={cn("mt-1 text-[34px] font-semibold tracking-[-0.03em] tabular-nums", result.monthlyNet >= 0 ? "text-white" : "text-bad")}>{formatAmount(cur, result.monthlyNet)}</p>
              </div>

              <figure className="mt-5 space-y-3" aria-label={`Value of recovered time ${formatAmount(cur, result.value)} compared with subscription ${formatAmount(cur, result.subscription)}`} role="img">
                {[
                  ["Value of time", result.value, "bg-brand-500"],
                  ["Subscription", result.subscription, "bg-n-300"],
                ].map(([l, val, c]) => (
                  <div key={l as string} aria-hidden="true">
                    <p className="text-[12.5px] text-n-500">{l as string}</p>
                    <div className="mt-1 h-2.5 rounded-full bg-n-100">
                      <div className={cn("h-full rounded-full transition-[width] duration-500", c as string)} style={{ width: `${Math.max(1.5, ((val as number) / max) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </figure>

              <dl className="mt-5 divide-y divide-n-150 text-[14.5px]">
                {[
                  ["Subscription a month", formatAmount(cur, result.subscription)],
                  ["One-off costs", formatAmount(cur, result.upfront)],
                  ["Payback on one-off costs", result.payback.text],
                  ["Net over the first 12 months", formatAmount(cur, result.yearNet)],
                ].map(([k, val]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-n-500">{k}</dt>
                    <dd className={cn("text-right font-medium tabular-nums", k.startsWith("Net") && result.yearNet < 0 ? "text-bad" : "text-n-900")}>{val}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="mt-3 rounded-xl bg-white p-5 text-[14.5px] leading-6 text-n-600 shadow-[0_0_0_1px_var(--n-150)]">
              {moneyMissing
                ? "Add your hourly staff cost and the monthly subscription from your quote to see the value, net and payback."
                : "Check the highlighted fields to see the full estimate."}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Link href="/demo?interest=roi" className={buttonClass("primary", "md")}>Review this estimate with us</Link>
          <Link href="/pricing" className={buttonClass("secondary", "md")}>Get a quote</Link>
        </div>
      </div>
    </div>
  );
}
