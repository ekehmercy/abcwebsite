import type { ReactNode } from "react";
import {
  BarChart3, Bell, Building2, CheckCircle2, Clock, FileSpreadsheet, HardHat, Home, Receipt, Search, ShieldCheck,
  Users, AlertTriangle, CircleDashed, CalendarClock, Info, ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { demoOrg, type DemoStatus } from "@/content/demo-data";

/* ───────────────────────── Avatar ───────────────────────── */

const tones = [
  "bg-[#E7EDFB] text-[#1E3CA3]",
  "bg-[#FBEFD9] text-[#8A560E]",
  "bg-[#E3F1EA] text-[#155E3B]",
  "bg-[#F1E7F6] text-[#6B3285]",
  "bg-[#E8EEF0] text-[#2E4F5C]",
  "bg-[#F7E6E2] text-[#8E3423]",
];

export function initials(name: string) {
  const parts = name.replace(/-/g, " ").split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export function Avatar({ name, tone = 0, size = 24, className }: { name: string; tone?: number; size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold", tones[tone % tones.length], className)}
      style={{ width: size, height: size, fontSize: Math.max(9, size * 0.38) }}
    >
      {initials(name)}
    </span>
  );
}

/* ───────────────────────── Status ───────────────────────── */

const statusStyle: Record<DemoStatus, { cls: string; Icon: typeof CheckCircle2 }> = {
  "On Site": { cls: "bg-info-bg text-info", Icon: HardHat },
  Approved: { cls: "bg-ok-bg text-ok", Icon: CheckCircle2 },
  "Pending Review": { cls: "bg-warn-bg text-warn", Icon: Clock },
  Exception: { cls: "bg-bad-bg text-bad", Icon: AlertTriangle },
  Completed: { cls: "bg-ok-bg text-ok", Icon: CheckCircle2 },
  Scheduled: { cls: "bg-n-100 text-n-600", Icon: CalendarClock },
  "Not Started": { cls: "bg-n-100 text-n-500", Icon: CircleDashed },
};

/** Status chip — icon + text so status never relies on colour alone. */
export function StatusPill({ status, className }: { status: DemoStatus; className?: string }) {
  const s = statusStyle[status];
  return (
    <span className={cn("ui-xs inline-flex items-center gap-1 whitespace-nowrap rounded-[5px] px-1.5 py-[3px] font-medium", s.cls, className)}>
      <s.Icon className="size-3" aria-hidden="true" strokeWidth={2} />
      {status}
    </span>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "warn" | "ok" | "bad" }) {
  const t = {
    neutral: "bg-n-100 text-n-600",
    brand: "bg-brand-50 text-brand-700",
    warn: "bg-warn-bg text-warn",
    ok: "bg-ok-bg text-ok",
    bad: "bg-bad-bg text-bad",
  }[tone];
  return <span className={cn("ui-xs inline-flex items-center gap-1 whitespace-nowrap rounded-[5px] px-1.5 py-[3px] font-medium", t)}>{children}</span>;
}

/* ───────────────────────── Layout pieces ───────────────────────── */

export function Panel({
  title,
  meta,
  children,
  className,
  bodyClass,
}: {
  title?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-[10px] bg-white shadow-[0_0_0_1px_var(--n-150),0_1px_2px_rgb(12_13_13/0.03)]", className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-n-100 px-3.5 py-2.5">
          <p className="ui-md truncate font-semibold text-n-900">{title}</p>
          {meta && <div className="ui-sm shrink-0 text-n-500">{meta}</div>}
        </header>
      )}
      <div className={cn("p-3.5", bodyClass)}>{children}</div>
    </section>
  );
}

export function Kpi({
  label,
  value,
  sub,
  tone = "neutral",
  highlight,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "neutral" | "warn" | "bad" | "ok";
  highlight?: boolean;
}) {
  const subTone = { neutral: "text-n-500", warn: "text-warn", bad: "text-bad", ok: "text-ok" }[tone];
  return (
    <div
      className={cn(
        "min-w-0 rounded-[10px] bg-white px-3.5 py-3 shadow-[0_0_0_1px_var(--n-150)] transition-shadow duration-500",
        highlight && "shadow-[0_0_0_1px_var(--brand-300),0_0_0_4px_var(--brand-50)]",
      )}
    >
      <p className="ui-sm truncate text-n-500">{label}</p>
      <p className="mt-1 text-[22px] font-semibold leading-7 tracking-[-0.02em] text-n-950 tabular-nums">{value}</p>
      {sub && <p className={cn("ui-xs mt-0.5 truncate", subTone)}>{sub}</p>}
    </div>
  );
}

export function Meter({ value, tone = "brand", className, label }: { value: number; tone?: "brand" | "warn" | "bad" | "ok" | "neutral"; className?: string; label?: string }) {
  const color = { brand: "bg-brand-500", warn: "bg-accent-500", bad: "bg-bad", ok: "bg-ok", neutral: "bg-n-400" }[tone];
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-n-100", className)}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${value}%`}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out-soft", color)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function Table({ head, children, className }: { head: ReactNode[]; children: ReactNode; className?: string }) {
  return (
    <div className="-mx-3.5 overflow-hidden">
      <table className={cn("ui-sm w-full border-collapse text-left", className)}>
        <thead>
          <tr className="text-n-500">
            {head.map((h, i) => (
              <th key={i} scope="col" className="whitespace-nowrap border-b border-n-100 px-3.5 pb-2 pt-0 font-medium first:pl-3.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-n-800 [&>tr:last-child>td]:border-b-0 [&_td]:border-b [&_td]:border-n-100 [&_td]:px-3.5 [&_td]:py-2">{children}</tbody>
      </table>
    </div>
  );
}

/* ───────────────────────── Charts (SVG, no dependency) ───────────────────────── */

export function Bars({
  data,
  height = 96,
  highlightLast,
  labels,
  ariaLabel,
}: {
  data: number[];
  height?: number;
  highlightLast?: boolean;
  labels?: string[];
  ariaLabel: string;
}) {
  const max = Math.max(...data) * 1.1;
  return (
    <figure aria-label={ariaLabel} role="img" className="w-full">
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((v, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-t-[3px] transition-[height] duration-700 ease-out-soft",
              highlightLast && i === data.length - 1 ? "bg-brand-500" : "bg-brand-200",
            )}
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
      {labels && (
        <div className="ui-xs mt-1.5 flex gap-1.5 text-n-400">
          {labels.map((l, i) => (
            <span key={i} className="flex-1 text-center">{l}</span>
          ))}
        </div>
      )}
    </figure>
  );
}

export function LineChart({
  series,
  height = 120,
  ariaLabel,
  labels,
}: {
  series: { values: number[]; tone: "brand" | "accent" | "neutral"; name: string }[];
  height?: number;
  ariaLabel: string;
  labels?: string[];
}) {
  const w = 320;
  const all = series.flatMap((s) => s.values);
  const min = Math.min(...all) * 0.96;
  const max = Math.max(...all) * 1.02;
  const n = series[0].values.length;
  const pt = (v: number, i: number) => [(i / (n - 1)) * w, height - ((v - min) / (max - min)) * (height - 8) - 4] as const;
  const stroke = { brand: "var(--brand-500)", accent: "var(--accent-500)", neutral: "var(--n-300)" };
  return (
    <figure role="img" aria-label={ariaLabel} className="w-full">
      <svg viewBox={`0 0 ${w} ${height}`} className="block h-auto w-full overflow-visible" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={w} y1={height * g} y2={height * g} stroke="var(--n-100)" strokeWidth="1" />
        ))}
        {series.map((s) => {
          const d = s.values.map((v, i) => `${i ? "L" : "M"}${pt(v, i).join(",")}`).join(" ");
          return (
            <g key={s.name}>
              {s.tone === "brand" && <path d={`${d} L${w},${height} L0,${height} Z`} fill="var(--brand-500)" opacity="0.07" />}
              <path d={d} fill="none" stroke={stroke[s.tone]} strokeWidth="1.75" strokeDasharray={s.tone === "neutral" ? "4 4" : undefined} vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
      </svg>
      {labels && (
        <div className="ui-xs mt-1.5 flex justify-between text-n-400">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </figure>
  );
}

/* ───────────────────────── App frame (desktop web app) ───────────────────────── */

export type AppSection = "home" | "workforce" | "attendance" | "field" | "projects" | "costs" | "payroll" | "compliance" | "reporting";

const nav: { id: AppSection; label: string; Icon: typeof Home; count?: number }[] = [
  { id: "home", label: "Overview", Icon: Home },
  { id: "workforce", label: "Workforce", Icon: Users },
  { id: "attendance", label: "Attendance", Icon: Clock, count: 7 },
  { id: "field", label: "Field reports", Icon: HardHat },
  { id: "projects", label: "Projects", Icon: Building2 },
  { id: "costs", label: "Expenses", Icon: Receipt, count: 4 },
  { id: "payroll", label: "Payroll prep", Icon: FileSpreadsheet },
  { id: "compliance", label: "Compliance", Icon: ShieldCheck },
  { id: "reporting", label: "Reports", Icon: BarChart3 },
];

/**
 * Desktop web-app chrome. Uses container queries: the sidebar collapses and
 * screens reflow when the frame is narrow (e.g. on phones), so text stays legible.
 */
export function AppFrame({
  active,
  crumbs,
  children,
  className,
  actions,
}: {
  active: AppSection;
  crumbs: string[];
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <div className={cn("@container overflow-hidden rounded-xl bg-n-25 text-left font-sans shadow-[0_0_0_1px_var(--n-200),var(--shadow-float)]", className)}>
      <div className="flex min-h-full">
        <aside className="hidden w-[188px] shrink-0 flex-col border-r border-n-150 bg-n-50/80 px-2.5 py-3 @3xl:flex">
          <div className="flex items-center gap-2 rounded-md px-1.5 py-1">
            <span className="flex size-6 items-center justify-center rounded-[6px] bg-ink-900 text-[10px] font-bold text-white">{demoOrg.initials}</span>
            <span className="ui-md min-w-0 flex-1 truncate font-semibold text-n-900">{demoOrg.short}</span>
            <ChevronsUpDown className="size-3.5 text-n-400" aria-hidden="true" />
          </div>
          <nav aria-label="Demo application navigation" className="mt-4 space-y-px">
            {nav.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "ui-md flex items-center gap-2 rounded-[6px] px-2 py-[5px]",
                  n.id === active ? "bg-white font-medium text-n-950 shadow-[0_0_0_1px_var(--n-150)]" : "text-n-600",
                )}
              >
                <n.Icon className={cn("size-[15px]", n.id === active ? "text-brand-600" : "text-n-400")} aria-hidden="true" />
                <span className="flex-1 truncate">{n.label}</span>
                {n.count && <span className="ui-xs rounded bg-n-150/70 px-1 text-n-600 tabular-nums">{n.count}</span>}
              </div>
            ))}
          </nav>
          <div className="mt-auto rounded-md border border-dashed border-n-200 px-2 py-2">
            <p className="ui-xs text-n-500">Sites active today</p>
            <p className="ui-md font-semibold text-n-900">4 of 5</p>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex h-11 items-center gap-3 border-b border-n-150 bg-white/70 px-3.5">
            <span className="flex size-6 items-center justify-center rounded-[6px] bg-ink-900 text-[10px] font-bold text-white @3xl:hidden">{demoOrg.initials}</span>
            <ol className="ui-md flex min-w-0 items-center gap-1.5 text-n-500">
              {crumbs.map((c, i) => (
                <li key={c} className={cn("flex min-w-0 items-center gap-1.5", i === crumbs.length - 1 && "font-medium text-n-900", i < crumbs.length - 1 && "hidden @lg:flex")}>
                  {i > 0 && <span aria-hidden="true" className="hidden text-n-300 @lg:inline">/</span>}
                  <span className="truncate">{c}</span>
                </li>
              ))}
            </ol>
            <div className="ml-auto flex items-center gap-2">
              {actions}
              <span className="ui-sm hidden items-center gap-1.5 rounded-md bg-n-50 px-2 py-1 text-n-400 shadow-[0_0_0_1px_var(--n-150)] @2xl:flex">
                <Search className="size-3.5" aria-hidden="true" /> Search <kbd className="ml-3 font-sans text-[10px]">⌘K</kbd>
              </span>
              <span className="relative">
                <Bell className="size-4 text-n-500" aria-hidden="true" />
                <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-accent-500" />
              </span>
              <Avatar name="Shanice Brown" tone={1} size={22} />
            </div>
          </div>
          <div className="p-3 @2xl:p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Phone frame ───────────────────────── */

export function PhoneFrame({
  children,
  className,
  time = "06:52",
  dark,
  label,
}: {
  children: ReactNode;
  className?: string;
  time?: string;
  dark?: boolean;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative aspect-[9/19.2] shrink-0 rounded-[42px] bg-[#111316] p-[9px] shadow-[var(--shadow-device),inset_0_0_0_1.5px_#2a2d33]",
        // Default width only when the caller does not set one (avoids conflicting width utilities).
        !/(^|\s)w-\[/.test(className ?? "") && "w-[260px]",
        className,
      )}
    >
      <div className={cn("relative flex h-full flex-col overflow-hidden rounded-[33px]", dark ? "bg-ink-900 text-white" : "bg-n-25 text-n-900")}>
        <div className="relative z-10 flex h-9 shrink-0 items-center justify-between px-6 pt-1 text-[11px] font-semibold tabular-nums">
          <span>{time}</span>
          <span aria-hidden="true" className="absolute left-1/2 top-2 h-[22px] w-[76px] -translate-x-1/2 rounded-full bg-[#0b0c0e]" />
          <span className="flex items-center gap-1" aria-hidden="true">
            <svg width="15" height="10" viewBox="0 0 15 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="1"/><rect x="4" y="4" width="3" height="6" rx="1"/><rect x="8" y="2" width="3" height="8" rx="1"/><rect x="12" y="0" width="3" height="10" rx="1" opacity=".35"/></svg>
            <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="0.5" y="0.5" width="18" height="9" rx="2.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="12" height="6" rx="1.5" fill="currentColor"/><rect x="19.5" y="3" width="1.5" height="4" rx=".75" fill="currentColor" opacity=".4"/></svg>
          </span>
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col" aria-hidden="true">{children}</div>
        <div aria-hidden="true" className={cn("mx-auto mb-1.5 mt-1 h-[4px] w-[96px] shrink-0 rounded-full", dark ? "bg-white/60" : "bg-n-900/80")} />
      </div>
    </div>
  );
}

export function MobileHeader({ title, sub, back }: { title: string; sub?: string; back?: boolean }) {
  return (
    <div className="shrink-0 px-4 pb-2 pt-1">
      {back && <p className="ui-sm mb-1 text-brand-600">‹ Back</p>}
      <p className="text-[17px] font-semibold leading-6 tracking-[-0.01em]">{title}</p>
      {sub && <p className="ui-sm text-n-500">{sub}</p>}
    </div>
  );
}

export function MobileTabBar({ active }: { active: "home" | "time" | "reports" | "me" }) {
  const items = [
    { id: "home", label: "Today", Icon: Home },
    { id: "time", label: "Time", Icon: Clock },
    { id: "reports", label: "Reports", Icon: HardHat },
    { id: "me", label: "Me", Icon: Users },
  ] as const;
  return (
    <div className="mt-auto grid shrink-0 grid-cols-4 border-t border-n-150 bg-white/90 px-2 pt-1.5">
      {items.map((i) => (
        <span key={i.id} className={cn("flex flex-col items-center gap-0.5 text-[10px] font-medium", i.id === active ? "text-brand-600" : "text-n-400")}>
          <i.Icon className="size-[18px]" aria-hidden="true" />
          {i.label}
        </span>
      ))}
    </div>
  );
}

export function IllustrativeNote({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <p className={cn("ui-sm flex items-center gap-1.5", dark ? "text-white/55" : "text-n-500", className)}>
      <Info className="size-3" aria-hidden="true" />
      Illustrative product demonstration · fictional data
    </p>
  );
}
