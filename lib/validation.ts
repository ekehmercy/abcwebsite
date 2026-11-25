/**
 * Shared, isomorphic form definitions and validators.
 * The same functions run in the browser (instant feedback) and on the server
 * (authoritative) — the API never trusts client-side validation.
 */

import { regions } from "../config/regions.ts";

export type FormId = "demo" | "contact" | "integration-request" | "security-contact";

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

export const forms: Record<FormId, { fields: FieldDef[]; submitLabel: string; subject: string }> = {
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
      { ...message("Anything we should know? (optional)"), hint: "For example, how many sites you run or what you use today." },
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
