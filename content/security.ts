/**
 * Security & privacy statements. `status` must reflect engineering evidence:
 *   implemented — verified in production by engineering (evidence recorded in `evidence`)
 *   commitment  — a design requirement / commitment, not yet verified as implemented
 * No certifications (ISO 27001, SOC 2, etc.) are claimed anywhere on the site.
 */
export type SecurityItem = {
  id: string;
  title: string;
  body: string;
  status: "implemented" | "commitment";
  evidence: string | null;
};

export const securityPrinciples: SecurityItem[] = [
  { id: "access", title: "Controlled access", body: "Role-based permissions so people see only the sites, projects and records their role requires.", status: "commitment", evidence: null },
  { id: "separation", title: "Organisation-level data separation", body: "Each customer organisation's data is logically separated from every other organisation's.", status: "commitment", evidence: null },
  { id: "audit", title: "Auditability", body: "Approvals, corrections and changes to operational records are attributed and time-stamped.", status: "commitment", evidence: null },
  { id: "employee", title: "Employee information protection", body: "Personal and employment information is limited to the people who need it, and handled under your instructions as the employer.", status: "commitment", evidence: null },
  { id: "integrations", title: "Secure integration principles", body: "Integrations use scoped credentials, encrypted transport and the minimum data required for the purpose.", status: "commitment", evidence: null },
  { id: "privacy", title: "Privacy-conscious product design", body: "Location is checked at clock-in rather than tracked continuously. Biometric features are optional and require lawful configuration and consent.", status: "commitment", evidence: null },
];

export const trustTopics: { id: string; title: string; body: string; status: SecurityItem["status"] }[] = [
  { id: "data-protection", title: "Data protection", body: "Customer data is processed to provide the service and for no unrelated purpose. Customers, as employers, remain the controllers of their workforce data.", status: "commitment" },
  { id: "app-security", title: "Application security", body: "Secure development practices, dependency monitoring and encrypted transport (TLS) for all application traffic.", status: "commitment" },
  { id: "access", title: "Access management", body: "Role-based access for customer users, and restricted, logged access for Axtara personnel where support requires it.", status: "commitment" },
  { id: "segregation", title: "Data segregation", body: "Logical separation of each organisation's records, enforced in the application and data layers.", status: "commitment" },
  { id: "employee-privacy", title: "Employee privacy", body: "Workers can see the personal information held about them in the app. Employers decide which optional features are enabled.", status: "commitment" },
  { id: "biometric", title: "Biometric information", body: "Facial verification is optional, off by default, and must only be enabled where the employer has a lawful basis and the worker's informed consent where required.", status: "commitment" },
  { id: "location", title: "Location information", body: "Location is captured at the moment of clock-in or clock-out to verify attendance against a site boundary — not tracked continuously.", status: "commitment" },
  { id: "retention", title: "Data retention", body: "Retention periods are configurable to the employer's legal obligations, with deletion or export at the end of a subscription.", status: "commitment" },
  { id: "third-party", title: "Third-party integrations", body: "Integrations are enabled by the customer, documented, and limited to the data required.", status: "commitment" },
  { id: "incident", title: "Incident management", body: "A defined process to investigate, contain and notify affected customers of security incidents within legally required timeframes.", status: "commitment" },
  { id: "responsible", title: "Responsible product development", body: "Features that affect workers — such as location and identity checks — are designed with the worker's experience and rights in mind.", status: "commitment" },
];
