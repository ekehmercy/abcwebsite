/**
 * Shared, isomorphic form definitions and validators.
 * The same functions run in the browser (instant feedback) and on the server
 * (authoritative) — the API never trusts client-side validation.
 */

import { regions } from "../config/regions.ts";

export type FormId = "demo" | "contact" | "integration-request" | "security-contact" | "partner";

export const businessTypes = [
  "General Contractor",
  "Subcontractor",
  "Real Estate Developer",
  "Civil Engineering Contractor",
  "Specialist Contractor",
  "Other",
] as const;

export const interestAreas = [
  "Workforce Management",
  "Attendance",
  "Field Operations",
  "Projects",
  "Payroll Preparation",
  "Compliance",
  "Complete Platform",
] as const;

export const employeeRanges = ["1–24", "25–74", "75–199", "200–499", "500–999", "1,000+"] as const;

/** Main operational challenge — drives the personalised demo agenda. */
export const demoChallenges = [
  "Chasing partner reports and daily logs",
  "RFIs, bids and responsibilities",
  "Crew time and payroll preparation",
  "Owner reporting and decisions",
  "Inspections, issues, changes and closeout",
  "Visibility across projects",
  "Something else",
] as const;

export const projectRanges = ["1 to 3", "4 to 10", "11 to 25", "More than 25"] as const;

export const workforceRanges = ["None of our own", "Under 25", "25 to 100", "101 to 250", "More than 250"] as const;

export const partnerCountries = ["Nigeria", "Jamaica", "Wider Caribbean", "United States", "Other"] as const;

export const partnerPathwayOptions = ["Referral", "Reseller and regional", "Implementation", "Technology and integration", "Not sure yet"] as const;

export const partnerOrgTypes = [
  "Construction adviser or consultancy",
  "Accounting or quantity surveying firm",
  "Industry association",
  "Software reseller or distributor",
  "Implementation or services firm",
  "Software provider",
  "Other",
] as const;

export const countryOptions = [...regions.map((r) => r.name), "Other"] as const;

export const contactTopics = ["Sales", "Existing customer support", "Partnerships", "Media", "Something else"] as const;

export const integrationCategoryOptions = [
  "Accounting",
  "Payroll",
  "Payments",
  "Identity Verification",
  "Estimating",
  "Procurement",
  "Document Management",
  "Other",
] as const;

export const securityTopics = ["Privacy request", "Security question", "Report a vulnerability", "Data processing enquiry"] as const;

export type FieldType = "text" | "email" | "select" | "textarea";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  max: number;
  options?: readonly string[];
  autoComplete?: string;
  placeholder?: string;
  half?: boolean;
  hint?: string;
};

const name = (n: string, label: string, auto: string): FieldDef => ({ name: n, label, type: "text", required: true, max: 80, autoComplete: auto, half: true });
const workEmail: FieldDef = { name: "email", label: "Work email", type: "email", required: true, max: 160, autoComplete: "email" };
const company: FieldDef = { name: "company", label: "Company name", type: "text", required: true, max: 120, autoComplete: "organization" };
const message = (label = "Message", required = false): FieldDef => ({ name: "message", label, type: "textarea", required, max: 2000 });

export type FormDef = { fields: FieldDef[]; submitLabel: string; subject: string };

export const forms: Record<FormId, FormDef> = {
  demo: {
    subject: "Demo request",
    submitLabel: "Request a Demo",
    fields: [
      name("firstName", "First name", "given-name"),
      name("lastName", "Last name", "family-name"),
      workEmail,
      company,
      { name: "country", label: "Country", type: "select", required: true, max: 60, options: countryOptions, half: true, autoComplete: "country-name" },
      { name: "businessType", label: "Business type", type: "select", required: true, max: 60, options: businessTypes, half: true },
      { name: "employees", label: "Number of employees", type: "select", required: true, max: 20, options: employeeRanges, half: true },
      { name: "interest", label: "Area of interest", type: "select", required: true, max: 60, options: interestAreas, half: true },
      { name: "challenge", label: "Main challenge", type: "select", required: true, max: 80, options: demoChallenges },
      { name: "projects", label: "Active projects (optional)", type: "select", max: 30, options: projectRanges, half: true },
      { name: "ownWorkforce", label: "Your own site workforce (optional)", type: "select", max: 30, options: workforceRanges, half: true },
      { ...message("Anything we should know? (optional)"), hint: "For example, the tools you use today or a project you'd like us to model." },
    ],
  },
  contact: {
    subject: "Website contact",
    submitLabel: "Send message",
    fields: [
      name("firstName", "First name", "given-name"),
      name("lastName", "Last name", "family-name"),
      { ...workEmail, label: "Email" },
      { ...company, required: false, label: "Company (optional)" },
      { name: "topic", label: "Topic", type: "select", required: true, max: 60, options: contactTopics },
      message("Message", true),
    ],
  },
  "integration-request": {
    subject: "Integration request",
    submitLabel: "Submit request",
    fields: [
      name("firstName", "First name", "given-name"),
      name("lastName", "Last name", "family-name"),
      workEmail,
      company,
      { name: "category", label: "Category", type: "select", required: true, max: 60, options: integrationCategoryOptions, half: true },
      { name: "system", label: "Application you use", type: "text", required: true, max: 120, half: true, placeholder: "e.g. your accounting software" },
      message("What should the integration do? (optional)"),
    ],
  },
  "security-contact": {
    subject: "Security or privacy enquiry",
    submitLabel: "Send to the security team",
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true, max: 120, autoComplete: "name", half: true },
      { ...workEmail, label: "Email", half: true },
      { ...company, required: false, label: "Organisation (optional)" },
      { name: "topic", label: "Topic", type: "select", required: true, max: 60, options: securityTopics },
      { ...message("Details", true), hint: "Please don't include passwords or other secrets. For vulnerabilities, describe the issue and how to reproduce it." },
    ],
  },
  partner: {
    subject: "Partner enquiry",
    submitLabel: "Send enquiry",
    fields: [
      name("firstName", "First name", "given-name"),
      name("lastName", "Last name", "family-name"),
      workEmail,
      { ...company, label: "Organisation" },
      { name: "country", label: "Country or region", type: "select", required: true, max: 40, options: partnerCountries, half: true },
      { name: "pathway", label: "Partnership pathway", type: "select", required: true, max: 40, options: partnerPathwayOptions, half: true },
      { name: "orgType", label: "Organisation type", type: "select", required: true, max: 60, options: partnerOrgTypes },
      { ...message("How you'd like to work together", true), hint: "Your customers or markets, and what you'd bring. Please don't include customer records or financial documents." },
    ],
  },
};

export function isFormId(v: string): v is FormId {
  return v in forms;
}

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;

export type Values = Record<string, string>;
export type Errors = Record<string, string>;

/** Validates and normalises submitted values. Unknown fields are dropped. */
export function validate(form: FormId, input: Record<string, unknown>): { values: Values; errors: Errors } {
  const values: Values = {};
  const errors: Errors = {};
  for (const f of forms[form].fields) {
    const raw = input[f.name];
    const v = typeof raw === "string" ? raw.trim() : "";
    values[f.name] = v;
    if (!v) {
      if (f.required) errors[f.name] = f.type === "select" ? `Choose ${f.label.toLowerCase()}.` : `Enter ${f.label.toLowerCase()}.`;
      continue;
    }
    if (v.length > f.max) errors[f.name] = `${f.label} must be ${f.max} characters or fewer.`;
    else if (f.type === "email" && !EMAIL_RE.test(v)) errors[f.name] = "Enter an email address like name@company.com.";
    else if (f.options && !f.options.includes(v)) errors[f.name] = `Choose a valid option for ${f.label.toLowerCase()}.`;
  }
  return { values, errors };
}
