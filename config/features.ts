/**
 * PRODUCT CAPABILITY REGISTER (internal)
 * -------------------------------------
 * Every capability presented on the website is listed here. The website reads
 * this register — capability claims are never hardcoded inside components.
 *
 * `status` and `verified` are INTERNAL fields used for the private publication
 * checklist. They are never rendered as labels on the website.
 *
 *   staging release → all capabilities are presented as part of the product
 *   public release  → only `verified: true` capabilities are presented
 *
 * Run `npm run audit:claims` to list everything still awaiting verification.
 */
import { isPublishable } from "../lib/release.ts";

export type FeatureStatus = "available" | "in-development" | "planned" | "integration-required";

export type Capability = {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  verified: boolean;
};

export type ModuleSlug =
  | "workforce"
  | "time-attendance"
  | "field-operations"
  | "project-operations"
  | "payroll"
  | "expenses"
  | "compliance"
  | "reporting";

export type ScreenKey =
  | "workforce"
  | "attendance"
  | "field"
  | "projects"
  | "costs"
  | "payroll"
  | "compliance"
  | "reporting";

export type ProductModule = {
  slug: ModuleSlug;
  name: string;
  shortName: string;
  navGroup: "People" | "Operations" | "Control";
  icon: string; // lucide icon name, resolved in components/ui/icon.tsx
  navDescription: string;
  seo: { title: string; description: string };
  headline: string;
  intro: string;
  outcome: string;
  problem: { heading: string; body: string; points: string[] };
  capabilities: Capability[];
  workflow: { title: string; steps: { actor: string; action: string }[] };
  related: ModuleSlug[];
  industryNotes: { industry: string; note: string }[];
  screen: ScreenKey;
};

const c = (
  id: string,
  name: string,
  description: string,
  status: FeatureStatus = "available",
  verified = false,
): Capability => ({ id, name, description, status, verified });

export const modules: ProductModule[] = [
  {
    slug: "workforce",
    name: "Workforce Management",
    shortName: "Workforce",
    navGroup: "People",
    icon: "Users",
    navDescription: "Profiles, crews, documents and allocation",
    seo: {
      title: "Construction Workforce Management Software",
      description:
        "Keep every worker, crew, certification and site allocation in one place. Axtara gives contractors a reliable workforce record that connects to attendance, projects and payroll preparation.",
    },
    headline: "Know who works for you, where they are assigned and what they are cleared to do.",
    intro:
      "One workforce record for every employee and crew — connected to the sites they work on, the hours they record and the documents that keep them compliant.",
    outcome: "Assign the right people to the right site, with the paperwork already in order.",
    problem: {
      heading: "Workforce information lives in too many places.",
      body:
        "Crew lists sit in spreadsheets, certifications in a filing cabinet and site assignments in a supervisor's phone. When someone asks who is available for Monday, nobody can answer quickly.",
      points: [
        "Crew lists that are out of date the moment they are shared",
        "Expired certifications discovered on site, not before",
        "No single place to see who is assigned where",
      ],
    },
    capabilities: [
      c("wf-profiles", "Employee profiles", "Roles, trades, pay classification, contact details and employment history in one record."),
      c("wf-crews", "Crew management", "Group workers into crews with a lead hand, and move crews between sites as work changes."),
      c("wf-allocation", "Workforce allocation", "Assign people and crews to projects and sites, and see allocation across the business."),
      c("wf-scheduling", "Shift scheduling", "Plan shifts by site and crew, and publish schedules to field workers' phones.", "in-development"),
      c("wf-documents", "Employee documentation", "Store identification, contracts and site inductions against the employee record."),
      c("wf-certs", "Certifications", "Track trade certifications and safety tickets with expiry dates."),
      c("wf-leave", "Leave management", "Leave requests submitted from the field, approved by supervisors and visible to HR."),
      c("wf-onboarding", "Recruitment and onboarding", "Move new hires from offer to first shift with the right documents collected.", "planned"),
    ],
    workflow: {
      title: "From new hire to first shift",
      steps: [
        { actor: "HR Manager", action: "Creates the employee profile and requests required documents." },
        { actor: "Field Worker", action: "Uploads identification and certifications from their phone." },
        { actor: "HR Manager", action: "Verifies documents; expiry dates are tracked automatically." },
        { actor: "Project Manager", action: "Allocates the worker to a crew on Harbour Point." },
        { actor: "Field Worker", action: "Sees the site assignment and first shift in the mobile app." },
      ],
    },
    related: ["time-attendance", "compliance", "project-operations"],
    industryNotes: [
      { industry: "general-contractors", note: "Coordinate your own crews alongside subcontracted labour across several active projects." },
      { industry: "subcontractors", note: "Move skilled crews between client sites without losing track of who is where." },
      { industry: "infrastructure", note: "Manage large, distributed workforces across remote and multi-location sites." },
    ],
    screen: "workforce",
  },
  {
    slug: "time-attendance",
    name: "Time and Attendance",
    shortName: "Attendance",
    navGroup: "People",
    icon: "Clock",
    navDescription: "Verified clock-in, timesheets and approvals",
    seo: {
      title: "Construction Time and Attendance Software",
      description:
        "Site attendance with location verification, supervisor approvals and clean timesheets. Axtara replaces paper sign-in sheets with records your payroll team can trust.",
    },
    headline: "Know who is on site — and approve the hours before they reach payroll.",
    intro:
      "Workers clock in from their phones at the site. Location is checked against the site boundary, time is linked to the right project, and supervisors review exceptions before anything moves on.",
    outcome: "Fewer disputes, faster approvals and timesheets that arrive ready for payroll preparation.",
    problem: {
      heading: "Paper sign-in sheets cost more than paper.",
      body:
        "Handwritten registers are hard to read, easy to fill in for someone else and slow to consolidate. By the time hours reach payroll, nobody can say for certain what happened on Tuesday.",
      points: [
        "Hours transcribed by hand from sheets and messages",
        "No reliable way to confirm a worker was actually on site",
        "Corrections and overtime argued about after the fact",
      ],
    },
    capabilities: [
      c("ta-clock", "Clock-in and clock-out", "Workers record start and finish times from the Axtara mobile app."),
      c("ta-geofence", "Geofence verification", "Clock-ins are checked against the site boundary and flagged when outside it."),
      c("ta-face", "Facial verification", "Optional identity check at clock-in, where lawful and configured with worker consent.", "in-development"),
      c("ta-timesheets", "Timesheet preparation", "Attendance becomes draft timesheets, allocated to projects and cost codes."),
      c("ta-exceptions", "Attendance exceptions", "Late arrivals, missed clock-outs and out-of-boundary records surface for review."),
      c("ta-approvals", "Supervisor approvals", "Supervisors approve, correct or query hours — with a full record of every change."),
      c("ta-overtime", "Overtime management", "Overtime is identified against configured rules and routed for approval."),
    ],
    workflow: {
      title: "A clock-in, from site to approval",
      steps: [
        { actor: "Field Worker", action: "Clocks in at 06:52 from the Harbour Point site." },
        { actor: "Axtara", action: "Confirms the location is inside the site boundary." },
        { actor: "Axtara", action: "Links the time to Harbour Point · Block B · Structural works." },
        { actor: "Site Supervisor", action: "Reviews the day's attendance and approves the hours." },
        { actor: "Finance Manager", action: "Receives approved hours for payroll preparation." },
      ],
    },
    related: ["payroll", "field-operations", "workforce"],
    industryNotes: [
      { industry: "subcontractors", note: "Produce attendance records your clients and your payroll team can both rely on." },
      { industry: "infrastructure", note: "Verify attendance on remote sites where a supervisor cannot be everywhere at once." },
    ],
    screen: "attendance",
  },
  {
    slug: "field-operations",
    name: "Field Operations",
    shortName: "Field",
    navGroup: "Operations",
    icon: "HardHat",
    navDescription: "Daily reports, site activity and evidence",
    seo: {
      title: "Field Operations Management Software for Contractors",
      description:
        "Daily work reports, photo evidence, site assignments and incident reporting from the field. Axtara keeps supervisors and project managers working from the same information.",
    },
    headline: "Connect the work happening outside the office to the decisions made inside it.",
    intro:
      "Daily reports, photos, site activity and incidents are captured where the work happens and reviewed by the people who need them — without chasing messages.",
    outcome: "Project managers see what happened on site today, not what someone remembers on Friday.",
    problem: {
      heading: "Site updates get lost in group chats.",
      body:
        "Photos, progress notes and incident reports are scattered across messaging apps and personal phones. Important details disappear in the scroll, and there is no record when you need one.",
      points: [
        "Progress shared as photos with no context",
        "Daily reports written up at the end of the week",
        "Incidents reported verbally and never recorded",
      ],
    },
    capabilities: [
      c("fo-daily", "Daily work reports", "Structured daily reports covering work completed, crew, weather, delays and materials."),
      c("fo-activity", "Site activity", "A timeline of everything recorded on a site today, across every crew."),
      c("fo-photos", "Photo evidence", "Photos attached to reports and tasks, with time and location recorded."),
      c("fo-review", "Supervisor reviews", "Supervisors review and sign off field submissions before they reach the project record."),
      c("fo-incidents", "Incident reporting", "Report incidents and near misses from the field in under a minute."),
      c("fo-comms", "Field communication", "Notices and messages between supervisors and crews, tied to the site.", "in-development"),
      c("fo-assignments", "Site assignments", "Workers see where they are working, with whom and what to bring."),
    ],
    workflow: {
      title: "A daily report, from crew to project record",
      steps: [
        { actor: "Site Supervisor", action: "Completes the daily report for Block B, with photos." },
        { actor: "Axtara", action: "Attaches crew attendance and hours already approved today." },
        { actor: "Project Manager", action: "Reviews progress and flags a materials delay." },
        { actor: "Executive", action: "Sees the delay as an exception on the portfolio view." },
      ],
    },
    related: ["project-operations", "compliance", "time-attendance"],
    industryNotes: [
      { industry: "general-contractors", note: "Hold every crew and subcontractor to the same reporting standard." },
      { industry: "real-estate", note: "See site progress across developments without waiting for weekly meetings." },
    ],
    screen: "field",
  },
  {
    slug: "project-operations",
    name: "Project Operations",
    shortName: "Projects",
    navGroup: "Operations",
    icon: "Building2",
    navDescription: "Sites, cost codes and project health",
    seo: {
      title: "Construction Project Operations Software",
      description:
        "Connect workforce, field activity and costs to every project. Axtara gives project managers a live operational view of labour, progress and risk on each site.",
    },
    headline: "See every project through the work actually being done on it.",
    intro:
      "Projects in Axtara are built from approved field inputs — attendance, daily reports, expenses and incidents — so project health reflects what is really happening on site.",
    outcome: "Project managers spot labour overruns and delays while there is still time to act.",
    problem: {
      heading: "Project status is reconstructed, not recorded.",
      body:
        "Project reports are assembled by hand from timesheets, site notes and invoices. By the time the numbers are ready, the decisions they should have informed have already been made.",
      points: [
        "Labour costs discovered at month end",
        "No link between site activity and project progress",
        "Risk spotted in meetings rather than in the data",
      ],
    },
    capabilities: [
      c("po-records", "Project records", "Projects with sites, phases, budgets and responsible managers."),
      c("po-allocation", "Site and workforce allocation", "Who is working on each project and site, today and planned."),
      c("po-costcodes", "Cost codes", "Time and expenses allocated to cost codes for accurate job costing."),
      c("po-progress", "Progress monitoring", "Progress tracked against milestones, informed by field reports."),
      c("po-inputs", "Approved field inputs", "Only approved hours, reports and expenses flow into the project record."),
      c("po-health", "Project health visibility", "A clear signal for labour, schedule and compliance on every project."),
      c("po-risk", "Operational risk monitoring", "Exceptions such as overtime spikes or open incidents surfaced early.", "in-development"),
    ],
    workflow: {
      title: "From field input to project decision",
      steps: [
        { actor: "Site Supervisor", action: "Approves today's hours and daily report for Block B." },
        { actor: "Axtara", action: "Adds approved labour hours to the Structural works cost code." },
        { actor: "Project Manager", action: "Sees labour at 94% of budget with 62% progress." },
        { actor: "Project Manager", action: "Reallocates a crew and records the decision." },
      ],
    },
    related: ["field-operations", "expenses", "reporting"],
    industryNotes: [
      { industry: "general-contractors", note: "Compare labour and progress across every project in the portfolio." },
      { industry: "real-estate", note: "Keep development projects visible across multiple contractors." },
      { industry: "infrastructure", note: "Track long-running programmes split across many sites and phases." },
    ],
    screen: "projects",
  },
  {
    slug: "payroll",
    name: "Payroll Preparation",
    shortName: "Payroll Prep",
    navGroup: "Control",
    icon: "FileSpreadsheet",
    navDescription: "Approved hours, ready for payroll",
    seo: {
      title: "Construction Payroll Preparation Software",
      description:
        "Turn approved timesheets into payroll-ready information. Axtara prepares and reviews payroll inputs; your payroll provider and banking arrangements process payment.",
    },
    headline: "Approve the work before it reaches payroll.",
    intro:
      "Axtara turns approved attendance into structured payroll information — reviewed, approved and handed off to your payroll provider. Axtara does not hold funds or transfer wages.",
    outcome: "Payroll runs start from approved, project-allocated hours instead of re-keyed spreadsheets.",
    problem: {
      heading: "Payroll is rebuilt from scratch every cycle.",
      body:
        "Finance teams consolidate hours from sheets, messages and memory, then chase supervisors to confirm them. Errors are found after payday, when they are most expensive to fix.",
      points: [
        "Hours re-keyed from multiple sources",
        "Approvals chased by phone before every run",
        "No audit trail when a worker disputes their pay",
      ],
    },
    capabilities: [
      c("pp-hours", "Approved timesheet information", "Only supervisor-approved hours are included in payroll preparation."),
      c("pp-earnings", "Earnings and deductions", "Configured earnings types, allowances and deductions applied to approved hours."),
      c("pp-prep", "Payroll preparation", "A payroll draft per period, with variances from the previous period highlighted."),
      c("pp-review", "Review and approval", "Finance reviews, queries and approves the payroll draft with a recorded sign-off."),
      c("pp-schedule", "Payroll schedule generation", "A payroll schedule produced for your payroll provider or bank.", "in-development"),
      c("pp-handoff", "External payroll handoff", "Export or send approved payroll data to an external payroll provider.", "integration-required"),
      c("pp-payslips", "Payslip-related workflows", "Workers view payslip information in the app, where supported by your payroll provider.", "planned"),
    ],
    workflow: {
      title: "From approved hours to payroll handoff",
      steps: [
        { actor: "Site Supervisor", action: "Approves the week's hours for the Block B crew." },
        { actor: "Axtara", action: "Applies configured earnings and allowance rules." },
        { actor: "Finance Manager", action: "Reviews variances and approves the payroll draft." },
        { actor: "Payroll provider", action: "Receives the approved schedule and processes payment externally." },
      ],
    },
    related: ["time-attendance", "expenses", "reporting"],
    industryNotes: [
      { industry: "subcontractors", note: "Spend less time on administration between the site and the payroll run." },
      { industry: "general-contractors", note: "Prepare payroll for large, multi-site workforces from one approved source." },
    ],
    screen: "payroll",
  },
  {
    slug: "expenses",
    name: "Expenses and Cost Management",
    shortName: "Expenses",
    navGroup: "Operations",
    icon: "Receipt",
    navDescription: "Field expenses and labour cost visibility",
    seo: {
      title: "Construction Expense and Labour Cost Management",
      description:
        "Capture field expenses with receipts, approve them against projects and cost codes, and see operational labour costs as they happen.",
    },
    headline: "See what the work is costing while it is still happening.",
    intro:
      "Field expenses are captured with receipts, approved against the right project and cost code, and combined with approved labour to give a current view of operational cost.",
    outcome: "Fewer surprises at month end, and reimbursements that do not depend on a shoebox of receipts.",
    problem: {
      heading: "Costs arrive late and unallocated.",
      body:
        "Receipts get lost, expenses are claimed weeks later and nobody knows which project they belong to. Labour cost is only visible once payroll has run.",
      points: [
        "Receipts photographed and sent by message",
        "Expenses not allocated to projects or cost codes",
        "Labour cost unknown until after payroll",
      ],
    },
    capabilities: [
      c("ex-submit", "Employee expense submissions", "Workers submit expenses from the field in a few steps."),
      c("ex-receipts", "Receipt attachments", "Photograph receipts at the point of purchase."),
      c("ex-approvals", "Approval workflows", "Configurable approval routing by amount, project or category."),
      c("ex-allocation", "Project and cost-code allocation", "Every expense allocated to a project and cost code."),
      c("ex-reimburse", "Reimbursement status", "Workers can see where their claim is in the approval process."),
      c("ex-labour", "Operational labour cost visibility", "Approved hours combined with configured rates for a current labour cost view."),
    ],
    workflow: {
      title: "From receipt to project cost",
      steps: [
        { actor: "Field Worker", action: "Buys fixings for Block B and photographs the receipt." },
        { actor: "Site Supervisor", action: "Approves the claim against Structural works." },
        { actor: "Finance Manager", action: "Sees the cost on the project and schedules reimbursement." },
      ],
    },
    related: ["project-operations", "payroll", "reporting"],
    industryNotes: [
      { industry: "real-estate", note: "Understand operational cost across developments as work progresses." },
    ],
    screen: "costs",
  },
  {
    slug: "compliance",
    name: "Safety and Compliance",
    shortName: "Compliance",
    navGroup: "Control",
    icon: "ShieldCheck",
    navDescription: "Incidents, certifications and records",
    seo: {
      title: "Construction Safety and Compliance Records",
      description:
        "Incident reporting, certification expiry monitoring and project compliance documentation in one place, connected to your workforce and sites.",
    },
    headline: "Keep safety and compliance records where the work is.",
    intro:
      "Incidents are reported from the field, certifications are tracked before they expire and compliance documents stay attached to the projects and people they relate to.",
    outcome: "Find the record you need in seconds — before an audit, a tender or an incident review.",
    problem: {
      heading: "Compliance records are hardest to find when you need them most.",
      body:
        "Incident forms, certificates and company credentials are kept in different folders by different people. Finding them for a client audit or tender takes days.",
      points: [
        "Expired tickets discovered on site",
        "Incident reports incomplete or missing",
        "Company credentials scattered across inboxes",
      ],
    },
    capabilities: [
      c("cp-incidents", "Incident records", "A complete record of every incident and near miss, with follow-up actions."),
      c("cp-safety", "Safety reporting", "Summaries of incidents and safety activity by site and project."),
      c("cp-certs", "Employee certifications", "Certifications attached to employee records, visible when allocating work."),
      c("cp-expiry", "Expiry monitoring", "Advance notice of expiring certifications and credentials."),
      c("cp-company", "Company credentials", "Insurance, licences and registrations stored with expiry dates."),
      c("cp-docs", "Project compliance documentation", "Permits, method statements and inspections attached to the project."),
      c("cp-approvals", "Approval records", "Who approved what, and when — retained as an audit trail."),
    ],
    workflow: {
      title: "From near miss to closed action",
      steps: [
        { actor: "Field Worker", action: "Reports a near miss at the Block B hoist with a photo." },
        { actor: "Site Supervisor", action: "Records the immediate action and assigns a follow-up." },
        { actor: "HR Manager", action: "Confirms refresher training for the crew involved." },
        { actor: "Executive", action: "Sees the incident closed with the full record attached." },
      ],
    },
    related: ["workforce", "field-operations", "reporting"],
    industryNotes: [
      { industry: "infrastructure", note: "Maintain consistent safety records across remote and distributed sites." },
      { industry: "real-estate", note: "Keep compliance documentation for each development ready for review." },
    ],
    screen: "compliance",
  },
  {
    slug: "reporting",
    name: "Reporting and Analytics",
    shortName: "Reporting",
    navGroup: "Control",
    icon: "BarChart3",
    navDescription: "Dashboards across people and projects",
    seo: {
      title: "Workforce and Project Reporting for Contractors",
      description:
        "Workforce, attendance, labour cost and project performance reporting built from approved operational records — not spreadsheets assembled at month end.",
    },
    headline: "See workforce activity across every project.",
    intro:
      "Reports in Axtara are built from approved operational records, so the numbers leadership sees match the work recorded on site.",
    outcome: "Leadership reviews exceptions and trends instead of reconciling spreadsheets.",
    problem: {
      heading: "Reports take longer to build than to read.",
      body:
        "Management reporting is assembled from exports and spreadsheets each month. By the time it is ready, it describes a business that has already moved on.",
      points: [
        "Numbers that differ depending on who built the report",
        "No view across projects and sites",
        "Exceptions buried in totals",
      ],
    },
    capabilities: [
      c("rp-workforce", "Workforce reporting", "Headcount, allocation and utilisation across the business."),
      c("rp-attendance", "Attendance summaries", "Attendance, lateness and exceptions by site, crew and period."),
      c("rp-projects", "Project performance", "Labour, progress and cost side by side for every project."),
      c("rp-labour", "Labour cost insights", "Labour cost trends by project, trade and cost code."),
      c("rp-exceptions", "Operational exceptions", "A single list of everything that needs management attention."),
      c("rp-dashboards", "Management dashboards", "Role-based dashboards for executives, project managers and finance."),
    ],
    workflow: {
      title: "From site record to leadership review",
      steps: [
        { actor: "Site Supervisors", action: "Approve attendance and daily reports across four sites." },
        { actor: "Axtara", action: "Rolls approved records into project and workforce reporting." },
        { actor: "Executive", action: "Reviews the week's exceptions and project health in one view." },
      ],
    },
    related: ["project-operations", "time-attendance", "expenses"],
    industryNotes: [
      { industry: "general-contractors", note: "Give leadership a consistent view across every active project." },
      { industry: "real-estate", note: "Report on operational progress across the development portfolio." },
    ],
    screen: "reporting",
  },
];

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}

/** Capabilities that may be shown in the current release stage. */
export function publicCapabilities(m: ProductModule): Capability[] {
  return m.capabilities.filter(isPublishable);
}

/** Look up a single capability; returns undefined if it may not be shown. */
export function publicCapability(moduleSlug: ModuleSlug, id: string): Capability | undefined {
  const c = getModule(moduleSlug)?.capabilities.find((x) => x.id === id);
  return c && isPublishable(c) ? c : undefined;
}

