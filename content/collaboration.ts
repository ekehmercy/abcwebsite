/**
 * CROSS-COMPANY COLLABORATION — content register.
 * Product claims carry an internal `verified` flag. In the public release only
 * verified items are shown (see lib/release.ts). Flags are never rendered.
 */
import { isPublishable } from "../lib/release.ts";

export type AppId = "gc-web" | "sub-web" | "supervisor-field" | "field";

export type AxtaraApp = {
  id: AppId;
  name: string;
  device: "Web" | "Mobile";
  who: string;
  summary: string;
  contributes: string[];
  reviews: string[];
  sees: string[];
  keepsPrivate: string[];
  verified: boolean;
};

export const apps: AxtaraApp[] = [
  {
    id: "gc-web",
    name: "GC/Developer Web",
    device: "Web",
    who: "Contractor and developer project teams",
    summary: "Set up the project, share work packages with partners and review everything that comes back from site.",
    contributes: ["Projects, work packages and document sets", "Bid invitations and addenda", "RFI routing and recorded answers", "Inspection findings and corrective items", "Decisions and published client updates"],
    reviews: ["Partners' daily reports, progress and issues", "Change requests", "Corrective item closure evidence", "Handover and closeout documents", "Its own employees' time"],
    sees: ["Everything shared in its own project workspaces", "Each bidder's submission to its own invitations"],
    keepsPrivate: ["Owner contract values", "Internal notes", "Bid comparisons", "Its own employees' payroll"],
    verified: false,
  },
  {
    id: "sub-web",
    name: "Subcontractor Web",
    device: "Web",
    who: "Trade contractor office teams",
    summary: "Run your own company — projects, crews and payroll preparation — and take part in each GC's project on the packages they share.",
    contributes: ["Bid submissions and clarification questions", "RFIs and change requests", "Daily reports shared on GC packages", "Corrective item closure and handover documents", "Crew assignments"],
    reviews: ["Its supervisors' reports before they are shared", "Crew time and corrections", "Payroll schedules before approval"],
    sees: ["Only the packages each GC has shared with it", "Its own bid submissions — never another bidder's", "Its own projects and clients"],
    keepsPrivate: ["Employees' payroll", "Private labour and plant rates", "Other projects and other GCs", "Other customer relationships"],
    verified: false,
  },
  {
    id: "supervisor-field",
    name: "Supervisor Field",
    device: "Mobile",
    who: "Foremen and site supervisors, for either employer",
    summary: "Run the day on site: crew sign-in, daily reports, issues and RFIs with photos, and progress against package activities.",
    contributes: ["Crew sign-in", "Daily reports and progress against activities", "Issues and RFIs with photos", "Corrective item closure evidence"],
    reviews: ["Crew time before it goes to the office"],
    sees: ["Assigned packages, activities and current drawings", "Their crew and site notices"],
    keepsPrivate: ["Crew time goes to the supervisor's own employer — not to the GC, unless the GC is the employer"],
    verified: false,
  },
  {
    id: "field",
    name: "Field",
    device: "Mobile",
    who: "Field workers on the crew",
    summary: "Clock in and out against today's assignment, see site notices and check your own recorded hours.",
    contributes: ["Clock-in and clock-out against the assignment", "Activity entries where the employer uses them", "Photos or notes when the supervisor asks"],
    reviews: ["Their own recorded hours, and whether the employer has reviewed them"],
    sees: ["Their own assignment, site and supervisor", "Site notices for their site", "Their own hours — not anyone else's"],
    keepsPrivate: ["Their time record is between them and their employer"],
    verified: false,
  },
];

export const publicApps = apps.filter(isPublishable);
export const appById = (id: AppId) => apps.find((a) => a.id === id);

/** What an inviting GC can and cannot see of a subcontractor's company. */
export type VisibilityRow = {
  /** Wording from the subcontractor's point of view. */
  item: string;
  note: string;
  /** Wording from the general contractor's point of view. */
  gcItem: string;
  gcNote: string;
  state: "shared" | "private";
  verified: boolean;
};

export const visibility: VisibilityRow[] = [
  { item: "Documents for the packages you're invited to", note: "Shared within the package", gcItem: "Documents on the packages you shared with them", gcNote: "Shared within the package", state: "shared", verified: false },
  { item: "RFIs on those packages", note: "Shared within the package", gcItem: "RFIs on those packages", gcNote: "Shared within the package", state: "shared", verified: false },
  { item: "Your bid submission for their invitation", note: "Seen by the inviting GC only — never by other bidders", gcItem: "Their bid submission for your invitation", gcNote: "Yours alone — other bidders never see it", state: "shared", verified: false },
  { item: "Site reports you submit on their package", note: "Reviewed by the GC for that package", gcItem: "Site reports they submit on your package", gcNote: "You review them for that package", state: "shared", verified: false },
  { item: "Your employees' payroll", note: "Stays in your company account", gcItem: "Their employees' payroll", gcNote: "Stays in their company account", state: "private", verified: false },
  { item: "Your private labour and plant rates", note: "Stays in your company account", gcItem: "Their private labour and plant rates", gcNote: "Stays in their company account", state: "private", verified: false },
  { item: "Your other projects", note: "Not visible to any inviting GC", gcItem: "Their other projects", gcNote: "Not visible to you or any other GC", state: "private", verified: false },
  { item: "Your relationships with other customers", note: "Not visible to any inviting GC", gcItem: "Their relationships with other customers", gcNote: "Not visible to you or any other GC", state: "private", verified: false },
];

export const publicVisibility = visibility.filter(isPublishable);

/** Independent use. */
export const independentUse: { title: string; body: string; verified: boolean }[] = [
  {
    title: "Subscribe as a company, on your own terms",
    body: "A subcontractor runs its own projects, crews, timesheets and payroll preparation in Axtara — for every client, including clients who don't use Axtara.",
    verified: false,
  },
  {
    title: "Join a GC's project without opening your books",
    body: "An invitation adds you to the packages the GC shares. You take part in that workspace whether or not you have your own subscription, and the GC sees only what you share on those packages.",
    verified: false,
  },
  {
    title: "Invite partners without asking them to buy",
    body: "A GC or developer invites each subcontractor to the work that involves them. An invitation doesn't create a subscription for the invited company.",
    verified: false,
  },
  {
    title: "One company identity across every relationship",
    body: "A subcontractor working for several GCs keeps one company account. Each GC sees its own packages — never another GC's work or your other customers.",
    verified: false,
  },
];

export const publicIndependentUse = independentUse.filter(isPublishable);

/** Clear lines — product boundaries that make responsibilities unambiguous. */
export const clearLines: { title: string; body: string; verified: boolean }[] = [
  { title: "Bids and RFIs are separate", body: "Commercial bid invitations go to invited bidders. Technical RFIs go to the people who can answer them. The two never share a thread.", verified: false },
  { title: "An RFI answer is a technical record", body: "Answering an RFI records a technical response. It doesn't approve a change order — change requests are raised and reviewed as their own records.", verified: false },
  { title: "A report review isn't a payroll approval", body: "Reviewing a subcontractor's site report confirms the work on that package. It doesn't approve that subcontractor's payroll — each employer approves its own.", verified: false },
  { title: "Your payroll provider runs payroll", body: "Axtara calculates, reviews and approves time and prepares the payroll schedule. Your payroll provider runs payroll and pays your people.", verified: false },
  { title: "Hours are time, not progress", body: "Hours worked are recorded as time. Physical progress is recorded against activities. One never stands in for the other.", verified: false },
  { title: "Specialist tools stay in charge", body: "Axtara works alongside estimating, accounting and scheduling tools rather than replacing them. Takeoff, budgets, ledgers and critical-path programmes stay where they are built.", verified: false },
];

export const publicClearLines = clearLines.filter(isPublishable);

/** Records shared inside a package workspace. */
export const sharedRecords = ["Packages and documents", "Bid invitations", "RFIs", "Daily reports and progress", "Issues and corrective items", "Handover and closeout documents"];
