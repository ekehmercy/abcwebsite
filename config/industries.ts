import type { ModuleSlug, ScreenKey } from "./features";

export type IndustrySlug = "general-contractors" | "subcontractors" | "real-estate" | "infrastructure";

export type Industry = {
  slug: IndustrySlug;
  name: string;
  shortName: string;
  navDescription: string;
  segmentBlurb: string;
  seo: { title: string; description: string };
  eyebrow: string;
  headline: string;
  intro: string;
  /** The operating reality this customer type faces. */
  realities: { title: string; body: string }[];
  /** How Axtara addresses each — linked to a product module. */
  answers: { title: string; body: string; module: ModuleSlug }[];
  /** An illustrative scenario. Always labelled as hypothetical on the page. */
  scenario: {
    title: string;
    context: string;
    beats: { time: string; who: string; what: string }[];
  };
  primaryScreen: ScreenKey;
  secondaryScreen: ScreenKey;
  /** Art direction for the licensed photograph that should accompany this page. */
  photoBrief: string;
  photoKey: string;
  modules: ModuleSlug[];
};

export const industries: Industry[] = [
  {
    slug: "general-contractors",
    name: "General Contractors",
    shortName: "General Contractors",
    navDescription: "Crews, subcontractors and project visibility",
    segmentBlurb:
      "Coordinate your own crews and subcontracted labour across several projects, with one view of who is on site and what it is costing.",
    seo: {
      title: "Workforce and Project Operations Software for General Contractors",
      description:
        "Axtara helps general contractors coordinate crews and subcontractors, verify site attendance, hold supervisors accountable and see labour costs across every project.",
    },
    eyebrow: "For general contractors",
    headline: "Run every project from the same picture of the workforce.",
    intro:
      "You are accountable for the whole site — including the people you do not directly employ. Axtara gives your project managers and supervisors one record of who is on site, what was done and what it cost.",
    realities: [
      { title: "Several projects, never enough supervisors", body: "Your best supervisors are spread across sites, and project managers depend on what they report." },
      { title: "Your crews and theirs", body: "Subcontractor labour on your site still affects your schedule, your safety record and your client relationship." },
      { title: "Labour cost arrives too late", body: "By the time payroll has run and invoices have arrived, the overrun has already happened." },
    ],
    answers: [
      { title: "One attendance record per site", body: "Every worker — direct or subcontracted — clocks in against the site, so you know who is there today.", module: "time-attendance" },
      { title: "Supervisor accountability", body: "Daily reports and approvals are recorded against each supervisor, with a clear trail of decisions.", module: "field-operations" },
      { title: "Labour cost by project", body: "Approved hours flow to projects and cost codes, so labour cost is visible during the job, not after it.", module: "project-operations" },
      { title: "Portfolio reporting", body: "Leadership sees exceptions and project health across every active project in one view.", module: "reporting" },
    ],
    scenario: {
      title: "A Monday across three projects",
      context:
        "Meridian Construction Group is running Harbour Point, Cedar Heights and a fit-out programme at the same time, with two subcontracted trades on site.",
      beats: [
        { time: "06:40", who: "Field workers", what: "Direct and subcontracted crews clock in at Harbour Point; two out-of-boundary records are flagged." },
        { time: "08:15", who: "Site Supervisor", what: "Resolves the flags — one crew was at the laydown yard — and approves morning attendance." },
        { time: "11:30", who: "Project Manager", what: "Sees labour on Structural works trending over budget and moves a crew from Cedar Heights." },
        { time: "17:00", who: "Operations Director", what: "Reviews the day's exceptions across all three projects in a single list." },
      ],
    },
    primaryScreen: "projects",
    secondaryScreen: "attendance",
    photoBrief: "Site supervisor in correct PPE reviewing a tablet with a foreman on an active commercial structure.",
    photoKey: "gc",
    modules: ["time-attendance", "field-operations", "project-operations", "reporting"],
  },
  {
    slug: "subcontractors",
    name: "Subcontractors",
    shortName: "Subcontractors",
    navDescription: "Crew assignments, timesheets and evidence",
    segmentBlurb:
      "Keep accurate records of your crews' time and work across client sites, and spend less time on paperwork between the site and payroll.",
    seo: {
      title: "Subcontractor Workforce Management Software",
      description:
        "Axtara helps subcontractors assign crews, keep accurate time and work records, get timesheets approved and evidence completed work — with less administration.",
    },
    eyebrow: "For subcontractors and specialist trades",
    headline: "Accurate records for every crew, on every client's site.",
    intro:
      "Your margin depends on knowing exactly where your people worked and proving what they did. Axtara gives your crews a simple way to record time and work, and gives your office the records without the chasing.",
    realities: [
      { title: "Crews spread across client sites", body: "Your people move between jobs daily, often on sites run by someone else." },
      { title: "Disputes cost margin", body: "When a client questions hours or progress, you need evidence — not a recollection." },
      { title: "Administration falls on a small office", body: "One or two people consolidate timesheets, expenses and payroll for the whole workforce." },
    ],
    answers: [
      { title: "Crew assignments on the phone", body: "Workers see which site they are on, with whom and when — and changes reach them immediately.", module: "workforce" },
      { title: "Time recorded where the work is", body: "Location-checked clock-ins against each client site, approved by your supervisor.", module: "time-attendance" },
      { title: "Evidence of work completed", body: "Photos and daily reports attached to the job, ready when a client asks.", module: "field-operations" },
      { title: "Less re-keying before payroll", body: "Approved hours become payroll information without transcribing sheets.", module: "payroll" },
    ],
    scenario: {
      title: "An electrical subcontractor across two client sites",
      context:
        "A 40-person electrical contractor has crews at Harbour Point and at a residential site run by a different main contractor.",
      beats: [
        { time: "Mon", who: "Office Manager", what: "Assigns Crew E2 to Harbour Point for the week; crew members see it in the app." },
        { time: "Wed", who: "Lead Hand", what: "Submits a daily report with photos of completed containment on Level 3." },
        { time: "Thu", who: "Client PM", what: "Questions Level 3 hours; the office shares the approved report and attendance record." },
        { time: "Fri", who: "Office Manager", what: "Approved hours move to payroll preparation with no spreadsheet in between." },
      ],
    },
    primaryScreen: "attendance",
    secondaryScreen: "field",
    photoBrief: "Specialist trade crew (electrical or MEP) working at height with correct harnesses, lead hand checking a phone.",
    photoKey: "sub",
    modules: ["workforce", "time-attendance", "field-operations", "payroll"],
  },
  {
    slug: "real-estate",
    name: "Real Estate Developers",
    shortName: "Developers",
    navDescription: "Visibility across development projects",
    segmentBlurb:
      "See operational progress, contractor activity and cost across your developments without waiting for the monthly report.",
    seo: {
      title: "Real Estate Development Operations Software",
      description:
        "Axtara gives real estate developers visibility across development projects — contractor coordination, site reporting, cost visibility and compliance documentation.",
    },
    eyebrow: "For real estate developers",
    headline: "Visibility across every development, not just the one you visited.",
    intro:
      "Developers depend on contractors for day-to-day information. Axtara gives your development team a consistent view of progress, site activity, cost and compliance across the portfolio.",
    realities: [
      { title: "Information arrives through contractors", body: "Site updates reach you second-hand, in different formats, on different schedules." },
      { title: "A portfolio of projects at different stages", body: "Some developments are breaking ground while others are in fit-out." },
      { title: "Compliance carries your name", body: "Permits, inspections and safety records matter to lenders, buyers and regulators." },
    ],
    answers: [
      { title: "Consistent site reporting", body: "Daily reports in one format across contractors and developments.", module: "field-operations" },
      { title: "Portfolio progress", body: "Progress and project health side by side for every development.", module: "project-operations" },
      { title: "Cost visibility", body: "Operational costs and approved labour visible as the work happens.", module: "expenses" },
      { title: "Compliance documentation", body: "Permits, inspections and credentials held against each project.", module: "compliance" },
    ],
    scenario: {
      title: "A development director reviewing three schemes",
      context:
        "A developer has Cedar Heights in superstructure, Harbour Point in fit-out and a third scheme awaiting permits.",
      beats: [
        { time: "Weekly", who: "Development Director", what: "Opens the portfolio view: Cedar Heights shows two days of weather delay." },
        { time: "Weekly", who: "Development Director", what: "Reads the contractor's daily reports and photos for the affected days." },
        { time: "Monthly", who: "Finance", what: "Reviews operational cost against budget before the lender's site visit." },
        { time: "Ongoing", who: "Compliance Lead", what: "Is notified 30 days before a permit renewal is due." },
      ],
    },
    primaryScreen: "reporting",
    secondaryScreen: "compliance",
    photoBrief: "Residential development in progress, development manager and site engineer walking the site in PPE.",
    photoKey: "re",
    modules: ["project-operations", "field-operations", "expenses", "compliance"],
  },
  {
    slug: "infrastructure",
    name: "Infrastructure and Civil Engineering",
    shortName: "Infrastructure",
    navDescription: "Distributed workforces and remote sites",
    segmentBlurb:
      "Manage large, distributed workforces across remote and linear sites, with verified attendance and consistent safety records.",
    seo: {
      title: "Workforce Software for Infrastructure and Civil Engineering Contractors",
      description:
        "Axtara supports civil and infrastructure contractors with distributed workforce management, remote attendance verification, multi-site allocation, safety and operational reporting.",
    },
    eyebrow: "For infrastructure and civil engineering",
    headline: "Manage a workforce spread across kilometres, not just one site.",
    intro:
      "Roads, drainage, utilities and bridges are built across many locations at once. Axtara keeps attendance, allocation, safety and reporting consistent wherever your crews are working.",
    realities: [
      { title: "Linear and remote sites", body: "Work moves along a corridor; a single site boundary rarely describes it." },
      { title: "Large, distributed crews", body: "Hundreds of workers across many work fronts, with supervisors spread thin." },
      { title: "Safety at scale", body: "Heavy plant, traffic and remote locations raise the stakes of every incident." },
    ],
    answers: [
      { title: "Multi-site allocation", body: "Allocate crews to work fronts and move them as the programme advances.", module: "workforce" },
      { title: "Attendance on remote sites", body: "Location-checked attendance against each work front, with exceptions surfaced.", module: "time-attendance" },
      { title: "Consistent safety records", body: "Incidents and near misses reported from the field and tracked to closure.", module: "compliance" },
      { title: "Programme-level reporting", body: "Workforce and labour cost across every section of the programme.", module: "reporting" },
    ],
    scenario: {
      title: "A drainage and road programme across six work fronts",
      context:
        "The Riverside Infrastructure Project has crews spread along 9 km of corridor, with plant moving between sections.",
      beats: [
        { time: "06:00", who: "Field workers", what: "Crews clock in at four work fronts; a clock-in outside the Section 6 boundary is flagged for review." },
        { time: "09:20", who: "Section Engineer", what: "Reports a near miss involving reversing plant at Section 3." },
        { time: "13:00", who: "Project Manager", what: "Moves a crew from Section 2 to Section 5 as the programme advances." },
        { time: "18:00", who: "Programme Director", what: "Reviews attendance, incidents and labour by section for the day." },
      ],
    },
    primaryScreen: "workforce",
    secondaryScreen: "compliance",
    photoBrief: "Civil works crew in high-visibility PPE on a road or drainage corridor, engineer with a tablet beside plant.",
    photoKey: "infra",
    modules: ["workforce", "time-attendance", "compliance", "reporting"],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
