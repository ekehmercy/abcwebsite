import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateQuote, parseRateCards, suggestPlan } from "../../lib/pricing-engine.ts";

// Test values only — not Axtara prices.
const base = { perWorkerMonthly: 10, minimumMonthly: 500, multiplier: 1, invoicing: "monthly" as const };

test("charges the greater of worker-based charge or plan minimum", () => {
  const small = calculateQuote({ ...base, workers: 20 });
  assert.equal(small.workerCharge, 200);
  assert.equal(small.minimumApplied, true);
  assert.equal(small.monthly, 500);

  const large = calculateQuote({ ...base, workers: 80 });
  assert.equal(large.minimumApplied, false);
  assert.equal(large.monthly, 800);
});

test("applies flexible premium (+15%) and annual prepayment discount (−10%)", () => {
  assert.equal(calculateQuote({ ...base, workers: 100, multiplier: 1.15 }).monthly, 1150);
  const annual = calculateQuote({ ...base, workers: 100, multiplier: 0.9, invoicing: "annual" });
  assert.equal(annual.monthly, 900);
  assert.equal(annual.perInvoice, 10800);
  assert.equal(annual.annualTotal, 10800);
});

test("handles zero and fractional worker counts safely", () => {
  assert.equal(calculateQuote({ ...base, workers: 0 }).monthly, 500);
  assert.equal(calculateQuote({ ...base, workers: 0 }).effectivePerWorker, 0);
  assert.equal(calculateQuote({ ...base, workers: 60.9 }).workerCharge, 600);
});

test("rejects invalid rate configuration", () => {
  assert.throws(() => calculateQuote({ ...base, workers: 10, multiplier: 0 }));
  assert.throws(() => calculateQuote({ ...base, workers: 10, perWorkerMonthly: -1 }));
});

test("suggests a plan from the worker count", () => {
  const plans = [
    { id: "core", suggestedWorkers: [1, 75] as [number, number | null] },
    { id: "scale", suggestedWorkers: [76, 400] as [number, number | null] },
    { id: "enterprise", suggestedWorkers: [401, null] as [number, number | null] },
  ];
  assert.equal(suggestPlan(10, plans), "core");
  assert.equal(suggestPlan(76, plans), "scale");
  assert.equal(suggestPlan(5000, plans), "enterprise");
});

test("parses untrusted rate cards and keeps approval flag strict", () => {
  const cards = parseRateCards([
    { region: "JM", currency: "JMD", approved: "yes", plans: { core: { perWorkerMonthly: 1, minimumMonthly: 2 } } },
    { region: 3 },
    "nonsense",
  ]);
  assert.equal(cards.length, 1);
  assert.equal(cards[0].approved, false);
  assert.deepEqual(cards[0].plans.core, { perWorkerMonthly: 1, minimumMonthly: 2 });
  assert.deepEqual(parseRateCards(null), []);
});

/* ── base-plus-allowance model (test values only — not Axtara prices) ── */
import { calculateBaseQuote, isBaseAllowance } from "../../lib/pricing-engine.ts";

const baseRates = { baseMonthly: 500, includedProjects: 10, includedWorkers: 100, perExtraProjectMonthly: 30, perExtraWorkerMonthly: 3 };

test("base-plus-allowance: within allowance charges the base only", () => {
  const q = calculateBaseQuote({ ...baseRates, projects: 8, workers: 80, billing: "monthly" });
  assert.equal(q.additions, 0);
  assert.equal(q.monthlyCharge, 500);
  assert.equal(q.yearOne, 6000);
});

test("base-plus-allowance: extra projects and workers are added monthly", () => {
  const q = calculateBaseQuote({ ...baseRates, projects: 12, workers: 130, billing: "monthly" });
  assert.equal(q.extraProjects, 2);
  assert.equal(q.extraWorkers, 30);
  assert.equal(q.additions, 2 * 30 + 30 * 3);
  assert.equal(q.monthlyCharge, 500 + 150);
});

test("base-plus-allowance: annual discount applies to the base only", () => {
  const q = calculateBaseQuote({ ...baseRates, projects: 12, workers: 130, billing: "annual", annualBaseDiscount: 0.1 });
  assert.equal(q.annualBase, 5400);
  assert.equal(q.monthlyCharge, 150);
  assert.equal(q.yearOne, 5400 + 150 * 12);
  assert.equal(q.effectiveMonthly, (5400 + 1800) / 12);
});

test("base-plus-allowance: rejects invalid configuration", () => {
  assert.throws(() => calculateBaseQuote({ ...baseRates, baseMonthly: -1, projects: 1, workers: 1, billing: "monthly" }));
  assert.throws(() => calculateBaseQuote({ ...baseRates, projects: 1, workers: 1, billing: "annual", annualBaseDiscount: 1 }));
});

test("parses base-plus-allowance rate cards and defaults the model", () => {
  const [a, b] = parseRateCards([
    { region: "JM", currency: "JMD", approved: true, model: "base-plus-allowance", annualBaseDiscount: 0.1, plans: { scale: baseRates, core: { perWorkerMonthly: 1, minimumMonthly: 2 } } },
    { region: "NG", currency: "NGN", approved: false, plans: { core: { perWorkerMonthly: 1, minimumMonthly: 2 } } },
  ]);
  assert.equal(a.model, "base-plus-allowance");
  assert.ok(isBaseAllowance(a.plans.scale));
  assert.equal(a.plans.core, undefined, "wrong-shape plan is dropped");
  assert.equal(a.annualBaseDiscount, 0.1);
  assert.equal(b.model, "max-of-workers-or-minimum");
});
