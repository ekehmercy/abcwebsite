/**
 * PUBLISHED PRICE BOOKS — approved for publication by Axtara on 25 Nov 2026.
 * Source: the Axtara pricing model in the supplied reference file
 * (`axtara-website (14).html`, "01f-pricing.js").
 *
 * Structure ("base-plus-allowance"): each plan has a monthly base that includes
 * a number of company-managed active projects and the company's own active
 * workers. Additional projects and workers are charged monthly per unit.
 * Annual prepayment takes 10% off the base only; additions are billed monthly.
 * Enterprise prices are starting points ("from") and are confirmed by quote.
 *
 * Each market has its own price book — they are not exchange-rate conversions.
 * PRICING_RATES_JSON or config/pricing/rates.private.json override a market here.
 */
import type { BaseAllowanceRates, RateCard } from "../../lib/pricing-engine.ts";

const allowances = {
  core: { includedProjects: 3, includedWorkers: 25 },
  scale: { includedProjects: 10, includedWorkers: 100 },
  enterprise: { includedProjects: 25, includedWorkers: 250 },
} as const;

function book(base: { core: number; scale: number; enterprise: number }, perWorker: number, perProject: number): RateCard["plans"] {
  const plan = (id: keyof typeof allowances, extra: Partial<BaseAllowanceRates> = {}): BaseAllowanceRates => ({
    baseMonthly: base[id],
    ...allowances[id],
    perExtraProjectMonthly: perProject,
    perExtraWorkerMonthly: perWorker,
    ...extra,
  });
  return { core: plan("core"), scale: plan("scale"), enterprise: plan("enterprise", { indicative: true }) };
}

export const publishedRateCards: RateCard[] = [
  { region: "US", currency: "USD", approved: true, model: "base-plus-allowance", annualBaseDiscount: 0.1, plans: book({ core: 199, scale: 499, enterprise: 999 }, 3, 30) },
  { region: "JM", currency: "JMD", approved: true, model: "base-plus-allowance", annualBaseDiscount: 0.1, plans: book({ core: 19900, scale: 49900, enterprise: 99900 }, 300, 3000) },
  { region: "NG", currency: "NGN", approved: true, model: "base-plus-allowance", annualBaseDiscount: 0.1, plans: book({ core: 99000, scale: 249000, enterprise: 499000 }, 1500, 15000) },
];
