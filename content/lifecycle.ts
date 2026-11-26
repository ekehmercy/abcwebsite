/**
 * WHERE AXTARA FITS — construction lifecycle content.
 * Each stage carries an internal `verified` flag; the public release shows only
 * verified stages (see lib/release.ts). Flags are never rendered.
 */
import { isPublishable } from "../lib/release.ts";

export type FitRole = "records" | "partners" | "runs";

export const fitRoles: Record<FitRole, { label: string; text: string }> = {
  records: { label: "Organises the records", text: "The core work happens in specialist tools. Axtara holds the records this stage produces, so later stages refer back to one set." },
  partners: { label: "Coordinates partners", text: "Axtara runs the coordination between the GC or developer and its subcontractors." },
  runs: { label: "Runs the work", text: "Mobilisation, field execution, review and delivery records — day to day, in Axtara." },
};

export type AdjacentId = "feasibility" | "design" | "estimating" | "budget" | "cpm" | "accounting" | "payroll" | "fm";

export type Stage = {
  id: string;
  n: number;
  title: string;
  short: string;
  role: FitRole;
  challenge: { gc: string; sub: string };
  gcDoes: string;
  subDoes: string;
  field: string | null;
  records: string[];
  value: { gc: string; sub: string };
  adjacent: AdjacentId[];
  verified: boolean;
};

export const stages: Stage[] = [
  {
    id: "prep", n: 1, title: "Package preparation", short: "Preparation", role: "records",
    challenge: {
      gc: "Packages are assembled from drawings, specifications and estimates held in different places, so partners receive inconsistent information.",
      sub: "Opportunities arrive late, with incomplete documents and no single place to find the latest set.",
    },
    gcDoes: "Break the project into work packages and attach the scope documents, drawings and activities prepared in your design and estimating tools.",
    subDoes: "Keep your company details, crews and current commitments up to date in your own account, ready for the next invitation.",
    field: null,
    records: ["Project", "Work packages", "Package documents and drawings", "Activity lists"],
    value: {
      gc: "Each package starts from one document set that every later invitation, RFI and report refers back to.",
      sub: "When an invitation arrives, it carries the package's documents — not a loose email chain.",
    },
    adjacent: ["feasibility", "design", "estimating", "budget"],
    verified: false,
  },
  {
    id: "bid", n: 2, title: "Bid invitation and submission", short: "Bidding", role: "partners",
    challenge: {
      gc: "Clarifications and addenda reach some bidders and not others, and bid questions get mixed up with technical RFIs.",
      sub: "Addenda arrive after you've priced, and you can't tell whether your clarification question was answered.",
    },
    gcDoes: "Issue a bid invitation to selected companies with documents, a deadline and addenda. Answer clarifications and compare submissions.",
    subDoes: "Review the package, ask clarification questions and submit your price and supporting documents before the deadline.",
    field: null,
    records: ["Bid invitation", "Addenda", "Clarification questions and answers", "Bid submissions — each visible only to its bidder and the inviting GC"],
    value: {
      gc: "A record of what each bidder received and when each submitted.",
      sub: "Confidence that you priced against the latest addendum.",
    },
    adjacent: ["estimating", "budget"],
    verified: false,
  },
  {
    id: "award", n: 3, title: "Award and agreed scope", short: "Award", role: "partners",
    challenge: {
      gc: "What was agreed at award drifts from what partners believe they are building.",
      sub: "The scope you priced and the scope you're asked to build don't quite match.",
    },
    gcDoes: "Award the package, record the agreed scope, documents and activities, and invite the partner's administrator to the package.",
    subDoes: "Accept the award, confirm scope and contacts, and see the package alongside your other work in your own account.",
    field: "The subcontractor nominates the supervisor who will run the package on site.",
    records: ["Award", "Agreed scope and document set", "Package membership", "Activity list"],
    value: {
      gc: "Both companies start from the same scope record.",
      sub: "A reference to return to when scope questions come up later.",
    },
    adjacent: ["budget", "cpm", "accounting"],
    verified: false,
  },
  {
    id: "mobilise", n: 4, title: "Mobilisation and crew assignment", short: "Mobilisation", role: "runs",
    challenge: {
      gc: "Partners arrive on site without current drawings, site notices or a named supervisor.",
      sub: "Crews are allocated by phone, and nobody is sure who is on which site tomorrow.",
    },
    gcDoes: "Share current drawings and site notices, confirm each partner's supervisor and start date, and assign your own crews.",
    subDoes: "Assign a supervisor and crew from your own workforce to the package, and manage assignments across every project you work on.",
    field: "Supervisors see their package, activities, current drawings and crew. Workers see their assignment, site and start date.",
    records: ["Crew assignments — held by each employer", "Package membership", "Current document set", "Site notices"],
    value: {
      gc: "You know who is responsible on site for each package before work starts.",
      sub: "One view of where every crew is working, across every GC and your own projects.",
    },
    adjacent: ["cpm", "payroll"],
    verified: false,
  },
  {
    id: "execute", n: 5, title: "Execution and project control", short: "Execution", role: "runs",
    challenge: {
      gc: "Daily reports are late or inconsistent, RFIs and change requests blur together, and progress gets inferred from hours.",
      sub: "Every GC wants reports differently, and time corrections pile up before each pay run.",
    },
    gcDoes: "Review daily reports, progress and issues. Route RFIs, track change requests as their own records, assign decisions and publish updates to the developer or client.",
    subDoes: "Share daily reports and progress on GC packages, raise RFIs and change requests, review your crews' time and prepare payroll schedules.",
    field: "Supervisors sign crews in, record progress against activities, raise issues and RFIs with photos, and correct time. Workers clock in and out against their assignment.",
    records: ["Daily reports", "Progress entries", "Issues", "RFIs", "Change requests", "Decisions and published updates", "Time records — held by each employer"],
    value: {
      gc: "Missing reports and open questions are visible every day, and owner updates come from reviewed records.",
      sub: "Report once per package, and correct time close to the day it applies to.",
    },
    adjacent: ["cpm", "budget", "accounting", "payroll"],
    verified: false,
  },
  {
    id: "inspect", n: 6, title: "Inspection and corrective work", short: "Inspection", role: "runs",
    challenge: {
      gc: "Inspection findings live in spreadsheets and are chased by phone. Nobody can see what has actually been fixed.",
      sub: "You hear about a defect only when it holds up the next trade.",
    },
    gcDoes: "Record inspection findings against the package, assign corrective items to the responsible partner with due dates, and review closure evidence.",
    subDoes: "Receive the corrective items on your packages, assign them to a supervisor and close them with photos and notes.",
    field: "Supervisors close corrective items with before-and-after photos. Workers carry out the assigned corrective work.",
    records: ["Inspection findings", "Corrective items with owner and due date", "Photo evidence", "Closure reviews"],
    value: {
      gc: "Open corrective items per partner are visible well before handover.",
      sub: "A clear list of what is yours to fix, with evidence of what you closed.",
    },
    adjacent: ["design", "accounting"],
    verified: false,
  },
  {
    id: "handover", n: 7, title: "Handover", short: "Handover", role: "runs",
    challenge: {
      gc: "Handover documents arrive late and incomplete, and open items surface after the keys change hands. Developers see readiness only at the last meeting.",
      sub: "You're asked again for warranties and manuals you sent weeks ago.",
    },
    gcDoes: "Track handover documents and outstanding items per package, and publish handover readiness to the developer, who follows it across every project.",
    subDoes: "Submit as-built drawings, test certificates, manuals and warranties for your packages, and close the remaining items.",
    field: "Supervisors close final items with photos and confirm their area is complete.",
    records: ["Handover document checklist", "As-built drawings and certificates", "Warranties and manuals", "Outstanding items", "Readiness status"],
    value: {
      gc: "Handover readiness is visible across the project, package by package.",
      sub: "A record of what you submitted, and when.",
    },
    adjacent: ["design", "fm"],
    verified: false,
  },
  {
    id: "closeout", n: 8, title: "Closeout and lessons", short: "Closeout", role: "runs",
    challenge: {
      gc: "Closeout evidence is scattered, and lessons from one project don't reach the next.",
      sub: "Final documentation requests drag on after your crews have moved to other work.",
    },
    gcDoes: "Confirm closeout evidence per package, keep the project record, and review partner records — report timeliness, RFIs and corrective items — to inform future selection.",
    subDoes: "Confirm your closeout documents and review your own crew and project records for lessons on future work.",
    field: "Supervisors add closing notes on what worked and what didn't on their packages.",
    records: ["Closeout checklist", "Final document set", "RFI, issue and corrective item history", "Lessons notes"],
    value: {
      gc: "A complete delivery record to refer to in disputes and when choosing partners for the next project.",
      sub: "Your own record of how the project ran, ready for your next opportunity.",
    },
    adjacent: ["accounting", "estimating", "fm"],
    verified: false,
  },
];

export const publicStages = stages.filter(isPublishable);

/**
 * Specialist tools Axtara works alongside. `span` is in stage columns:
 * 0 = before stage 1, 1–8 = stages, 9 = after stage 8.
 */
export const adjacentTools: Record<AdjacentId, { name: string; span: [number, number]; note: string }> = {
  feasibility: { name: "Land, financing and feasibility", span: [0, 0], note: "Development appraisal, funding and acquisition happen before a construction project exists in Axtara." },
  design: { name: "Design authoring", span: [0, 1], note: "Drawings and models are authored in design tools. Axtara shares and versions the issued documents." },
  estimating: { name: "Takeoff and estimating", span: [1, 2], note: "Quantities and prices are produced in estimating tools — by GCs for budgets and by subcontractors for bids." },
  budget: { name: "Budget creation", span: [1, 3], note: "Budgets are authored in your commercial tools. Axtara shows cost context from approved source information." },
  cpm: { name: "Critical-path scheduling", span: [3, 5], note: "Critical-path programmes are built in scheduling tools. Axtara records activities and progress against them." },
  accounting: { name: "Accounting", span: [3, 8], note: "Ledgers, invoicing, back-charges and final accounts stay in your accounting system." },
  payroll: { name: "Payroll execution", span: [4, 8], note: "Axtara prepares approved payroll schedules. Your payroll provider runs payroll and pays your people." },
  fm: { name: "Facilities management", span: [9, 9], note: "Operating and maintaining the finished building happens in facilities tools after handover." },
};

export const adjacentOrder: AdjacentId[] = ["feasibility", "design", "estimating", "budget", "cpm", "accounting", "payroll", "fm"];
