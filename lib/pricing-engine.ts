/**
 * Pricing engine — pure functions, no business values embedded.
 * Shared by the calculator (client) and tests.
 */

/**
 * Two commercial structures are supported. Each market's private rate card
 * chooses one with `model`:
 *
 *  "max-of-workers-or-minimum" (default)
 *     monthly = max(active workers × per-worker rate, plan minimum) × billing multiplier
 *
 *  "base-plus-allowance"
 *     monthly = plan base (includes N company-managed active projects and N own workers)
 *             + extra projects × per-project rate + extra workers × per-worker rate.
 *     Annual prepayment discounts the BASE only; additions are billed monthly.
 */
export type PricingModel = "max-of-workers-or-minimum" | "base-plus-allowance";

export type WorkerMinimumRates = { perWorkerMonthly: number; minimumMonthly: number };
export type BaseAllowanceRates = {
  /** Enterprise prices are starting points: the estimate is indicative and confirmed by quote. */
  indicative?: boolean;
  baseMonthly: number;
  includedProjects: number;
  includedWorkers: number;
  perExtraProjectMonthly: number;
  perExtraWorkerMonthly: number;
};

export type RateCard = {
  /** Market the rate card applies to. */
  region: string;
  currency: string;
  /** Must be true before the rate card is ever sent to a browser. */
  approved: boolean;
  /** Commercial structure for this market. Defaults to "max-of-workers-or-minimum". */
  model: PricingModel;
  /** base-plus-allowance only: discount on the base for annual prepayment (e.g. 0.1). */
  annualBaseDiscount?: number;
  plans: {
    core?: WorkerMinimumRates | BaseAllowanceRates;
    scale?: WorkerMinimumRates | BaseAllowanceRates;
    enterprise?: WorkerMinimumRates | BaseAllowanceRates;
  };
};

export function isBaseAllowance(r: WorkerMinimumRates | BaseAllowanceRates | undefined): r is BaseAllowanceRates {
  return !!r && "baseMonthly" in r;
}

export type QuoteInput = {
  workers: number;
  perWorkerMonthly: number;
  minimumMonthly: number;
  multiplier: number;
  invoicing: "monthly" | "annual";
};

export type Quote = {
  workerCharge: number;
  minimumApplied: boolean;
  standardMonthly: number;
  monthly: number;
  /** Amount per invoice: monthly charge, or 12 × monthly for annual prepayment. */
  perInvoice: number;
  annualTotal: number;
  effectivePerWorker: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateQuote(input: QuoteInput): Quote {
  const workers = Math.max(0, Math.floor(input.workers));
  if (input.perWorkerMonthly < 0 || input.minimumMonthly < 0 || input.multiplier <= 0) {
    throw new Error("Invalid rate configuration");
  }
  const workerCharge = workers * input.perWorkerMonthly;
  // The charge is the greater of the worker-based charge or the plan minimum.
  const standardMonthly = Math.max(workerCharge, input.minimumMonthly);
  const monthly = round2(standardMonthly * input.multiplier);
  const annualTotal = round2(monthly * 12);
  return {
    workerCharge: round2(workerCharge),
    minimumApplied: input.minimumMonthly > workerCharge,
    standardMonthly: round2(standardMonthly),
    monthly,
    perInvoice: input.invoicing === "annual" ? annualTotal : monthly,
    annualTotal,
    effectivePerWorker: workers > 0 ? round2(monthly / workers) : 0,
  };
}

export type BaseQuoteInput = BaseAllowanceRates & {
  projects: number;
  workers: number;
  billing: "monthly" | "annual";
  annualBaseDiscount?: number;
};

export type BaseQuote = {
  base: number;
  extraProjects: number;
  extraWorkers: number;
  projectAdditions: number;
  workerAdditions: number;
  /** Monthly additions (always billed monthly, never discounted). */
  additions: number;
  /** Base paid once a year in advance (annual billing only). */
  annualBase: number | null;
  /** What is invoiced each month. Annual billing: additions only. */
  monthlyCharge: number;
  /** Year-one total divided by 12. */
  effectiveMonthly: number;
  yearOne: number;
};

/** Base subscription with included allowances, plus per-project and per-worker additions. */
export function calculateBaseQuote(input: BaseQuoteInput): BaseQuote {
  const values = [input.baseMonthly, input.includedProjects, input.includedWorkers, input.perExtraProjectMonthly, input.perExtraWorkerMonthly];
  const discount = input.annualBaseDiscount ?? 0;
  if (values.some((v) => !Number.isFinite(v) || v < 0) || discount < 0 || discount >= 1) {
    throw new Error("Invalid rate configuration");
  }
  const projects = Math.max(0, Math.floor(input.projects));
  const workers = Math.max(0, Math.floor(input.workers));
  const extraProjects = Math.max(0, projects - input.includedProjects);
  const extraWorkers = Math.max(0, workers - input.includedWorkers);
  const projectAdditions = round2(extraProjects * input.perExtraProjectMonthly);
  const workerAdditions = round2(extraWorkers * input.perExtraWorkerMonthly);
  const additions = round2(projectAdditions + workerAdditions);
  const annual = input.billing === "annual";
  const annualBase = annual ? round2(input.baseMonthly * 12 * (1 - discount)) : null;
  const yearOne = round2((annual ? annualBase! : input.baseMonthly * 12) + additions * 12);
  return {
    base: input.baseMonthly,
    extraProjects,
    extraWorkers,
    projectAdditions,
    workerAdditions,
    additions,
    annualBase,
    monthlyCharge: annual ? additions : round2(input.baseMonthly + additions),
    effectiveMonthly: round2(yearOne / 12),
    yearOne,
  };
}

export function suggestPlan(
  workers: number,
  plans: { id: string; suggestedWorkers: [number, number | null] }[],
): string {
  const match = plans.find(
    (p) => workers >= p.suggestedWorkers[0] && (p.suggestedWorkers[1] === null || workers <= p.suggestedWorkers[1]),
  );
  return match?.id ?? plans[plans.length - 1].id;
}

const currencySymbols: Record<string, string> = { USD: "US$", JMD: "J$", NGN: "₦", GYD: "G$" };

/** Formats an amount with the market's currency symbol, e.g. J$19,900 or US$199. */
export function formatMoney(amount: number, currency: string, locale = "en"): string {
  const symbol = currencySymbols[currency];
  if (!symbol) return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  const whole = Math.abs(amount - Math.round(amount)) < 1e-9;
  const n = Math.abs(amount).toLocaleString(locale, { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 });
  return `${amount < 0 ? "−" : ""}${symbol}${n}`;
}

/** Validates an untrusted rate-card object (e.g. from env JSON). */
export function parseRateCards(raw: unknown): RateCard[] {
  if (!Array.isArray(raw)) return [];
  const out: RateCard[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const rc = r as Record<string, unknown>;
    if (typeof rc.region !== "string" || typeof rc.currency !== "string") continue;
    const model: PricingModel = rc.model === "base-plus-allowance" ? "base-plus-allowance" : "max-of-workers-or-minimum";
    const num = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0;
    const plans: RateCard["plans"] = {};
    const p = (rc.plans ?? {}) as Record<string, unknown>;
    for (const id of ["core", "scale", "enterprise"] as const) {
      const v = p[id] as Record<string, unknown> | undefined;
      if (!v) continue;
      if (model === "base-plus-allowance") {
        if ([v.baseMonthly, v.includedProjects, v.includedWorkers, v.perExtraProjectMonthly, v.perExtraWorkerMonthly].every(num)) {
          plans[id] = {
            ...(v.indicative === true ? { indicative: true } : {}),
            baseMonthly: v.baseMonthly as number,
            includedProjects: v.includedProjects as number,
            includedWorkers: v.includedWorkers as number,
            perExtraProjectMonthly: v.perExtraProjectMonthly as number,
            perExtraWorkerMonthly: v.perExtraWorkerMonthly as number,
          };
        }
      } else if (num(v.perWorkerMonthly) && num(v.minimumMonthly)) {
        plans[id] = { perWorkerMonthly: v.perWorkerMonthly as number, minimumMonthly: v.minimumMonthly as number };
      }
    }
    const discount = num(rc.annualBaseDiscount) && (rc.annualBaseDiscount as number) < 1 ? (rc.annualBaseDiscount as number) : undefined;
    out.push({ region: rc.region, currency: rc.currency, approved: rc.approved === true, model, annualBaseDiscount: discount, plans });
  }
  return out;
}
