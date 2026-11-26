/**
 * ROI estimate — pure functions shared by the calculator and tests.
 *
 * Everything here works from the visitor's own inputs. Presets carry only
 * illustrative starting hours (not benchmarks). No Axtara price is assumed:
 * the visitor enters the subscription amount from their own quote.
 */

export type RoiPresetId = "gc" | "developer" | "sub";
export type RoiActivity = { id: string; label: string; hours: string };

export type RoiInput = {
  activities: RoiActivity[];
  /** Average hourly staff cost (pay plus on-costs). */
  rate: string;
  /** % of those hours the visitor expects to recover. */
  reduction: string;
  /** Monthly subscription, from the visitor's own quote. */
  subscription: string;
  /** Optional one-off implementation / setup cost. */
  setupCost: string;
  /** Optional one-off internal training hours, valued at `rate`. */
  trainingHours: string;
};

export const roiPresets: Record<RoiPresetId, { label: string; focus: string; activities: RoiActivity[] }> = {
  gc: {
    label: "General contractor",
    focus: "Site updates, reports and assignments",
    activities: [
      { id: "chase", label: "Collecting site updates and daily logs", hours: "40" },
      { id: "compile", label: "Compiling weekly and client reports", hours: "30" },
      { id: "assign", label: "Coordinating crew assignments and upcoming work", hours: "24" },
      { id: "time", label: "Consolidating your own crews' time", hours: "16" },
    ],
  },
  developer: {
    label: "Developer",
    focus: "Project updates and decisions",
    activities: [
      { id: "updates", label: "Consolidating project updates across developments", hours: "36" },
      { id: "decide", label: "Following up decisions and answers", hours: "20" },
      { id: "exceptions", label: "Chasing exceptions and missing information", hours: "16" },
    ],
  },
  sub: {
    label: "Subcontractor",
    focus: "Crew time, scheduling and project reports",
    activities: [
      { id: "recon", label: "Reconciling and correcting crew time", hours: "48" },
      { id: "reports", label: "Preparing project reports for GCs", hours: "24" },
      { id: "schedule", label: "Scheduling crews across jobs", hours: "20" },
    ],
  },
};

export const roiCurrencies = ["JMD", "NGN", "GYD", "USD"] as const;

export function roiFromPreset(id: RoiPresetId, keep?: Partial<RoiInput>): RoiInput {
  return {
    activities: roiPresets[id].activities.map((a) => ({ ...a })),
    rate: keep?.rate ?? "",
    reduction: keep?.reduction ?? "20",
    subscription: keep?.subscription ?? "",
    setupCost: keep?.setupCost ?? "0",
    trainingHours: keep?.trainingHours ?? "0",
  };
}

type Kind = "hours" | "money" | "pct";

/** Returns an error message, or null if valid. */
export function checkNumber(raw: string | undefined, kind: Kind, required = true): string | null {
  const s = (raw ?? "").trim();
  if (s === "") return required ? (kind === "money" ? "Enter an amount. Use 0 if none." : "Enter a number. Use 0 if none.") : null;
  const n = Number(s.replace(/,/g, ""));
  if (!Number.isFinite(n)) return "Enter a number, without symbols or letters.";
  if (n < 0) return "Enter 0 or more.";
  if (kind === "pct" && n > 100) return "Enter a percentage from 0 to 100.";
  if (kind === "hours" && n > 10000) return "Enter 10,000 hours or fewer.";
  return null;
}

const num = (s: string) => Number((s ?? "").trim().replace(/,/g, "")) || 0;

export type RoiErrors = Partial<Record<"rate" | "reduction" | "subscription" | "setupCost" | "trainingHours", string>> & Record<string, string>;

export function validateRoi(v: RoiInput): RoiErrors {
  const e: RoiErrors = {};
  for (const a of v.activities) {
    const err = checkNumber(a.hours, "hours");
    if (err) e[`act:${a.id}`] = err;
  }
  const r = checkNumber(v.reduction, "pct");
  if (r) e.reduction = r;
  const rate = checkNumber(v.rate, "money");
  if (rate) e.rate = rate;
  const sub = checkNumber(v.subscription, "money");
  if (sub) e.subscription = sub;
  const setup = checkNumber(v.setupCost, "money", false);
  if (setup) e.setupCost = setup;
  const train = checkNumber(v.trainingHours, "hours", false);
  if (train) e.trainingHours = train;
  return e;
}

export type Payback = { months: number | null; text: string };

/** Payback in months — never Infinity or NaN. */
export function payback(upfront: number, monthlyNet: number): Payback {
  if (!(monthlyNet > 0)) return { months: null, text: "No payback under these assumptions" };
  if (upfront === 0) return { months: 0, text: "Immediate — no one-off costs entered" };
  const m = upfront / monthlyNet;
  return { months: m, text: `${(Math.round(m * 10) / 10).toLocaleString("en")} months` };
}

export type RoiResult = {
  baselineHours: number;
  recoveredHours: number;
  /** Value of recovered time a month. */
  value: number;
  subscription: number;
  /** Value less subscription, a month. */
  monthlyNet: number;
  /** One-off costs: setup + training hours × rate. */
  upfront: number;
  payback: Payback;
  /** 12 × monthly net − one-off costs. */
  yearNet: number;
};

/**
 * Computes the estimate. Hours are always computed from the activity list;
 * money figures need valid rate and subscription values.
 */
export function computeRoi(v: RoiInput): { ok: boolean; errors: RoiErrors; hoursOnly: { baselineHours: number; recoveredHours: number } | null; result: RoiResult | null } {
  const errors = validateRoi(v);
  const hoursValid = !Object.keys(errors).some((k) => k.startsWith("act:") || k === "reduction");
  const baselineHours = v.activities.reduce((s, a) => s + num(a.hours), 0);
  const recoveredHours = baselineHours * (num(v.reduction) / 100);
  const hoursOnly = hoursValid ? { baselineHours, recoveredHours } : null;
  if (Object.keys(errors).length) return { ok: false, errors, hoursOnly, result: null };
  const rate = num(v.rate);
  const value = recoveredHours * rate;
  const subscription = num(v.subscription);
  const monthlyNet = value - subscription;
  const upfront = num(v.setupCost) + num(v.trainingHours) * rate;
  return {
    ok: true,
    errors,
    hoursOnly,
    result: {
      baselineHours,
      recoveredHours,
      value,
      subscription,
      monthlyNet,
      upfront,
      payback: payback(upfront, monthlyNet),
      yearNet: 12 * monthlyNet - upfront,
    },
  };
}

export function formatAmount(currency: string, amount: number): string {
  const sign = amount < 0 ? "−" : "";
  return `${sign}${currency} ${Math.abs(Math.round(amount)).toLocaleString("en")}`;
}

export function formatHours(h: number): string {
  return `${(Math.round(h * 10) / 10).toLocaleString("en")} h`;
}
