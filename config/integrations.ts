/**
 * INTEGRATION REGISTRY
 * --------------------
 * Only entries with `public: true` appear on the website. No third-party
 * vendor is named publicly unless the relationship AND the integration status
 * have been confirmed (`partnerConfirmed: true`). Entries describe integration
 * *types* until a named integration is approved.
 */

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

export const integrationCategories: { id: IntegrationCategory; name: string; icon: string; description: string }[] = [
  { id: "accounting", name: "Accounting", icon: "BookOpen", description: "Send approved labour and expense costs to your general ledger by project and cost code." },
  { id: "payroll", name: "Payroll", icon: "FileSpreadsheet", description: "Hand off approved, payroll-ready information to the payroll provider you already use." },
  { id: "payments", name: "Payment Services", icon: "Landmark", description: "Support reimbursement and payment workflows executed by licensed payment providers." },
  { id: "identity", name: "Identity Verification", icon: "ScanFace", description: "Confirm worker identity at onboarding or clock-in through specialist providers, where lawful." },
  { id: "estimating", name: "Estimating", icon: "Calculator", description: "Bring budgets and cost codes from estimating tools into project records." },
  { id: "procurement", name: "Procurement", icon: "Package", description: "Connect field requests and expenses with purchasing processes." },
  { id: "documents", name: "Document Management", icon: "FolderOpen", description: "Keep compliance and project documents in sync with your document system." },
];

export const integrationStatusLabels: Record<IntegrationStatus, string> = {
  available: "Available",
  planned: "Planned",
  "under-evaluation": "Under evaluation",
  "customer-requested": "Customer-requested",
};

export const integrations: Integration[] = [
  { id: "csv-export", name: "Spreadsheet and CSV exports", category: "accounting", description: "Export approved hours, expenses and project costs in structured files for import into accounting software.", status: "available", partnerConfirmed: true, public: true, verified: false },
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
