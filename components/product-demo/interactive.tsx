"use client";

/**
 * Interactive product demonstrations — controlled, client-side simulations of
 * the Axtara application. Nothing here calls a backend; every action changes
 * local demonstration state only and is clearly a demo of the product UI.
 */

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowLeft, Camera, Check, CheckCircle2, ChevronRight, CloudSun, FileText, MapPin, MessageSquare,
  Paperclip, RotateCcw, ShieldAlert, Upload, X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  demoAttendance, demoPeople, demoProjectDetail, demoProjects, type DemoStatus,
} from "@/content/demo-data";
import { AppFrame, Avatar, Bars, Kpi, LineChart, Meter, Panel, PhoneFrame, StatusPill, Table, Tag, type AppIdentity } from "./primitives";
import { MobileApprovals, MobileClockIn, type ClockInContent, type ClockStage } from "./mobile-screens";

const btn = "ui-sm inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1.5 font-medium transition-colors";
const btnPrimary = cn(btn, "bg-brand-600 text-white hover:bg-brand-700");
const btnGhost = cn(btn, "text-n-700 shadow-[0_0_0_1px_var(--n-200)] hover:bg-n-50");
const rowBtn = "w-full text-left transition-colors hover:bg-n-25 focus-visible:bg-brand-50 focus-visible:outline-none";

/* ══════════════ Time & attendance — review an exception, approve hours ══════════════ */

export function AttendanceDemo({ className }: { className?: string }) {
  const [rows, setRows] = useState(() => demoAttendance.map((r) => ({ ...r })));
  const [selected, setSelected] = useState<string>("Rohan Thompson");
  const [note, setNote] = useState<string | null>(null);
  const sel = rows.find((r) => r.name === selected)!;
  const pending = rows.filter((r) => r.status === "Pending Review" || r.status === "On Site").length;

  const setStatus = (name: string, status: DemoStatus) => setRows((rs) => rs.map((r) => (r.name === name ? { ...r, status } : r)));
  const approveAll = () => setRows((rs) => rs.map((r) => (r.status === "Pending Review" || r.status === "On Site" ? { ...r, status: "Approved" } : r)));

  return (
    <AppFrame
      active="attendance"
      crumbs={["Meridian", "Attendance", "Harbour Point"]}
      className={className}
      actions={
        <button type="button" onClick={approveAll} disabled={!pending} className={cn(btnPrimary, "hidden disabled:opacity-50 @xl:inline-flex")}>
          <Check className="size-3.5" aria-hidden="true" />Approve {pending || "all"}
        </button>
      }
    >
      <div className="grid gap-2.5 @4xl:grid-cols-[1fr_240px]">
        <Panel title="Today · Harbour Point" meta={<span className="tabular-nums">{pending} to review</span>} bodyClass="pt-2.5 pb-0">
          <Table head={["Worker", "In", <span key="l" className="hidden @2xl:inline">Location check</span>, "Status"]}>
            {rows.map((r) => (
              <tr key={r.name} className={cn(selected === r.name && "bg-brand-50/60")}>
                <td className="!p-0">
                  <button type="button" onClick={() => { setSelected(r.name); setNote(null); }} className={cn(rowBtn, "px-3.5 py-2")} aria-pressed={selected === r.name}>
                    <span className="block truncate font-medium text-n-900">{r.name}</span>
                    <span className="ui-xs block text-n-500">{r.crew}</span>
                  </button>
                </td>
                <td className="tabular-nums">{r.in}</td>
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
        <div className="space-y-2.5">
          <Panel title="Review" meta={sel.crew}>
            <p className="ui-md font-medium text-n-900">{sel.name} · {sel.in}</p>
            {sel.location === "Outside boundary" ? (
              <div className="ui-sm mt-1.5 rounded-md bg-bad-bg px-2.5 py-2 text-bad">
                <p className="flex items-center gap-1 font-medium"><AlertTriangle className="size-3.5" aria-hidden="true" />Clocked in 140 m outside Block B</p>
                <p className="mt-0.5 text-n-700">Location captured at clock-in only.</p>
              </div>
            ) : (
              <p className="ui-sm mt-1.5 flex items-center gap-1 text-n-600"><MapPin className="size-3.5" aria-hidden="true" />{sel.location === "—" ? "Not clocked in yet" : "Inside the site boundary"}</p>
            )}
            {sel.status === "Exception" && (
              <div className="mt-2.5 space-y-1.5" role="group" aria-label="Resolve exception">
                <p className="ui-xs text-n-500">Reason</p>
                {["Working at the laydown yard", "Collecting materials", "Not on site"].map((n) => (
                  <button key={n} type="button" onClick={() => setNote(n)} aria-pressed={note === n} className={cn("ui-sm block w-full rounded-md px-2.5 py-1.5 text-left", note === n ? "bg-brand-50 text-brand-800 shadow-[0_0_0_1px_var(--brand-300)]" : "bg-n-50 text-n-700 hover:bg-n-100")}>{n}</button>
                ))}
                <div className="flex gap-1.5 pt-1">
                  <button type="button" disabled={!note} onClick={() => setStatus(sel.name, note === "Not on site" ? "Not Started" : "Approved")} className={cn(btnPrimary, "disabled:opacity-40")}>Resolve</button>
                  <button type="button" className={btnGhost}><MessageSquare className="size-3.5" aria-hidden="true" />Message</button>
                </div>
              </div>
            )}
            {(sel.status === "Pending Review" || sel.status === "On Site") && (
              <div className="mt-2.5 flex gap-1.5">
                <button type="button" onClick={() => setStatus(sel.name, "Approved")} className={btnPrimary}><Check className="size-3.5" aria-hidden="true" />Approve</button>
                <button type="button" className={btnGhost}>Query</button>
              </div>
            )}
            {(sel.status === "Approved" || sel.status === "Not Started") && sel.in !== "—" && (
              <p className="ui-sm mt-2.5 flex items-center gap-1 text-ok"><CheckCircle2 className="size-3.5" aria-hidden="true" />Recorded by Shanice Brown{note ? ` · ${note}` : ""}</p>
            )}
          </Panel>
          <Panel title="Site boundary" meta="Block B" className="hidden @4xl:block" bodyClass="p-2">
            <div className="relative h-[110px] overflow-hidden rounded-md bg-[#EEF1EC]">
              <svg viewBox="0 0 200 110" className="absolute inset-0 size-full" aria-hidden="true">
                <path d="M0 82 L200 64" stroke="#D9DED5" strokeWidth="10" />
                <polygon points="38,18 112,12 122,74 44,86" fill="var(--brand-500)" fillOpacity=".1" stroke="var(--brand-500)" strokeWidth="1.25" strokeDasharray="4 3" />
                {[[78, 48], [66, 60], [90, 38]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4" fill="var(--brand-600)" />)}
                <circle cx="158" cy="36" r={selected === "Rohan Thompson" ? 6 : 4} fill="var(--st-danger)" />
              </svg>
            </div>
          </Panel>
        </div>
      </div>
    </AppFrame>
  );
}

/* ══════════════ Projects — navigate between project records ══════════════ */

export function ProjectsDemo({ className }: { className?: string }) {
  const [id, setId] = useState("HPC");
  const p = demoProjects.find((x) => x.id === id)!;
  const d = demoProjectDetail[id];
  return (
    <AppFrame active="projects" crumbs={["Meridian", "Projects", p.short]} className={className}>
      <div role="tablist" aria-label="Projects" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none]">
        {demoProjects.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={x.id === id} onClick={() => setId(x.id)}
            className={cn("ui-sm shrink-0 rounded-md px-2.5 py-1.5 font-medium transition-colors", x.id === id ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-200)]" : "text-n-500 hover:text-n-900")}>
            {x.short}
          </button>
        ))}
      </div>
      <div key={id} className="anim-fade">
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-n-950">{p.name}</p>
          {p.health === "At risk" ? <Tag tone="warn"><AlertTriangle className="size-3" aria-hidden="true" />At risk</Tag> : <Tag tone="ok"><CheckCircle2 className="size-3" aria-hidden="true" />On track</Tag>}
          <span className="ui-sm text-n-500">{p.location} · {p.phase}</span>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 @3xl:grid-cols-4">
          <Kpi label="Progress" value={`${p.progress}%`} sub={d.milestone} />
          <Kpi label="Labour budget used" value={`${p.labourBudgetUsed}%`} sub={p.labourBudgetUsed > p.progress ? `+${p.labourBudgetUsed - p.progress}% vs progress` : "In line with progress"} tone={p.labourBudgetUsed > p.progress + 3 ? "warn" : "ok"} />
          <div className="hidden @3xl:block"><Kpi label="On site today" value={p.onSite} sub={`of ${p.planned} planned`} /></div>
          <div className="hidden @3xl:block"><Kpi label="Labour this week" value={d.labourWeek} sub="Approved hours only" /></div>
        </div>
        <div className="mt-2.5 grid gap-2.5 @4xl:grid-cols-[1.3fr_1fr]">
          <Panel title="Labour by cost code" meta="Budget used" bodyClass="space-y-3">
            {d.costCodes.map((c) => (
              <div key={c.code}>
                <div className="ui-sm flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-n-800"><span className="font-mono text-n-500">{c.code}</span> · {c.name}</span>
                  <span className={cn("tabular-nums", c.used > 90 ? "font-medium text-warn" : "text-n-500")}>{c.used}%</span>
                </div>
                <Meter value={c.used} tone={c.used > 90 ? "warn" : "brand"} className="mt-1.5" label={`${c.name} ${c.used}% used`} />
              </div>
            ))}
          </Panel>
          <div className="space-y-2.5">
            <Panel title="Operational risks" bodyClass="space-y-1.5">
              {d.risks.map((r) => (
                <p key={r.text} className="ui-sm flex gap-1.5 text-n-800">
                  {r.tone === "ok" ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" /> : <AlertTriangle className={cn("mt-0.5 size-3.5 shrink-0", r.tone === "bad" ? "text-bad" : "text-warn")} aria-hidden="true" />}
                  {r.text}
                </p>
              ))}
            </Panel>
            <Panel title="Crews on site" className="hidden @2xl:block" bodyClass="space-y-1.5">
              {d.crews.map((c) => (
                <p key={c.name} className="ui-sm flex items-center justify-between gap-2"><span className="font-medium text-n-900">{c.name} <span className="font-normal text-n-500">· {c.lead}</span></span><span className="text-n-500">{c.size} · {c.area}</span></p>
              ))}
            </Panel>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ══════════════ Field operations — daily report, photos, expenses, incidents ══════════════ */

const photoBg = ["linear-gradient(160deg,#9aa3a8,#525a5f)", "linear-gradient(170deg,#b8b2a6,#6c665b)", "linear-gradient(150deg,#a5adb3,#5f676c)"];

export function FieldDemo({ className }: { className?: string }) {
  const [tab, setTab] = useState<"report" | "expenses" | "incidents">("report");
  const [photo, setPhoto] = useState<number | null>(null);
  const [approved, setApproved] = useState(false);
  const photos = [{ t: "07:41", cap: "Rebar fixed, grid lines C–F" }, { t: "11:05", cap: "Hoist and edge protection" }, { t: "14:30", cap: "Column formwork struck, C3–C6" }];
  return (
    <AppFrame active="field" crumbs={["Meridian", "Field reports", "Block B · Tue 18 Nov"]} className={className}>
      <div role="tablist" aria-label="Field records" className="flex gap-1">
        {([["report", "Daily report"], ["expenses", "Expenses · 2"], ["incidents", "Incidents · 1"]] as const).map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("ui-sm rounded-md px-2.5 py-1.5 font-medium", tab === k ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-200)]" : "text-n-500 hover:text-n-900")}>{l}</button>
        ))}
      </div>
      <div key={tab} className="anim-fade mt-2.5">
        {tab === "report" && (
          <div className="grid gap-2.5 @4xl:grid-cols-[1.5fr_1fr]">
            <Panel title={<span className="flex items-center gap-2">Block B, Level 3 <StatusPill status={approved ? "Approved" : "Pending Review"} /></span>} meta={<span className="hidden @xl:inline">Shanice Brown · 15:48</span>}>
              <div className="ui-sm grid grid-cols-3 gap-2 text-n-600">
                <div className="rounded-md bg-n-50 px-2.5 py-2"><p className="ui-xs text-n-500">Weather</p><p className="flex items-center gap-1 font-medium text-n-900"><CloudSun className="size-3.5" aria-hidden="true" />31°C</p></div>
                <div className="rounded-md bg-n-50 px-2.5 py-2"><p className="ui-xs text-n-500">Crew</p><p className="font-medium text-n-900">12 · 94.5 h</p></div>
                <div className="rounded-md bg-n-50 px-2.5 py-2"><p className="ui-xs text-n-500">Delays</p><p className="font-medium text-warn">1 · materials</p></div>
              </div>
              <ul className="ui-sm mt-3 space-y-1.5 text-n-700">
                {["Rebar fixed to grid lines C–F, Level 3 slab", "Column formwork struck, columns C3–C6", "Edge protection inspected and signed off"].map((t) => (
                  <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" />{t}</li>
                ))}
                <li className="flex gap-2"><AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warn" aria-hidden="true" />Pour moved to Thursday — Y12 bar delivery short by 2 t</li>
              </ul>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {photos.map((ph, i) => (
                  <button key={ph.t} type="button" onClick={() => setPhoto(i)} aria-label={`Open photo: ${ph.cap}, ${ph.t}`} className="relative aspect-[4/3] overflow-hidden rounded-md ring-offset-2 hover:ring-2 hover:ring-brand-300" style={{ background: photoBg[i] }}>
                    <span className="ui-xs absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/45 px-1 py-px text-white"><Camera className="size-2.5" aria-hidden="true" />{ph.t}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-1.5">
                {approved ? (
                  <button type="button" onClick={() => setApproved(false)} className={btnGhost}><RotateCcw className="size-3.5" aria-hidden="true" />Reopen</button>
                ) : (
                  <button type="button" onClick={() => setApproved(true)} className={btnPrimary}><Check className="size-3.5" aria-hidden="true" />Approve report</button>
                )}
              </div>
            </Panel>
            <Panel title="Site activity" meta="Today" className="hidden @4xl:block" bodyClass="py-2">
              <ol className="space-y-3">
                {[
                  ...(approved ? [{ who: "Andre Campbell", t: "16:02", what: "approved the daily report", tone: 2 }] : []),
                  { who: "Shanice Brown", t: "15:48", what: "submitted the daily report", tone: 1 },
                  { who: "Rohan Thompson", t: "13:12", what: "reported a near miss at the hoist", tone: 5 },
                  { who: "Odane Morgan", t: "11:05", what: "added 4 photos to Level 3", tone: 5 },
                  { who: "Kemar Williams", t: "06:52", what: "clocked in at Block B", tone: 0 },
                ].map((a) => (
                  <li key={a.t} className="flex gap-2.5">
                    <Avatar name={a.who} tone={a.tone} size={22} />
                    <p className="ui-sm min-w-0 text-n-600"><span className="font-medium text-n-900">{a.who}</span> {a.what}<span className="ui-xs block text-n-400">{a.t}</span></p>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        )}
        {tab === "expenses" && <ExpenseList compact />}
        {tab === "incidents" && (
          <Panel title="Near miss · Block B hoist" meta="INC-0042">
            <dl className="ui-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              <dt className="text-n-500">Reported</dt><dd className="text-n-900">Rohan Thompson · 13:12</dd>
              <dt className="text-n-500">What happened</dt><dd className="text-n-900">Hoist gate opened while the platform was between floors.</dd>
              <dt className="text-n-500">Immediate action</dt><dd className="text-n-900">Hoist stood down; gate interlock checked by Shanice Brown.</dd>
            </dl>
          </Panel>
        )}
      </div>
      {photo !== null && (
        <div role="dialog" aria-label={photos[photo].cap} className="absolute inset-0 z-20 flex items-center justify-center bg-ink-950/70 p-6 anim-fade" onClick={() => setPhoto(null)}>
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-lg" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-[4/3]" style={{ background: photoBg[photo] }} />
            <div className="ui-sm flex items-center justify-between bg-white px-3 py-2"><span className="text-n-800">{photos[photo].cap}</span><span className="flex items-center gap-1 text-n-500"><MapPin className="size-3" aria-hidden="true" />Block B · {photos[photo].t}</span></div>
            <button type="button" onClick={() => setPhoto(null)} className="absolute right-2 top-2 rounded-md bg-black/50 p-1 text-white" aria-label="Close photo"><X className="size-4" aria-hidden="true" /></button>
          </div>
        </div>
      )}
    </AppFrame>
  );
}

/* ══════════════ Expenses — approve claims, see project cost ══════════════ */

const claimsSeed = [
  { who: "Kemar Williams", tone: 0, what: "Tie wire and spacers", code: "03-200", project: "Harbour Point", amt: "J$14,850", status: "Pending Review" as DemoStatus },
  { who: "Odane Morgan", tone: 5, what: "Formwork release agent", code: "03-310", project: "Harbour Point", amt: "J$22,400", status: "Pending Review" as DemoStatus },
  { who: "Ifeoma Eze", tone: 5, what: "Survey pegs and marking paint", code: "33-420", project: "Riverside", amt: "₦86,000", status: "Approved" as DemoStatus },
  { who: "Ravi Persaud", tone: 2, what: "Block saw blades", code: "04-200", project: "Cedar Heights", amt: "G$41,200", status: "Exception" as DemoStatus },
];

function ExpenseList({ compact }: { compact?: boolean }) {
  const [claims, setClaims] = useState(claimsSeed);
  const [sel, setSel] = useState(0);
  const c = claims[sel];
  const set = (i: number, status: DemoStatus) => setClaims((cs) => cs.map((x, k) => (k === i ? { ...x, status } : x)));
  const list = compact ? claims.slice(0, 2) : claims;
  return (
    <div className="grid gap-2.5 @4xl:grid-cols-[1.5fr_1fr]">
      <Panel title="Expense claims" meta={`${claims.filter((x) => x.status !== "Approved").length} awaiting action`} bodyClass="pt-1 pb-1">
        <ul className="divide-y divide-n-100">
          {list.map((x, i) => (
            <li key={x.who} className="-mx-3.5">
              <button type="button" onClick={() => setSel(i)} aria-pressed={sel === i} className={cn(rowBtn, "flex items-center gap-2.5 px-3.5 py-2", sel === i && "bg-brand-50/60")}>
                <Avatar name={x.who} tone={x.tone} size={22} />
                <span className="min-w-0 flex-1">
                  <span className="ui-md block truncate font-medium text-n-900">{x.what}</span>
                  <span className="ui-xs block truncate text-n-500">{x.who} · <span className="font-mono">{x.code}</span> · {x.project}</span>
                </span>
                <span className="ui-sm hidden tabular-nums text-n-900 @lg:inline">{x.amt}</span>
                <StatusPill status={x.status} />
              </button>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Receipt" meta={c.amt}>
        <div className="flex gap-3">
          <div className="flex h-[96px] w-[70px] shrink-0 flex-col gap-1 rounded bg-n-50 p-2 shadow-[0_0_0_1px_var(--n-150)]" aria-hidden="true">
            <span className="h-1 w-9 rounded bg-n-300" /><span className="h-1 w-7 rounded bg-n-200" /><span className="mt-1.5 h-1 w-11 rounded bg-n-200" /><span className="h-1 w-10 rounded bg-n-200" /><span className="mt-auto h-1.5 w-7 self-end rounded bg-n-400" />
          </div>
          <dl className="ui-sm grid grid-cols-[auto_1fr] content-start gap-x-3 gap-y-1">
            <dt className="text-n-500">Project</dt><dd className="text-n-900">{c.project}</dd>
            <dt className="text-n-500">Cost code</dt><dd className="font-mono text-n-900">{c.code}</dd>
            <dt className="text-n-500">Receipt</dt><dd className="flex items-center gap-1 text-n-900"><Paperclip className="size-3" aria-hidden="true" />Attached</dd>
          </dl>
        </div>
        {c.status === "Exception" && <p className="ui-sm mt-2 flex gap-1 text-bad"><AlertTriangle className="mt-0.5 size-3.5" aria-hidden="true" />Above the G$25,000 site limit — needs PM approval</p>}
        <div className="mt-2.5 flex gap-1.5">
          {c.status === "Approved" ? (
            <p className="ui-sm flex items-center gap-1 text-ok"><CheckCircle2 className="size-3.5" aria-hidden="true" />Approved · added to project cost</p>
          ) : (
            <>
              <button type="button" onClick={() => set(sel, "Approved")} className={btnPrimary}><Check className="size-3.5" aria-hidden="true" />Approve</button>
              <button type="button" onClick={() => set(sel, "Exception")} className={btnGhost}>Query</button>
            </>
          )}
        </div>
      </Panel>
    </div>
  );
}

export function CostsDemo({ className }: { className?: string }) {
  return (
    <AppFrame active="costs" crumbs={["Meridian", "Expenses", "Review"]} className={className}>
      <ExpenseList />
      <div className="mt-2.5 hidden @2xl:block">
        <Panel title="Labour and expense cost · Harbour Point" meta="Weekly, J$ m">
          <Bars ariaLabel="Weekly cost for Harbour Point over eight weeks, rising to 4.2 million" data={[3.1, 3.3, 3.2, 3.6, 3.5, 3.8, 3.9, 4.2]} highlightLast height={64} labels={["W40", "", "", "", "", "", "", "W47"]} />
        </Panel>
      </div>
    </AppFrame>
  );
}

/* ══════════════ Payroll preparation — follow the approval workflow ══════════════ */

export function PayrollDemo({ className, identity, crewLabel = "Harbour Point · Crews B2 and S1", people }: { className?: string; identity?: AppIdentity; crewLabel?: string; people?: { n: string; t: number; reg: string; ot: string; allw: string; flag: string | null }[] }) {
  const steps = ["Hours approved", "Rules applied", "Finance review", "Schedule prepared"];
  const [done, setDone] = useState(2);
  const [resolved, setResolved] = useState<string[]>([]);
  const rows = people ?? [
    { n: "Kemar Williams", t: 0, reg: "80.0", ot: "6.5", allw: "Site", flag: null as string | null },
    { n: "Odane Morgan", t: 5, reg: "80.0", ot: "4.0", allw: "Site · Lead hand", flag: null },
    { n: "Jodi-Ann Clarke", t: 4, reg: "72.0", ot: "0.0", allw: "Site", flag: "1 day leave · confirm" },
    { n: "Rohan Thompson", t: 5, reg: "80.0", ot: "11.5", allw: "Site · Welding", flag: "Overtime above 10 h" },
  ];
  const open = rows.filter((r) => r.flag && !resolved.includes(r.n)).length;
  return (
    <AppFrame active="payroll" crumbs={[identity?.name ?? "Meridian", "Payroll prep", "Period 11–24 Nov"]} className={className} identity={identity}>
      <ol className="grid grid-cols-2 gap-1.5 @3xl:grid-cols-4" aria-label="Payroll preparation stages">
        {steps.map((s, i) => (
          <li key={s} aria-current={i === done ? "step" : undefined} className={cn("ui-sm flex items-center gap-2 rounded-md px-2.5 py-2 transition-colors", i < done ? "bg-ok-bg text-ok" : i === done ? "bg-white font-medium text-n-900 shadow-[0_0_0_1px_var(--brand-300)]" : "bg-white text-n-500 shadow-[0_0_0_1px_var(--n-150)]")}>
            <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold", i < done ? "bg-ok text-white" : i === done ? "bg-brand-600 text-white" : "bg-n-150 text-n-500")}>
              {i < done ? <Check className="size-2.5" aria-hidden="true" strokeWidth={3} /> : i + 1}
            </span>
            <span className="truncate">{s}</span>
          </li>
        ))}
      </ol>
      <div className="mt-2.5 grid gap-2.5 @4xl:grid-cols-[1.6fr_1fr]">
        <Panel title={crewLabel} meta="Approved hours only" bodyClass="pt-2.5 pb-0">
          <Table head={["Employee", <span key="r" className="hidden @lg:inline">Regular</span>, "Overtime", <span key="a" className="hidden @xl:inline">Allowances</span>, "Check"]}>
            {rows.map((r) => (
              <tr key={r.n}>
                <td><span className="flex items-center gap-2"><Avatar name={r.n} tone={r.t} size={22} /><span className="truncate font-medium text-n-900">{r.n}</span></span></td>
                <td className="hidden tabular-nums @lg:table-cell">{r.reg}</td>
                <td className="tabular-nums">{r.ot}</td>
                <td className="hidden text-n-600 @xl:table-cell">{r.allw}</td>
                <td>
                  {r.flag && !resolved.includes(r.n) ? (
                    <button type="button" disabled={done !== 2} onClick={() => setResolved((x) => [...x, r.n])} title={r.flag} className="disabled:cursor-default">
                      <Tag tone="warn"><AlertTriangle className="size-3" aria-hidden="true" />{done === 2 ? "Review" : "Variance"}</Tag>
                    </button>
                  ) : (
                    <Tag tone="ok"><Check className="size-3" aria-hidden="true" />OK</Tag>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        </Panel>
        <div className="space-y-2.5">
          <Panel title="Period summary">
            <dl className="ui-sm grid grid-cols-2 gap-y-1.5">
              <dt className="text-n-500">Employees</dt><dd className="text-right tabular-nums text-n-900">164</dd>
              <dt className="text-n-500">Approved hours</dt><dd className="text-right tabular-nums text-n-900">12,906</dd>
              <dt className="text-n-500">Overtime hours</dt><dd className="text-right tabular-nums text-n-900">741</dd>
              <dt className="text-n-500">Variances open</dt><dd className={cn("text-right tabular-nums", open ? "text-warn" : "text-ok")}>{open}</dd>
            </dl>
            <div className="mt-3">
              {done < 3 ? (
                <button type="button" disabled={open > 0} onClick={() => setDone(3)} className={cn(btnPrimary, "w-full justify-center disabled:opacity-45")}>
                  {open > 0 ? `Resolve ${open} variance${open > 1 ? "s" : ""} to continue` : "Approve and prepare schedule"}
                </button>
              ) : (
                <button type="button" onClick={() => { setDone(2); setResolved([]); }} className={cn(btnGhost, "w-full justify-center")}><RotateCcw className="size-3.5" aria-hidden="true" />Restart demo</button>
              )}
            </div>
          </Panel>
          <div className={cn("ui-sm rounded-[10px] border border-dashed px-3 py-2.5 transition-colors", done === 3 ? "border-ok bg-ok-bg/60 text-n-700" : "border-n-200 text-n-600")}>
            <p className="flex items-center gap-1.5 font-medium text-n-800"><Upload className="size-3.5" aria-hidden="true" />{done === 3 ? "Schedule ready for your payroll provider" : "Handoff to payroll provider"}</p>
            <p className="ui-xs mt-1">Your payroll provider runs payroll and pays employees. Axtara prepares the approved information and does not hold funds or transfer wages.</p>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ══════════════ Workforce — filter people, open a profile ══════════════ */

export function WorkforceDemo({ className }: { className?: string }) {
  const [filter, setFilter] = useState<"all" | "direct" | "sub">("all");
  const [open, setOpen] = useState<string | null>(null);
  const people = useMemo(() => demoPeople.filter((p) => p.trade).map((p, i) => ({ ...p, sub: i % 3 === 2, cert: i === 3 ? "12 days" : i === 5 ? "Expired" : "Valid" })), []);
  const shown = people.filter((p) => filter === "all" || (filter === "sub" ? p.sub : !p.sub)).slice(0, 7);
  const person = people.find((p) => p.id === open);
  const certTag = (c: string) => (c === "Expired" ? <Tag tone="bad">Expired</Tag> : c === "Valid" ? <Tag tone="ok">Valid</Tag> : <Tag tone="warn">{c}</Tag>);
  return (
    <AppFrame active="workforce" crumbs={["Meridian", "Workforce", person ? person.name : "People"]} className={className}>
      {!person ? (
        <>
          <div role="tablist" aria-label="Workforce filter" className="flex flex-wrap items-center gap-1.5">
            {([["all", "All people · 412"], ["direct", "Direct · 318"], ["sub", "Subcontracted · 94"]] as const).map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={filter === k} onClick={() => setFilter(k)} className={cn("ui-sm rounded-md px-2 py-1", filter === k ? "bg-white font-medium text-n-900 shadow-[0_0_0_1px_var(--n-200)]" : "text-n-500 hover:text-n-900")}>{l}</button>
            ))}
          </div>
          <div className="mt-2.5 grid gap-2.5 @4xl:grid-cols-[1.6fr_1fr]">
            <Panel bodyClass="pt-1 pb-1">
              <ul className="divide-y divide-n-100">
                {shown.map((p) => (
                  <li key={p.id} className="-mx-3.5">
                    <button type="button" onClick={() => setOpen(p.id)} className={cn(rowBtn, "flex items-center gap-2.5 px-3.5 py-2")}>
                      <Avatar name={p.name} tone={p.tone} size={24} />
                      <span className="min-w-0 flex-1">
                        <span className="ui-md block truncate font-medium text-n-900">{p.name}</span>
                        <span className="ui-xs block truncate text-n-500">{p.role} · {p.crew}{p.sub ? " · Subcontracted" : ""}</span>
                      </span>
                      <span className="ui-sm hidden text-n-600 @xl:inline">{demoProjects.find((x) => x.id === p.project)?.short}</span>
                      {certTag(p.cert)}
                      <ChevronRight className="size-3.5 text-n-300" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Deployed today" meta="By project" className="hidden @4xl:block">
              {demoProjects.map((p) => (
                <div key={p.id} className="ui-sm mb-2.5 last:mb-0">
                  <div className="flex justify-between text-n-700"><span>{p.short}</span><span className="tabular-nums text-n-500">{p.onSite}/{p.planned}</span></div>
                  <Meter value={(p.onSite / p.planned) * 100} className="mt-1" label={`${p.short}: ${p.onSite} of ${p.planned} on site`} />
                </div>
              ))}
            </Panel>
          </div>
        </>
      ) : (
        <div className="anim-fade">
          <button type="button" onClick={() => setOpen(null)} className="ui-sm inline-flex items-center gap-1 text-brand-700 hover:underline"><ArrowLeft className="size-3.5" aria-hidden="true" />All people</button>
          <div className="mt-2.5 grid gap-2.5 @3xl:grid-cols-[1fr_1fr]">
            <Panel>
              <div className="flex items-center gap-3">
                <Avatar name={person.name} tone={person.tone} size={40} />
                <div>
                  <p className="text-[15px] font-semibold text-n-950">{person.name}</p>
                  <p className="ui-sm text-n-500">{person.role} · {person.trade}</p>
                </div>
              </div>
              <dl className="ui-sm mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                <dt className="text-n-500">Assignment</dt><dd className="text-n-900">{demoProjects.find((x) => x.id === person.project)?.short} · {person.crew}</dd>
                <dt className="text-n-500">Employment</dt><dd className="text-n-900">{person.sub ? "Subcontracted" : "Direct"}</dd>
                <dt className="text-n-500">This week</dt><dd className="text-n-900">38.5 h approved · 1 shift scheduled</dd>
                <dt className="text-n-500">Status</dt><dd><StatusPill status="On Site" /></dd>
              </dl>
            </Panel>
            <Panel title="Documents and certifications">
              <ul className="ui-sm space-y-1.5">
                <li className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-n-800"><FileText className="size-3.5 text-n-400" aria-hidden="true" />Identification</span><Tag tone="ok">Verified</Tag></li>
                <li className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-n-800"><FileText className="size-3.5 text-n-400" aria-hidden="true" />{person.trade} certificate</span>{certTag(person.cert)}</li>
                <li className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-n-800"><FileText className="size-3.5 text-n-400" aria-hidden="true" />Site induction</span><Tag tone="ok">Completed</Tag></li>
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </AppFrame>
  );
}

/* ══════════════ Compliance — certifications, credentials, incidents ══════════════ */

export function ComplianceDemo({ className }: { className?: string }) {
  const [tab, setTab] = useState<"certs" | "company" | "incidents">("certs");
  const [renewed, setRenewed] = useState<string[]>([]);
  const certs = [
    { n: "Rohan Thompson", t: 5, c: "Welding certificate", d: "Expired 2 Nov", tone: "bad" as const },
    { n: "Tunde Adeyemi", t: 0, c: "Excavator operator licence", d: "In 12 days", tone: "warn" as const },
    { n: "Devon Fraser", t: 1, c: "Electrical licence", d: "In 21 days", tone: "warn" as const },
    { n: "Odane Morgan", t: 5, c: "Working at height", d: "In 27 days", tone: "neutral" as const },
  ];
  return (
    <AppFrame active="compliance" crumbs={["Meridian", "Compliance"]} className={className}>
      <div className="grid grid-cols-2 gap-2.5 @3xl:grid-cols-4">
        <Kpi label="Certifications expiring" value={9 - renewed.length} sub="Next 30 days" tone="warn" />
        <Kpi label="Open incidents" value="2" sub="1 near miss · 1 minor" tone="bad" />
        <div className="hidden @3xl:block"><Kpi label="Company credentials" value="14" sub="All current" tone="ok" /></div>
        <div className="hidden @3xl:block"><Kpi label="Documents verified" value="1,126" sub="Across 412 people" /></div>
      </div>
      <div role="tablist" aria-label="Compliance records" className="mt-2.5 flex gap-1">
        {([["certs", "Certifications"], ["company", "Company credentials"], ["incidents", "Incidents"]] as const).map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("ui-sm rounded-md px-2.5 py-1.5 font-medium", tab === k ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-200)]" : "text-n-500 hover:text-n-900")}>{l}</button>
        ))}
      </div>
      <div key={tab} className="anim-fade mt-2.5">
        {tab === "certs" && (
          <Panel title="Expiring in the next 30 days" bodyClass="pt-1 pb-1">
            <ul className="divide-y divide-n-100">
              {certs.map((r) => (
                <li key={r.n} className="-mx-3.5 flex items-center gap-2.5 px-3.5 py-2">
                  <Avatar name={r.n} tone={r.t} size={22} />
                  <div className="min-w-0 flex-1"><p className="ui-md truncate font-medium text-n-900">{r.n}</p><p className="ui-xs truncate text-n-500">{r.c}</p></div>
                  {renewed.includes(r.n) ? <Tag tone="ok"><Check className="size-3" aria-hidden="true" />Renewal requested</Tag> : (
                    <>
                      <Tag tone={r.tone}>{r.d}</Tag>
                      <button type="button" onClick={() => setRenewed((x) => [...x, r.n])} className={cn(btnGhost, "hidden @xl:inline-flex")}>Request renewal</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {tab === "company" && (
          <Panel title="Company credentials" bodyClass="pt-1 pb-1">
            <ul className="divide-y divide-n-100">
              {[["Public liability insurance", "Renews 30 Jun"], ["Contractor registration", "Renews 14 Mar"], ["Workers' compensation cover", "Renews 1 Apr"], ["Tax compliance certificate", "Renews 31 Jan"]].map(([n, d]) => (
                <li key={n} className="-mx-3.5 flex items-center justify-between gap-2 px-3.5 py-2"><span className="ui-md flex items-center gap-1.5 text-n-900"><FileText className="size-3.5 text-n-400" aria-hidden="true" />{n}</span><span className="ui-sm text-n-500">{d}</span></li>
              ))}
            </ul>
          </Panel>
        )}
        {tab === "incidents" && (
          <Panel title="Near miss at Block B hoist" meta="INC-0042">
            <dl className="ui-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              <dt className="text-n-500">Reported</dt><dd className="text-n-900">Rohan Thompson · 13:12</dd>
              <dt className="text-n-500">Site</dt><dd className="text-n-900">Harbour Point · Block B</dd>
              <dt className="text-n-500">Severity</dt><dd><Tag tone="warn">Near miss</Tag></dd>
            </dl>
            <ul className="ui-sm mt-2.5 space-y-1.5 text-n-700">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" />Hoist gate interlock checked · Shanice Brown</li>
              <li className="flex gap-2"><ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-warn" aria-hidden="true" />Toolbox talk for Crew S1 · due Thursday</li>
            </ul>
          </Panel>
        )}
      </div>
    </AppFrame>
  );
}

/* ══════════════ Reporting — executive view with selectable project ══════════════ */

export function ReportingDemo({ className }: { className?: string }) {
  const [focus, setFocus] = useState<string | null>(null);
  const exceptions = [
    { text: "Overtime above plan", project: "HPC", tone: "warn" },
    { text: "Weather delay · 2 days", project: "CHR", tone: "warn" },
    { text: "Certification expired", project: "HPC", tone: "bad" },
    { text: "Near miss · reversing plant", project: "RIP", tone: "bad" },
  ];
  const shown = exceptions.filter((e) => !focus || e.project === focus);
  return (
    <AppFrame active="reporting" crumbs={["Meridian", "Reports", "Operations summary"]} className={className}>
      <div className="grid gap-2.5 @4xl:grid-cols-[1.3fr_1fr]">
        <Panel title="Portfolio · week 47" meta={focus ? <button type="button" onClick={() => setFocus(null)} className="text-brand-700 hover:underline">Show all</button> : "Select a project"} bodyClass="pt-1 pb-1">
          <ul className="divide-y divide-n-100">
            {demoProjects.map((p) => (
              <li key={p.id} className="-mx-3.5">
                <button type="button" aria-pressed={focus === p.id} onClick={() => setFocus(focus === p.id ? null : p.id)} className={cn(rowBtn, "grid grid-cols-[1fr_auto] items-center gap-3 px-3.5 py-2.5 @2xl:grid-cols-[1fr_120px_70px_auto]", focus === p.id && "bg-brand-50/60")}>
                  <span className="min-w-0"><span className="ui-md block truncate font-medium text-n-900">{p.short}</span><span className="ui-xs block text-n-500">{p.location}</span></span>
                  <span className="hidden items-center gap-2 @2xl:flex"><Meter value={p.progress} label={`${p.progress}% complete`} /><span className="ui-sm tabular-nums text-n-600">{p.progress}%</span></span>
                  <span className="ui-sm hidden tabular-nums text-n-600 @2xl:inline">{p.labourBudgetUsed}% lab.</span>
                  {p.health === "At risk" ? <Tag tone="warn"><AlertTriangle className="size-3" aria-hidden="true" />At risk</Tag> : <Tag tone="ok"><CheckCircle2 className="size-3" aria-hidden="true" />On track</Tag>}
                </button>
              </li>
            ))}
          </ul>
        </Panel>
        <div className="space-y-2.5">
          <Panel title="Attendance rate" meta="Last 8 weeks" className="hidden @2xl:block">
            <LineChart ariaLabel="Attendance rate rising from 89 to 95 percent over eight weeks" series={[{ name: "Rate", tone: "brand", values: [89, 90, 90.5, 92, 91.4, 93.2, 94, 95] }]} height={70} labels={["W40", "W47"]} />
          </Panel>
          <Panel title="Exceptions" meta={`${shown.length} open`} bodyClass="space-y-1.5">
            {shown.map((e) => (
              <p key={e.text} className="ui-sm flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 text-n-800"><AlertTriangle className={cn("size-3.5 shrink-0", e.tone === "bad" ? "text-bad" : "text-warn")} aria-hidden="true" /><span className="truncate">{e.text}</span></span>
                <span className="ui-xs shrink-0 text-n-500">{demoProjects.find((p) => p.id === e.project)?.short}</span>
              </p>
            ))}
          </Panel>
        </div>
      </div>
    </AppFrame>
  );
}



/* ══════════════ Mobile: Axtara Field clock-in and supervisor approval ══════════════ */


export function ClockInPhone({ className, content, label = "Axtara Field: Kemar Williams clocks in at Harbour Point" }: { className?: string; content?: ClockInContent; label?: string }) {
  const [stage, setStage] = useState<ClockStage>(0);
  useEffect(() => {
    if (stage !== 1) return;
    const t = window.setTimeout(() => setStage(2), 1100);
    return () => window.clearTimeout(t);
  }, [stage]);
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <PhoneFrame interactive label={label} className="w-[240px]">
        <MobileClockIn stage={stage} title="Axtara Field" onClockIn={() => setStage(1)} content={content} />
      </PhoneFrame>
      <p className="ui-sm flex h-7 items-center gap-2 text-n-600" aria-live="polite">
        {stage === 0 && "Try it: tap Clock in"}
        {stage === 1 && "Checking location against the site boundary…"}
        {stage === 2 && (
          <>
            <CheckCircle2 className="size-4 text-ok" aria-hidden="true" />Recorded and sent for review
            <button type="button" onClick={() => setStage(0)} className="ml-1 inline-flex items-center gap-1 text-brand-700 hover:underline"><RotateCcw className="size-3" aria-hidden="true" />Reset</button>
          </>
        )}
      </p>
    </div>
  );
}

export function ApprovalsPhone({ className }: { className?: string }) {
  const [approved, setApproved] = useState(false);
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <PhoneFrame interactive label="Axtara Field supervisor view: attendance approvals" className="w-[240px]">
        <MobileApprovals approved={approved} onApprove={() => setApproved(true)} />
      </PhoneFrame>
      <p className="ui-sm flex h-7 items-center gap-2 text-n-600" aria-live="polite">
        {approved ? (
          <>
            <CheckCircle2 className="size-4 text-ok" aria-hidden="true" />Approved by Shanice Brown
            <button type="button" onClick={() => setApproved(false)} className="ml-1 inline-flex items-center gap-1 text-brand-700 hover:underline"><RotateCcw className="size-3" aria-hidden="true" />Reset</button>
          </>
        ) : "Try it: approve Kemar's clock-in"}
      </p>
    </div>
  );
}
