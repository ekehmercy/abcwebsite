"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import type { Values } from "@/lib/validation";

const VALUES_EVENT = "axtara:demo-values";

type Buyer = "gc" | "developer" | "sub" | "other";

const buyerFor: Record<string, Buyer> = {
  "General Contractor": "gc",
  "Civil Engineering Contractor": "gc",
  "Real Estate Developer": "developer",
  Subcontractor: "sub",
  "Specialist Contractor": "sub",
  Other: "other",
};

/** What the demo focuses on, by main challenge × business type. */
const focus: Record<string, Record<Buyer, string>> = {
  "Chasing partner reports and daily logs": {
    gc: "Partner obligations, daily report submission and review on your packages.",
    developer: "How reviewed field records become the updates you receive.",
    sub: "Submitting one daily report per package, in the structure each GC uses.",
    other: "Daily reports, review states and who sees them.",
  },
  "RFIs, bids and responsibilities": {
    gc: "Bid invitations and revisions, kept separate from technical RFIs with owners and due dates.",
    developer: "Decisions assigned to you, and how they stay separate from technical RFIs.",
    sub: "Responding to bid invitations, and raising and answering RFIs on your packages.",
    other: "How bids and RFIs run as separate workflows.",
  },
  "Crew time and payroll preparation": {
    gc: "Your own crews' clock-in, supervisor correction and payroll schedule preparation.",
    developer: "Time and payroll preparation for any site workforce you employ directly.",
    sub: "Crews, assignments, time review and payroll schedule preparation for your own employees.",
    other: "Clock-in, supervisor review and employer approval.",
  },
  "Owner reporting and decisions": {
    gc: "Publishing reviewed updates and assigning decisions to the developer.",
    developer: "Owner views, decisions and portfolio exceptions, for directly managed and GC-delivered projects.",
    sub: "How the reports you submit feed the GC's reviewed updates.",
    other: "Reported, reviewed and published information.",
  },
  "Inspections, issues, changes and closeout": {
    gc: "Corrective items, change requests reviewed apart from RFIs, and closeout evidence per package.",
    developer: "Handover readiness and outstanding items across projects.",
    sub: "Closing corrective items with evidence and submitting closeout documents.",
    other: "Issues, inspections and closeout records.",
  },
  "Visibility across projects": {
    gc: "Exceptions across projects and partners.",
    developer: "A portfolio view of reviewed progress and exceptions.",
    sub: "One view of every crew across GCs and your own projects.",
    other: "Cross-project oversight.",
  },
  "Something else": {
    gc: "The workflow you describe.",
    developer: "The workflow you describe.",
    sub: "The workflow you describe.",
    other: "The workflow you describe.",
  },
};

const appsFor: Record<Buyer, string> = {
  gc: "GC/Developer Web, Supervisor Field and Field",
  developer: "GC/Developer Web — and the field apps if you run your own crews",
  sub: "Subcontractor Web, Supervisor Field and Field",
  other: "The web and mobile apps that fit your team",
};

/** The demo request form; shares its values with the agenda panel. */
export function DemoRequestForm({ fallbackEmail }: { fallbackEmail: string | null }) {
  return (
    <LeadForm
      form="demo"
      fallbackEmail={fallbackEmail}
      onValuesChange={(values) => window.dispatchEvent(new CustomEvent<Values>(VALUES_EVENT, { detail: values }))}
    />
  );
}

/** "What we'll focus on" — updates live as the visitor fills in the demo form. */
export function DemoAgenda() {
  const [v, setV] = useState<Values>({});
  useEffect(() => {
    const on = (e: Event) => setV({ ...(e as CustomEvent<Values>).detail });
    window.addEventListener(VALUES_EVENT, on);
    return () => window.removeEventListener(VALUES_EVENT, on);
  }, []);

  const buyer = buyerFor[v.businessType ?? ""] ?? null;
  const challengeFocus = v.challenge && buyer ? focus[v.challenge]?.[buyer] : null;
  const items = [
    challengeFocus ?? "Your main challenge — tell us in the form and this agenda updates.",
    v.interest && v.interest !== "Complete Platform" ? `A closer look at ${v.interest.toLowerCase()}.` : "How the four Axtara apps connect, from the site to the office.",
    buyer ? `The apps your team would use: ${appsFor[buyer]}.` : "Which apps your office, supervisors and field teams would use.",
    v.country ? `Pricing and payroll preparation set up for ${v.country}.` : "A recommended plan and a quote in your local currency.",
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-[0_0_0_1px_var(--n-150)]">
      <p className="text-[13px] font-medium text-brand-700">Your demo agenda</p>
      <h2 className="mt-1.5 text-[18px] font-semibold tracking-[-0.01em] text-n-950">
        {v.company ? `What we'll focus on for ${v.company}` : "What we'll focus on in your demo"}
      </h2>
      <ul className="mt-4 space-y-3" aria-live="polite">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2.5 text-[14.5px] leading-6 text-n-700">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-brand-500" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[13px] text-n-500">Built from your answers. We confirm the agenda with you before the call.</p>
    </div>
  );
}
