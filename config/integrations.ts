/**
 * INTEGRATION REGISTRY (internal availability configuration)
 * ----------------------------------------------------------
 * `status`, `verified` and `partnerConfirmed` are INTERNAL fields. They feed the
 * private publication checklist and are never rendered as labels.
 *
 * On the website:
 *   - an integration is shown as "Available" only when status === "available"
 *     and it is publishable in the current release stage (see lib/release.ts);
 *   - every other category is presented through what connecting it does, with
 *     a "Request this connection" path into the integration enquiry form;
 *   - no third-party vendor is named unless `partnerConfirmed: true`.
 */
import { isPublishable } from "../lib/release.ts";

export type IntegrationCategory =
  | "accounting"
  | "payroll"
  | "payments"
  | "identity"
  | "estimating"
  | "procurement"
  | "documents";

export type IntegrationStatus = "available" | "planned" | "under-evaluation" | "customer-requested";

export type Integration = {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  status: IntegrationStatus;
  /** A named vendor may only be shown if this is true. */
  partnerConfirmed: boolean;
  public: boolean;
  verified: boolean;
};

export type IntegrationCategoryDef = {
  id: IntegrationCategory;
  name: string;
  icon: string;
  description: string;
  outcome: string;
  /** What stays in the specialist tool. */
  stays: string;
  /** What moves between that tool and Axtara. */
  flows: string;
};

export const integrationCategories: IntegrationCategoryDef[] = [
  { id: "accounting", name: "Accounting", icon: "BookOpen", description: "Approved labour and expense costs flow to your general ledger by project and cost code.", outcome: "Close the month without re-keying site costs.", stays: "Ledgers, invoicing, budgets and final accounts.", flows: "Cost codes, approved hours, approved expenses and change-request status from Axtara." },
  { id: "payroll", name: "Payroll", icon: "FileSpreadsheet", description: "Approved, payroll-ready hours and allowances reach the payroll provider you already use. Your provider runs payroll and pays your people.", outcome: "Start every payroll run from approved hours.", stays: "Running payroll and paying your employees.", flows: "An employer-approved payroll schedule, prepared from reviewed time in Axtara." },
  { id: "payments", name: "Payments", icon: "Landmark", description: "Reimbursement status stays in step with payments made by your bank or licensed payment provider.", outcome: "Workers see where their claim stands.", stays: "Moving money — wages and reimbursements.", flows: "Approved expense claims out; reimbursement status back in." },
  { id: "identity", name: "Identity Verification", icon: "ScanFace", description: "Specialist verification services confirm worker identity at onboarding, where lawful and with consent.", outcome: "Know who you are putting on site.", stays: "Identity checks and the evidence behind them.", flows: "A verification result attached to the employee record." },
  { id: "estimating", name: "Estimating", icon: "Calculator", description: "Budgets and cost-code structures from your estimating tools become the baseline for each project.", outcome: "Compare actual labour against the estimate.", stays: "Takeoff, quantities, rates and prices.", flows: "Cost-code structures and approved budget references in; bid documents recorded against each package." },
  { id: "procurement", name: "Procurement", icon: "Package", description: "Approved field requests pass into your purchasing process with the project and cost code attached.", outcome: "Materials requests arrive ready to order.", stays: "Purchase orders, suppliers and payments to them.", flows: "Approved field requests with project, package and cost code attached." },
  { id: "documents", name: "Document Management", icon: "FolderOpen", description: "Certifications, permits and project records stay in sync with your document system.", outcome: "One version of every compliance document.", stays: "Authoring and controlling drawings, models and company documents.", flows: "Issued documents shared and versioned on packages, with superseded copies marked." },
];

/** Specialist tools Axtara works alongside without replacing. */
export const adjacentTools: { name: string; stays: string; axtara: string }[] = [
  { name: "Specialist scheduling", stays: "The critical-path programme and its logic.", axtara: "Activities, progress entries, milestones and lookahead commitments referenced against it." },
  { name: "Design and drawings", stays: "Authoring drawings and models.", axtara: "Issued drawings shared on packages, versioned, with superseded copies marked." },
  { name: "Takeoff and estimating", stays: "Quantities, rates and prices.", axtara: "Bid invitations, addenda and submissions recorded per package; the awarded scope." },
];

/** INTERNAL — used by the publication checklist only. Never render these labels on the website. */
export const integrationStatusLabels: Record<IntegrationStatus, string> = {
  available: "Available",
  planned: "Planned",
  "under-evaluation": "Under evaluation",
  "customer-requested": "Customer-requested",
};

export const integrations: Integration[] = [
  { id: "csv-export", name: "Spreadsheet and CSV exports", category: "accounting", description: "Export approved hours, expenses and project costs in structured files ready for your accounting software.", status: "available", partnerConfirmed: true, public: true, verified: false },
  { id: "gl-sync", name: "General ledger connectors", category: "accounting", description: "Direct posting of labour and expense costs to cloud accounting platforms by project and cost code.", status: "under-evaluation", partnerConfirmed: false, public: true, verified: false },
  { id: "payroll-file", name: "Payroll provider file handoff", category: "payroll", description: "Approved payroll information formatted for import by an external payroll provider.", status: "planned", partnerConfirmed: false, public: true, verified: false },
  { id: "payroll-api", name: "Payroll provider connectors", category: "payroll", description: "Direct handoff of approved payroll data to regional payroll providers in Jamaica, Nigeria, Guyana and the United States.", status: "under-evaluation", partnerConfirmed: false, public: true, verified: false },
  { id: "reimburse", name: "Reimbursement payment workflows", category: "payments", description: "Status updates for expense reimbursements processed by a licensed payment provider or bank.", status: "under-evaluation", partnerConfirmed: false, public: true, verified: false },
  { id: "idv", name: "Identity verification services", category: "identity", description: "Document and identity checks at onboarding through regional verification providers.", status: "under-evaluation", partnerConfirmed: false, public: true, verified: false },
  { id: "estimating-import", name: "Budget and cost-code import", category: "estimating", description: "Import project budgets and cost-code structures from estimating tools.", status: "planned", partnerConfirmed: false, public: true, verified: false },
  { id: "po-link", name: "Purchase request handoff", category: "procurement", description: "Pass approved field requests into procurement and purchasing processes.", status: "customer-requested", partnerConfirmed: false, public: true, verified: false },
  { id: "doc-sync", name: "Cloud document storage", category: "documents", description: "Synchronise compliance and project documents with cloud document storage.", status: "customer-requested", partnerConfirmed: false, public: true, verified: false },
];

export const publicIntegrations = integrations.filter((i) => i.public);

/** Integrations that may be presented as available in the current release stage. */
export const availableIntegrations = publicIntegrations.filter((i) => i.status === "available" && isPublishable(i));
