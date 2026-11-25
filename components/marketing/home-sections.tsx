import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Check, CheckCircle2, Clock, FileText, HardHat, Lock, MapPin, MessageSquare,
  Plane, Receipt, ShieldAlert, ShieldCheck, Users,
} from "lucide-react";
import { modules, publicCapabilities, publicCapability, type ModuleSlug } from "@/config/features";
import { industries } from "@/config/industries";
import { plans } from "@/config/pricing";
import { integrationCategories, availableIntegrations } from "@/config/integrations";
import { publicSecurityPrinciples } from "@/content/security";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { LinkButton, TextLink } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Icon } from "@/components/ui/icon";
import { EditorialImage } from "@/components/ui/editorial-image";
import { screenComponents, OverviewScreen } from "@/components/product-demo/screens";
import { ApprovalsPhone, AttendanceDemo, ClockInPhone, PayrollDemo, ProjectsDemo, ReportingDemo } from "@/components/product-demo/interactive";
import {
  MobileApprovals, MobileClockIn, MobileDailyReport, MobileHome, MobileSchedule,
} from "@/components/product-demo/mobile-screens";
import { Avatar, IllustrativeNote, Panel, PhoneFrame, Tag } from "@/components/product-demo/primitives";
import { HeroDemo } from "./hero-demo";
import { Fragmented } from "./fragmented";
import { Journey, type JourneyStep } from "./journey";
import { cn } from "@/lib/cn";

const cap = (moduleSlug: ModuleSlug, id: string) => publicCapability(moduleSlug, id);

/* ═════════════ 1. Hero ═════════════ */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-20 pt-10 sm:pt-16 lg:pb-28 lg:pt-20">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[880px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000_20%,transparent_75%)]" />
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="t-eyebrow inline-flex items-center gap-2 text-n-600">
              <span className="size-1.5 rounded-full bg-accent-500" aria-hidden="true" />
              Workforce and project operations for construction
            </p>
            <h1 id="hero-title" className="t-display mt-5 text-n-950">
              The work happens everywhere. Manage it from one place.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <p className="t-lead text-n-600">
              Connect your people, projects and field operations in one powerful platform built for the way construction businesses work.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="/demo" size="lg" arrow>Request a Demo</LinkButton>
              <LinkButton href="/platform" size="lg" variant="secondary">Explore the Platform</LinkButton>
            </div>
          </div>
        </div>
        <div className="mt-14 lg:mt-16">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}

/* ═════════════ 2. Built for your business ═════════════ */
export function Segments() {
  return (
    <section aria-labelledby="segments-title" className="border-y border-n-150 bg-white">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4" data-reveal>
          <Eyebrow>Who it&apos;s for</Eyebrow>
          <h2 id="segments-title" className="t-h3 mt-4 text-n-950">Built for businesses where the work happens on site.</h2>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-xl bg-n-150 sm:grid-cols-2 lg:col-span-8" data-reveal>
          {industries.map((ind) => (
            <li key={ind.slug} className="bg-white">
              <Link href={`/industries/${ind.slug}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-n-25">
                <span className="flex items-center justify-between text-[16px] font-medium text-n-950">
                  {ind.name}
                  <ArrowUpRight className="size-4 text-n-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
                </span>
                <span className="mt-2 text-[14.5px] leading-6 text-n-600">{ind.segmentBlurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ═════════════ 3. Problem ═════════════ */
export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="py-24 lg:py-32">
      <div className="container-x">
        <SectionIntro
          id="problem-title"
          align="center"
          eyebrow="The problem"
          title="The work is connected. Your systems should be too."
          lead="Attendance on paper. Crew lists in spreadsheets. Site updates in group chats. Costs, approvals and payroll somewhere else. Every handoff is a chance for something to go missing."
        />
        <div className="mt-12">
          <Fragmented />
        </div>
      </div>
    </section>
  );
}

/* ═════════════ 4. Product explorer (dark) ═════════════ */
const explorerOrder = ["workforce", "time-attendance", "field-operations", "project-operations", "expenses", "payroll", "compliance", "reporting"];

export function ProductExplorer() {
  const ordered = explorerOrder.map((s) => modules.find((m) => m.slug === s)!);
  const tabs = ordered.map((m) => ({ id: m.slug, label: m.shortName === "Payroll Prep" ? "Payroll Preparation" : m.name.replace("Expenses and Cost Management", "Costs").replace("Workforce Management", "Workforce").replace("Project Operations", "Projects").replace("Reporting and Analytics", "Reporting") }));
  const panels = ordered.map((m) => {
    const Screen = screenComponents[m.screen];
    return (
      <div key={m.slug} className="grid gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-14">
        <div className="lg:pt-4">
          <h3 className="t-h3 text-white">{m.headline}</h3>
          <p className="mt-4 text-[16px] leading-7 text-white/70">{m.intro}</p>
          <ul className="mt-6 space-y-2.5">
            {publicCapabilities(m).slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-start gap-2.5 text-[15px] text-white/85">
                <Check className="mt-1 size-4 shrink-0 text-brand-300" aria-hidden="true" />
                <span>{c.name}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 rounded-lg bg-white/[0.04] p-4 ring-1 ring-white/10">
            <p className="text-[12.5px] font-medium text-brand-200">Outcome</p>
            <p className="mt-1 text-[15px] leading-6 text-white">{m.outcome}</p>
          </div>
          <TextLink href={`/platform/${m.slug}`} dark className="mt-6">Explore {m.name}</TextLink>
        </div>
        <div className="min-w-0">
          <Screen />
          <IllustrativeNote dark className="mt-3" />
        </div>
      </div>
    );
  });
  return (
    <section aria-labelledby="explore-title" className="dark-surface relative overflow-hidden bg-ink-900 py-24 text-white lg:py-32">
      <div aria-hidden="true" className="grid-lines-dark pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />
      <div className="container-x relative">
        <SectionIntro dark id="explore-title" eyebrow="Explore the product" title="One platform. A clearer view of every operation." lead="Eight connected parts of one product. Choose an area, then use it — the previews below respond like the real application." />
        <Tabs
          label="Product areas"
          tabs={tabs}
          panels={panels}
          layoutClassName="mt-12"
          listClassName="-mx-4 flex snap-x gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:flex-wrap"
          trackEvent="product_tour_started"
          tabClass="h-10 shrink-0 snap-start whitespace-nowrap rounded-md px-3.5 text-[14px] font-medium transition-colors"
          tabActiveClass="bg-white text-ink-900"
          tabInactiveClass="text-white/65 hover:bg-white/8 hover:text-white"
          panelClassName="mt-10 outline-none"
        />
      </div>
    </section>
  );
}

/* ═════════════ 5. Operational journey ═════════════ */
function TimeEntryCard() {
  return (
    <div className="mx-auto grid max-w-[760px] items-center gap-6 md:grid-cols-[auto_1fr]">
      <PhoneFrame label="Kemar Williams is clocked in at Harbour Point" className="mx-auto w-[232px]"><MobileClockIn stage={2} title="Axtara Field" /></PhoneFrame>
      <Panel title="Time entry · TE-20418" meta="Created 06:52">
        <dl className="ui-md grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5">
          <dt className="text-n-500">Worker</dt><dd className="flex items-center gap-2 text-n-900"><Avatar name="Kemar Williams" size={20} />Kemar Williams</dd>
          <dt className="text-n-500">Project</dt><dd className="text-n-900">Harbour Point Commercial Development</dd>
          <dt className="text-n-500">Site · area</dt><dd className="text-n-900">Block B · Level 3 slab</dd>
          <dt className="text-n-500">Cost code</dt><dd className="font-mono text-n-900">03-200 · Structural works</dd>
          <dt className="text-n-500">Location</dt><dd className="flex items-center gap-1.5 text-ok"><MapPin className="size-3.5" aria-hidden="true" />Inside site boundary</dd>
          <dt className="text-n-500">Status</dt><dd><Tag tone="warn"><Clock className="size-3" aria-hidden="true" />Sent to Shanice Brown for review</Tag></dd>
        </dl>
      </Panel>
    </div>
  );
}

export function OperationalJourney() {
  const steps: JourneyStep[] = [
    { title: "Clock in on site", actor: "Field worker", person: "Kemar Williams, Steel Fixer", detail: "Kemar arrives at the Harbour Point gate. His site, crew and shift are already in Axtara Field — one tap records the start of his day." },
    { title: "Linked to site and project", actor: "Site verification", person: "Recorded automatically", detail: "The clock-in is checked against the Block B site boundary and attached to Harbour Point, Block B and cost code 03-200. Nobody re-keys it later." },
    { title: "Review and approve", actor: "Site supervisor", person: "Shanice Brown, Site Supervisor", detail: "Shanice sees her crew's clock-ins and any exceptions on her phone, resolves them on the spot and approves the hours." },
    { title: "Update the project picture", actor: "Project manager", person: "Andre Campbell, Project Manager", detail: "Approved hours flow into labour cost by cost code. Andre sees Structural works at 94% of its labour budget and acts while there is still time." },
    { title: "Prepare payroll", actor: "Finance", person: "Tavia Reid, Finance Manager", detail: "Only approved hours reach payroll preparation. Tavia clears the variances and prepares the schedule for the payroll provider, which pays employees." },
    { title: "See the whole operation", actor: "Executive", person: "Paul Henry, Operations Director", detail: "Paul reviews progress, labour and exceptions across every project — built from the same records that started on site this morning." },
  ];
  const visuals = [
    <div key="1" className="flex justify-center py-2"><ClockInPhone /></div>,
    <TimeEntryCard key="2" />,
    <div key="3" className="grid items-start gap-6 xl:grid-cols-[auto_1fr]">
      <ApprovalsPhone className="mx-auto" />
      <div className="hidden min-w-0 xl:block"><AttendanceDemo /></div>
    </div>,
    <ProjectsDemo key="4" />,
    <PayrollDemo key="5" />,
    <ReportingDemo key="6" />,
  ];
  return (
    <section id="journey" aria-labelledby="journey-title" className="scroll-mt-16 py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionIntro id="journey-title" eyebrow="Product walkthrough" title="From the jobsite to the boardroom." lead="Follow one clock-in through every person who relies on it. Each step is the product itself — tap, approve and explore." />
          <IllustrativeNote className="shrink-0" />
        </div>
        <div className="mt-12">
          <Journey steps={steps} visuals={visuals} />
        </div>
      </div>
    </section>
  );
}

/* ═════════════ 6. Built for the field ═════════════ */
export function FieldSection() {
  const worker = [
    { label: "Clock-in and clock-out", I: Clock, c: cap("time-attendance", "ta-clock") },
    { label: "Site assignments", I: MapPin, c: cap("field-operations", "fo-assignments") },
    { label: "Shift schedules", I: Clock, c: cap("workforce", "wf-scheduling") },
    { label: "Daily work reports", I: HardHat, c: cap("field-operations", "fo-daily") },
    { label: "Expense submissions", I: Receipt, c: cap("expenses", "ex-submit") },
    { label: "Incident reporting", I: ShieldAlert, c: cap("field-operations", "fo-incidents") },
    { label: "Leave requests", I: Plane, c: cap("workforce", "wf-leave") },
    { label: "Messages with supervisors", I: MessageSquare, c: cap("field-operations", "fo-comms") },
    { label: "Employee documents", I: FileText, c: cap("workforce", "wf-documents") },
  ];
  const supervisorAll = [
    { label: "Crew attendance and exceptions", c: cap("time-attendance", "ta-exceptions") },
    { label: "Approve hours on site", c: cap("time-attendance", "ta-approvals") },
    { label: "Review daily reports", c: cap("field-operations", "fo-review") },
  ];
  // Only capabilities that may be shown in this release stage.
  const workerShown = worker.filter((w) => w.c);
  const supervisor = supervisorAll.filter((w) => w.c);
  return (
    <section aria-labelledby="field-title" className="border-t border-n-150 bg-white py-24 lg:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionIntro id="field-title" eyebrow="Mobile" title="Powerful in the office. Practical on the jobsite." lead="Simple enough to use with gloves on, at 6 a.m., at the site gate. Field workers get what they need for the day; supervisors approve without going back to the office." />
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" data-reveal>
              <div className={workerShown.length ? "" : "hidden"}>
                <h3 className="text-[14px] font-medium text-n-900">For field workers</h3>
                <ul className="mt-3 space-y-2">
                  {workerShown.map(({ label, I }) => (
                    <li key={label} className="flex items-center gap-2.5 text-[14.5px] text-n-700">
                      <I className="size-4 shrink-0 text-n-400" aria-hidden="true" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[14px] font-medium text-n-900">For supervisors</h3>
                <ul className="mt-3 space-y-2">
                  {supervisor.map(({ label }) => (
                    <li key={label} className="flex items-center gap-2.5 text-[14.5px] text-n-700">
                      <CheckCircle2 className="size-4 shrink-0 text-n-400" aria-hidden="true" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
                <TextLink href="/mobile" className="mt-6">Explore the mobile apps</TextLink>
              </div>
            </div>
          </div>
          <div className="relative h-[560px] overflow-hidden rounded-2xl sm:h-[640px] lg:col-span-7 lg:h-auto lg:min-h-[700px]" data-reveal>
            <EditorialImage slot="field" className="absolute inset-0" />
            <div className="absolute inset-x-0 top-16 flex items-start justify-center px-4 sm:top-24">
              <PhoneFrame label="Field worker home screen" className="-mr-10 hidden w-[244px] origin-top translate-y-14 scale-[0.84] md:block"><MobileHome /></PhoneFrame>
              <PhoneFrame label="Daily report on mobile" className="relative z-10 w-[244px]"><MobileDailyReport /></PhoneFrame>
              <PhoneFrame label="Weekly shift schedule" className="-ml-10 hidden w-[244px] origin-top translate-y-14 scale-[0.84] md:block"><MobileSchedule /></PhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═════════════ 7. Personas ═════════════ */
export function Personas() {
  const personas = [
    { id: "exec", label: "Executive", who: "Paul Henry · Operations Director", needs: "Operational performance, project visibility and the exceptions that need a decision.", points: ["Portfolio health across every project", "Labour cost against budget, by project", "One list of exceptions — not twelve reports"], preview: <ReportingDemo /> },
    { id: "pm", label: "Project Manager", who: "Andre Campbell · Project Manager", needs: "Labour, progress and site activity on their projects, while there is still time to act.", points: ["Approved hours by cost code", "Daily reports and photos from every crew", "Early warning on labour overruns"], preview: <ProjectsDemo /> },
    { id: "super", label: "Site Supervisor", who: "Shanice Brown · Site Supervisor", needs: "Crew attendance, approvals, daily reports and safety incidents — from the site, not the office.", points: ["See who is on site right now", "Approve hours in one tap", "Report incidents and daily progress on the spot"], preview: <div className="flex justify-center gap-6 py-2"><PhoneFrame label="Supervisor approvals" className="w-[232px]"><MobileApprovals /></PhoneFrame><PhoneFrame label="Supervisor daily report" className="hidden w-[232px] sm:block"><MobileDailyReport /></PhoneFrame></div> },
    { id: "hr", label: "HR Manager", who: "Adaeze Nwosu · HR Manager", needs: "Employee records, attendance, leave and workforce compliance in one place.", points: ["Complete employee records and documents", "Leave requests routed and recorded", "Certification expiry before it becomes a problem"], preview: <screenComponents.workforce /> },
    { id: "fin", label: "Finance Manager", who: "Tavia Reid · Finance Manager", needs: "Approved hours, expenses, labour cost and payroll preparation without re-keying.", points: ["Only approved hours reach payroll preparation", "Expenses allocated to projects and cost codes", "Variances highlighted before handoff"], preview: <PayrollDemo /> },
    { id: "worker", label: "Field Worker", who: "Kemar Williams · Steel Fixer", needs: "Their assignment, a quick clock-in, simple submissions and a direct line to their supervisor.", points: ["Today's site and shift on the phone", "Clock in at the gate in seconds", "Submit expenses, leave and reports in a few taps"], preview: <div className="flex justify-center gap-6 py-2"><PhoneFrame label="Worker home" className="w-[232px]"><MobileHome /></PhoneFrame><PhoneFrame label="Worker shifts" className="hidden w-[232px] sm:block"><MobileSchedule /></PhoneFrame></div> },
  ];
  const panels = personas.map((p) => (
    <div key={p.id} className="grid gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-10">
      <div>
        <p className="text-[13px] font-medium text-n-500">{p.who}</p>
        <p className="t-h3 mt-3 text-n-950">{p.needs}</p>
        <ul className="mt-6 space-y-3">
          {p.points.map((x) => (
            <li key={x} className="flex gap-2.5 text-[15px] text-n-700"><Check className="mt-1 size-4 shrink-0 text-brand-600" aria-hidden="true" />{x}</li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 rounded-2xl bg-n-100/70 p-3 shadow-[inset_0_0_0_1px_var(--n-150)] sm:p-5">{p.preview}</div>
    </div>
  ));
  return (
    <section aria-labelledby="teams-title" className="py-24 lg:py-32">
      <div className="container-x">
        <SectionIntro id="teams-title" eyebrow="For every team" title="Different people. The same record of the work." lead="Everyone sees the part of the operation they are responsible for — all of it built from the same approved information." />
        <Tabs
          label="Roles"
          tabs={personas.map((p) => ({ id: p.id, label: p.label }))}
          panels={panels}
          layoutClassName="mt-12"
          listClassName="-mx-4 flex gap-1 overflow-x-auto border-b border-n-150 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
          tabClass="relative h-11 shrink-0 whitespace-nowrap px-3.5 text-[14.5px] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full"
          tabActiveClass="text-n-950 after:bg-brand-600"
          tabInactiveClass="text-n-500 hover:text-n-900 after:bg-transparent"
          panelClassName="mt-10 outline-none"
        />
      </div>
    </section>
  );
}

/* ═════════════ 8. Ecosystem ═════════════ */
export function Ecosystem() {
  const what: Record<string, string> = {
    accounting: "Costs by project",
    payroll: "Approved hours",
    payments: "Reimbursements",
    identity: "Worker identity",
    estimating: "Budgets and cost codes",
    procurement: "Field requests",
    documents: "Compliance files",
  };
  const statusFor = (cat: string) => (availableIntegrations.some((i) => i.category === cat) ? `${what[cat]} · connected` : what[cat]);
  const n = integrationCategories.length;
  return (
    <section aria-labelledby="eco-title" className="border-y border-n-150 bg-white py-24 lg:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionIntro id="eco-title" eyebrow="Integrations" title="Your operation, connected to the tools you trust." lead="Axtara works alongside your accounting, payroll and document systems. Approved records leave Axtara ready to use — and if you need a connection to the software you already run, tell us what it is." />
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/integrations" variant="secondary" arrow>Explore integrations</LinkButton>
          </div>
        </div>
        <div className="lg:col-span-7" data-reveal>
          <ul className="grid grid-cols-2 gap-2 sm:hidden">
            {integrationCategories.map((c) => (
              <li key={c.id} className="rounded-lg bg-white p-3 shadow-[0_0_0_1px_var(--n-150)]">
                <Icon name={c.icon} className="size-4 text-brand-600" />
                <p className="mt-2 text-[14px] font-medium text-n-900">{c.name}</p>
                <p className="text-[12.5px] text-n-500">{statusFor(c.id)}</p>
              </li>
            ))}
          </ul>
          <div className="relative mx-auto hidden aspect-square w-full max-w-[540px] sm:block">
            <svg viewBox="0 0 540 540" className="absolute inset-0 size-full" aria-hidden="true">
              <circle cx="270" cy="270" r="200" fill="none" stroke="var(--n-150)" strokeDasharray="3 5" />
              <circle cx="270" cy="270" r="120" fill="none" stroke="var(--n-100)" />
              {integrationCategories.map((c, i) => {
                const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                return <line key={c.id} x1="270" y1="270" x2={270 + Math.cos(a) * 200} y2={270 + Math.sin(a) * 200} stroke="var(--brand-200)" strokeWidth="1" />;
              })}
            </svg>
            <div className="absolute left-1/2 top-1/2 flex size-[112px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl bg-ink-900 text-white shadow-[var(--shadow-float)]">
              <span className="text-[17px] font-semibold tracking-[-0.02em]">axtara</span>
              <span className="mt-0.5 text-[11px] text-white/60">Approved records</span>
            </div>
            <ul>
              {integrationCategories.map((c, i) => {
                const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                const x = 50 + (Math.cos(a) * 200 * 100) / 540;
                const y = 50 + (Math.sin(a) * 200 * 100) / 540;
                return (
                  <li key={c.id} className="absolute flex w-[118px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-white px-2 py-2 text-center shadow-[0_0_0_1px_var(--n-150),var(--shadow-card)] sm:w-[168px] sm:px-3" style={{ left: `${x}%`, top: `${y}%` }}>
                    <Icon name={c.icon} className="size-4 text-brand-600" />
                    <span className="mt-1 text-[12.5px] font-medium leading-4 text-n-900 sm:text-[13px]">{c.name}</span>
                    <span className="mt-0.5 block text-[11px] text-n-500 sm:text-[11.5px]">{statusFor(c.id)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═════════════ 9. Security ═════════════ */
export function SecurityTeaser() {
  return (
    <section aria-labelledby="sec-title" className="py-24 lg:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionIntro id="sec-title" eyebrow="Security and trust" title="Visibility for managers. Privacy for the people doing the work." />
          <p className="mt-5 max-w-md text-[15.5px] leading-7 text-n-600" data-reveal>
            Axtara holds information about people, their hours and where they work. Access is controlled by role, every approval is recorded, and location is captured only at clock-in.
          </p>
          <TextLink href="/security" className="mt-7">Visit the Security and Trust centre</TextLink>
        </div>
        <dl className="border-t border-n-200 lg:col-span-7" data-reveal>
          {publicSecurityPrinciples.map((p) => (
            <div key={p.id} className="grid gap-1 border-b border-n-150 py-5 sm:grid-cols-[220px_1fr] sm:gap-8">
              <dt className="flex items-center gap-2.5 text-[15.5px] font-medium text-n-950">
                {p.id === "access" ? <Lock className="size-4 text-brand-600" aria-hidden="true" /> : p.id === "employee" ? <Users className="size-4 text-brand-600" aria-hidden="true" /> : <ShieldCheck className="size-4 text-brand-600" aria-hidden="true" />}
                {p.title}
              </dt>
              <dd className="text-[15px] leading-6 text-n-600">{p.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ═════════════ 10. Pricing intro ═════════════ */
export function PricingIntro() {
  return (
    <section aria-labelledby="pricing-title" className="border-t border-n-150 bg-white py-24 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionIntro id="pricing-title" eyebrow="Pricing" title="Subscriptions that grow with your workforce." lead="Priced by active workers, with plans for every stage — from replacing paper attendance to running complex, multi-entity operations." />
          <div className="flex shrink-0 flex-wrap gap-3">
            <LinkButton href="/pricing" variant="secondary" arrow>See pricing</LinkButton>
            <LinkButton href="/demo?interest=pricing">Get a quote</LinkButton>
          </div>
        </div>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl bg-n-150 md:grid-cols-3" data-reveal>
          {plans.map((p, i) => (
            <li key={p.id} className={cn("flex flex-col p-7", i === 1 ? "bg-n-25" : "bg-white")}>
              <p className="flex items-center justify-between text-[20px] font-semibold tracking-[-0.02em] text-n-950">
                {p.name}
                <span className="text-[12px] font-medium tracking-normal text-n-400">0{i + 1}</span>
              </p>
              <p className="mt-2 text-[14.5px] font-medium text-n-700">{p.forWhom}</p>
              <p className="mt-3 text-[14.5px] leading-6 text-n-600">{p.summary}</p>
              <Link href={`/pricing#plan-${p.id}`} className="mt-auto inline-flex items-center gap-1 pt-6 text-[14px] font-medium text-brand-700 hover:underline">
                {p.quotedOnly ? "Talk to us" : "View plan"} <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ═════════════ 11. Final CTA ═════════════ */
export function FinalCta({ title = "Bring your entire operation into focus.", lead = "See how Axtara can connect the people, projects and processes that keep your business moving." }: { title?: string; lead?: string }) {
  return (
    <section aria-labelledby="cta-title" className="dark-surface relative overflow-hidden bg-ink-950 py-24 text-white lg:py-32">
      <div aria-hidden="true" className="grid-lines-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_80%_at_80%_50%,#000,transparent)]" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="cta-title" className="t-h1 text-white">{title}</h2>
          <p className="t-lead mt-6 max-w-lg text-white/70">{lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="/demo" variant="light" size="lg" arrow>Request a Demo</LinkButton>
            <LinkButton href="/platform" variant="outline-light" size="lg">Explore the Platform</LinkButton>
          </div>
        </div>
        <div className="hidden lg:col-span-6 lg:block" aria-hidden="true">
          <div className="relative ml-auto max-w-[560px] [mask-image:linear-gradient(to_bottom,#000_60%,transparent)]">
            <OverviewScreen stage={3} />
          </div>
        </div>
      </div>
    </section>
  );
}


