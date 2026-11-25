/**
 * PUBLIC PRICING CONFIGURATION
 * ----------------------------
 * Plans, billing arrangements and market commercial models. This file contains
 * NO monetary values. Rate cards (per-worker prices and plan minimums) are
 * loaded on the server from `config/pricing/rates.private.json` (gitignored) or
 * the PRICING_RATES_JSON environment variable, and are only sent to the browser
 * for markets whose rate card is marked `"approved": true`.
 *
 * See config/pricing/rates.example.json for the expected shape.
 */

import type { RegionCode } from "./regions";

export type PlanId = "core" | "scale" | "enterprise";
export type BillingId = "commitment-monthly" | "flexible-monthly" | "annual-prepaid";

export type Plan = {
  id: PlanId;
  name: string;
  forWhom: string;
  summary: string;
  /** Indicative worker range used to suggest a plan in the calculator. */
  suggestedWorkers: [number, number | null];
  highlights: string[];
  /** Enterprise is always quoted individually. */
  quotedOnly: boolean;
};

export const plans: Plan[] = [
  {
    id: "core",
    name: "Core",
    forWhom: "For foundational workforce and operational management",
    summary:
      "Workforce records, verified attendance and supervisor approvals for businesses replacing paper and spreadsheets.",
    suggestedWorkers: [1, 75],
    highlights: ["Workforce records", "Mobile clock-in", "Supervisor approvals", "Standard reports"],
    quotedOnly: false,
  },
  {
    id: "scale",
    name: "Scale",
    forWhom: "For growing businesses managing multiple sites, crews and projects",
    summary:
      "Everything in Core, with project operations, field reporting, expenses and payroll preparation across multiple sites.",
    suggestedWorkers: [76, 400],
    highlights: ["Everything in Core", "Project and cost-code allocation", "Daily reports and expenses", "Payroll preparation"],
    quotedOnly: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    forWhom: "For complex organisations needing governance, advanced permissions and integrations",
    summary:
      "Everything in Scale, with advanced permissions, governance, multi-entity reporting and integration support.",
    suggestedWorkers: [401, null],
    highlights: ["Everything in Scale", "Advanced roles and permissions", "Multi-entity reporting", "Integration support"],
    quotedOnly: true,
  },
];

export type BillingArrangement = {
  id: BillingId;
  name: string;
  description: string;
  /** Multiplier applied to the standard monthly charge. */
  multiplier: number;
  /** How the charge is invoiced. */
  invoicing: "monthly" | "annual";
  termMonths: number | null;
};

/** Commercial model per market. `status` is INTERNAL (publication checklist) and never rendered. */
export type MarketModel = {
  status: "proposed" | "approved" | "under-review";
  billing: BillingArrangement[];
  /** "max" = charge the greater of (workers × per-worker rate) or the plan minimum. */
  chargeBasis: "max-of-workers-or-minimum";
  notes: string[];
};

const jamaicaBilling: BillingArrangement[] = [
  {
    id: "commitment-monthly",
    name: "12-month commitment, billed monthly",
    description: "Standard rate with a 12-month subscription term, invoiced monthly.",
    multiplier: 1,
    invoicing: "monthly",
    termMonths: 12,
  },
  {
    id: "flexible-monthly",
    name: "Flexible month-to-month",
    description: "No long-term commitment. Priced at a 15% premium to the standard rate.",
    multiplier: 1.15,
    invoicing: "monthly",
    termMonths: null,
  },
  {
    id: "annual-prepaid",
    name: "Annual prepayment",
    description: "Twelve months paid in advance at a 10% discount to the standard rate.",
    multiplier: 0.9,
    invoicing: "annual",
    termMonths: 12,
  },
];

export const marketModels: Partial<Record<RegionCode, MarketModel>> = {
  JM: {
    status: "proposed",
    billing: jamaicaBilling,
    chargeBasis: "max-of-workers-or-minimum",
    notes: [
      "Final terms are confirmed in your order form.",
    ],
  },
};

/** Charges that sit outside the subscription. Shown on the pricing page. */
export const separateCharges = [
  {
    title: "Implementation and onboarding",
    body: "Configuration, data migration and training are scoped for each customer and quoted separately from the subscription.",
  },
  {
    title: "Third-party software",
    body: "Payroll providers, accounting systems, identity-verification services and other external tools are subscribed to and billed by their providers.",
  },
  {
    title: "Payroll and payment processing",
    body: "Axtara prepares payroll information. Payment of wages is carried out by your payroll provider or bank, under your own arrangements and fees.",
  },
  {
    title: "Taxes",
    body: "Applicable sales taxes such as GCT, VAT or state sales tax are added where required.",
  },
];

/** Plan comparison. INTERNAL flag: set true once plan packaging is approved (publication checklist). */
export const comparisonApproved = false;

export type ComparisonRow = { group: string; name: string; values: Record<PlanId, boolean | string> };

export const comparison: ComparisonRow[] = [
  { group: "People", name: "Employee profiles and documents", values: { core: true, scale: true, enterprise: true } },
  { group: "People", name: "Crews and site allocation", values: { core: true, scale: true, enterprise: true } },
  { group: "People", name: "Certification tracking", values: { core: true, scale: true, enterprise: true } },
  { group: "Attendance", name: "Mobile clock-in with location check", values: { core: true, scale: true, enterprise: true } },
  { group: "Attendance", name: "Supervisor approvals", values: { core: true, scale: true, enterprise: true } },
  { group: "Attendance", name: "Overtime rules", values: { core: false, scale: true, enterprise: true } },
  { group: "Operations", name: "Daily work reports and photos", values: { core: false, scale: true, enterprise: true } },
  { group: "Operations", name: "Projects and cost codes", values: { core: false, scale: true, enterprise: true } },
  { group: "Operations", name: "Expenses and receipts", values: { core: false, scale: true, enterprise: true } },
  { group: "Control", name: "Payroll preparation", values: { core: false, scale: true, enterprise: true } },
  { group: "Control", name: "Incident and safety records", values: { core: true, scale: true, enterprise: true } },
  { group: "Control", name: "Management dashboards", values: { core: "Standard", scale: "Standard", enterprise: "Custom" } },
  { group: "Governance", name: "Advanced roles and permissions", values: { core: false, scale: false, enterprise: true } },
  { group: "Governance", name: "Multi-entity reporting", values: { core: false, scale: false, enterprise: true } },
  { group: "Governance", name: "Integration support", values: { core: false, scale: "Standard exports", enterprise: true } },
];
