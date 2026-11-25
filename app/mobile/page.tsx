import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Hand, Languages, Lock, Smartphone, Sun } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { appUrls } from "@/config/site";
import { publicCapability, type Capability, type ModuleSlug } from "@/config/features";
import { SectionIntro, Eyebrow } from "@/components/ui/section";
import { LinkButton, TextLink } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { AttendanceScreen } from "@/components/product-demo/screens";
import { IllustrativeNote, PhoneFrame } from "@/components/product-demo/primitives";
import {
  MobileApprovals, MobileClockIn, MobileDailyReport, MobileDocuments, MobileExpense, MobileHome, MobileIncident, MobileLeave,
  MobileMessages, MobileSchedule,
} from "@/components/product-demo/mobile-screens";
import { FinalCta } from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "Mobile Apps for Field Workers and Supervisors",
  description:
    "Axtara's mobile apps give field workers their site assignment, clock-in, reports and requests — and let supervisors approve hours and review reports from the jobsite.",
  path: "/mobile",
});

const cap = (m: ModuleSlug, id: string): Capability | undefined => publicCapability(m, id);

const workerFeaturesAll = [
  { id: "clock", label: "Clock-in", title: "Clock in at the gate in seconds.", body: "Today's site, crew and shift are already on the phone. One tap records the start of the day, with location checked at that moment against the site boundary.", c: cap("time-attendance", "ta-clock"), screen: <MobileClockIn stage={2} /> },
  { id: "shifts", label: "Shifts", title: "Know where you're working this week.", body: "Assignments and shift times by day, including early starts and site changes, so nobody turns up at the wrong gate.", c: cap("workforce", "wf-scheduling"), screen: <MobileSchedule /> },
  { id: "reports", label: "Daily reports", title: "Report the day before leaving site.", body: "Work completed, delays, weather and photos in a structured report that reaches the project manager the same day.", c: cap("field-operations", "fo-daily"), screen: <MobileDailyReport /> },
  { id: "expenses", label: "Expenses", title: "Photograph the receipt where you bought it.", body: "Amount, category, project and cost code captured at the point of purchase, with the claim's status visible until it's reimbursed.", c: cap("expenses", "ex-submit"), screen: <MobileExpense /> },
  { id: "incidents", label: "Incidents", title: "Report a near miss in under a minute.", body: "Choose the type, confirm the location, add a photo and send it to the supervisor — while the details are clear.", c: cap("field-operations", "fo-incidents"), screen: <MobileIncident /> },
  { id: "leave", label: "Leave", title: "Request leave without the paperwork.", body: "See the balance, submit a request and follow its approval without visiting the office.", c: cap("workforce", "wf-leave"), screen: <MobileLeave /> },
  { id: "documents", label: "Documents", title: "Carry your certifications with you.", body: "Identification, trade certificates and inductions on the worker's record, with a reminder before anything expires.", c: cap("workforce", "wf-documents"), screen: <MobileDocuments /> },
  { id: "messages", label: "Messages", title: "Hear about changes from the person running the site.", body: "Notices and messages between supervisors and crews, tied to the site rather than a personal group chat.", c: cap("field-operations", "fo-comms"), screen: <MobileMessages /> },
];

const supervisorPointsAll = [
  { label: "See who is on site right now, and who isn't", c: cap("time-attendance", "ta-exceptions") },
  { label: "Approve, correct or query hours in one tap", c: cap("time-attendance", "ta-approvals") },
  { label: "Review crew daily reports and photos", c: cap("field-operations", "fo-review") },
  { label: "Record incidents and follow-up actions", c: cap("compliance", "cp-incidents") },
  { label: "Approve field expenses against cost codes", c: cap("expenses", "ex-approvals") },
];

// Only capabilities that may be shown in this release stage.
const workerFeatures = workerFeaturesAll.filter((f): f is typeof f & { c: Capability } => !!f.c);
const supervisorPoints = supervisorPointsAll.filter((p) => p.c);

function StoreOrInterestCtas() {
  if (appUrls.appStore || appUrls.googlePlay) {
    return (
      <div className="flex flex-wrap gap-3">
        {appUrls.appStore && <LinkButton href={appUrls.appStore} variant="primary" size="lg">Download on the App Store</LinkButton>}
        {appUrls.googlePlay && <LinkButton href={appUrls.googlePlay} variant="secondary" size="lg">Get it on Google Play</LinkButton>}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-3">
      <LinkButton href="/demo?interest=mobile" size="lg" arrow>Request a Mobile Demo</LinkButton>
      <LinkButton href="#features" size="lg" variant="secondary">Explore Mobile Features</LinkButton>
    </div>
  );
}

export default function MobilePage() {
  const panels = workerFeatures.map((f) => (
    <div key={f.id} className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
      <div className="max-w-md md:justify-self-end">
        <h3 className="t-h3 text-n-950">{f.title}</h3>
        <p className="mt-4 text-[16px] leading-7 text-n-600">{f.body}</p>
        <p className="mt-5 flex items-center gap-2 text-[14px] text-n-700">
          <Check className="size-4 text-brand-600" aria-hidden="true" />{f.c.name}
        </p>
      </div>
      <div className="flex justify-center">
        <PhoneFrame label={`Axtara worker app: ${f.label}`} className="w-[248px]">{f.screen}</PhoneFrame>
      </div>
    </div>
  ));

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="mobile-title" className="relative overflow-hidden pb-20 pt-14 sm:pt-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[760px] [mask-image:radial-gradient(70%_60%_at_70%_30%,#000_20%,transparent_75%)]" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>Mobile apps</Eyebrow>
            <h1 id="mobile-title" className="t-h1 mt-4 text-n-950">The jobsite, connected to the office.</h1>
            <p className="t-lead mt-6 text-n-600">
              A field app that does what a worker needs at 6 a.m. at the site gate — and a supervisor app that turns approvals into a tap instead of a trip to the office.
            </p>
            <div className="mt-8"><StoreOrInterestCtas /></div>
            <p className="mt-5 text-[14px] text-n-500">
              Want to know when the apps are listed in your market?{" "}
              <Link href="/contact?topic=mobile" className="font-medium text-brand-700 underline underline-offset-2">Register Your Interest</Link>
            </p>
          </div>
          <div className="relative lg:col-span-7">
            <div className="flex items-start justify-center gap-4 sm:gap-6">
              <PhoneFrame label="Worker home screen" className="hidden w-[236px] translate-y-12 sm:block"><MobileHome /></PhoneFrame>
              <PhoneFrame label="Worker clock-in screen, clocked in at 06:52" className="w-[236px]"><MobileClockIn stage={2} /></PhoneFrame>
              <PhoneFrame label="Supervisor approvals screen" className="hidden w-[236px] translate-y-12 md:block"><MobileApprovals /></PhoneFrame>
            </div>
            <IllustrativeNote className="mt-16 justify-center" />
          </div>
        </div>
      </section>

      {/* Flow diagram */}
      <section aria-labelledby="flow-title" className="border-y border-n-150 bg-white py-24 lg:py-28">
        <div className="container-x">
          <SectionIntro id="flow-title" eyebrow="How it fits together" title="Three apps. One record of the work." lead="Field workers create the record, supervisors confirm it, and the office works from it — all in the same Axtara platform." />
          <ol className="mt-14 grid gap-4 lg:grid-cols-4">
            {[
              { n: "01", who: "Field workers", what: "Clock in, see assignments, submit reports, expenses and requests.", where: "Worker app" },
              { n: "02", who: "Supervisors", what: "Review attendance and exceptions, approve hours and reports on site.", where: "Supervisor app" },
              { n: "03", who: "Axtara web platform", what: "Approved records update projects, costs and payroll preparation.", where: "Central platform" },
              { n: "04", who: "Office administrators", what: "HR, finance and project teams manage people, rules and reporting.", where: "Web app" },
            ].map((s, i) => (
              <li key={s.n} className="relative rounded-xl bg-n-25 p-6 shadow-[0_0_0_1px_var(--n-150)]">
                <p className="flex items-center justify-between text-[12.5px] font-medium text-n-400"><span>{s.n}</span><span className="text-brand-700">{s.where}</span></p>
                <h3 className="mt-4 text-[17px] font-medium text-n-950">{s.who}</h3>
                <p className="mt-1.5 text-[14.5px] leading-6 text-n-600">{s.what}</p>
                {i < 3 && (
                  <span aria-hidden="true" className="absolute -bottom-3.5 left-1/2 z-10 flex size-7 -translate-x-1/2 items-center justify-center rounded-full bg-white text-n-400 shadow-[0_0_0_1px_var(--n-150)] lg:-right-3.5 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0">
                    <ArrowDown className="size-3.5 lg:hidden" /><ArrowRight className="hidden size-3.5 lg:block" />
                  </span>
                )}
              </li>
            ))}
          </ol>

          <div className="relative mt-16 overflow-hidden rounded-2xl bg-n-100/70 p-4 shadow-[inset_0_0_0_1px_var(--n-150)] sm:p-8">
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
            <div className="relative grid items-center gap-8 xl:grid-cols-[auto_auto_minmax(0,1fr)]">
              <div className="flex justify-center gap-5">
                <figure>
                  <PhoneFrame label="Field worker clocks in" className="w-[228px]"><MobileClockIn stage={2} /></PhoneFrame>
                  <figcaption className="mt-3 text-center text-[13px] font-medium text-n-600">Field worker</figcaption>
                </figure>
                <figure className="hidden sm:block">
                  <PhoneFrame label="Supervisor approves the record" className="w-[236px]"><MobileApprovals approved /></PhoneFrame>
                  <figcaption className="mt-3 text-center text-[13px] font-medium text-n-600">Supervisor</figcaption>
                </figure>
              </div>
              <ArrowRight className="mx-auto hidden size-5 text-brand-500 xl:block" aria-hidden="true" />
              <figure className="min-w-0">
                <AttendanceScreen />
                <figcaption className="mt-3 text-center text-[13px] font-medium text-n-600">Office — the same records in the web platform</figcaption>
              </figure>
            </div>
          </div>
          <IllustrativeNote className="mt-4" />
        </div>
      </section>

      {/* Worker app features */}
      <section id="features" aria-labelledby="features-title" className="scroll-mt-20 py-24 lg:py-32">
        <div className="container-x">
          <SectionIntro id="features-title" eyebrow="For field workers" title="Everything for the working day. Nothing else." lead="Choose a feature to see it in the worker app." />
          <Tabs
            label="Worker app features"
            tabs={workerFeatures.map((f) => ({ id: f.id, label: f.label }))}
            panels={panels}
            layoutClassName="mt-12"
            listClassName="-mx-4 flex gap-1 overflow-x-auto border-b border-n-150 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
            tabClass="relative h-11 shrink-0 whitespace-nowrap px-3.5 text-[14.5px] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full"
            tabActiveClass="text-n-950 after:bg-brand-600"
            tabInactiveClass="text-n-500 hover:text-n-900 after:bg-transparent"
            panelClassName="mt-12 outline-none"
          />
        </div>
      </section>

      {/* Supervisor app */}
      <section aria-labelledby="super-title" className="dark-surface relative overflow-hidden bg-ink-900 py-24 text-white lg:py-32">
        <div aria-hidden="true" className="grid-lines-dark pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_80%)]" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro dark id="super-title" eyebrow="For supervisors" title="Approve the work where it happens." lead="Supervisors spend their day on site. Their app puts the crew's attendance, exceptions and reports in their hand — so approvals happen the same day, not at the end of the week." />
            <ul className="mt-8 space-y-3">
              {supervisorPoints.map((p) => (
                <li key={p.label} className="flex items-start gap-2.5 text-[15px] text-white/85">
                  <Check className="mt-1 size-4 shrink-0 text-brand-300" aria-hidden="true" />
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center gap-6 lg:col-span-7">
            <PhoneFrame label="Supervisor approval queue" className="w-[236px]"><MobileApprovals /></PhoneFrame>
            <PhoneFrame label="Supervisor reviewing a daily report" className="hidden w-[236px] translate-y-10 sm:block"><MobileDailyReport /></PhoneFrame>
          </div>
        </div>
      </section>

      {/* Design principles */}
      <section aria-labelledby="principles-title" className="py-24 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Design principles</Eyebrow>
            <h2 id="principles-title" className="t-h3 mt-4 text-n-950">Designed for the people who use it outdoors.</h2>
            <p className="mt-4 text-[15px] leading-7 text-n-600">These are the principles our mobile design is built around.</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-xl bg-n-150 sm:grid-cols-2 lg:col-span-8">
            {[
              { I: Hand, t: "Large, forgiving controls", b: "Primary actions are big enough to use with work gloves and in a hurry." },
              { I: Sun, t: "Readable in daylight", b: "High-contrast screens and plain status labels that never rely on colour alone." },
              { I: Languages, t: "Plain language", b: "Short, clear wording a new starter understands on their first morning." },
              { I: Lock, t: "Privacy by design", b: "Location is checked at clock-in and clock-out, not tracked through the day. Workers can see the information held about them." },
              { I: Smartphone, t: "Only what's needed today", b: "Each worker sees their own site, shift and tasks — not the whole company." },
              { I: Check, t: "One action, one outcome", b: "Every submission shows its status, so workers know when something has been approved." },
            ].map(({ I, t, b }) => (
              <li key={t} className="bg-n-25 p-6">
                <I className="size-5 text-brand-600" aria-hidden="true" />
                <h3 className="mt-4 text-[16px] font-medium text-n-950">{t}</h3>
                <p className="mt-1.5 text-[14.5px] leading-6 text-n-600">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Availability */}
      <section aria-labelledby="avail-title" className="border-t border-n-150 bg-white py-20">
        <div className="container-x flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 id="avail-title" className="t-h3 text-n-950">Getting the apps</h2>
            <p className="mt-3 text-[15.5px] leading-7 text-n-600">
              {appUrls.appStore || appUrls.googlePlay
                ? "Download the Axtara app from your device's app store. Your organisation will invite you to sign in."
                : "Axtara's mobile apps are provided to customer organisations during onboarding. App store links will appear here once public listings are available in your market."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/contact?topic=mobile" variant="secondary">Register Your Interest</LinkButton>
            <TextLink href="/platform">See the web platform</TextLink>
          </div>
        </div>
      </section>

      <FinalCta title="See the field app in your crew's hands." lead="We'll walk through the worker and supervisor apps using a scenario from your own sites." />
    </>
  );
}
