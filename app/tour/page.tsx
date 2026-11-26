import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { demoCompanies, demoPartnerPeople } from "@/content/demo-data";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { LinkButton, TextLink } from "@/components/ui/button";
import { Avatar, IllustrativeNote } from "@/components/product-demo/primitives";
import { PayrollDemo } from "@/components/product-demo/interactive";
import { RfisDemo } from "@/components/product-demo/interactive-construction";
import { BidScene, CrewScene, DayScene, InviteScene, OwnerScene, subIdentity } from "@/components/product-demo/tour-scenes";
import { Journey, type JourneyStep } from "@/components/marketing/journey";
import { FinalCta } from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "Product Tour — Follow one project across companies",
  description:
    "Follow an electrical package on a commercial development through Axtara: invitation, bid, crew assignment, the working day, an RFI from site, the owner's weekly update and payroll preparation — across the GC, subcontractor and developer.",
  path: "/tour",
});

const cast = [
  { company: demoCompanies.gc.name, role: "General contractor", person: demoPartnerPeople.gcAdmin.name, title: demoPartnerPeople.gcAdmin.role, app: "GC/Developer Web", tone: 2 },
  { company: demoCompanies.sub.name, role: "Electrical subcontractor", person: demoPartnerPeople.subOps.name, title: demoPartnerPeople.subOps.role, app: "Subcontractor Web", tone: 3 },
  { company: demoCompanies.sub.name, role: "On site", person: demoPartnerPeople.subSupervisor.name, title: demoPartnerPeople.subSupervisor.role, app: "Supervisor Field", tone: 1 },
  { company: demoCompanies.sub.name, role: "On site", person: demoPartnerPeople.subWorker.name, title: demoPartnerPeople.subWorker.role, app: "Field", tone: 0 },
  { company: demoCompanies.developer.name, role: "Developer", person: demoPartnerPeople.developer.name, title: demoPartnerPeople.developer.role, app: "Owner view", tone: 4 },
];

const steps: JourneyStep[] = [
  {
    title: "Invite the partner", actor: "Meridian · GC", person: "Andre Campbell, Project Manager", app: "GC/Developer Web",
    detail: "Meridian sets up package E2 — electrical rough-in for Block A — and invites Volt Line Electrical into it. Volt Line joins the package workspace whether or not it subscribes to Axtara itself.",
    note: "The invitation shares package E2 and nothing else. It gives Meridian no access to Volt Line's payroll, rates, other projects or other customers.",
  },
  {
    title: "Respond to the bid", actor: "Volt Line · subcontractor", person: "Paul Hylton, Operations Manager", app: "Subcontractor Web",
    detail: "Paul reviews the drawings, acknowledges addendum 01 and submits Volt Line's price with its exclusions — in Volt Line's own workspace, beside its other clients' work.",
    note: "Each bidder sees only its own submission. Volt Line's price is visible to Meridian, never to other bidders.",
  },
  {
    title: "Assign the crew", actor: "Volt Line · subcontractor", person: "Paul Hylton, Operations Manager", app: "Subcontractor Web + Field",
    detail: "After the award, Volt Line assigns Tanya Brown as supervisor and a crew from its own workforce. Ricardo sees his new assignment, start date and site notice in the Field app.",
    note: "Meridian sees who is responsible for E2. Crew records stay with Volt Line as the employer.",
  },
  {
    title: "Run the working day", actor: "Volt Line · on site", person: "Tanya Brown and Ricardo Lewis", app: "Field + Supervisor Field",
    detail: "Ricardo clocks in at 06:58. Tanya signs the crew in, records Level 3 conduit progress and submits the daily report for package E2 with photos.",
    note: "Meridian receives the daily report and progress for review. Crew time stays with Volt Line for its own payroll preparation.",
  },
  {
    title: "Answer a question from site", actor: "Meridian · GC", person: "Andre Campbell, Project Manager", app: "GC/Developer Web",
    detail: "Tanya's RFI-021 — a conduit route clashing with a Level 3 beam — is routed to the services engineer and answered with a revised sketch. Volt Line raises change request CR-004 as a separate record.",
    note: "An answered RFI is a technical record. It doesn't approve CR-004, which is reviewed on its own.",
  },
  {
    title: "Publish to the developer", actor: "Seabreeze · developer", person: "Marcia Gayle, Development Manager", app: "Owner view",
    detail: "Meridian reviews the week's reports and publishes an update to Seabreeze Developments, with a finish selection waiting on Marcia's decision.",
    note: "Seabreeze sees what Meridian has reviewed and published — not raw site entries, internal notes or any partner's payroll.",
  },
  {
    title: "Prepare payroll", actor: "Volt Line · subcontractor", person: "Paul Hylton, Operations Manager", app: "Subcontractor Web",
    detail: "Volt Line approves its own crew's hours for the period, clears the variances and prepares the payroll schedule for its payroll provider.",
    note: "Meridian reviewing Volt Line's site report doesn't approve Volt Line's payroll. Volt Line's payroll provider runs payroll.",
  },
];

const voltPayroll = [
  { n: "Tanya Brown", t: 1, reg: "80.0", ot: "4.0", allw: "Supervisor", flag: null },
  { n: "Ricardo Lewis", t: 0, reg: "80.0", ot: "6.0", allw: "Site", flag: null },
  { n: "Kareem Bennett", t: 2, reg: "72.0", ot: "0.0", allw: "Site", flag: "1 day unpaid leave · confirm" },
  { n: "Simone Watson", t: 3, reg: "80.0", ot: "11.0", allw: "Site", flag: "Overtime above 10 h" },
];

export default function TourPage() {
  const visuals = [
    <InviteScene key="1" />,
    <BidScene key="2" />,
    <CrewScene key="3" />,
    <DayScene key="4" />,
    <RfisDemo key="5" />,
    <OwnerScene key="6" />,
    <PayrollDemo key="7" identity={subIdentity} crewLabel="Harbour Point · E2 crew" people={voltPayroll} />,
  ];
  return (
    <>
      <section aria-labelledby="tour-title" className="relative overflow-hidden pb-14 pt-12 lg:pb-20 lg:pt-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[620px] [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_10%,transparent_75%)]" />
        <div className="container-x relative grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Product tour</Eyebrow>
            <h1 id="tour-title" className="t-h1 mt-5 text-n-950">Follow one package across three companies.</h1>
          </div>
          <div className="lg:col-span-5">
            <p className="t-lead text-n-600">
              Electrical rough-in on Block A of Harbour Point — from invitation to payroll — through the four Axtara apps. Use each screen as you go.
            </p>
          </div>
        </div>
        <div className="container-x relative mt-12">
          <ul className="grid gap-px overflow-hidden rounded-xl bg-n-150 sm:grid-cols-2 lg:grid-cols-5" aria-label="Who's involved">
            {cast.map((c) => (
              <li key={c.person} className="flex gap-3 bg-white p-4">
                <Avatar name={c.person} tone={c.tone} size={32} />
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-medium text-n-950">{c.person}</p>
                  <p className="truncate text-[13px] text-n-500">{c.title} · {c.company.split(" ")[0]} {c.company.split(" ")[1]}</p>
                  <p className="mt-1.5 inline-block rounded-[5px] bg-brand-50 px-1.5 py-0.5 text-[12px] font-medium text-brand-800">{c.app}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="walk-title" className="border-t border-n-150 py-16 lg:py-24">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <SectionIntro id="walk-title" eyebrow="Harbour Point · package E2" title="Seven moments. One shared record." />
            <IllustrativeNote className="shrink-0" />
          </div>
          <div className="mt-12">
            <Journey steps={steps} visuals={visuals} />
          </div>
        </div>
      </section>

      <section aria-labelledby="takeaway-title" className="border-t border-n-150 bg-white py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="takeaway-title" className="t-h3 text-n-950">Every company keeps its own records. The project stays connected.</h2>
            <p className="mt-4 text-[15.5px] leading-7 text-n-600">
              Shared work — packages, bids, RFIs, reports and handover documents — lives in the project. Payroll, private rates and other customers stay with each company.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/demo?interest=platform" arrow>Request a Demo</LinkButton>
              <TextLink href="/collaboration">How shared projects work</TextLink>
            </div>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-xl bg-n-150 sm:grid-cols-3 lg:col-span-7">
            {[
              ["Meridian saw", "E2 bid, crew assignment, daily reports, progress, RFIs and change requests on the package."],
              ["Volt Line kept", "Its payroll, pay rates, other projects and other clients — in its own company account."],
              ["Seabreeze saw", "Reviewed, published progress, documents and the decisions assigned to it."],
            ].map(([t, d]) => (
              <div key={t} className="bg-n-25 p-5">
                <dt className="text-[14px] font-medium text-n-950">{t}</dt>
                <dd className="mt-1.5 text-[14.5px] leading-6 text-n-600">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FinalCta title="See your own projects run this way." lead="We'll walk through a package from your current work — your partners, your crews and your approvals." />
    </>
  );
}
