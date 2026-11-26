"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CheckCircle2, Clock, FileSpreadsheet, HardHat, Mail, MessageCircle, Receipt, StickyNote, Table2, Users } from "lucide-react";
import { cn } from "@/lib/cn";

type Item = {
  id: string;
  before: { icon: typeof Mail; label: string; render: () => React.ReactNode; rot: number; dx: number; dy: number };
  after: { icon: typeof Mail; label: string; render: () => React.ReactNode };
};

const Line = ({ w, dark }: { w: string; dark?: boolean }) => <span className={cn("block h-[5px] rounded-full", dark ? "bg-n-400/70" : "bg-n-200")} style={{ width: w }} />;

const items: Item[] = [
  {
    id: "attendance",
    before: {
      icon: StickyNote, label: "Paper sign-in sheet", rot: -4, dx: -6, dy: 10,
      render: () => (
        <div className="space-y-2 font-[cursive] text-[13px] italic text-n-700">
          {["K. Williams   6:50 – ?", "O. Morgan   6:4? – 3:00", "R. Thompson   7:30 – 3:30", "J. Clarke   — absent?"].map((l) => (
            <p key={l} className="border-b border-dashed border-n-300 pb-1">{l}</p>
          ))}
        </div>
      ),
    },
    after: {
      icon: Clock, label: "Verified attendance",
      render: () => (
        <ul className="ui-sm space-y-1.5">
          {[["Kemar Williams", "06:52"], ["Odane Morgan", "06:48"], ["Rohan Thompson", "07:31"]].map(([n, t]) => (
            <li key={n} className="flex items-center justify-between gap-2"><span className="truncate text-n-800">{n}</span><span className="flex items-center gap-1 tabular-nums text-n-500">{t}<CheckCircle2 className="size-3.5 text-ok" aria-hidden="true" /></span></li>
          ))}
        </ul>
      ),
    },
  },
  {
    id: "workforce",
    before: {
      icon: Table2, label: "crew_list_FINAL_v3.xlsx", rot: 3, dx: 8, dy: -4,
      render: () => (
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-sm bg-n-200 text-[11px]">
          {["Name", "Site", "Cert", "Kemar", "HP?", "✓", "Rohan", "HP", "exp?", "Ravi", "CH", "", "Devon", "—", "✓"].map((c, i) => (
            <span key={i} className={cn("truncate bg-white px-1.5 py-1", i < 3 ? "font-semibold text-n-700" : "text-n-600")}>{c || " "}</span>
          ))}
        </div>
      ),
    },
    after: {
      icon: Users, label: "One workforce record",
      render: () => (
        <div className="ui-sm space-y-1.5">
          <p className="flex justify-between"><span className="text-n-500">Crew B2</span><span className="text-n-800">12 people</span></p>
          <p className="flex justify-between"><span className="text-n-500">Site</span><span className="text-n-800">Harbour Point</span></p>
          <p className="flex justify-between"><span className="text-n-500">Certifications</span><span className="text-warn">1 expiring</span></p>
        </div>
      ),
    },
  },
  {
    id: "field",
    before: {
      icon: MessageCircle, label: "Site group chat", rot: -2, dx: 4, dy: 14,
      render: () => (
        <div className="space-y-1.5 text-[12.5px]">
          <p className="w-fit max-w-[90%] rounded-xl rounded-tl-sm bg-n-100 px-2.5 py-1.5 text-n-700">pour moved to thurs?? 🙏</p>
          <p className="ml-auto w-fit max-w-[90%] rounded-xl rounded-tr-sm bg-[#DCF3E4] px-2.5 py-1.5 text-n-700">who confirmed that</p>
          <p className="w-fit max-w-[90%] rounded-xl rounded-tl-sm bg-n-100 px-2.5 py-1.5 text-n-700">[photo] level 3 done</p>
        </div>
      ),
    },
    after: {
      icon: HardHat, label: "Daily report",
      render: () => (
        <div className="ui-sm space-y-1.5 text-n-700">
          <p className="flex gap-1.5"><Check className="mt-0.5 size-3.5 text-ok" aria-hidden="true" />Level 3 rebar complete</p>
          <p className="flex gap-1.5"><Clock className="mt-0.5 size-3.5 text-warn" aria-hidden="true" />Pour moved to Thu · bar delivery</p>
          <p className="text-n-500">3 photos · approved 16:02</p>
        </div>
      ),
    },
  },
  {
    id: "costs",
    before: {
      icon: Receipt, label: "Receipt, somewhere", rot: 5, dx: -10, dy: -8,
      render: () => (
        <div className="mx-auto w-[70%] space-y-1.5 rounded-sm bg-[#FFFDF7] p-2 shadow-[0_0_0_1px_var(--n-150)]">
          <Line w="60%" dark /><Line w="80%" /><Line w="70%" /><Line w="50%" /><p className="pt-1 text-right text-[11px] font-semibold text-n-600">14,850.00</p>
        </div>
      ),
    },
    after: {
      icon: Receipt, label: "Approved expense",
      render: () => (
        <div className="ui-sm space-y-1.5">
          <p className="flex justify-between"><span className="text-n-500">Amount</span><span className="tabular-nums text-n-800">J$14,850</span></p>
          <p className="flex justify-between"><span className="text-n-500">Cost code</span><span className="font-mono text-n-800">03-200</span></p>
          <p className="flex justify-between"><span className="text-n-500">Status</span><span className="text-ok">Approved</span></p>
        </div>
      ),
    },
  },
  {
    id: "approvals",
    before: {
      icon: Mail, label: "RE: RE: FW: hours wk 46", rot: -3, dx: 6, dy: 6,
      render: () => (
        <div className="space-y-1.5 text-[12.5px] text-n-600">
          <p><span className="font-semibold text-n-800">Andre:</span> can someone confirm Rohan&apos;s OT?</p>
          <p><span className="font-semibold text-n-800">Shanice:</span> think it was 11.5 not 15</p>
          <p className="text-n-400">— 14 more messages</p>
        </div>
      ),
    },
    after: {
      icon: CheckCircle2, label: "Recorded approval",
      render: () => (
        <div className="ui-sm space-y-1.5">
          <p className="text-n-800">Overtime 11.5 h · Rohan Thompson</p>
          <p className="text-n-500">Approved by Shanice Brown</p>
          <p className="text-n-500">Tue 18 Nov, 16:05</p>
        </div>
      ),
    },
  },
  {
    id: "payroll",
    before: {
      icon: FileSpreadsheet, label: "payroll_consolidated.xlsx", rot: 2, dx: -4, dy: 12,
      render: () => (
        <div className="space-y-1 text-[11.5px] text-n-600">
          <p className="font-mono">=SUM(B4:B61)+&apos;Site2&apos;!C9</p>
          <p className="font-mono text-bad">#REF!</p>
          <p className="font-mono">=VLOOKUP(A12,crew,4,0)</p>
        </div>
      ),
    },
    after: {
      icon: FileSpreadsheet, label: "Payroll preparation",
      render: () => (
        <div className="ui-sm space-y-1.5">
          <p className="flex justify-between"><span className="text-n-500">Approved hours</span><span className="tabular-nums text-n-800">12,906</span></p>
          <p className="flex justify-between"><span className="text-n-500">Variances</span><span className="text-warn">6 to review</span></p>
          <p className="flex justify-between"><span className="text-n-500">Handoff</span><span className="text-n-800">Ready</span></p>
        </div>
      ),
    },
  },
];

export function Fragmented() {
  const [connected, setConnected] = useState(false);
  const touched = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  // Connect automatically once, shortly after the section is in view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          window.setTimeout(() => {
            if (!touched.current) setConnected(true);
          }, 1800);
        }
      },
      { threshold: 0.45 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const choose = (v: boolean) => {
    touched.current = true;
    setConnected(v);
  };

  return (
    <div ref={ref}>
      <div className="flex justify-center">
        <div role="group" aria-label="Compare ways of working" className="inline-flex rounded-lg bg-n-100 p-1">
          {[
            [false, "How it works today"],
            [true, "With Axtara"],
          ].map(([v, l]) => (
            <button
              key={String(v)}
              type="button"
              aria-pressed={connected === v}
              onClick={() => choose(v as boolean)}
              className={cn(
                "h-9 rounded-md px-4 text-[14px] font-medium transition-[background-color,color,box-shadow] duration-200",
                connected === v ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-150),0_1px_2px_rgb(0_0_0/0.05)]" : "text-n-600 hover:text-n-900",
              )}
            >
              {l as string}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-10">
        {/* Connection spine, visible when connected */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-x-[8%] top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-brand-400 to-transparent transition-opacity duration-700 md:block",
            connected ? "opacity-100" : "opacity-0",
          )}
        />
        <ul className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {items.map((it, i) => {
            const face = connected ? it.after : it.before;
            return (
              <li
                key={it.id}
                className={cn(
                  "relative rounded-xl p-4 transition-[transform,background-color,box-shadow] duration-700 ease-out-soft",
                  connected ? "bg-white shadow-[0_0_0_1px_var(--n-150),var(--shadow-card)]" : "bg-n-50 shadow-[0_0_0_1px_var(--n-150)]",
                )}
                style={{
                  transform: connected ? "none" : `translate(${it.before.dx}px, ${it.before.dy}px) rotate(${it.before.rot}deg)`,
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <p className="flex items-center gap-2 text-[13px] font-medium text-n-700">
                  <span className={cn("flex size-6 items-center justify-center rounded-md transition-colors duration-500", connected ? "bg-brand-50 text-brand-700" : "bg-white text-n-500 shadow-[0_0_0_1px_var(--n-150)]")}>
                    <face.icon className="size-3.5" aria-hidden="true" />
                  </span>
                  {face.label}
                  {connected && <span className="ml-auto text-[11.5px] font-normal text-n-400">Step {i + 1}</span>}
                </p>
                <div key={String(connected)} className="anim-fade mt-3 min-h-[86px]">{face.render()}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <p className={cn("mx-auto mt-8 max-w-xl text-center text-[15px] text-n-600 transition-opacity duration-500")}>
        {connected
          ? "One record moves from the site to approval, to the project and into payroll preparation — with every step recorded."
          : "Six disconnected sources, re-keyed by hand every week. Each one is a chance to lose time, money or trust."}
      </p>
    </div>
  );
}
