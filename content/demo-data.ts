/**
 * ILLUSTRATIVE DEMONSTRATION DATA
 * All organisations, projects and people below are fictional. They are used
 * consistently across every product demonstration on the website and do not
 * represent Axtara customers, their employees or live activity.
 */

export const demoOrg = {
  name: "Meridian Construction Group",
  short: "Meridian",
  initials: "MC",
};

export type DemoStatus =
  | "On Site"
  | "Approved"
  | "Pending Review"
  | "Exception"
  | "Completed"
  | "Scheduled"
  | "Not Started";

export type DemoProject = {
  id: string;
  name: string;
  short: string;
  location: string;
  phase: string;
  progress: number;
  labourBudgetUsed: number;
  onSite: number;
  planned: number;
  health: "On track" | "At risk" | "Attention";
  manager: string;
};

export const demoProjects: DemoProject[] = [
  { id: "HPC", name: "Harbour Point Commercial Development", short: "Harbour Point", location: "Kingston, JM", phase: "Superstructure", progress: 62, labourBudgetUsed: 66, onSite: 48, planned: 52, health: "On track", manager: "Andre Campbell" },
  { id: "CHR", name: "Cedar Heights Residential Estate", short: "Cedar Heights", location: "Georgetown, GY", phase: "Foundations · Plots 9–24", progress: 38, labourBudgetUsed: 47, onSite: 31, planned: 34, health: "At risk", manager: "Natasha Singh" },
  { id: "RIP", name: "Riverside Infrastructure Project", short: "Riverside", location: "Lagos, NG", phase: "Drainage · Sections 1–6", progress: 71, labourBudgetUsed: 69, onSite: 86, planned: 90, health: "On track", manager: "Chinedu Okafor" },
];

/** Per-project operational detail used by the interactive project record. */
export const demoProjectDetail: Record<
  string,
  {
    milestone: string;
    openItems: string;
    currency: string;
    labourWeek: string;
    costCodes: { code: string; name: string; used: number }[];
    crews: { name: string; lead: string; size: number; area: string }[];
    risks: { text: string; tone: "warn" | "bad" | "ok" }[];
    plannedVsActual: { planned: number[]; actual: number[] };
  }
> = {
  HPC: {
    milestone: "Milestone 4 of 7 · Level 3 slab",
    openItems: "1 incident · 4 RFIs",
    currency: "J$",
    labourWeek: "J$4.2m",
    costCodes: [
      { code: "03-200", name: "Structural works · Block B", used: 94 },
      { code: "03-310", name: "Formwork", used: 71 },
      { code: "05-120", name: "Structural steel", used: 58 },
      { code: "26-050", name: "Electrical first fix", used: 33 },
    ],
    crews: [
      { name: "Crew B2", lead: "Odane Morgan", size: 12, area: "Block B · Level 3" },
      { name: "Crew S1", lead: "Rohan Thompson", size: 6, area: "Steel yard" },
      { name: "Crew E1", lead: "Devon Fraser", size: 8, area: "Block A · services" },
    ],
    risks: [
      { text: "Structural works labour at 94% of budget", tone: "warn" },
      { text: "Y12 bar delivery short — pour moved to Thursday", tone: "warn" },
      { text: "Expired welding certificate · Crew S1", tone: "bad" },
    ],
    plannedVsActual: { planned: [380, 410, 430, 450, 470, 480, 490, 500], actual: [372, 405, 441, 448, 489, 501, 512, 523] },
  },
  CHR: {
    milestone: "Milestone 2 of 6 · Foundations",
    openItems: "2 RFIs",
    currency: "G$",
    labourWeek: "G$5.8m",
    costCodes: [
      { code: "02-300", name: "Excavation and footings", used: 82 },
      { code: "04-200", name: "Blockwork · Plots 9–16", used: 41 },
      { code: "03-100", name: "Concrete supply and placing", used: 55 },
      { code: "22-100", name: "Below-ground drainage", used: 28 },
    ],
    crews: [
      { name: "Crew C1", lead: "Ravi Persaud", size: 9, area: "Plots 9–14" },
      { name: "Crew C2", lead: "Natasha Singh", size: 11, area: "Plots 15–24" },
    ],
    risks: [
      { text: "Two days lost to weather this week", tone: "warn" },
      { text: "Excavation labour ahead of progress", tone: "warn" },
      { text: "All certifications current", tone: "ok" },
    ],
    plannedVsActual: { planned: [210, 230, 250, 260, 270, 280, 290, 300], actual: [205, 228, 262, 271, 268, 296, 301, 322] },
  },
  RIP: {
    milestone: "Milestone 5 of 7 · Sections 4–6",
    openItems: "1 near miss",
    currency: "₦",
    labourWeek: "₦38.4m",
    costCodes: [
      { code: "33-410", name: "Storm drainage · Sections 1–3", used: 76 },
      { code: "33-420", name: "Storm drainage · Sections 4–6", used: 52 },
      { code: "32-100", name: "Road base and kerbs", used: 63 },
      { code: "01-500", name: "Plant and traffic management", used: 70 },
    ],
    crews: [
      { name: "Section 3", lead: "Tunde Adeyemi", size: 18, area: "Ch. 2+400 – 3+100" },
      { name: "Section 5", lead: "Ifeoma Eze", size: 22, area: "Ch. 5+800 – 6+600" },
      { name: "Section 6", lead: "Emeka Obi", size: 14, area: "Ch. 6+600 – 7+400" },
    ],
    risks: [
      { text: "Near miss with reversing plant · Section 3", tone: "bad" },
      { text: "Excavator licence expiring in 12 days", tone: "warn" },
      { text: "Labour in line with programme", tone: "ok" },
    ],
    plannedVsActual: { planned: [820, 840, 860, 880, 900, 910, 920, 930], actual: [810, 846, 851, 879, 905, 902, 918, 926] },
  },
};

export type DemoPerson = {
  id: string;
  name: string;
  role: string;
  trade?: string;
  project: string;
  crew?: string;
  tone: number; // avatar colour index
};

export const demoPeople: DemoPerson[] = [
  { id: "p1", name: "Kemar Williams", role: "Steel Fixer", trade: "Rebar", project: "HPC", crew: "Crew B2", tone: 0 },
  { id: "p2", name: "Shanice Brown", role: "Site Supervisor", project: "HPC", tone: 1 },
  { id: "p3", name: "Andre Campbell", role: "Project Manager", project: "HPC", tone: 2 },
  { id: "p4", name: "Tavia Reid", role: "Finance Manager", project: "HQ", tone: 3 },
  { id: "p5", name: "Paul Henry", role: "Operations Director", project: "HQ", tone: 4 },
  { id: "p6", name: "Odane Morgan", role: "Carpenter", trade: "Formwork", project: "HPC", crew: "Crew B2", tone: 5 },
  { id: "p7", name: "Ravi Persaud", role: "Mason", trade: "Blockwork", project: "CHR", crew: "Crew C1", tone: 2 },
  { id: "p8", name: "Natasha Singh", role: "Project Manager", project: "CHR", tone: 1 },
  { id: "p9", name: "Chinedu Okafor", role: "Project Manager", project: "RIP", tone: 3 },
  { id: "p10", name: "Adaeze Nwosu", role: "HR Manager", project: "HQ", tone: 4 },
  { id: "p11", name: "Tunde Adeyemi", role: "Plant Operator", trade: "Excavator", project: "RIP", crew: "Section 3", tone: 0 },
  { id: "p12", name: "Ifeoma Eze", role: "Section Engineer", project: "RIP", tone: 5 },
  { id: "p13", name: "Devon Fraser", role: "Electrician", trade: "Electrical", project: "CHR", crew: "Crew E1", tone: 1 },
  { id: "p14", name: "Marcus Hill", role: "Site Supervisor", project: "RIP", tone: 2 },
  { id: "p15", name: "Elena Ramirez", role: "Commercial Manager", project: "HQ", tone: 3 },
  { id: "p16", name: "Jodi-Ann Clarke", role: "Labourer", trade: "General", project: "HPC", crew: "Crew B2", tone: 4 },
  { id: "p17", name: "Rohan Thompson", role: "Welder", trade: "Steel", project: "HPC", crew: "Crew S1", tone: 5 },
  { id: "p18", name: "Emeka Obi", role: "Labourer", trade: "Drainage", project: "RIP", crew: "Section 5", tone: 0 },
];

export const findPerson = (name: string) => demoPeople.find((p) => p.name === name);

/** Today's attendance at Harbour Point, used by several screens. */
export const demoAttendance: {
  name: string;
  crew: string;
  in: string;
  out: string;
  hours: string;
  location: "Inside boundary" | "Outside boundary" | "—";
  status: DemoStatus;
}[] = [
  { name: "Kemar Williams", crew: "Crew B2", in: "06:52", out: "—", hours: "—", location: "Inside boundary", status: "Pending Review" },
  { name: "Odane Morgan", crew: "Crew B2", in: "06:48", out: "—", hours: "—", location: "Inside boundary", status: "On Site" },
  { name: "Jodi-Ann Clarke", crew: "Crew B2", in: "06:55", out: "—", hours: "—", location: "Inside boundary", status: "On Site" },
  { name: "Rohan Thompson", crew: "Crew S1", in: "07:31", out: "—", hours: "—", location: "Outside boundary", status: "Exception" },
  { name: "Devon Fraser", crew: "Crew E1", in: "06:58", out: "15:02", hours: "8.0", location: "Inside boundary", status: "Approved" },
  { name: "Ravi Persaud", crew: "Crew C1", in: "—", out: "—", hours: "—", location: "—", status: "Scheduled" },
];

export const demoCostCodes = [
  { code: "03-200", name: "Structural works · Block B", budget: 100, used: 94 },
  { code: "03-310", name: "Formwork", budget: 100, used: 71 },
  { code: "05-120", name: "Structural steel", budget: 100, used: 58 },
  { code: "26-050", name: "Electrical first fix", budget: 100, used: 33 },
];

export const illustrativeLabel = "Illustrative product demonstration · fictional data";

/* ───────────── Cross-company collaboration (fictional) ─────────────
 * Meridian Construction Group is the GC on Harbour Point, building for the
 * developer Seabreeze Developments. Subcontractors join Meridian's project
 * workspace through package invitations and keep their own company records.
 */
export const demoCompanies = {
  gc: { name: "Meridian Construction Group", short: "Meridian", initials: "MC", role: "General contractor" },
  developer: { name: "Seabreeze Developments", short: "Seabreeze", initials: "SD", role: "Developer" },
  sub: { name: "Volt Line Electrical", short: "Volt Line", initials: "VL", role: "Electrical subcontractor" },
  masonry: { name: "Keystone Masonry", short: "Keystone", initials: "KM", role: "Masonry subcontractor" },
  bidder: { name: "Brightwire Electrical", short: "Brightwire", initials: "BE", role: "Electrical subcontractor" },
  waterproofing: { name: "Shoreline Membranes", short: "Shoreline", initials: "SM", role: "Waterproofing subcontractor" },
} as const;

/** People at partner companies (Meridian people are in demoPeople). */
export const demoPartnerPeople = {
  subOps: { name: "Paul Hylton", role: "Operations Manager", company: "Volt Line Electrical", tone: 3 },
  subSupervisor: { name: "Tanya Brown", role: "Electrical Supervisor", company: "Volt Line Electrical", tone: 1 },
  subWorker: { name: "Ricardo Lewis", role: "Electrician", company: "Volt Line Electrical", tone: 0 },
  developer: { name: "Marcia Gayle", role: "Development Manager", company: "Seabreeze Developments", tone: 4 },
  gcAdmin: { name: "Andre Campbell", role: "Project Manager", company: "Meridian Construction Group", tone: 2 },
} as const;

export type DemoPackage = {
  code: string;
  name: string;
  partner: string;
  kind: "Work package" | "Bid invitation";
  status: string;
  note: string;
  tone: "ok" | "warn" | "neutral";
};

export const demoPackages: DemoPackage[] = [
  { code: "E2", name: "Electrical rough-in, Block A", partner: "Volt Line Electrical", kind: "Work package", status: "Active", note: "RFI-021 answered · CR-004 in review", tone: "ok" },
  { code: "W1", name: "Block A masonry", partner: "Keystone Masonry", kind: "Work package", status: "Active", note: "2 daily reports to review", tone: "ok" },
  { code: "B1", name: "Block B masonry", partner: "2 companies invited", kind: "Bid invitation", status: "Closes 20 Nov", note: "1 submission received", tone: "warn" },
  { code: "W2", name: "Podium waterproofing", partner: "Shoreline Membranes", kind: "Work package", status: "Active", note: "No open items", tone: "neutral" },
];

export const demoRfis = [
  { id: "RFI-021", title: "Conduit route clashes with Level 3 beam GL C/4", pkg: "E2", raisedBy: "Tanya Brown", company: "Volt Line Electrical", to: "Services engineer", due: "Tue 17 Nov", status: "Answered" as const, answer: "Re-route via the riser at GL C/5. Revised sketch SK-E-014 attached." },
  { id: "RFI-024", title: "Waterproofing upstand height at podium door thresholds", pkg: "W2", raisedBy: "Leon Spence", company: "Shoreline Membranes", to: "Architect", due: "Fri 20 Nov", status: "Open" as const, answer: null },
  { id: "RFI-025", title: "Block A lintel bearing at stair core openings", pkg: "W1", raisedBy: "Garfield Shaw", company: "Keystone Masonry", to: "Structural engineer", due: "Mon 23 Nov", status: "Open" as const, answer: null },
];

export const demoBids = [
  { company: "Keystone Masonry", revision: "Rev 2 · 18 Nov", note: "Revised after addendum 01", price: "J$41,200,000", exclusions: ["Scaffold beyond Level 4", "Lintel supply"], ackAddendum: true },
  { company: "Coralstone Masonry", revision: "Rev 1 · 17 Nov", note: "Addendum 01 not yet acknowledged", price: "J$39,850,000", exclusions: ["Lintel supply", "Cleaning", "Builder's work holes"], ackAddendum: false },
];

export const demoInspections = {
  id: "INSP-007",
  title: "Level 2 services inspection · Block A",
  date: "Wed 18 Nov",
  items: [
    { id: "CI-031", pkg: "E2", owner: "Volt Line Electrical", text: "Fire-stop missing at two conduit penetrations, GL B/3", due: "Fri 20 Nov", status: "Open" as const },
    { id: "CI-032", pkg: "W1", owner: "Keystone Masonry", text: "Mortar joints not struck at stair core, east face", due: "Mon 23 Nov", status: "Evidence submitted" as const },
    { id: "CI-029", pkg: "E2", owner: "Volt Line Electrical", text: "Unlabelled circuits at DB-2A", due: "Tue 17 Nov", status: "Closed" as const },
  ],
};

export const demoHandover = [
  { pkg: "E2", item: "Electrical test certificates", status: "Received" as const },
  { pkg: "E2", item: "As-built conduit drawings", status: "Outstanding" as const },
  { pkg: "W1", item: "Masonry warranty", status: "Received" as const },
  { pkg: "W2", item: "Membrane manufacturer warranty", status: "Outstanding" as const },
  { pkg: "W2", item: "Flood test record", status: "Received" as const },
];
