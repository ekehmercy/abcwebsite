import {
  AlertTriangle, Camera, Check, CheckCircle2, CloudSun, Filter, MapPin, Paperclip, Plus, ShieldAlert, Upload, X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { demoAttendance, demoCostCodes, demoPeople, demoProjects, type DemoStatus } from "@/content/demo-data";
import {
  AttendanceDemo, ComplianceDemo, CostsDemo, FieldDemo, PayrollDemo, ProjectsDemo, ReportingDemo, WorkforceDemo,
} from "./interactive";
import { AppFrame, Avatar, Bars, Kpi, LineChart, Meter, Panel, StatusPill, Table, Tag } from "./primitives";

/* ═════════════════════ Overview — used in the hero ═════════════════════ */

export type HeroStage = 0 | 1 | 2 | 3;

export function OverviewScreen({ stage = 3, className }: { stage?: HeroStage; className?: string }) {
  const kemar: DemoStatus = stage >= 2 ? "Approved" : "Pending Review";
  const onSite = stage >= 3 ? 166 : 165;
  const pending = stage >= 1 && stage < 2 ? 8 : 7;
  const queue = [
    ...(stage >= 1 ? [{ name: "Kemar Williams", tone: 0, site: "Harbour Point · Block B", time: "06:52", status: kemar, fresh: true }] : []),
    { name: "Odane Morgan", tone: 5, site: "Harbour Point · Block B", time: "06:48", status: "Pending Review" as DemoStatus, fresh: false },
    { name: "Rohan Thompson", tone: 5, site: "Harbour Point · Steel yard", time: "07:31", status: "Exception" as DemoStatus, fresh: false },
    { name: "Ravi Persaud", tone: 2, site: "Cedar Heights · Plot 14", time: "07:02", status: "Pending Review" as DemoStatus, fresh: false },
    { name: "Tunde Adeyemi", tone: 0, site: "Riverside · Section 3", time: "06:15", status: "Approved" as DemoStatus, fresh: false },
  ].slice(0, 4);

  return (
    <AppFrame active="home" crumbs={["Meridian", "Overview"]} className={className}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="ui-sm text-n-500">Tuesday, 18 November</p>
          <p className="text-[17px] font-semibold tracking-[-0.01em] text-n-950">Good morning, Shanice</p>
        </div>
        <div className="ui-sm hidden items-center gap-1.5 @xl:flex">
          <Tag>All projects</Tag>
          <Tag>Today</Tag>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 @3xl:grid-cols-4">
        <Kpi label="On site now" value={`${onSite}`} sub="of 188 scheduled" highlight={stage === 3} />
        <Kpi label="Pending approvals" value={pending} sub={stage === 1 ? "1 new submission" : "Across 3 sites"} tone={stage === 1 ? "warn" : "neutral"} highlight={stage === 1} />
        <div className="hidden @3xl:block"><Kpi label="Attendance exceptions" value="3" sub="2 outside boundary" tone="bad" /></div>
        <div className="hidden @3xl:block"><Kpi label="Labour cost · this week" value={stage >= 3 ? "J$4.22m" : "J$4.21m"} sub="Approved hours · all sites" /></div>
      </div>

      <div className="mt-2.5 grid gap-2.5 @4xl:grid-cols-[1.45fr_1fr]">
        <Panel title="Attendance review queue" meta={<span className="tabular-nums">{pending} pending</span>} bodyClass="pt-2 pb-1">
          <ul className="divide-y divide-n-100">
            {queue.map((r) => (
              <li key={r.name} className={cn("-mx-3.5 flex items-center gap-2.5 px-3.5 py-2", r.fresh && stage === 1 && "anim-row")}>
                <Avatar name={r.name} tone={r.tone} size={24} />
                <div className="min-w-0 flex-1">
                  <p className="ui-md truncate font-medium text-n-900">{r.name}</p>
                  <p className="ui-xs truncate text-n-500">{r.site}</p>
                </div>
                <span className="ui-sm hidden tabular-nums text-n-600 @lg:inline">{r.time}</span>
                <StatusPill status={r.status} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Projects" meta="Labour vs progress" className="hidden @2xl:block" bodyClass="space-y-3 py-3">
          {demoProjects.slice(0, 3).map((p) => (
            <div key={p.id}>
              <div className="ui-sm flex items-center justify-between gap-2">
                <span className="truncate font-medium text-n-800">{p.short}</span>
                <span className="tabular-nums text-n-500">{p.progress}%</span>
              </div>
              <Meter value={p.progress} className="mt-1.5" label={`${p.short} progress ${p.progress}%`} />
              <p className="ui-xs mt-1 flex justify-between text-n-500">
                <span>{p.id === "HPC" ? (stage >= 3 ? 49 : 48) : p.onSite} on site</span>
                <span className={p.health === "At risk" ? "text-warn" : ""}>{p.health}</span>
              </p>
            </div>
          ))}
        </Panel>
      </div>
    </AppFrame>
  );
}

/* ═════════════════════ Workforce ═════════════════════ */

export function WorkforceScreen({ className }: { className?: string }) {
  const rows = demoPeople.filter((p) => p.trade).slice(0, 7);
  const cert = (i: number) => (i === 3 ? <Tag tone="warn">12 days</Tag> : i === 5 ? <Tag tone="bad">Expired</Tag> : <Tag tone="ok">Valid</Tag>);
  return (
    <AppFrame active="workforce" crumbs={["Meridian", "Workforce", "People"]} className={className} actions={<span className="ui-sm hidden items-center gap-1 rounded-md bg-ink-900 px-2 py-1 font-medium text-white @xl:flex"><Plus className="size-3.5" aria-hidden="true" />Add person</span>}>
      <div className="flex flex-wrap items-center gap-1.5">
        {["All people · 412", "Direct · 318", "Subcontracted · 94"].map((t, i) => (
          <span key={t} className={cn("ui-sm rounded-md px-2 py-1", i === 0 ? "bg-white font-medium text-n-900 shadow-[0_0_0_1px_var(--n-200)]" : "text-n-500")}>{t}</span>
        ))}
        <span className="ui-sm ml-auto hidden items-center gap-1 text-n-500 @xl:flex"><Filter className="size-3.5" aria-hidden="true" />Trade, project, crew</span>
      </div>
      <div className="mt-3 grid gap-2.5 @4xl:grid-cols-[1.6fr_1fr]">
        <Panel bodyClass="pt-2.5 pb-0">
          <Table head={["Name", "Trade", <span key="c" className="hidden @xl:inline">Crew</span>, <span key="p" className="hidden @2xl:inline">Project</span>, "Certification"]}>
            {rows.map((p, i) => (
              <tr key={p.id}>
                <td>
                  <span className="flex items-center gap-2">
                    <Avatar name={p.name} tone={p.tone} size={22} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-n-900">{p.name}</span>
                      <span className="ui-xs block text-n-500 @xl:hidden">{p.crew}</span>
                    </span>
                  </span>
                </td>
                <td className="text-n-600">{p.trade}</td>
                <td className="hidden text-n-600 @xl:table-cell">{p.crew}</td>
                <td className="hidden text-n-600 @2xl:table-cell">{demoProjects.find((x) => x.id === p.project)?.short}</td>
                <td>{cert(i)}</td>
              </tr>
            ))}
          </Table>
        </Panel>
        <div className="hidden space-y-2.5 @4xl:block">
          <Panel title="Allocation by project" meta="Today">
            {demoProjects.map((p) => (
              <div key={p.id} className="ui-sm mb-2.5 last:mb-0">
                <div className="flex justify-between text-n-700"><span>{p.short}</span><span className="tabular-nums text-n-500">{p.onSite}/{p.planned}</span></div>
                <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-n-100">
                  <div className="bg-brand-500" style={{ width: `${(p.onSite / 100) * 100}%` }} />
                  <div className="bg-brand-200" style={{ width: `${((p.planned - p.onSite) / 100) * 100}%` }} />
                </div>
              </div>
            ))}
          </Panel>
          <Panel title="Crew B2" meta="Harbour Point">
            <div className="flex -space-x-1.5">
              {["Kemar Williams", "Odane Morgan", "Jodi-Ann Clarke", "Andre Campbell"].map((n, i) => (
                <Avatar key={n} name={n} tone={i + 2} size={26} className="ring-2 ring-white" />
              ))}
              <span className="ui-xs flex size-[26px] items-center justify-center rounded-full bg-n-100 text-n-600 ring-2 ring-white">+8</span>
            </div>
            <p className="ui-sm mt-2 text-n-600">Lead hand: Odane Morgan · Block B, Level 3</p>
          </Panel>
        </div>
      </div>
    </AppFrame>
  );
}

/* ═════════════════════ Time & attendance ═════════════════════ */

export function AttendanceScreen({ className }: { className?: string }) {
  return (
    <AppFrame
      active="attendance"
      crumbs={["Meridian", "Attendance", "Harbour Point"]}
      className={className}
      actions={<span className="ui-sm hidden items-center gap-1 rounded-md bg-brand-600 px-2 py-1 font-medium text-white @xl:flex"><Check className="size-3.5" aria-hidden="true" />Approve 4</span>}
    >
      <div className="grid gap-2.5 @4xl:grid-cols-[1fr_230px]">
        <Panel title="Today · Harbour Point" meta="Tue 18 Nov" bodyClass="pt-2.5 pb-0">
          <Table head={["Worker", "In", <span key="o" className="hidden @xl:inline">Out</span>, <span key="l" className="hidden @2xl:inline">Location check</span>, "Status"]}>
            {demoAttendance.map((r) => (
              <tr key={r.name}>
                <td>
                  <span className="block truncate font-medium text-n-900">{r.name}</span>
                  <span className="ui-xs block text-n-500">{r.crew}</span>
                </td>
                <td className="tabular-nums">{r.in}</td>
                <td className="hidden tabular-nums @xl:table-cell">{r.out}</td>
                <td className="hidden @2xl:table-cell">
                  <span className={cn("ui-sm inline-flex items-center gap-1", r.location === "Outside boundary" ? "text-bad" : "text-n-600")}>
                    {r.location !== "—" && <MapPin className="size-3" aria-hidden="true" />}{r.location}
                  </span>
                </td>
                <td><StatusPill status={r.status} /></td>
              </tr>
            ))}
          </Table>
        </Panel>
        <div className="hidden space-y-2.5 @4xl:block">
          <Panel title="Site boundary" meta="Block B" bodyClass="p-2">
            <div className="relative h-[124px] overflow-hidden rounded-md bg-[#EEF1EC]">
              <svg viewBox="0 0 200 124" className="absolute inset-0 size-full" aria-hidden="true">
                <path d="M0 90 L200 70" stroke="#D9DED5" strokeWidth="10" />
                <path d="M120 0 L135 124" stroke="#D9DED5" strokeWidth="7" />
                <polygon points="38,22 112,16 122,82 44,96" fill="var(--brand-500)" fillOpacity=".1" stroke="var(--brand-500)" strokeWidth="1.25" strokeDasharray="4 3" />
                <circle cx="78" cy="54" r="4" fill="var(--brand-600)" />
                <circle cx="66" cy="66" r="4" fill="var(--brand-600)" />
                <circle cx="90" cy="44" r="4" fill="var(--brand-600)" />
                <circle cx="158" cy="40" r="4" fill="var(--st-danger)" />
              </svg>
            </div>
            <p className="ui-xs mt-1.5 px-1 text-n-500">1 clock-in outside the boundary</p>
          </Panel>
          <Panel title="Exception" bodyClass="space-y-1.5">
            <p className="ui-md font-medium text-n-900">Rohan Thompson · 07:31</p>
            <p className="ui-sm text-n-600">Clocked in 140 m outside the Block B boundary.</p>
            <div className="flex gap-1.5 pt-1">
              <span className="ui-xs rounded-[5px] bg-ink-900 px-2 py-1 font-medium text-white">Review</span>
              <span className="ui-xs rounded-[5px] px-2 py-1 font-medium text-n-600 shadow-[0_0_0_1px_var(--n-200)]">Message</span>
            </div>
          </Panel>
        </div>
      </div>
    </AppFrame>
  );
}

/* ═════════════════════ Field operations ═════════════════════ */

function PhotoTile({ label, variant = 0 }: { label: string; variant?: number }) {
  const bgs = [
    "linear-gradient(160deg,#9aa3a8 0%,#6f777c 55%,#525a5f 100%)",
    "linear-gradient(170deg,#b8b2a6 0%,#8d877b 60%,#6c665b 100%)",
    "linear-gradient(150deg,#a5adb3 0%,#7c858b 50%,#5f676c 100%)",
  ];
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-md" style={{ background: bgs[variant % 3] }}>
      <svg viewBox="0 0 80 60" className="absolute inset-0 size-full opacity-40" aria-hidden="true">
        {variant === 0 && Array.from({ length: 9 }).map((_, i) => <line key={i} x1={6 + i * 8} y1="8" x2={6 + i * 8} y2="56" stroke="#3b3f42" strokeWidth="1.2" />)}
        {variant === 0 && Array.from({ length: 6 }).map((_, i) => <line key={i} x1="4" y1={10 + i * 8} x2="76" y2={10 + i * 8} stroke="#3b3f42" strokeWidth="1" />)}
        {variant === 1 && <><rect x="10" y="18" width="60" height="34" fill="#e3ddd2" opacity=".5" /><rect x="10" y="12" width="60" height="6" fill="#4a4540" /></>}
        {variant === 2 && <><path d="M0 46 L80 40 L80 60 L0 60Z" fill="#3f4549" /><rect x="30" y="10" width="4" height="36" fill="#d9a03b" /><rect x="14" y="10" width="40" height="3" fill="#d9a03b" /></>}
      </svg>
      <span className="ui-xs absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/45 px-1 py-px text-white"><Camera className="size-2.5" aria-hidden="true" />{label}</span>
    </div>
  );
}

export function FieldScreen({ className }: { className?: string }) {
  return (
    <AppFrame active="field" crumbs={["Meridian", "Field reports", "Daily report · Block B"]} className={className}>
      <div className="grid gap-2.5 @4xl:grid-cols-[1.5fr_1fr]">
        <Panel
          title={<span className="flex items-center gap-2">Daily report · Block B, Level 3 <StatusPill status="Pending Review" /></span>}
          meta={<span className="hidden @xl:inline">Submitted 15:48 by Shanice Brown</span>}
        >
          <div className="ui-sm grid grid-cols-3 gap-2 text-n-600">
            <div className="rounded-md bg-n-50 px-2.5 py-2"><p className="ui-xs text-n-500">Weather</p><p className="flex items-center gap-1 font-medium text-n-900"><CloudSun className="size-3.5" aria-hidden="true" />31°C</p></div>
            <div className="rounded-md bg-n-50 px-2.5 py-2"><p className="ui-xs text-n-500">Crew on site</p><p className="font-medium text-n-900">12 · 94.5 h</p></div>
            <div className="rounded-md bg-n-50 px-2.5 py-2"><p className="ui-xs text-n-500">Delays</p><p className="font-medium text-warn">1 · materials</p></div>
          </div>
          <p className="ui-sm mt-3 font-medium text-n-800">Work completed</p>
          <ul className="ui-sm mt-1.5 space-y-1.5 text-n-700">
            {["Rebar fixed to grid lines C–F, Level 3 slab", "Column formwork struck, columns C3–C6", "Edge protection inspected and signed off"].map((t) => (
              <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" />{t}</li>
            ))}
            <li className="flex gap-2"><AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warn" aria-hidden="true" />Slab pour moved to Thursday — Y12 bar delivery short by 2 t</li>
          </ul>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <PhotoTile label="07:41" variant={0} />
            <PhotoTile label="11:05" variant={2} />
            <PhotoTile label="14:30" variant={1} />
          </div>
        </Panel>
        <Panel title="Site activity" meta="Today" className="hidden @4xl:block" bodyClass="py-2">
          <ol className="relative space-y-3 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-n-150">
            {[
              { who: "Shanice Brown", t: "15:48", what: "submitted the daily report", tone: 1 },
              { who: "Rohan Thompson", t: "13:12", what: "reported a near miss at the hoist", tone: 5, alert: true },
              { who: "Odane Morgan", t: "11:05", what: "added 4 photos to Level 3 slab", tone: 5 },
              { who: "Andre Campbell", t: "09:20", what: "flagged Y12 bar delivery delay", tone: 2 },
              { who: "Kemar Williams", t: "06:52", what: "clocked in at Block B", tone: 0 },
            ].map((a) => (
              <li key={a.t} className="relative flex gap-2.5">
                <Avatar name={a.who} tone={a.tone} size={22} className="relative ring-2 ring-white" />
                <p className="ui-sm min-w-0 text-n-600">
                  <span className="font-medium text-n-900">{a.who}</span> {a.what}
                  {a.alert && <ShieldAlert className="ml-1 inline size-3.5 text-bad" aria-label="Safety" />}
                  <span className="ui-xs block text-n-400">{a.t}</span>
                </p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </AppFrame>
  );
}

/* ═════════════════════ Projects ═════════════════════ */

export function ProjectsScreen({ className }: { className?: string }) {
  const p = demoProjects[0];
  return (
    <AppFrame active="projects" crumbs={["Meridian", "Projects", p.short]} className={className}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-[16px] font-semibold tracking-[-0.01em] text-n-950">{p.name}</p>
        <Tag tone="ok"><CheckCircle2 className="size-3" aria-hidden="true" />{p.health}</Tag>
        <span className="ui-sm text-n-500">{p.location} · {p.phase}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2.5 @3xl:grid-cols-4">
        <Kpi label="Progress" value={`${p.progress}%`} sub="Milestone 4 of 7" />
        <Kpi label="Labour budget used" value={`${p.labourBudgetUsed}%`} sub="+4% vs progress" tone="warn" />
        <div className="hidden @3xl:block"><Kpi label="On site today" value={p.onSite} sub={`of ${p.planned} planned`} /></div>
        <div className="hidden @3xl:block"><Kpi label="Open items" value="5" sub="1 incident · 4 RFIs" /></div>
      </div>
      <div className="mt-2.5 grid gap-2.5 @4xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Labour by cost code" meta="Budget used" bodyClass="space-y-3">
          {demoCostCodes.map((c) => (
            <div key={c.code}>
              <div className="ui-sm flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-n-800"><span className="font-mono text-n-500">{c.code}</span> · {c.name}</span>
                <span className={cn("tabular-nums", c.used > 90 ? "font-medium text-warn" : "text-n-500")}>{c.used}%</span>
              </div>
              <Meter value={c.used} tone={c.used > 90 ? "warn" : "brand"} className="mt-1.5" label={`${c.name} ${c.used}% used`} />
            </div>
          ))}
        </Panel>
        <Panel title="Planned vs actual hours" meta="Last 8 weeks" className="hidden @2xl:block">
          <LineChart
            ariaLabel="Planned versus actual labour hours over eight weeks"
            series={[
              { name: "Planned", tone: "neutral", values: [380, 410, 430, 450, 470, 480, 490, 500] },
              { name: "Actual", tone: "brand", values: [372, 405, 441, 448, 489, 501, 512, 523] },
            ]}
            labels={["W40", "W43", "W47"]}
          />
          <p className="ui-xs mt-2 flex gap-3 text-n-500">
            <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-brand-500" />Actual</span>
            <span className="flex items-center gap-1"><span className="h-0.5 w-3 border-t border-dashed border-n-400" />Planned</span>
          </p>
        </Panel>
      </div>
    </AppFrame>
  );
}

/* ═════════════════════ Costs / expenses ═════════════════════ */

export function CostsScreen({ className }: { className?: string }) {
  const claims = [
    { who: "Kemar Williams", tone: 0, what: "Tie wire and spacers", code: "03-200", amt: "J$14,850", status: "Pending Review" as DemoStatus },
    { who: "Odane Morgan", tone: 5, what: "Formwork release agent", code: "03-310", amt: "J$22,400", status: "Approved" as DemoStatus },
    { who: "Ifeoma Eze", tone: 5, what: "Survey pegs and paint", code: "02-110", amt: "₦86,000", status: "Approved" as DemoStatus },
    { who: "Devon Fraser", tone: 1, what: "Cable ties and glands", code: "26-050", amt: "G$41,200", status: "Exception" as DemoStatus },
  ];
  return (
    <AppFrame active="costs" crumbs={["Meridian", "Expenses", "Review"]} className={className}>
      <div className="grid gap-2.5 @4xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Expense claims" meta="4 awaiting action" bodyClass="pt-2.5 pb-0">
          <Table head={["Submitted by", <span key="d" className="hidden @xl:inline">Item</span>, <span key="c" className="hidden @2xl:inline">Cost code</span>, "Amount", "Status"]}>
            {claims.map((c) => (
              <tr key={c.who}>
                <td>
                  <span className="flex items-center gap-2"><Avatar name={c.who} tone={c.tone} size={22} /><span className="truncate font-medium text-n-900">{c.who}</span></span>
                </td>
                <td className="hidden text-n-600 @xl:table-cell"><span className="flex items-center gap-1"><Paperclip className="size-3 text-n-400" aria-label="Receipt attached" />{c.what}</span></td>
                <td className="hidden font-mono text-n-500 @2xl:table-cell">{c.code}</td>
                <td className="tabular-nums text-n-900">{c.amt}</td>
                <td><StatusPill status={c.status} /></td>
              </tr>
            ))}
          </Table>
        </Panel>
        <div className="space-y-2.5">
          <Panel title="Receipt · Tie wire and spacers" className="hidden @4xl:block" bodyClass="flex gap-3">
            <div className="flex h-[108px] w-[78px] shrink-0 flex-col gap-1 rounded bg-n-50 p-2 shadow-[0_0_0_1px_var(--n-150)]">
              <span className="h-1 w-10 rounded bg-n-300" />
              <span className="h-1 w-8 rounded bg-n-200" />
              <span className="mt-1.5 h-1 w-12 rounded bg-n-200" />
              <span className="h-1 w-11 rounded bg-n-200" />
              <span className="h-1 w-9 rounded bg-n-200" />
              <span className="mt-auto h-1.5 w-8 self-end rounded bg-n-400" />
            </div>
            <dl className="ui-sm grid grid-cols-[auto_1fr] content-start gap-x-3 gap-y-1">
              <dt className="text-n-500">Project</dt><dd className="text-n-900">Harbour Point</dd>
              <dt className="text-n-500">Code</dt><dd className="font-mono text-n-900">03-200</dd>
              <dt className="text-n-500">Captured</dt><dd className="text-n-900">10:14 · on site</dd>
              <dt className="text-n-500">Approver</dt><dd className="text-n-900">Shanice Brown</dd>
            </dl>
          </Panel>
          <Panel title="Labour cost · Harbour Point" meta="Weekly, J$ '000">
            <Bars ariaLabel="Weekly labour cost for Harbour Point over eight weeks" data={[3.1, 3.3, 3.2, 3.6, 3.5, 3.8, 3.9, 4.2]} highlightLast height={78} labels={["W40", "", "", "", "", "", "", "W47"]} />
          </Panel>
        </div>
      </div>
    </AppFrame>
  );
}

/* ═════════════════════ Payroll preparation ═════════════════════ */

export function PayrollScreen({ className, stepDone = 2 }: { className?: string; stepDone?: number }) {
  const steps = ["Hours approved", "Rules applied", "Finance review", "Handoff to provider"];
  const rows = [
    { n: "Kemar Williams", t: 0, reg: "80.0", ot: "6.5", allw: "Site", flag: false },
    { n: "Odane Morgan", t: 5, reg: "80.0", ot: "4.0", allw: "Site · Lead", flag: false },
    { n: "Jodi-Ann Clarke", t: 4, reg: "72.0", ot: "0.0", allw: "Site", flag: true },
    { n: "Rohan Thompson", t: 5, reg: "80.0", ot: "11.5", allw: "Site · Weld", flag: true },
  ];
  return (
    <AppFrame active="payroll" crumbs={["Meridian", "Payroll prep", "Period 11–24 Nov"]} className={className}>
      <ol className="grid grid-cols-2 gap-1.5 @3xl:grid-cols-4" aria-label="Payroll preparation stages">
        {steps.map((s, i) => (
          <li key={s} className={cn("ui-sm flex items-center gap-2 rounded-md px-2.5 py-2", i < stepDone ? "bg-ok-bg text-ok" : i === stepDone ? "bg-white font-medium text-n-900 shadow-[0_0_0_1px_var(--brand-300)]" : "bg-white text-n-500 shadow-[0_0_0_1px_var(--n-150)]")}>
            <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold", i < stepDone ? "bg-ok text-white" : i === stepDone ? "bg-brand-600 text-white" : "bg-n-150 text-n-500")}>
              {i < stepDone ? <Check className="size-2.5" aria-hidden="true" strokeWidth={3} /> : i + 1}
            </span>
            <span className="truncate">{s}</span>
          </li>
        ))}
      </ol>
      <div className="mt-2.5 grid gap-2.5 @4xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Harbour Point · Crew B2 and S1" meta="Approved hours only" bodyClass="pt-2.5 pb-0">
          <Table head={["Employee", "Regular", "Overtime", <span key="a" className="hidden @xl:inline">Allowances</span>, "Check"]}>
            {rows.map((r) => (
              <tr key={r.n}>
                <td><span className="flex items-center gap-2"><Avatar name={r.n} tone={r.t} size={22} /><span className="truncate font-medium text-n-900">{r.n}</span></span></td>
                <td className="tabular-nums">{r.reg}</td>
                <td className="tabular-nums">{r.ot}</td>
                <td className="hidden text-n-600 @xl:table-cell">{r.allw}</td>
                <td>{r.flag ? <Tag tone="warn"><AlertTriangle className="size-3" aria-hidden="true" />Variance</Tag> : <Tag tone="ok"><Check className="size-3" aria-hidden="true" />OK</Tag>}</td>
              </tr>
            ))}
          </Table>
        </Panel>
        <div className="hidden space-y-2.5 @4xl:block">
          <Panel title="Period summary">
            <dl className="ui-sm grid grid-cols-2 gap-y-1.5">
              <dt className="text-n-500">Employees</dt><dd className="text-right tabular-nums text-n-900">164</dd>
              <dt className="text-n-500">Approved hours</dt><dd className="text-right tabular-nums text-n-900">12,906</dd>
              <dt className="text-n-500">Overtime hours</dt><dd className="text-right tabular-nums text-n-900">741</dd>
              <dt className="text-n-500">Variances to review</dt><dd className="text-right tabular-nums text-warn">6</dd>
            </dl>
          </Panel>
          <div className="ui-sm rounded-[10px] border border-dashed border-n-200 px-3 py-2.5 text-n-600">
            <p className="flex items-center gap-1.5 font-medium text-n-800"><Upload className="size-3.5" aria-hidden="true" />Handoff to payroll provider</p>
            <p className="ui-xs mt-1">Payment is processed by your payroll provider. Axtara does not hold funds or transfer wages.</p>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ═════════════════════ Safety & compliance ═════════════════════ */

export function ComplianceScreen({ className }: { className?: string }) {
  return (
    <AppFrame active="compliance" crumbs={["Meridian", "Compliance"]} className={className}>
      <div className="grid grid-cols-2 gap-2.5 @3xl:grid-cols-4">
        <Kpi label="Certifications expiring" value="9" sub="Next 30 days" tone="warn" />
        <Kpi label="Open incidents" value="2" sub="1 near miss · 1 minor" tone="bad" />
        <div className="hidden @3xl:block"><Kpi label="Company credentials" value="14" sub="All current" tone="ok" /></div>
        <div className="hidden @3xl:block"><Kpi label="Days since lost-time incident" value="118" sub="Across all sites" /></div>
      </div>
      <div className="mt-2.5 grid gap-2.5 @4xl:grid-cols-2">
        <Panel title="Expiring certifications" meta="30 days" bodyClass="pt-2 pb-1">
          <ul className="divide-y divide-n-100">
            {[
              { n: "Rohan Thompson", t: 5, c: "Welding certificate", d: "Expired 2 Nov", tone: "bad" as const },
              { n: "Tunde Adeyemi", t: 0, c: "Excavator operator licence", d: "In 12 days", tone: "warn" as const },
              { n: "Devon Fraser", t: 1, c: "Electrical licence", d: "In 21 days", tone: "warn" as const },
              { n: "Odane Morgan", t: 5, c: "Working at height", d: "In 27 days", tone: "neutral" as const },
            ].map((r) => (
              <li key={r.n} className="-mx-3.5 flex items-center gap-2.5 px-3.5 py-2">
                <Avatar name={r.n} tone={r.t} size={22} />
                <div className="min-w-0 flex-1">
                  <p className="ui-md truncate font-medium text-n-900">{r.n}</p>
                  <p className="ui-xs truncate text-n-500">{r.c}</p>
                </div>
                <Tag tone={r.tone}>{r.d}</Tag>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Incident · Near miss at Block B hoist" meta="INC-0042" className="hidden @2xl:block">
          <dl className="ui-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
            <dt className="text-n-500">Reported</dt><dd className="text-n-900">Rohan Thompson · 13:12</dd>
            <dt className="text-n-500">Site</dt><dd className="text-n-900">Harbour Point · Block B</dd>
            <dt className="text-n-500">Severity</dt><dd><Tag tone="warn">Near miss</Tag></dd>
          </dl>
          <p className="ui-sm mt-2.5 font-medium text-n-800">Actions</p>
          <ul className="ui-sm mt-1.5 space-y-1.5 text-n-700">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" />Hoist gate interlock checked · Shanice Brown</li>
            <li className="flex gap-2"><X className="mt-0.5 size-3.5 shrink-0 text-n-400" aria-hidden="true" />Toolbox talk for Crew S1 · due Thu</li>
          </ul>
        </Panel>
      </div>
    </AppFrame>
  );
}

/* ═════════════════════ Reporting ═════════════════════ */

export function ReportingScreen({ className }: { className?: string }) {
  return (
    <AppFrame active="reporting" crumbs={["Meridian", "Reports", "Operations summary"]} className={className}>
      <div className="grid gap-2.5 @4xl:grid-cols-[1.3fr_1fr]">
        <Panel title="Portfolio" meta="Week 47" bodyClass="pt-2.5 pb-0">
          <Table head={["Project", "Progress", <span key="l" className="hidden @xl:inline">Labour used</span>, "Health"]}>
            {demoProjects.map((p) => (
              <tr key={p.id}>
                <td><span className="block truncate font-medium text-n-900">{p.short}</span><span className="ui-xs block text-n-500">{p.location}</span></td>
                <td className="w-[28%]"><div className="flex items-center gap-2"><Meter value={p.progress} className="max-w-[90px]" label={`${p.progress}%`} /><span className="tabular-nums text-n-600">{p.progress}%</span></div></td>
                <td className="hidden tabular-nums @xl:table-cell">{p.labourBudgetUsed}%</td>
                <td>{p.health === "At risk" ? <Tag tone="warn"><AlertTriangle className="size-3" aria-hidden="true" />At risk</Tag> : <Tag tone="ok"><CheckCircle2 className="size-3" aria-hidden="true" />On track</Tag>}</td>
              </tr>
            ))}
          </Table>
        </Panel>
        <div className="space-y-2.5">
          <Panel title="Attendance rate" meta="Last 8 weeks">
            <LineChart
              ariaLabel="Attendance rate over eight weeks, rising from 89 to 95 percent"
              series={[{ name: "Rate", tone: "brand", values: [89, 90, 90.5, 92, 91.4, 93.2, 94, 95] }]}
              height={84}
              labels={["W40", "W47"]}
            />
          </Panel>
          <Panel title="Exceptions this week" className="hidden @2xl:block" bodyClass="space-y-1.5">
            {[["Overtime above plan", "Harbour Point", "warn"], ["Weather delay · 2 days", "Cedar Heights", "warn"], ["Certification expired", "Harbour Point", "bad"]].map(([a, b, t]) => (
              <p key={a} className="ui-sm flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 text-n-800">
                  <AlertTriangle className={cn("size-3.5 shrink-0", t === "bad" ? "text-bad" : "text-warn")} aria-hidden="true" />
                  <span className="truncate">{a}</span>
                </span>
                <span className="ui-xs shrink-0 text-n-500">{b}</span>
              </p>
            ))}
          </Panel>
        </div>
      </div>
    </AppFrame>
  );
}

/** Interactive versions are used everywhere a module preview appears. */
export const screenComponents = {
  workforce: WorkforceDemo,
  attendance: AttendanceDemo,
  field: FieldDemo,
  projects: ProjectsDemo,
  costs: CostsDemo,
  payroll: PayrollDemo,
  compliance: ComplianceDemo,
  reporting: ReportingDemo,
} as const;

