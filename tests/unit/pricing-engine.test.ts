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
