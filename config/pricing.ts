/**
 * PUBLIC PRICING CONFIGURATION
 * ----------------------------
 * Plans, billing arrangements and market commercial models. Monetary values
 * live in config/pricing/published-rates.ts (approved price books for the
 * United States, Jamaica and Nigeria). Markets without a price book are quoted.
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
  /** Indicative range of company-managed active projects, used to suggest a plan. */
  suggestedProjects: [number, number | null];
  highlights: string[];
  /** Enterprise is always quoted individually. */
  quotedOnly: boolean;
};

export const plans: Plan[] = [
  {
    id: "core",
    name: "Core",
    forWhom: "For a company starting with a few active projects and its own crews",
    summary:
      "Projects, partner packages, daily reports, RFIs and bids, with workforce records, mobile clock-in, supervisor time review and approved-time export.",
    suggestedWorkers: [1, 75],
    suggestedProjects: [0, 3],
    highlights: ["Projects, packages, RFIs and bids", "Daily reports and site photos", "Mobile clock-in and supervisor time review", "Approved-time export"],
    quotedOnly: false,
  },
  {
    id: "scale",
    name: "Scale",
    forWhom: "For a company running several projects with consistent processes across sites",
    summary:
      "Everything in Core, plus payroll calculation, review, approval and schedule export, lookahead planning, cost codes and change controls, and a portfolio dashboard.",
    suggestedWorkers: [76, 400],
    suggestedProjects: [4, 10],
    highlights: ["Payroll calculation, review, approval and schedule export", "Lookahead planning and trade readiness", "Cost codes, change orders and approval stages", "Portfolio dashboard and client updates"],
    quotedOnly: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    forWhom: "For a larger organisation that needs controls across teams, projects and entities",
    summary:
      "Everything in Scale, plus organisational controls: multi-entity governance, single sign-on, API access, an executive portfolio dashboard and a scoped rollout.",
    suggestedWorkers: [401, null],
    suggestedProjects: [11, null],
    highlights: ["Multi-entity governance and entity payroll controls", "Cross-project schedule oversight", "Single sign-on, API and webhooks", "Executive portfolio dashboard"],
    quotedOnly: true,
  },
];

/** Company types for sizing a subscription. One company, one subscription. */
export type CompanyTypeId = "gc" | "sub" | "developer";
export const companyTypes: { id: CompanyTypeId; label: string; short: string; crews: "always" | "ask"; sizing: string }[] = [
  { id: "gc", label: "General contractor", short: "General contractor", crews: "ask", sizing: "Projects your company manages, plus your own site crews if you employ them." },
  { id: "sub", label: "Subcontractor or specialty trade", short: "Subcontractor", crews: "always", sizing: "Your own projects and the crews you employ. Work on a GC's shared packages happens in their project workspace." },
  { id: "developer", label: "Real estate developer", short: "Developer", crews: "ask", sizing: "Developments your team manages, plus any site workforce you employ directly." },
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
  /** Commercial structure used in this market. */
  chargeBasis: "max-of-workers-or-minimum" | "base-plus-allowance";
  notes: string[];
};

/** Billing for markets on the published base-plus-allowance price books. */
export const baseAllowanceBilling: BillingArrangement[] = [
  {
    id: "commitment-monthly",
    name: "Monthly",
    description: "Base subscription and any additional projects or workers, invoiced monthly.",
    multiplier: 1,
    invoicing: "monthly",
    termMonths: null,
  },
  {
    id: "annual-prepaid",
    name: "Annual prepayment",
    description: "The base subscription paid a year in advance with 10% off. Additional projects and workers are invoiced monthly at the standard rate.",
    multiplier: 1,
    invoicing: "annual",
    termMonths: 12,
  },
];

const published = (): MarketModel => ({ status: "approved", billing: baseAllowanceBilling, chargeBasis: "base-plus-allowance", notes: [] });

/** Markets with a published price book. Other markets are quoted. */
export const marketModels: Partial<Record<RegionCode, MarketModel>> = {
  US: published(),
  JM: published(),
  NG: published(),
};

/** How subscriptions are billed — published with the price books. */
export const billingRules = [
  { t: "Office users and invited collaborators are included", d: "Plans are priced by company, projects and your own workers — not by office seats." },
  { t: "Supervisors don't need a separate mobile subscription", d: "The Supervisor Field app is part of the employer's plan." },
  { t: "A GC isn't billed for its subcontractors' workers", d: "Own active workers means your company's own workforce only." },
  { t: "Invitations don't use your project allowance", d: "Only projects your company manages count as company-managed active projects." },
  { t: "A subcontractor subscribes for its own work", d: "To manage its own projects and workforce. Taking part in a GC's shared workspace is through the GC's invitation." },
  { t: "One company, one subscription", d: "A company working as both a GC and a specialty contractor uses one subscription, sized by the projects it manages and its own workers." },
];

/** Pricing disclosures shown beneath the price books. */
export const pricingDisclosures = [
  "Prices exclude taxes, which are added where applicable.",
  "Implementation, data migration, training beyond standard onboarding and integrations are separately scoped services, quoted on their own.",
  "Each market has its own price book. Prices in one market aren't exchange-rate conversions of another.",
  "Enterprise prices are starting points. Enterprise estimates are indicative and confirmed by quote.",
  "Markets without a published price book — including Guyana — are quoted in local currency.",
];

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
