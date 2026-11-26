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
      "Includes 3 active projects and 25 of your own workers. Run projects and partner packages, daily reports with photos, RFIs and bids, inspections and punch lists, and your crews' clock-in, timesheets and supervisor time review — then export approved time to your payroll provider.",
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
      "Includes 10 active projects and 100 of your own workers. Everything in Core, plus payroll calculation, review, approval and schedule export; overtime rules; lookahead planning and progress tracking; cost codes, change orders and approval stages; published client updates and a portfolio dashboard.",
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
      "Starts from 25 active projects and 250 of your own workers, confirmed by quote. Everything in Scale, plus multi-entity governance and entity payroll controls, single sign-on, API and webhooks, cross-project oversight, an executive portfolio dashboard and a scoped rollout.",
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
  { group: "Included capacity", name: "Active projects you manage", values: { core: "3", scale: "10", enterprise: "From 25" } },
  { group: "Included capacity", name: "Your own active workers", values: { core: "25", scale: "100", enterprise: "From 250" } },
  { group: "Workforce", name: "Employee records, crews and assignments", values: { core: true, scale: true, enterprise: true } },
  { group: "Workforce", name: "Mobile clock-in, location check and timesheets", values: { core: true, scale: true, enterprise: true } },
  { group: "Workforce", name: "Supervisor time review and corrections", values: { core: true, scale: true, enterprise: true } },
  { group: "Workforce", name: "Leave requests and expense submissions", values: { core: true, scale: true, enterprise: true } },
  { group: "Workforce", name: "Overtime rules and attendance analytics", values: { core: false, scale: true, enterprise: true } },
  { group: "Workforce", name: "Expense approval stages and reimbursement status", values: { core: false, scale: true, enterprise: true } },
  { group: "Projects and field", name: "Projects, partner packages and document revisions", values: { core: true, scale: true, enterprise: true } },
  { group: "Projects and field", name: "Daily reports, site photos and report approval", values: { core: true, scale: true, enterprise: true } },
  { group: "Projects and field", name: "Technical RFIs and bid invitations", values: { core: true, scale: true, enterprise: true } },
  { group: "Projects and field", name: "Issues, inspections and punch lists", values: { core: true, scale: true, enterprise: true } },
  { group: "Projects and field", name: "Lookahead planning and trade readiness", values: { core: false, scale: true, enterprise: true } },
  { group: "Projects and field", name: "Progress measurement and published client updates", values: { core: false, scale: true, enterprise: true } },
  { group: "Projects and field", name: "Handover package export and risk register", values: { core: false, scale: true, enterprise: true } },
  { group: "Cost and payroll", name: "Contract references and change requests", values: { core: true, scale: true, enterprise: true } },
  { group: "Cost and payroll", name: "Approved-time export for your payroll provider", values: { core: true, scale: true, enterprise: true } },
  { group: "Cost and payroll", name: "Cost codes, budgets, commitments and change orders", values: { core: false, scale: true, enterprise: true } },
  { group: "Cost and payroll", name: "Payroll calculation, review, approval and schedule export", values: { core: false, scale: true, enterprise: true } },
  { group: "Cost and payroll", name: "Entity payroll controls", values: { core: false, scale: false, enterprise: true } },
  { group: "Reporting and control", name: "Standard reports and client viewer access", values: { core: true, scale: true, enterprise: true } },
  { group: "Reporting and control", name: "Roles, permissions, partner invitations and audit history", values: { core: true, scale: true, enterprise: true } },
  { group: "Reporting and control", name: "Configurable approval stages", values: { core: false, scale: true, enterprise: true } },
  { group: "Reporting and control", name: "Portfolio project dashboard", values: { core: false, scale: true, enterprise: true } },
  { group: "Reporting and control", name: "Executive portfolio dashboard and scheduled reports", values: { core: false, scale: false, enterprise: true } },
  { group: "Reporting and control", name: "Multi-entity governance and single sign-on", values: { core: false, scale: false, enterprise: true } },
  { group: "Reporting and control", name: "Integrations", values: { core: "Standard exports", scale: "Released connectors", enterprise: "API and webhooks" } },
  { group: "Reporting and control", name: "Onboarding", values: { core: "Guided setup", scale: "Assisted configuration", enterprise: "Scoped rollout" } },
];
