"use client";

/**
 * Interactive demonstrations of Axtara's construction workflows:
 * work packages, bid invitations, technical RFIs, inspections and handover.
 * Client-side demonstration state only — nothing is sent anywhere.
 */

import { useState } from "react";
import { AlertTriangle, Bell, Camera, Check, CheckCircle2, CircleDot, FileText, Lock, MessageSquare, RotateCcw, Send, Upload } from "lucide-react";
import { cn } from "@/lib/cn";
import { demoBids, demoHandover, demoInspections, demoPackages, demoRfis } from "@/content/demo-data";
import { AppFrame, Meter, Panel, Tag } from "./primitives";

const btn = "ui-sm inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1.5 font-medium transition-colors";
const btnPrimary = cn(btn, "bg-brand-600 text-white hover:bg-brand-700");
const btnGhost = cn(btn, "text-n-700 shadow-[0_0_0_1px_var(--n-200)] hover:bg-n-50");
const rowBtn = "w-full text-left transition-colors hover:bg-n-25 focus-visible:bg-brand-50 focus-visible:outline-none";

function SubTabs<T extends string>({ value, onChange, items, label }: { value: T; onChange: (v: T) => void; items: [T, string][]; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
      {items.map(([k, l]) => (
        <button key={k} type="button" role="tab" aria-selected={value === k} onClick={() => onChange(k)}
          className={cn("ui-sm shrink-0 rounded-md px-2.5 py-1.5 font-medium", value === k ? "bg-white text-n-950 shadow-[0_0_0_1px_var(--n-200)]" : "text-n-500 hover:text-n-900")}>{l}</button>
      ))}
    </div>
  );
}

/* ══════════════ Packages, bids and RFIs ══════════════ */

export function RfisDemo({ className }: { className?: string }) {
  const [tab, setTab] = useState<"packages" | "bids" | "rfis">("rfis");
  const [rfis, setRfis] = useState(() => demoRfis.map((r) => ({ ...r })));
  const [sel, setSel] = useState("RFI-024");
  const [draft, setDraft] = useState("");
  const [reminded, setReminded] = useState(false);
  const [awarded, setAwarded] = useState<string | null>(null);
  const r = rfis.find((x) => x.id === sel)!;
  const open = rfis.filter((x) => x.status === "Open").length;

  const answer = () => {
    if (!draft.trim()) return;
    setRfis((xs) => xs.map((x) => (x.id === sel ? { ...x, status: "Answered" as const, answer: draft.trim() } : x)));
    setDraft("");
  };

  return (
    <AppFrame active={tab === "packages" ? "packages" : "rfis"} crumbs={["Meridian", "Harbour Point", tab === "packages" ? "Packages" : tab === "bids" ? "Bid B1" : "RFIs"]} className={className}>
      <SubTabs label="Project records" value={tab} onChange={setTab} items={[["packages", "Packages · 4"], ["bids", "Bid invitation B1"], ["rfis", `RFIs · ${open} open`]]} />
      <div key={tab} className="anim-fade mt-2.5">
        {tab === "packages" && (
          <Panel title="Harbour Point · packages" meta="Shared with each partner separately" bodyClass="pt-1 pb-1">
            <ul className="divide-y divide-n-100">
              {demoPackages.map((p) => (
                <li key={p.code} className="-mx-3.5 grid grid-cols-[44px_1fr_auto] items-center gap-2.5 px-3.5 py-2.5">
                  <span className="ui-sm flex h-7 items-center justify-center rounded-md bg-n-50 font-mono font-semibold text-n-700 shadow-[0_0_0_1px_var(--n-150)]">{p.code}</span>
                  <span className="min-w-0">
                    <span className="ui-md block truncate font-medium text-n-900">{p.name}</span>
                    <span className="ui-xs block truncate text-n-500">{p.partner} · {p.note}</span>
                  </span>
                  <Tag tone={p.kind === "Bid invitation" ? "warn" : "ok"}>{p.kind === "Bid invitation" ? p.status : "Active"}</Tag>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {tab === "bids" && (
          <div className="grid gap-2.5 @4xl:grid-cols-[1.5fr_1fr]">
            <Panel title="B1 · Block B masonry" meta="Closes Fri 20 Nov" bodyClass="pt-1 pb-1">
              <ul className="divide-y divide-n-100">
                {demoBids.map((b) => (
                  <li key={b.company} className="-mx-3.5 px-3.5 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="ui-md font-medium text-n-900">{b.company}</span>
                      <span className="ui-md tabular-nums text-n-900">{b.price}</span>
                    </div>
                    <p className="ui-xs mt-0.5 text-n-500">{b.revision} · Excludes: {b.exclusions.join(", ")}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {b.ackAddendum || reminded ? (
                        <Tag tone={b.ackAddendum ? "ok" : "neutral"}>{b.ackAddendum ? <><Check className="size-3" aria-hidden="true" />Addendum 01 acknowledged</> : <><Bell className="size-3" aria-hidden="true" />Reminder sent</>}</Tag>
                      ) : (
                        <>
                          <Tag tone="warn"><AlertTriangle className="size-3" aria-hidden="true" />Addendum 01 not acknowledged</Tag>
                          <button type="button" onClick={() => setReminded(true)} className={btnGhost}><Bell className="size-3.5" aria-hidden="true" />Remind</button>
                        </>
                      )}
                      {awarded === b.company && <Tag tone="ok"><CheckCircle2 className="size-3" aria-hidden="true" />Awarded · package W3 created</Tag>}
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
            <div className="space-y-2.5">
              <Panel title="Award">
                {awarded ? (
                  <div className="ui-sm space-y-2">
                    <p className="flex items-center gap-1.5 text-ok"><CheckCircle2 className="size-3.5" aria-hidden="true" />Awarded to {awarded}</p>
                    <p className="text-n-600">Scope, documents and activities carried into the new package.</p>
                    <button type="button" onClick={() => setAwarded(null)} className={btnGhost}><RotateCcw className="size-3.5" aria-hidden="true" />Reset demo</button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {demoBids.map((b) => (
                      <button key={b.company} type="button" onClick={() => setAwarded(b.company)} className={cn(btnGhost, "w-full justify-between")}>Award to {b.company}<Check className="size-3.5" aria-hidden="true" /></button>
                    ))}
                  </div>
                )}
              </Panel>
              <p className="ui-xs flex gap-1.5 px-1 text-n-500"><Lock className="mt-px size-3 shrink-0" aria-hidden="true" />Each bidder sees only its own submission. Prices are visible to Meridian alone.</p>
            </div>
          </div>
        )}

        {tab === "rfis" && (
          <div className="grid gap-2.5 @4xl:grid-cols-[1fr_1.15fr]">
            <Panel title="Technical RFIs" meta={`${open} open`} bodyClass="pt-1 pb-1">
              <ul className="divide-y divide-n-100">
                {rfis.map((x) => (
                  <li key={x.id} className="-mx-3.5">
                    <button type="button" onClick={() => setSel(x.id)} aria-pressed={sel === x.id} className={cn(rowBtn, "px-3.5 py-2.5", sel === x.id && "bg-brand-50/60")}>
                      <span className="flex items-center justify-between gap-2">
                        <span className="ui-sm font-mono font-semibold text-n-700">{x.id} · {x.pkg}</span>
                        {x.status === "Answered" ? <Tag tone="ok"><Check className="size-3" aria-hidden="true" />Answered</Tag> : <Tag tone="warn"><CircleDot className="size-3" aria-hidden="true" />Due {x.due}</Tag>}
                      </span>
                      <span className="ui-md mt-0.5 block text-n-900">{x.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title={r.id} meta={`Package ${r.pkg}`}>
              <dl className="ui-sm grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                <dt className="text-n-500">Raised by</dt><dd className="text-n-900">{r.raisedBy} · {r.company}</dd>
                <dt className="text-n-500">Routed to</dt><dd className="text-n-900">{r.to}</dd>
                <dt className="text-n-500">Due</dt><dd className="text-n-900">{r.due}</dd>
                <dt className="text-n-500">Evidence</dt><dd className="flex items-center gap-1 text-n-900"><Camera className="size-3" aria-hidden="true" />2 photos · drawing E-201 rev B</dd>
              </dl>
              <p className="ui-md mt-2.5 font-medium text-n-900">{r.title}</p>
              {r.status === "Answered" ? (
                <div className="ui-sm mt-2 rounded-md bg-ok-bg/60 px-2.5 py-2 text-n-800">
                  <p className="flex items-center gap-1 font-medium text-ok"><CheckCircle2 className="size-3.5" aria-hidden="true" />Answer recorded</p>
                  <p className="mt-0.5">{r.answer}</p>
                </div>
              ) : (
                <div className="mt-2 space-y-1.5">
                  <label htmlFor="rfi-answer" className="ui-xs block text-n-500">Respond as {r.to}</label>
                  <textarea id="rfi-answer" value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="Type a technical response…"
                    className="ui-sm w-full resize-none rounded-md bg-white px-2.5 py-2 text-n-900 shadow-[0_0_0_1px_var(--n-200)] outline-none focus:shadow-[0_0_0_2px_var(--brand-400)]" />
                  <div className="flex gap-1.5">
                    <button type="button" onClick={answer} disabled={!draft.trim()} className={cn(btnPrimary, "disabled:opacity-40")}><Send className="size-3.5" aria-hidden="true" />Record answer</button>
                    <button type="button" onClick={() => setDraft("Upstand to be 150 mm above finished floor; see detail A-512 rev C.")} className={btnGhost}><MessageSquare className="size-3.5" aria-hidden="true" />Use example</button>
                  </div>
                </div>
              )}
              <p className="ui-xs mt-2.5 flex gap-1.5 text-n-500"><FileText className="mt-px size-3 shrink-0" aria-hidden="true" />An answer is a technical record. Change requests such as CR-004 are reviewed separately.</p>
            </Panel>
          </div>
        )}
      </div>
    </AppFrame>
  );
}

/* ══════════════ Inspections, corrective items and handover ══════════════ */

const photo = (i: number) => ["linear-gradient(160deg,#9aa3a8,#525a5f)", "linear-gradient(150deg,#b4bcc0,#6f787d)"][i % 2];

export function InspectionsDemo({ className }: { className?: string }) {
  const [tab, setTab] = useState<"items" | "handover">("items");
  const [items, setItems] = useState(() => demoInspections.items.map((x) => ({ ...x })));
  const [sel, setSel] = useState("CI-032");
  const [docs, setDocs] = useState(() => demoHandover.map((d) => ({ ...d, requested: false })));
  const [published, setPublished] = useState(false);
  const it = items.find((x) => x.id === sel)!;
  const setStatus = (status: (typeof items)[number]["status"]) => setItems((xs) => xs.map((x) => (x.id === sel ? { ...x, status } : x)));
  const received = docs.filter((d) => d.status === "Received").length;
  const readiness = Math.round((received / docs.length) * 100);
  const tone = (s: string) => (s === "Closed" ? "ok" : s === "Evidence submitted" ? "neutral" : "warn") as "ok" | "neutral" | "warn";

  return (
    <AppFrame active="inspections" crumbs={["Meridian", "Harbour Point", tab === "items" ? demoInspections.id : "Handover"]} className={className}>
      <SubTabs label="Inspection records" value={tab} onChange={setTab} items={[["items", "Corrective items"], ["handover", `Handover · ${readiness}% ready`]]} />
      <div key={tab} className="anim-fade mt-2.5">
        {tab === "items" ? (
          <div className="grid gap-2.5 @4xl:grid-cols-[1fr_1.1fr]">
            <Panel title={demoInspections.title} meta={demoInspections.date} bodyClass="pt-1 pb-1">
              <ul className="divide-y divide-n-100">
                {items.map((x) => (
                  <li key={x.id} className="-mx-3.5">
                    <button type="button" onClick={() => setSel(x.id)} aria-pressed={sel === x.id} className={cn(rowBtn, "px-3.5 py-2.5", sel === x.id && "bg-brand-50/60")}>
                      <span className="flex items-center justify-between gap-2">
                        <span className="ui-sm font-mono font-semibold text-n-700">{x.id} · {x.pkg}</span>
                        <Tag tone={tone(x.status)}>{x.status === "Closed" ? <Check className="size-3" aria-hidden="true" /> : null}{x.status}</Tag>
                      </span>
                      <span className="ui-md mt-0.5 block text-n-900">{x.text}</span>
                      <span className="ui-xs block text-n-500">{x.owner} · due {x.due}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title={it.id} meta={it.owner}>
              <p className="ui-md text-n-900">{it.text}</p>
              {it.status === "Open" ? (
                <p className="ui-sm mt-2 flex items-center gap-1.5 text-n-600"><AlertTriangle className="size-3.5 text-warn" aria-hidden="true" />Waiting for {it.owner.split(" ")[0]} {it.owner.split(" ")[1]} to submit closure evidence.</p>
              ) : (
                <>
                  <p className="ui-xs mt-2.5 text-n-500">Closure evidence · Tanya Brown, Supervisor</p>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {["Before · 18 Nov", "After · 19 Nov"].map((l, i) => (
                      <div key={l} className="relative aspect-[16/10] overflow-hidden rounded-md" style={{ background: photo(i) }} role="img" aria-label={`${l} photo`}>
                        <span className="ui-xs absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/45 px-1 py-px text-white"><Camera className="size-2.5" aria-hidden="true" />{l}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {it.status === "Evidence submitted" && (
                  <>
                    <button type="button" onClick={() => setStatus("Closed")} className={btnPrimary}><Check className="size-3.5" aria-hidden="true" />Accept closure</button>
                    <button type="button" onClick={() => setStatus("Open")} className={btnGhost}>Return with comment</button>
                  </>
                )}
                {it.status === "Open" && <button type="button" onClick={() => setStatus("Evidence submitted")} className={btnGhost}><Upload className="size-3.5" aria-hidden="true" />Show evidence arriving</button>}
                {it.status === "Closed" && <p className="ui-sm flex items-center gap-1 text-ok"><CheckCircle2 className="size-3.5" aria-hidden="true" />Closed and accepted by Andre Campbell</p>}
              </div>
            </Panel>
          </div>
        ) : (
          <div className="grid gap-2.5 @4xl:grid-cols-[1.4fr_1fr]">
            <Panel title="Handover documents" meta={`${received} of ${docs.length} received`} bodyClass="pt-1 pb-1">
              <ul className="divide-y divide-n-100">
                {docs.map((d, i) => (
                  <li key={d.item} className="-mx-3.5 flex items-center gap-2.5 px-3.5 py-2">
                    <span className="ui-xs w-8 shrink-0 font-mono font-semibold text-n-600">{d.pkg}</span>
                    <span className="ui-md min-w-0 flex-1 truncate text-n-900">{d.item}</span>
                    {d.status === "Received" ? (
                      <Tag tone="ok"><Check className="size-3" aria-hidden="true" />Received</Tag>
                    ) : d.requested ? (
                      <Tag tone="neutral"><Bell className="size-3" aria-hidden="true" />Requested</Tag>
                    ) : (
                      <button type="button" onClick={() => setDocs((xs) => xs.map((x, k) => (k === i ? { ...x, requested: true } : x)))} className={btnGhost}>Request</button>
                    )}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Readiness · Harbour Point">
              <div className="flex items-baseline justify-between"><span className="text-[22px] font-semibold tabular-nums text-n-950">{readiness}%</span><span className="ui-sm text-n-500">documents received</span></div>
              <Meter value={readiness} className="mt-2" label={`Handover readiness ${readiness}%`} />
              <ul className="ui-sm mt-3 space-y-1">
                {["E2", "W1", "W2"].map((p) => {
                  const ds = docs.filter((d) => d.pkg === p);
                  const ok = ds.every((d) => d.status === "Received");
                  return <li key={p} className="flex items-center justify-between"><span className="text-n-700">Package {p}</span>{ok ? <span className="flex items-center gap-1 text-ok"><Check className="size-3.5" aria-hidden="true" />Ready</span> : <span className="text-warn">{ds.filter((d) => d.status !== "Received").length} outstanding</span>}</li>;
                })}
              </ul>
              <div className="mt-3">
                {published ? (
                  <p className="ui-sm flex items-center gap-1.5 text-ok"><CheckCircle2 className="size-3.5" aria-hidden="true" />Published to Seabreeze Developments</p>
                ) : (
                  <button type="button" onClick={() => setPublished(true)} className={cn(btnPrimary, "w-full justify-center")}>Publish readiness to the developer</button>
                )}
              </div>
            </Panel>
          </div>
        )}
      </div>
    </AppFrame>
  );
}


