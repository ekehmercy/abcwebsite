"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { forms, validate, interestAreas, type Errors, type FormId, type Values } from "@/lib/validation";
import { regions } from "@/config/regions";
import { track } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Field } from "./field";

type Status = "idle" | "submitting" | "success" | "not_configured" | "error";

const successCopy: Record<FormId, { title: string; body: string }> = {
  demo: { title: "Thanks — your request has been received.", body: "A member of the Axtara team will contact you to arrange a time. We'll tailor the demonstration to the areas you selected." },
  contact: { title: "Thanks — your message has been sent.", body: "We'll reply to the email address you provided." },
  "integration-request": { title: "Thanks — your request has been recorded.", body: "Integration requests help us decide what to build next. We may contact you to understand your requirements." },
  "security-contact": { title: "Thanks — your message reached the security team.", body: "We'll respond to the email address you provided. If you reported a vulnerability, please don't disclose it publicly while we investigate." },
  partner: { title: "Thanks — your enquiry has been received.", body: "Our partnerships team will review it and get in touch to arrange a fit discussion." },
};

const interestAliases: Record<string, string> = {
  pricing: "Complete Platform",
  platform: "Complete Platform",
  workforce: "Workforce Management",
  roi: "Complete Platform",
  mobile: "Field Operations",
  "bids-rfis": "Projects",
  "inspections-handover": "Compliance",
  expenses: "Projects",
  reporting: "Complete Platform",
  attendance: "Attendance",
  "time-attendance": "Attendance",
  field: "Field Operations",
  "field-operations": "Field Operations",
  projects: "Projects",
  "project-operations": "Projects",
  payroll: "Payroll Preparation",
  compliance: "Compliance",
};

/** Reads supported URL parameters and maps them onto form fields. */
function prefillFromUrl(form: FormId): Values {
  const p = new URLSearchParams(window.location.search);
  const out: Values = {};
  const fieldNames = new Set(forms[form].fields.map((f) => f.name));
  const interest = p.get("interest")?.toLowerCase();
  if (interest && fieldNames.has("interest")) {
    const match = interestAreas.find((a) => a.toLowerCase() === interest) ?? interestAliases[interest];
    if (match) out.interest = match;
  }
  const region = p.get("region");
  if (region && fieldNames.has("country")) {
    const r = regions.find((x) => x.code === region.toUpperCase());
    if (r) out.country = r.name;
  }
  const topic = p.get("topic");
  if (topic && fieldNames.has("topic")) {
    const opt = forms[form].fields.find((f) => f.name === "topic")?.options?.find((o) => o.toLowerCase().startsWith(topic.toLowerCase()));
    if (opt) out.topic = opt;
  }
  const category = p.get("category");
  if (category && fieldNames.has("category")) {
    const opt = forms[form].fields.find((f) => f.name === "category")?.options?.find((o) => o.toLowerCase().startsWith(category.toLowerCase()));
    if (opt) out.category = opt;
  }
  const pathway = p.get("pathway");
  if (pathway && fieldNames.has("pathway")) {
    const opt = forms[form].fields.find((f) => f.name === "pathway")?.options?.find((o) => o.toLowerCase().replace(/[^a-z]/g, "").startsWith(pathway.toLowerCase().replace(/[^a-z]/g, "")));
    if (opt) out.pathway = opt;
  }
  const business = p.get("business")?.toLowerCase();
  if (business && fieldNames.has("businessType")) {
    const map: Record<string, string> = {
      "general-contractors": "General Contractor", gc: "General Contractor", "general-contractor": "General Contractor",
      subcontractors: "Subcontractor", sub: "Subcontractor", subcontractor: "Subcontractor",
      "real-estate": "Real Estate Developer", developer: "Real Estate Developer", developers: "Real Estate Developer",
      infrastructure: "Civil Engineering Contractor", civil: "Civil Engineering Contractor",
      specialist: "Specialist Contractor",
    };
    if (map[business]) out.businessType = map[business];
  }
  const challenge = p.get("challenge")?.toLowerCase();
  if (challenge && fieldNames.has("challenge")) {
    const opt = forms[form].fields.find((f) => f.name === "challenge")?.options?.find((o) => o.toLowerCase().startsWith(challenge.replace(/-/g, " ")) || o.toLowerCase().includes(challenge.replace(/-/g, " ")));
    if (opt) out.challenge = opt;
  }
  const projectsParam = p.get("projects");
  const companyType = p.get("type");
  const crews = p.get("crews");
  const plan = p.get("plan");
  const workers = p.get("workers");
  const billing = p.get("billing");
  if ((plan || workers) && fieldNames.has("message")) {
    const bits = [
      companyType && companyType.replace(/-/g, " "),
      plan && `${plan.charAt(0).toUpperCase()}${plan.slice(1)} plan`,
      workers && `about ${workers.replace(/\D/g, "")} own active workers`,
      projectsParam && `${projectsParam.replace(/\D/g, "")} company-managed projects`,
      crews && `own site crews: ${crews === "yes" ? "yes" : "no"}`,
      billing && `billing: ${billing.replace(/-/g, " ")}`,
    ].filter(Boolean);
    out.message = `Pricing enquiry — ${bits.join(", ")}.`;
  }
  return out;
}

export function LeadForm({
  form,
  fallbackEmail,
  className,
  onValuesChange,
}: {
  form: FormId;
  fallbackEmail?: string | null;
  className?: string;
  /** Optional: notified whenever field values change (e.g. to personalise surrounding content). */
  onValuesChange?: (values: Values) => void;
}) {
  const def = forms[form];
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const startedAt = useRef<number>(0);
  const startedTracked = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const idp = `f-${form}`;

  useEffect(() => {
    startedAt.current = Date.now();
    setValues((v) => ({ ...prefillFromUrl(form), ...v }));
  }, [form]);

  const onValuesChangeRef = useRef(onValuesChange);
  onValuesChangeRef.current = onValuesChange;
  useEffect(() => {
    onValuesChangeRef.current?.(values);
  }, [values]);

  useEffect(() => {
    if (showSummary) summaryRef.current?.focus();
  }, [showSummary]);

  useEffect(() => {
    if (status === "success" || status === "not_configured" || status === "error") resultRef.current?.focus();
  }, [status]);

  const onChange = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) {
      const next = validate(form, { ...values, [name]: value }).errors;
      setErrors((e) => {
        const copy = { ...e };
        if (next[name]) copy[name] = next[name];
        else delete copy[name];
        return copy;
      });
    }
    if (!startedTracked.current && form === "demo") {
      startedTracked.current = true;
      track("demo_form_started");
    }
  };

  const onBlur = (name: string) => {
    const v = values[name];
    if (!v) return;
    const e = validate(form, values).errors[name];
    setErrors((prev) => {
      const copy = { ...prev };
      if (e) copy[name] = e;
      else delete copy[name];
      return copy;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { errors: errs } = validate(form, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setShowSummary(false);
      requestAnimationFrame(() => setShowSummary(true));
      return;
    }
    setShowSummary(false);
    setStatus("submitting");
    try {
      const res = await fetch(`/api/forms/${form}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company_website: String(fd.get("company_website") ?? ""), _startedAt: startedAt.current, _page: window.location.pathname }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Errors; message?: string; error?: string };
      if (res.ok && data.ok) {
        setStatus("success");
        if (form === "demo") track("demo_form_submitted", { interest: values.interest ?? "", country: values.country ?? "" });
        if (form === "integration-request") track("integration_request_submitted", { category: values.category ?? "" });
        if (form === "contact") track("contact_form_submitted", { topic: values.topic ?? "" });
        if (form === "partner") track("partner_enquiry_submitted", { pathway: values.pathway ?? "" });
        return;
      }
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        requestAnimationFrame(() => setShowSummary(true));
        return;
      }
      setServerMessage(data.message ?? "Something went wrong. Please try again.");
      setStatus(res.status === 503 ? "not_configured" : "error");
    } catch {
      setServerMessage("We couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    const c = successCopy[form];
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className={cn("rounded-xl bg-white p-8 shadow-[0_0_0_1px_var(--n-150),var(--shadow-card)] outline-none", className)}>
        <CheckCircle2 className="size-8 text-ok" aria-hidden="true" />
        <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-n-950">{c.title}</h2>
        <p className="mt-2 text-[15px] leading-6 text-n-600">{c.body}</p>
      </div>
    );
  }

  const errorEntries = Object.entries(errors);
  const fieldLabel = (n: string) => def.fields.find((f) => f.name === n)?.label ?? n;

  return (
    <form noValidate onSubmit={onSubmit} className={cn("relative rounded-xl bg-white p-5 shadow-[0_0_0_1px_var(--n-150),var(--shadow-card)] sm:p-8", className)} aria-describedby={`${idp}-req`}>
      <p id={`${idp}-req`} className="mb-5 text-[13px] text-n-500">All fields are required unless marked optional.</p>

      {showSummary && errorEntries.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 rounded-lg bg-bad-bg p-4 text-bad outline-none ring-1 ring-bad/25">
          <p className="flex items-center gap-2 text-[14.5px] font-semibold"><AlertCircle className="size-4" aria-hidden="true" />Please check {errorEntries.length === 1 ? "1 field" : `${errorEntries.length} fields`}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-[14px]">
            {errorEntries.map(([n, m]) => (
              <li key={n}><a href={`#${idp}-${n}`} className="underline underline-offset-2">{fieldLabel(n)}</a>: {m}</li>
            ))}
          </ul>
        </div>
      )}

      {(status === "not_configured" || status === "error") && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="mb-6 rounded-lg bg-warn-bg p-4 text-[14.5px] leading-6 text-n-800 outline-none ring-1 ring-warn/25">
          <p className="flex items-center gap-2 font-semibold text-warn"><AlertCircle className="size-4" aria-hidden="true" />{status === "not_configured" ? "Your details have not been sent" : "Your submission didn't go through"}</p>
          <p className="mt-1">{serverMessage}</p>
          {fallbackEmail ? (
            <p className="mt-1">You can email us directly at <a className="font-medium text-brand-700 underline" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.</p>
          ) : status === "not_configured" ? (
            <p className="mt-1">Please try again later — no information has been stored.</p>
          ) : null}
        </div>
      )}

      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {def.fields.map((f) => (
          <Field
            key={f.name}
            def={f}
            id={`${idp}-${f.name}`}
            value={values[f.name] ?? ""}
            error={errors[f.name]}
            onChange={(v) => onChange(f.name, v)}
            onBlur={() => onBlur(f.name)}
          />
        ))}
      </div>

      {/* Honeypot — hidden from people and assistive technology */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${idp}-hp`}>Company website</label>
        <input id={`${idp}-hp`} name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === "submitting"} className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
          {status === "submitting" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {status === "submitting" ? "Sending…" : def.submitLabel}
        </button>
        <p className="text-[12.5px] leading-5 text-n-500 sm:max-w-[260px] sm:text-right">
          We use these details only to respond to you. See our <a href="/legal/privacy" className="underline underline-offset-2">privacy policy</a>.
        </p>
      </div>
      <p className="sr-only" aria-live="polite">{status === "submitting" ? "Sending your submission" : ""}</p>
    </form>
  );
}
