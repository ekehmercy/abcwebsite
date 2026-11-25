import { test } from "node:test";
import assert from "node:assert/strict";
import { publishedRateCards } from "../../config/pricing/published-rates.ts";
import { calculateBaseQuote, isBaseAllowance, parseRateCards } from "../../lib/pricing-engine.ts";

const card = (r: string) => publishedRateCards.find((c) => c.region === r)!;

test("published price books match the approved Axtara pricing", () => {
  const expect = {
    US: { base: [199, 499, 999], worker: 3, project: 30, currency: "USD" },
    JM: { base: [19900, 49900, 99900], worker: 300, project: 3000, currency: "JMD" },
    NG: { base: [99000, 249000, 499000], worker: 1500, project: 15000, currency: "NGN" },
  } as const;
  for (const [region, e] of Object.entries(expect)) {
    const c = card(region);
    assert.equal(c.approved, true);
    assert.equal(c.currency, e.currency);
    assert.equal(c.model, "base-plus-allowance");
    assert.equal(c.annualBaseDiscount, 0.1);
    (["core", "scale", "enterprise"] as const).forEach((p, i) => {
      const r = c.plans[p]!;
      assert.ok(isBaseAllowance(r));
      assert.equal(r.baseMonthly, e.base[i]);
      assert.equal(r.perExtraWorkerMonthly, e.worker);
      assert.equal(r.perExtraProjectMonthly, e.project);
    });
  }
});

test("allowances: Core 3/25, Scale 10/100, Enterprise from 25/250", () => {
  const p = card("JM").plans;
  assert.deepEqual([p.core, p.scale, p.enterprise].map((r: any) => [r.includedProjects, r.includedWorkers]), [[3, 25], [10, 100], [25, 250]]);
  assert.equal((p.enterprise as any).indicative, true);
});

test("Jamaica Core: 5 projects, 40 workers, monthly and annual", () => {
  const core = card("JM").plans.core as any;
  const m = calculateBaseQuote({ ...core, projects: 5, workers: 40, billing: "monthly", annualBaseDiscount: 0.1 });
  assert.equal(m.monthlyCharge, 19900 + 2 * 3000 + 15 * 300); // J$30,400
  const a = calculateBaseQuote({ ...core, projects: 5, workers: 40, billing: "annual", annualBaseDiscount: 0.1 });
  assert.equal(a.annualBase, 214920); // 19,900 × 12 × 0.9
  assert.equal(a.monthlyCharge, 10500); // additions still billed monthly
});

test("published cards survive the rate-card parser unchanged", () => {
  assert.deepEqual(parseRateCards(JSON.parse(JSON.stringify(publishedRateCards))), publishedRateCards);
});
