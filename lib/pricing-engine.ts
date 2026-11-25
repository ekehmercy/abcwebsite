/**
 * Pricing engine — pure functions, no business values embedded.
 * Shared by the calculator (client) and tests.
 */

export type RateCard = {
  /** Market the rate card applies to. */
  region: string;
  currency: string;
  /** Must be true before the rate card is ever sent to a browser. */
  approved: boolean;
  plans: {
    core?: { perWorkerMonthly: number; minimumMonthly: number };
    scale?: { perWorkerMonthly: number; minimumMonthly: number };
  };
};

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

export function suggestPlan(
  workers: number,
  plans: { id: string; suggestedWorkers: [number, number | null] }[],
): string {
  const match = plans.find(
    (p) => workers >= p.suggestedWorkers[0] && (p.suggestedWorkers[1] === null || workers <= p.suggestedWorkers[1]),
  );
  return match?.id ?? plans[plans.length - 1].id;
}

export function formatMoney(amount: number, currency: string, locale = "en"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

/** Validates an untrusted rate-card object (e.g. from env JSON). */
export function parseRateCards(raw: unknown): RateCard[] {
  if (!Array.isArray(raw)) return [];
  const out: RateCard[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const rc = r as Record<string, unknown>;
    if (typeof rc.region !== "string" || typeof rc.currency !== "string") continue;
    const plans: RateCard["plans"] = {};
    const p = (rc.plans ?? {}) as Record<string, unknown>;
    for (const id of ["core", "scale"] as const) {
      const v = p[id] as Record<string, unknown> | undefined;
      if (v && typeof v.perWorkerMonthly === "number" && typeof v.minimumMonthly === "number") {
        plans[id] = { perWorkerMonthly: v.perWorkerMonthly, minimumMonthly: v.minimumMonthly };
      }
    }
    out.push({ region: rc.region, currency: rc.currency, approved: rc.approved === true, plans });
  }
  return out;
}
