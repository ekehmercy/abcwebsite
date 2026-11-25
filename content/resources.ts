/**
 * RESOURCE CENTRE — article registry.
 *
 * status:
 *   draft     — written but NOT approved. Visible only in development or when
 *               CONTENT_PREVIEW=true (with a "Draft — not published" badge).
 *   published — approved for the public website.
 *
 * Rules: no fabricated statistics, research, customer stories or testimonials.
 */

export type ResourceCategory =
  | "product-guides"
  | "construction-operations"
  | "workforce-management"
  | "field-productivity"
  | "project-visibility"
  | "safety-compliance"
  | "product-updates";

export const resourceCategories: { id: ResourceCategory; name: string }[] = [
  { id: "product-guides", name: "Product Guides" },
  { id: "construction-operations", name: "Construction Operations" },
  { id: "workforce-management", name: "Workforce Management" },
  { id: "field-productivity", name: "Field Productivity" },
  { id: "project-visibility", name: "Project Visibility" },
  { id: "safety-compliance", name: "Safety and Compliance" },
  { id: "product-updates", name: "Product Updates" },
];

export type Block = { type: "h2"; text: string } | { type: "p"; text: string } | { type: "ul"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  summary: string;
  category: ResourceCategory;
  status: "draft" | "published";
  date: string; // ISO date
  readingMinutes: number;
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: "paper-sign-in-sheets-to-verified-attendance",
    title: "Moving a crew from paper sign-in sheets to verified attendance",
    summary: "A practical, site-by-site approach to replacing the clipboard at the gate — without losing a week of hours in the changeover.",
    category: "workforce-management",
    status: "draft",
    date: "2026-11-03",
    readingMinutes: 6,
    body: [
      { type: "p", text: "The paper sign-in sheet survives on most sites for a simple reason: it works well enough on the day. The problems arrive later — when someone has to read the handwriting, reconcile it with the supervisor's notes and type it into a spreadsheet before payroll." },
      { type: "p", text: "Moving to verified attendance is less about technology than about changing a habit at the site gate. The crews that make the switch smoothly tend to follow the same pattern." },
      { type: "h2", text: "Start with one site and one supervisor" },
      { type: "p", text: "Pick a site with a supervisor who is willing to champion the change. A single site lets you work through practical details — where people stand when they clock in, what happens when a phone is flat, who resolves exceptions — before rolling out further." },
      { type: "h2", text: "Run both systems for one pay period" },
      { type: "p", text: "Keep the paper sheet alongside digital clock-in for one pay period. Comparing the two shows where the new process needs adjusting, and gives the payroll team confidence before the sheet is retired." },
      { type: "h2", text: "Define the site boundary carefully" },
      { type: "p", text: "A boundary drawn too tightly creates false exceptions; one drawn too loosely stops being useful. Include laydown yards, welfare facilities and site entrances that crews legitimately use at the start of a shift." },
      { type: "h2", text: "Decide who handles exceptions — before the first one" },
      { type: "ul", items: [
        "Who reviews a clock-in recorded outside the boundary?",
        "What happens when a worker forgets to clock out?",
        "How is time recorded for someone without a working phone that day?",
        "Who approves a correction, and is the reason recorded?",
      ] },
      { type: "p", text: "Agreeing these answers up front stops exceptions from becoming disputes." },
      { type: "h2", text: "Explain the why to the crew" },
      { type: "p", text: "Workers are more willing to adopt a new clock-in when they understand what it does and does not do. Be clear that location is checked at the moment of clock-in, not tracked throughout the day, and that accurate records protect their pay as much as the company's costs." },
    ],
  },
  {
    slug: "what-a-good-daily-site-report-contains",
    title: "What a good daily site report contains",
    summary: "The daily report is the most useful document a supervisor writes — when it is consistent. A simple structure that project managers can rely on.",
    category: "field-productivity",
    status: "draft",
    date: "2026-10-20",
    readingMinutes: 5,
    body: [
      { type: "p", text: "A daily report should let someone who was not on site understand what happened, what changed and what needs a decision. It does not need to be long. It needs to be consistent." },
      { type: "h2", text: "The essentials" },
      { type: "ul", items: [
        "Date, site and area of work",
        "Crews and trades on site, with hours",
        "Weather and its effect on work",
        "Work completed against the plan",
        "Delays, with the cause and expected impact",
        "Materials delivered or short",
        "Safety observations and incidents",
        "Photos that show progress or problems",
      ] },
      { type: "h2", text: "Write it the same day" },
      { type: "p", text: "Reports written at the end of the week rely on memory. Completing the report before leaving site — even briefly — produces a record that is far more useful when questions come up months later." },
      { type: "h2", text: "Separate facts from opinions" },
      { type: "p", text: "\"Slab pour moved to Thursday — reinforcement delivery short\" is a fact with a cause. \"Supplier unreliable\" is an opinion. Both may matter, but the report should make the difference clear." },
      { type: "h2", text: "Connect it to the rest of the record" },
      { type: "p", text: "A daily report is more valuable when it sits alongside the day's attendance, approved hours and any incidents. When these live in the same system, the project manager does not have to assemble the picture from separate sources." },
    ],
  },
  {
    slug: "approvals-before-payroll",
    title: "Why approvals belong before payroll, not after",
    summary: "Most payroll corrections start as attendance questions nobody answered in time. Moving the approval upstream changes where problems are caught.",
    category: "construction-operations",
    status: "draft",
    date: "2026-10-06",
    readingMinutes: 5,
    body: [
      { type: "p", text: "In many construction businesses, hours are first questioned when payroll is already being prepared. Finance chases supervisors, supervisors try to remember the week, and workers wait to find out what they will be paid." },
      { type: "h2", text: "The supervisor is closest to the facts" },
      { type: "p", text: "The person best placed to confirm hours is the supervisor who was on site that day. An approval step at the end of each day or week — while the details are fresh — catches most problems at their source." },
      { type: "h2", text: "What an approval should record" },
      { type: "ul", items: [
        "Who approved the hours, and when",
        "Any corrections made, with the original value kept",
        "The reason for each correction",
        "Overtime approved against the applicable rules",
      ] },
      { type: "h2", text: "Payroll preparation becomes review, not reconstruction" },
      { type: "p", text: "When only approved hours reach payroll preparation, the finance team's job changes from rebuilding the week to reviewing variances. Questions still arise, but they arrive with an audit trail attached." },
      { type: "h2", text: "Keep payment where it belongs" },
      { type: "p", text: "Preparing payroll information and paying wages are different responsibilities. Approved data is handed to your payroll provider or bank, which processes payment under your own arrangements." },
    ],
  },
  {
    slug: "certification-expiry-30-day-habit",
    title: "Certification expiry: building a 30-day early-warning habit",
    summary: "Expired tickets are usually discovered at the worst moment. A simple routine that brings them forward to when they are easy to fix.",
    category: "safety-compliance",
    status: "draft",
    date: "2026-09-22",
    readingMinutes: 4,
    body: [
      { type: "p", text: "Trade certificates, plant licences and safety tickets all expire. The problem is rarely the expiry itself — it is finding out on the morning a worker is needed on a task they are no longer cleared for." },
      { type: "h2", text: "Record expiry dates when documents are collected" },
      { type: "p", text: "Every certification should be stored against the worker's record with its expiry date at the point it is received. A document without a date is a reminder that will never fire." },
      { type: "h2", text: "Review the next 30 days every week" },
      { type: "p", text: "A short weekly review of everything expiring in the next 30 days gives enough time to book renewal training without disrupting the programme. Assign each item to someone with a date." },
      { type: "h2", text: "Check before allocating" },
      { type: "p", text: "When planning crews for a new task, check certifications as part of allocation, not after. It is easier to change a plan on Monday than to remove someone from site on Wednesday." },
      { type: "h2", text: "Do the same for company credentials" },
      { type: "ul", items: [
        "Insurance certificates",
        "Trade and contractor licences",
        "Tax and registration documents requested in tenders",
      ] },
    ],
  },
  {
    slug: "labour-cost-codes-starting-structure",
    title: "Cost codes for labour: a practical starting structure",
    summary: "Labour cost visibility depends on allocating time to something meaningful. How to start with cost codes that crews can actually use.",
    category: "project-visibility",
    status: "draft",
    date: "2026-09-08",
    readingMinutes: 6,
    body: [
      { type: "p", text: "Cost codes turn hours into information. Without them, labour cost is a single number per project. With too many, crews guess, and the information becomes unreliable." },
      { type: "h2", text: "Start from how the project is estimated" },
      { type: "p", text: "Use the same structure your estimators use to build the budget. If labour is estimated by work package, record actual time against those packages so the comparison means something." },
      { type: "h2", text: "Keep the field list short" },
      { type: "p", text: "Workers and supervisors should only see the codes relevant to their site and trade. A short, relevant list is more accurate than a complete one." },
      { type: "h2", text: "Allocate at the crew level where possible" },
      { type: "p", text: "Asking each worker to choose a code at clock-in adds friction. Allocating a crew's time to a code — and letting supervisors adjust it when they approve — is often more accurate and easier to sustain." },
      { type: "h2", text: "A simple starting structure" },
      { type: "ul", items: [
        "Preliminaries and site set-up",
        "Groundworks and foundations",
        "Structural frame, by area or level",
        "Envelope",
        "Mechanical and electrical first fix",
        "Finishes",
        "Snagging and handover",
      ] },
      { type: "p", text: "Refine it once you have a few weeks of data and can see where more detail would change a decision." },
    ],
  },
  {
    slug: "how-an-attendance-exception-moves-through-axtara",
    title: "Product guide: how an attendance exception moves through Axtara",
    summary: "Follow a clock-in recorded outside the site boundary — from the worker's phone to the supervisor's review and the approved record.",
    category: "product-guides",
    status: "draft",
    date: "2026-11-10",
    readingMinutes: 4,
    body: [
      { type: "p", text: "An attendance exception is any record that needs a person to look at it before it is approved — for example, a clock-in outside the site boundary or a missing clock-out. This guide follows one exception through Axtara." },
      { type: "h2", text: "1. The worker clocks in" },
      { type: "p", text: "A worker clocks in from the Axtara mobile app. Axtara checks their location at that moment against the boundary configured for the site." },
      { type: "h2", text: "2. The record is flagged" },
      { type: "p", text: "If the location is outside the boundary, the time entry is still created, but it is marked as an exception rather than rejected. The worker is not blocked from starting work." },
      { type: "h2", text: "3. The supervisor reviews" },
      { type: "p", text: "The site supervisor sees the exception in their review queue, with the recorded time and distance from the boundary. They can approve it with a note — for example, the crew was at the laydown yard — correct it, or message the worker." },
      { type: "h2", text: "4. The decision is recorded" },
      { type: "p", text: "Whatever the supervisor decides is recorded with their name, the time and their note. The original record is kept, so anyone reviewing it later can see what changed and why." },
      { type: "h2", text: "5. Approved hours move on" },
      { type: "p", text: "Once approved, the hours are included in project labour reporting and become available for payroll preparation." },
      { type: "p", text: "Exact options available depend on how your organisation configures attendance rules. Your Axtara team will walk through them during onboarding." },
    ],
  },
  {
    slug: "one-record-from-site-to-boardroom",
    title: "One record, from the site to the boardroom",
    summary: "Why the most useful management reports are built from the same approved records supervisors create on site — not from monthly spreadsheets.",
    category: "construction-operations",
    status: "draft",
    date: "2026-08-25",
    readingMinutes: 5,
    body: [
      { type: "p", text: "Management reports in project-based businesses are often assembled once a month from exports, spreadsheets and emails. The effort is significant, and the numbers can differ depending on who prepared them." },
      { type: "h2", text: "Reports should be a view, not a project" },
      { type: "p", text: "When attendance, daily reports, expenses and approvals are recorded in one place, a management report becomes a view of information that already exists. Leadership and site teams are looking at the same record." },
      { type: "h2", text: "Approval is what makes the numbers trustworthy" },
      { type: "p", text: "Totals are only as reliable as the records underneath them. Building reports from approved records — rather than raw submissions — means the figures leadership sees have already been checked by the people closest to the work." },
      { type: "h2", text: "Look at exceptions first" },
      { type: "ul", items: [
        "Projects where labour is running ahead of progress",
        "Sites with recurring attendance exceptions",
        "Open incidents and overdue actions",
        "Certifications expiring in the next month",
      ] },
      { type: "p", text: "A short list of exceptions is often more useful to an executive than a long report of totals." },
    ],
  },
];

export const showDrafts = process.env.NODE_ENV !== "production" || process.env.CONTENT_PREVIEW === "true";

export function visibleArticles(): Article[] {
  return articles
    .filter((a) => a.status === "published" || showDrafts)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  const a = articles.find((x) => x.slug === slug);
  if (!a) return undefined;
  return a.status === "published" || showDrafts ? a : undefined;
}

export function categoryName(id: ResourceCategory) {
  return resourceCategories.find((c) => c.id === id)?.name ?? id;
}
