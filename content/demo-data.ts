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
  { id: "CHR", name: "Cedar Heights Residential Development", short: "Cedar Heights", location: "Georgetown, GY", phase: "Foundations", progress: 38, labourBudgetUsed: 47, onSite: 31, planned: 34, health: "At risk", manager: "Natasha Singh" },
  { id: "RIP", name: "Riverside Infrastructure Project", short: "Riverside", location: "Lagos, NG", phase: "Drainage · Sections 1–6", progress: 71, labourBudgetUsed: 69, onSite: 86, planned: 90, health: "On track", manager: "Chinedu Okafor" },
  { id: "EMO", name: "Eastgate Medical Office", short: "Eastgate", location: "Houston, US", phase: "Mobilisation", progress: 6, labourBudgetUsed: 4, onSite: 0, planned: 12, health: "On track", manager: "Elena Ramirez" },
];

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
  { id: "p14", name: "Marcus Hill", role: "Site Supervisor", project: "EMO", tone: 2 },
  { id: "p15", name: "Elena Ramirez", role: "Project Manager", project: "EMO", tone: 3 },
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
