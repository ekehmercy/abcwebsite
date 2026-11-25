import {
  AlertTriangle, Camera, Check, CheckCircle2, ChevronRight, Clock, FileText, HardHat, Loader2, MapPin, MessageSquare,
  Paperclip, Plane, Receipt, Send, ShieldCheck, Sun,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar, MobileHeader, MobileTabBar, StatusPill } from "./primitives";

const Row = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-xl bg-white px-3 py-2.5 shadow-[0_0_0_1px_var(--n-150)]", className)}>{children}</div>
);

/* ── Worker: clock-in flow (hero + journey) ── */
export type ClockStage = 0 | 1 | 2;

export function MobileClockIn({ stage = 2 }: { stage?: ClockStage }) {
  return (
    <>
      <MobileHeader title="Today" sub="Tue 18 Nov · Kemar Williams" />
      <div className="flex flex-1 flex-col gap-2 px-3">
        <Row>
          <p className="ui-xs font-medium uppercase tracking-[0.06em] text-n-500">Site assignment</p>
          <p className="ui-md mt-1 font-semibold text-n-900">Harbour Point · Block B</p>
          <p className="ui-sm text-n-600">Level 3 slab · Crew B2</p>
          <div className="ui-sm mt-2 flex items-center gap-3 text-n-600">
            <span className="flex items-center gap-1"><Clock className="size-3.5" aria-hidden="true" />07:00–16:00</span>
            <span className="flex items-center gap-1"><HardHat className="size-3.5" aria-hidden="true" />Rebar</span>
          </div>
        </Row>

        <div className="relative mt-1 flex h-[118px] items-center justify-center overflow-hidden rounded-xl bg-[#EEF1EC] shadow-[0_0_0_1px_var(--n-150)]">
          <svg viewBox="0 0 240 118" className="absolute inset-0 size-full" aria-hidden="true">
            <path d="M0 96 L240 74" stroke="#DCE1D8" strokeWidth="12" />
            <path d="M160 0 L176 118" stroke="#DCE1D8" strokeWidth="8" />
            <polygon points="58,18 150,12 160,86 66,98" fill="var(--brand-500)" fillOpacity={stage === 2 ? ".14" : ".08"} stroke="var(--brand-500)" strokeWidth="1.25" strokeDasharray="4 3" />
          </svg>
          <span className="relative flex size-4 items-center justify-center">
            {stage === 1 && <span className="absolute inset-0 rounded-full bg-brand-500" style={{ animation: "pulse-ring 1.4s ease-out infinite" }} />}
            <span className={cn("relative size-3.5 rounded-full ring-[3px] ring-white", stage === 2 ? "bg-ok" : "bg-brand-600")} />
          </span>
          <span className="ui-xs absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 font-medium text-n-700">Site boundary</span>
        </div>

        <div className="ui-sm flex min-h-[34px] items-center gap-2 px-1 text-n-600" aria-live="polite">
          {stage === 0 && (<><MapPin className="size-4 text-n-400" aria-hidden="true" />You are 40 m from the site entrance</>)}
          {stage === 1 && (<><Loader2 className="size-4 animate-spin text-brand-600" aria-hidden="true" />Checking your location…</>)}
          {stage === 2 && (<><CheckCircle2 className="size-4 text-ok" aria-hidden="true" /><span><span className="font-medium text-n-900">Clocked in 06:52</span> · inside site boundary</span></>)}
        </div>

        <div
          className={cn(
            "mt-auto mb-2 flex h-12 items-center justify-center gap-2 rounded-xl text-[15px] font-semibold transition-colors duration-300",
            stage === 2 ? "bg-n-100 text-n-700" : "bg-brand-600 text-white",
          )}
        >
          {stage === 2 ? "Clock out" : stage === 1 ? "Verifying…" : "Clock in"}
        </div>
      </div>
      <MobileTabBar active="home" />
    </>
  );
}

/* ── Supervisor: approvals ── */
export function MobileApprovals({ approved = false }: { approved?: boolean }) {
  const rows = [
    { n: "Kemar Williams", t: 0, time: "06:52", status: approved ? "Approved" : "Pending Review" },
    { n: "Odane Morgan", t: 5, time: "06:48", status: "Pending Review" },
    { n: "Jodi-Ann Clarke", t: 4, time: "06:55", status: "Pending Review" },
  ] as const;
  return (
    <>
      <MobileHeader title="Approvals" sub="Harbour Point · Shanice Brown" />
      <div className="flex gap-1.5 px-3 pb-2">
        <span className="ui-xs rounded-full bg-ink-900 px-2.5 py-1 font-medium text-white">Attendance · {approved ? 2 : 3}</span>
        <span className="ui-xs rounded-full bg-white px-2.5 py-1 font-medium text-n-600 shadow-[0_0_0_1px_var(--n-150)]">Expenses · 1</span>
        <span className="ui-xs rounded-full bg-white px-2.5 py-1 font-medium text-n-600 shadow-[0_0_0_1px_var(--n-150)]">Reports</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3">
        {rows.map((r, i) => (
          <Row key={r.n} className={cn(i === 0 && "shadow-[0_0_0_1.5px_var(--brand-300)]")}>
            <div className="flex items-center gap-2.5">
              <Avatar name={r.n} tone={r.t} size={28} />
              <div className="min-w-0 flex-1">
                <p className="ui-md truncate font-semibold text-n-900">{r.n}</p>
                <p className="ui-xs text-n-500">In {r.time} · Block B · inside boundary</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <StatusPill status={r.status} />
              {i === 0 && (
                <span className={cn("ui-xs flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors duration-300", approved ? "bg-ok-bg text-ok" : "bg-brand-600 text-white")}>
                  <Check className="size-3" aria-hidden="true" strokeWidth={3} />{approved ? "Done" : "Approve"}
                </span>
              )}
            </div>
          </Row>
        ))}
      </div>
      <MobileTabBar active="time" />
    </>
  );
}

/* ── Worker: schedule / assignments ── */
export function MobileSchedule() {
  const days = [
    { d: "Tue 18", site: "Harbour Point · Block B", t: "07:00–16:00", today: true },
    { d: "Wed 19", site: "Harbour Point · Block B", t: "07:00–16:00" },
    { d: "Thu 20", site: "Harbour Point · Slab pour", t: "05:30–15:00", note: "Early start" },
    { d: "Fri 21", site: "Harbour Point · Block B", t: "07:00–14:00" },
  ];
  return (
    <>
      <MobileHeader title="My shifts" sub="This week · Crew B2" />
      <div className="flex flex-1 flex-col gap-2 px-3">
        {days.map((x) => (
          <Row key={x.d} className={cn(x.today && "shadow-[0_0_0_1.5px_var(--brand-300)]")}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="ui-xs font-medium text-n-500">{x.d}{x.today && " · Today"}</p>
                <p className="ui-md font-semibold text-n-900">{x.site}</p>
                <p className="ui-sm text-n-600">{x.t}</p>
              </div>
              {x.note && <span className="ui-xs rounded bg-accent-100 px-1.5 py-0.5 font-medium text-accent-700">{x.note}</span>}
            </div>
          </Row>
        ))}
      </div>
      <MobileTabBar active="time" />
    </>
  );
}

/* ── Daily report ── */
export function MobileDailyReport() {
  return (
    <>
      <MobileHeader title="Daily report" sub="Block B · Level 3" back />
      <div className="flex flex-1 flex-col gap-2 px-3">
        <Row className="flex items-center gap-2"><Sun className="size-4 text-accent-600" aria-hidden="true" /><span className="ui-sm text-n-700">31°C · Clear · No weather delay</span></Row>
        <Row>
          <p className="ui-xs font-medium text-n-500">Work completed</p>
          <p className="ui-sm mt-1 text-n-800">Rebar fixed to grid lines C–F. Column formwork struck C3–C6.</p>
        </Row>
        <Row>
          <p className="ui-xs font-medium text-n-500">Photos · 4</p>
          <div className="mt-1.5 grid grid-cols-4 gap-1">
            {[0, 1, 2].map((i) => <span key={i} className="aspect-square rounded-md" style={{ background: ["#8d969b", "#a19a8d", "#7c858b"][i] }} />)}
            <span className="flex aspect-square items-center justify-center rounded-md bg-n-100"><Camera className="size-4 text-n-500" aria-hidden="true" /></span>
          </div>
        </Row>
        <Row className="flex items-center gap-2"><AlertTriangle className="size-4 text-warn" aria-hidden="true" /><span className="ui-sm text-n-700">1 delay · Y12 bar short</span></Row>
        <div className="mt-auto mb-2 flex h-11 items-center justify-center rounded-xl bg-brand-600 text-[14px] font-semibold text-white">Submit for review</div>
      </div>
    </>
  );
}

/* ── Expense ── */
export function MobileExpense() {
  return (
    <>
      <MobileHeader title="New expense" back />
      <div className="flex flex-1 flex-col gap-2 px-3">
        <div className="flex h-[112px] items-center justify-center rounded-xl bg-n-100 shadow-[0_0_0_1px_var(--n-150)]">
          <div className="flex h-[92px] w-[64px] flex-col gap-1 rounded bg-white p-1.5 shadow-sm">
            <span className="h-1 w-8 rounded bg-n-300" /><span className="h-1 w-6 rounded bg-n-200" /><span className="mt-1 h-1 w-10 rounded bg-n-200" /><span className="h-1 w-9 rounded bg-n-200" /><span className="mt-auto h-1.5 w-6 self-end rounded bg-n-400" />
          </div>
        </div>
        {[
          ["Amount", "J$14,850"],
          ["Category", "Site materials"],
          ["Project", "Harbour Point"],
          ["Cost code", "03-200 · Structural"],
        ].map(([k, v]) => (
          <div key={k} className="ui-sm flex justify-between border-b border-n-150 px-1 py-1.5"><span className="text-n-500">{k}</span><span className="font-medium text-n-900">{v}</span></div>
        ))}
        <div className="mt-auto mb-2 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-brand-600 text-[14px] font-semibold text-white"><Receipt className="size-4" aria-hidden="true" />Submit expense</div>
      </div>
    </>
  );
}

/* ── Incident ── */
export function MobileIncident() {
  return (
    <>
      <MobileHeader title="Report incident" back />
      <div className="flex flex-1 flex-col gap-2 px-3">
        <div className="grid grid-cols-2 gap-1.5">
          {["Near miss", "Injury", "Damage", "Hazard"].map((t, i) => (
            <span key={t} className={cn("ui-sm rounded-lg px-2 py-2 text-center font-medium", i === 0 ? "bg-bad-bg text-bad shadow-[0_0_0_1.5px_var(--st-danger)]" : "bg-white text-n-700 shadow-[0_0_0_1px_var(--n-150)]")}>{t}</span>
          ))}
        </div>
        <Row><p className="ui-xs text-n-500">Location</p><p className="ui-sm flex items-center gap-1 font-medium text-n-900"><MapPin className="size-3.5" aria-hidden="true" />Block B · hoist</p></Row>
        <Row><p className="ui-xs text-n-500">What happened?</p><p className="ui-sm text-n-800">Hoist gate opened while platform was between floors.</p></Row>
        <Row className="flex items-center gap-2"><Camera className="size-4 text-n-500" aria-hidden="true" /><span className="ui-sm text-n-700">2 photos attached</span></Row>
        <div className="mt-auto mb-2 flex h-11 items-center justify-center rounded-xl bg-bad text-[14px] font-semibold text-white">Send to supervisor</div>
      </div>
    </>
  );
}

/* ── Leave ── */
export function MobileLeave() {
  return (
    <>
      <MobileHeader title="Leave" sub="Balance · 9 days" />
      <div className="flex flex-1 flex-col gap-2 px-3">
        <Row>
          <p className="ui-xs font-medium text-n-500">Request</p>
          <p className="ui-md font-semibold text-n-900">Mon 1 – Wed 3 Dec</p>
          <p className="ui-sm text-n-600">Annual leave · 3 days</p>
          <div className="mt-2"><StatusPill status="Pending Review" /></div>
        </Row>
        <Row>
          <p className="ui-xs font-medium text-n-500">Previous</p>
          <p className="ui-sm font-medium text-n-900">Fri 3 Oct · Sick leave</p>
          <div className="mt-1.5"><StatusPill status="Approved" /></div>
        </Row>
        <div className="mt-auto mb-2 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-white text-[14px] font-semibold text-n-900 shadow-[0_0_0_1px_var(--n-200)]"><Plane className="size-4" aria-hidden="true" />New request</div>
      </div>
      <MobileTabBar active="me" />
    </>
  );
}

/* ── Documents ── */
export function MobileDocuments() {
  const docs = [
    { n: "National ID", s: "Verified", ok: true },
    { n: "Rebar fixing certificate", s: "Valid to Mar 2027", ok: true },
    { n: "Working at height", s: "Expires in 27 days", ok: false },
    { n: "Site induction · Harbour Point", s: "Completed 3 Sep", ok: true },
  ];
  return (
    <>
      <MobileHeader title="My documents" sub="Kemar Williams" />
      <div className="flex flex-1 flex-col gap-2 px-3">
        {docs.map((d) => (
          <Row key={d.n} className="flex items-center gap-2.5">
            <FileText className="size-4 shrink-0 text-n-500" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="ui-sm truncate font-medium text-n-900">{d.n}</p>
              <p className={cn("ui-xs", d.ok ? "text-n-500" : "text-warn")}>{d.s}</p>
            </div>
            {d.ok ? <ShieldCheck className="size-4 text-ok" aria-label="Valid" /> : <AlertTriangle className="size-4 text-warn" aria-label="Expiring" />}
          </Row>
        ))}
      </div>
      <MobileTabBar active="me" />
    </>
  );
}

/* ── Messages ── */
export function MobileMessages() {
  return (
    <>
      <MobileHeader title="Block B · Crew B2" sub="Shanice Brown, 11 others" back />
      <div className="flex flex-1 flex-col gap-2 px-3">
        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3 py-2 shadow-[0_0_0_1px_var(--n-150)]">
          <p className="ui-xs font-semibold text-n-900">Shanice Brown</p>
          <p className="ui-sm text-n-800">Slab pour moved to Thursday. Early start 05:30 — shifts updated.</p>
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-md bg-brand-600 px-3 py-2 text-white">
          <p className="ui-sm">Noted. Do we need extra vibrators on site?</p>
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3 py-2 shadow-[0_0_0_1px_var(--n-150)]">
          <p className="ui-xs font-semibold text-n-900">Shanice Brown</p>
          <p className="ui-sm text-n-800">Two arriving Wednesday. I&apos;ll confirm in the daily report.</p>
        </div>
        <div className="mt-auto mb-2 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_0_0_1px_var(--n-150)]">
          <Paperclip className="size-4 text-n-400" aria-hidden="true" /><span className="ui-sm flex-1 text-n-400">Message</span><Send className="size-4 text-brand-600" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}

/* ── Worker home with menu ── */
export function MobileHome() {
  const items = [
    { l: "Daily report", I: HardHat },
    { l: "Expenses", I: Receipt },
    { l: "Report incident", I: AlertTriangle },
    { l: "Messages", I: MessageSquare },
  ];
  return (
    <>
      <MobileHeader title="Good morning, Kemar" sub="Harbour Point · Block B" />
      <div className="flex flex-1 flex-col gap-2 px-3">
        <Row className="flex items-center gap-2.5 bg-ok-bg shadow-none">
          <CheckCircle2 className="size-5 text-ok" aria-hidden="true" />
          <div><p className="ui-md font-semibold text-n-900">On site since 06:52</p><p className="ui-xs text-n-600">3 h 18 m today</p></div>
        </Row>
        {items.map(({ l, I }) => (
          <Row key={l} className="flex items-center gap-2.5">
            <I className="size-4 text-n-500" aria-hidden="true" /><span className="ui-md flex-1 font-medium text-n-900">{l}</span><ChevronRight className="size-4 text-n-300" aria-hidden="true" />
          </Row>
        ))}
      </div>
      <MobileTabBar active="home" />
    </>
  );
}
