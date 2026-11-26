/**
 * SECURITY & PRIVACY STATEMENTS
 * -----------------------------
 * Written as the product's applicable controls, in present tense.
 *
 * `status` and `verified` are INTERNAL fields for the private publication
 * checklist — they are never rendered as labels.
 *   status: "implemented" — confirmed in production by engineering (record evidence in `evidence`)
 *           "commitment"  — a product requirement not yet confirmed by engineering
 *   verified: true only once the statement has been checked against the live product.
 *
 * In the public release stage, unverified statements are omitted from the site.
 * No certifications (ISO 27001, SOC 2, etc.) or regulatory approvals are claimed anywhere.
 */
import { isPublishable } from "../lib/release.ts";

export type SecurityItem = {
  id: string;
  title: string;
  body: string;
  status: "implemented" | "commitment";
  verified: boolean;
  evidence: string | null;
};

export const securityPrinciples: SecurityItem[] = [
  { id: "access", title: "Role-based access", body: "People see only the sites, projects and records their role requires. Supervisors see their crews; finance sees what finance needs.", status: "commitment", verified: false, evidence: null },
  { id: "separation", title: "Organisation-level data separation", body: "Every customer organisation's records are kept separate from every other organisation's.", status: "commitment", verified: false, evidence: null },
  { id: "employee", title: "Secure employee information", body: "Personal and employment details are limited to the people who need them and handled under your instructions as the employer.", status: "commitment", verified: false, evidence: null },
  { id: "approvals", title: "Controlled approvals", body: "Hours, expenses and reports move forward only when the right person approves them.", status: "commitment", verified: false, evidence: null },
  { id: "audit", title: "Audit trails", body: "Approvals, corrections and changes are attributed to a person and time-stamped. Records are corrected, never silently overwritten.", status: "commitment", verified: false, evidence: null },
  { id: "privacy", title: "Location and biometric privacy", body: "Location is checked at clock-in and clock-out, not tracked through the day. Facial verification is optional and switched on only where the employer has a lawful basis and consent.", status: "commitment", verified: false, evidence: null },
];

export const trustTopics: { id: string; title: string; body: string; status: SecurityItem["status"]; verified: boolean }[] = [
  { id: "data-protection", title: "Data protection", body: "Customer data is processed to provide the service and for no unrelated purpose. As the employer, you remain in control of your workforce data.", status: "commitment", verified: false },
  { id: "app-security", title: "Application security", body: "All application traffic is encrypted in transit. Development follows secure coding practices, with dependencies monitored and updated.", status: "commitment", verified: false },
  { id: "access", title: "Access management", body: "Customer access is role-based. Support access by Axtara personnel is restricted, logged and used only when needed to help you.", status: "commitment", verified: false },
  { id: "segregation", title: "Data segregation", body: "Each organisation's records are logically separated, enforced in both the application and data layers.", status: "commitment", verified: false },
  { id: "employee-privacy", title: "Employee privacy", body: "Workers can see the personal information held about them in the app. Employers choose which optional features are enabled.", status: "commitment", verified: false },
  { id: "biometric", title: "Biometric information", body: "Facial verification is optional and off by default. Enable it only where you have a lawful basis and, where required, the worker's informed consent.", status: "commitment", verified: false },
  { id: "location", title: "Location information", body: "Location is captured at the moment of clock-in or clock-out to confirm attendance against a site boundary. It is not tracked continuously.", status: "commitment", verified: false },
  { id: "retention", title: "Data retention", body: "Retention periods are configured to your legal obligations. At the end of a subscription your data can be exported and deleted.", status: "commitment", verified: false },
  { id: "approvals", title: "Approvals and audit trails", body: "Every approval, correction and rejection is recorded with who made it and when, so you can answer questions about hours or costs long after the fact.", status: "commitment", verified: false },
  { id: "third-party", title: "Secure integrations", body: "Integrations are enabled by you, use scoped credentials and encrypted transport, and carry only the data the receiving system needs.", status: "commitment", verified: false },
  { id: "incident", title: "Incident management", body: "A defined process to investigate and contain security incidents, and to notify affected customers within legally required timeframes.", status: "commitment", verified: false },
];

/** Statements that may be shown in the current release stage. */
export const publicSecurityPrinciples = securityPrinciples.filter(isPublishable);
export const publicTrustTopics = trustTopics.filter(isPublishable);
