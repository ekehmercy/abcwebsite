"use client";

/**
 * Scenes for the cross-company project tour. Each is a small, working piece of
 * the relevant Axtara application, using the shared demonstration data.
 */

import { useState } from "react";
import { Camera, Check, CheckCircle2, Clock, EyeOff, Eye, FileText, Lock, MapPin, RotateCcw, Send, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { demoCompanies, demoPartnerPeople } from "@/content/demo-data";
import { AppFrame, Avatar, Meter, Panel, PhoneFrame, Tag, MobileHeader, type AppIdentity } from "./primitives";
import { ClockInPhone } from "./interactive";

const btn = "ui-sm inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1.5 font-medium transition-colors";
const btnPrimary = cn(btn, "bg-brand-600 text-white hover:bg-brand-700");
const btnGhost = cn(btn, "text-n-700 shadow-[0_0_0_1px_var(--n-200)] hover:bg-n-50");

export const gcIdentity: AppIdentity = { initials: demoCompanies.gc.initials, name: demoCompanies.gc.short, app: "GC/Developer Web", variant: "gc" };
export const subIdentity: AppIdentity = { initials: demoCompanies.sub.initials, name: demoCompanies.sub.short, app: "Subcontractor Web", variant: "sub" };
export const ownerIdentity: AppIdentity = { initials: demoCompanies.developer.initials, name: demoCompanies.developer.short, app: "Owner view", variant: "gc" };

function Reset({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className={btnGhost}><RotateCcw className="size-3.5" aria-hidden="true" />Reset</button>;
}

/* 1 · Meridian invites Volt Line to package E2 */
export function InviteScene() {
  const [sent, setSent] = useState(false);
  const shared = ["E2 scope, drawings rev B and activity list", "RFIs and change requests on E2", "Daily reports and progress Volt Line submits on E2", "Inspection items assigned to E2"];
  const notShared = ["Meridian's other packages and partners", "Owner contract values and bid comparisons", "Volt Line's payroll, rates and other projects"];
  return (
    <AppFrame active="packages" crumbs={["Meridian", "Harbour Point", "Invite partner"]} identity={gcIdentity}>
      <div className="grid gap-2.5 @4xl:grid-cols-[1.2fr_1fr]">
        <Panel title="Invite to package E2 · Electrical rough-in, Block A" meta="Volt Line Electrical">
          <p className="ui-sm text-n-600">Invitee: <span className="font-medium text-n-900">{demoPartnerPeople.subOps.name}</span>, {demoPartnerPeople.subOps.role}</p>
          <p className="ui-xs mt-3 font-medium text-n-500">Shared within this package</p>
          <ul className="ui-sm mt-1 space-y-1">{shared.map((x) => <li key={x} className="flex gap-1.5 text-n-800"><Eye className="mt-0.5 size-3.5 shrink-0 text-brand-600" aria-hidden="true" />{x}</li>)}</ul>
          <p className="ui-xs mt-3 font-medium text-n-500">Never shared</p>
          <ul className="ui-sm mt-1 space-y-1">{notShared.map((x) => <li key={x} className="flex gap-1.5 text-n-600"><EyeOff className="mt-0.5 size-3.5 shrink-0 text-n-400" aria-hidden="true" />{x}</li>)}</ul>
        </Panel>
        <Panel title="Invitation">
          {sent ? (
            <div className="ui-sm space-y-2">
              <p className="flex items-center gap-1.5 text-ok"><CheckCircle2 className="size-3.5" aria-hidden="true" />Accepted by Paul Hylton · 09:42</p>
              <p className="text-n-600">Volt Line now sees package E2 in its own Subcontractor Web workspace, beside its other clients' work.</p>
              <Reset onClick={() => setSent(false)} />
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="ui-sm text-n-600">Volt Line doesn't need its own subscription to work in this package.</p>
              <button type="button" onClick={() => setSent(true)} className={cn(btnPrimary, "w-full justify-center")}><Send className="size-3.5" aria-hidden="true" />Send invitation</button>
            </div>
          )}
        </Panel>
      </div>
    </AppFrame>
  );
}

/* 2 · Volt Line responds to the bid invitation */
export function BidScene() {
  const [ack, setAck] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <AppFrame active="bids" crumbs={["Volt Line", "Bid invitations", "E2 · Harbour Point"]} identity={subIdentity}>
      <div className="grid gap-2.5 @4xl:grid-cols-[1.2fr_1fr]">
        <Panel title="E2 · Electrical rough-in, Block A" meta="From Meridian · closes Fri 23 Oct">
          <ul className="ui-sm space-y-1.5">
            <li className="flex items-center gap-1.5 text-n-800"><FileText className="size-3.5 text-n-400" aria-hidden="true" />Drawings E-200 to E-214, rev A</li>
            <li className="flex items-center gap-1.5 text-n-800"><FileText className="size-3.5 text-n-400" aria-hidden="true" />Specification section 26 05 00</li>
            <li className="flex items-center justify-between gap-2 text-n-800">
              <span className="flex items-center gap-1.5"><FileText className="size-3.5 text-n-400" aria-hidden="true" />Addendum 01 · revised riser layout</span>
              {ack ? <Tag tone="ok"><Check className="size-3" aria-hidden="true" />Acknowledged</Tag> : <button type="button" onClick={() => setAck(true)} className={btnGhost}>Acknowledge</button>}
            </li>
          </ul>
          <p className="ui-xs mt-3 flex gap-1.5 text-n-500"><Lock className="mt-px size-3 shrink-0" aria-hidden="true" />Your clarification questions stay private unless Meridian issues the answer as an addendum to every bidder.</p>
        </Panel>
        <Panel title="Your submission">
          <dl className="ui-sm grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <dt className="text-n-500">Price</dt><dd className="tabular-nums text-n-900">J$18,950,000</dd>
            <dt className="text-n-500">Exclusions</dt><dd className="text-n-900">Trenching outside the building line; light fitting supply</dd>
          </dl>
          <div className="mt-2.5">
            {submitted ? (
              <div className="ui-sm space-y-2">
                <p className="flex items-center gap-1.5 text-ok"><CheckCircle2 className="size-3.5" aria-hidden="true" />Submitted · visible to Meridian only</p>
                <Reset onClick={() => { setSubmitted(false); setAck(false); }} />
              </div>
            ) : (
              <button type="button" disabled={!ack} onClick={() => setSubmitted(true)} className={cn(btnPrimary, "w-full justify-center disabled:opacity-45")}>
                {ack ? "Submit price" : "Acknowledge addendum 01 first"}
              </button>
            )}
          </div>
        </Panel>
      </div>
    </AppFrame>
  );
}

/* 3 · Volt Line assigns a supervisor and crew from its own workforce */
const voltCrew = [
  { n: "Tanya Brown", r: "Supervisor", t: 1 },
  { n: "Ricardo Lewis", r: "Electrician", t: 0 },
  { n: "Kareem Bennett", r: "Electrician", t: 2 },
  { n: "Simone Watson", r: "Electrician", t: 3 },
  { n: "Jermaine Hall", r: "Apprentice", t: 4 },
  { n: "Omar Grant", r: "Labourer", t: 5 },
];

export function CrewScene() {
  const [picked, setPicked] = useState<string[]>(["Tanya Brown", "Ricardo Lewis"]);
  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[1fr_auto]">
      <AppFrame active="crews" crumbs={["Volt Line", "Crews", "Assign to E2"]} identity={subIdentity}>
        <Panel title="Assign crew to E2 · Harbour Point" meta={`${picked.length} selected`} bodyClass="pt-1 pb-1">
          <ul className="divide-y divide-n-100">
            {voltCrew.map((c) => (
              <li key={c.n} className="-mx-3.5">
                <label className="flex cursor-pointer items-center gap-2.5 px-3.5 py-2 hover:bg-n-25">
                  <input type="checkbox" checked={picked.includes(c.n)} onChange={() => toggle(c.n)} className="size-4 accent-[var(--brand-600)]" />
                  <Avatar name={c.n} tone={c.t} size={22} />
                  <span className="ui-md flex-1 text-n-900">{c.n}</span>
                  <span className="ui-sm text-n-500">{c.r}</span>
                </label>
              </li>
            ))}
          </ul>
        </Panel>
        <p className="ui-xs mt-2 flex gap-1.5 text-n-500"><Lock className="mt-px size-3 shrink-0" aria-hidden="true" />Meridian sees who is assigned to E2. Volt Line's rates and other projects stay in Volt Line's account.</p>
      </AppFrame>
      <PhoneFrame label="Ricardo Lewis's assignment in the Field app" className="mx-auto w-[232px]">
        <MobileHeader title="Axtara Field" sub="Ricardo Lewis · Volt Line" />
        <div className="flex flex-1 flex-col gap-2 px-3">
          <div className="rounded-xl bg-white px-3 py-2.5 shadow-[0_0_0_1px_var(--n-150)]">
            <p className="ui-xs font-medium uppercase tracking-[0.06em] text-n-500">New assignment</p>
            <p className="ui-md mt-1 font-semibold text-n-900">Harbour Point · Block A</p>
            <p className="ui-sm text-n-600">E2 electrical rough-in</p>
            <p className="ui-sm mt-1.5 flex items-center gap-1 text-n-600"><Clock className="size-3.5" aria-hidden="true" />Starts Mon 9 Nov · 07:00</p>
            <p className="ui-sm flex items-center gap-1 text-n-600"><Users className="size-3.5" aria-hidden="true" />Supervisor: Tanya Brown</p>
          </div>
          <div className="rounded-xl bg-white px-3 py-2.5 shadow-[0_0_0_1px_var(--n-150)]">
            <p className="ui-xs font-medium text-n-500">Site notice</p>
            <p className="ui-sm text-n-800">Induction at the Block A cabin before first shift.</p>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

/* 4 · The working day: worker clocks in, supervisor reports */
export function DayScene() {
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(45);
  return (
    <div className="flex flex-wrap items-start justify-center gap-6">
      <ClockInPhone
        label="Field app: Ricardo Lewis clocks in"
        content={{ worker: "Ricardo Lewis", site: "Harbour Point · Block A", detail: "E2 electrical rough-in · Level 3", hours: "07:00–16:00", trade: "Electrical", time: "06:58" }}
      />
      <div className="flex flex-col items-center gap-3">
        <PhoneFrame interactive label="Supervisor Field app: daily report for package E2" className="w-[240px]">
          <MobileHeader title="Daily report · E2" sub="Tanya Brown · Thu 19 Nov" />
          <div className="flex flex-1 flex-col gap-2 px-3">
            <div className="ui-sm flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-[0_0_0_1px_var(--n-150)]"><span className="text-n-600">Crew signed in</span><span className="font-medium text-n-900">6 of 6</span></div>
            <div className="rounded-xl bg-white px-3 py-2 shadow-[0_0_0_1px_var(--n-150)]">
              <label htmlFor="tour-progress" className="ui-xs flex justify-between text-n-500"><span>Level 3 conduit</span><span className="font-medium tabular-nums text-n-900">{progress}%</span></label>
              <input id="tour-progress" type="range" min={0} max={100} step={5} value={progress} onChange={(e) => setProgress(Number(e.target.value))} disabled={submitted} className="mt-1 w-full accent-[var(--brand-600)]" />
              <p className="ui-xs text-n-500">Progress is recorded separately from hours.</p>
            </div>
            <div className="ui-sm flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-[0_0_0_1px_var(--n-150)]"><Camera className="size-4 text-n-500" aria-hidden="true" />3 photos · conduit runs C3–C6</div>
            {submitted ? (
              <p className="ui-sm mt-auto mb-2 flex items-center justify-center gap-1.5 rounded-xl bg-ok-bg py-3 font-medium text-ok"><CheckCircle2 className="size-4" aria-hidden="true" />Sent to Meridian for review</p>
            ) : (
              <button type="button" onClick={() => setSubmitted(true)} className="mt-auto mb-2 flex h-11 items-center justify-center rounded-xl bg-brand-600 text-[14px] font-semibold text-white hover:bg-brand-700">Submit daily report</button>
            )}
          </div>
        </PhoneFrame>
        <p className="ui-sm flex h-7 items-center gap-2 text-n-600" aria-live="polite">
          {submitted ? <button type="button" onClick={() => setSubmitted(false)} className="inline-flex items-center gap-1 text-brand-700 hover:underline"><RotateCcw className="size-3" aria-hidden="true" />Reset</button> : "Try it: set progress, then submit"}
        </p>
      </div>
    </div>
  );
}

/* 6 · Owner view: what Seabreeze sees */
export function OwnerScene() {
  const [answered, setAnswered] = useState(false);
  return (
    <AppFrame active="home" crumbs={["Seabreeze", "Harbour Point", "Weekly update"]} identity={ownerIdentity}>
      <div className="grid gap-2.5 @4xl:grid-cols-[1.3fr_1fr]">
        <Panel title="Weekly update · week 47" meta="Published by Meridian · Fri 20 Nov">
          <div className="space-y-2.5">
            {[["Structure · Block A", 92], ["Building services · Block A", 58], ["Podium waterproofing", 34]].map(([l, v]) => (
              <div key={l as string}>
                <div className="ui-sm flex justify-between"><span className="text-n-800">{l}</span><span className="tabular-nums text-n-500">{v}%</span></div>
                <Meter value={v as number} className="mt-1" label={`${l} ${v}%`} />
              </div>
            ))}
          </div>
          <p className="ui-sm mt-3 text-n-700">E2 electrical rough-in on Level 3 progressing; conduit clash resolved by RFI-021. Pour for Block B Level 4 moved to Thursday.</p>
        </Panel>
        <div className="space-y-2.5">
          <Panel title="Decision for Seabreeze" meta="Due Tue 24 Nov">
            <p className="ui-md text-n-900">Confirm lobby floor finish selection (Option B or C)</p>
            <div className="mt-2.5">
              {answered ? (
                <p className="ui-sm flex items-center gap-1.5 text-ok"><CheckCircle2 className="size-3.5" aria-hidden="true" />Option B confirmed by Marcia Gayle</p>
              ) : (
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => setAnswered(true)} className={btnPrimary}>Choose option B</button>
                  <button type="button" onClick={() => setAnswered(true)} className={btnGhost}>Option C</button>
                </div>
              )}
            </div>
          </Panel>
          <p className="ui-xs flex gap-1.5 px-1 text-n-500"><Lock className="mt-px size-3 shrink-0" aria-hidden="true" />Seabreeze sees what Meridian has reviewed and published — not raw site entries, internal notes or any partner's payroll.</p>
        </div>
      </div>
    </AppFrame>
  );
}

/* Small "where it happened" pill used on the tour page */
export function SitePill({ children }: { children: React.ReactNode }) {
  return <span className="ui-sm inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-n-700 shadow-[0_0_0_1px_var(--n-150)]"><MapPin className="size-3" aria-hidden="true" />{children}</span>;
}
