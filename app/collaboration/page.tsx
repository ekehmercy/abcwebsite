import type { Metadata } from "next";
import { ArrowRight, Check, Eye, Lock, Monitor, Smartphone } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import {
  publicApps, publicClearLines, publicIndependentUse, publicVisibility, sharedRecords, type AppId,
} from "@/content/collaboration";
import { demoCompanies } from "@/content/demo-data";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { LinkButton, TextLink } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { IllustrativeNote, PhoneFrame } from "@/components/product-demo/primitives";
import { MobileClockIn, MobileDailyReport } from "@/components/product-demo/mobile-screens";
import { GcPackagesPreview, SubWorkspacePreview } from "@/components/marketing/collaboration-previews";
import { VisibilityExplorer } from "@/components/marketing/collaboration-visibility";
import { FinalCta } from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "Shared Projects, Separate Companies — Contractor and Subcontractor Collaboration",
  description:
    "How general contractors, developers and subcontractors work together in Axtara: four connected apps, work packages shared by invitation, and company records — payroll, rates and other projects — that stay private.",
  path: "/collaboration",
  ogTitle: "Shared projects. Separate companies.",
});

const previews: Record<AppId, React.ReactNode> = {
  "gc-web": <GcPackagesPreview />,
  "sub-web": <SubWorkspacePreview />,
  "supervisor-field": (
    <div className="flex justify-center py-2">
      <PhoneFrame label="Supervisor Field: daily report for Block B, Level 3" className="w-[244px]"><MobileDailyReport /></PhoneFrame>
    </div>
  ),
  field: (
    <div className="flex justify-center py-2">
      <PhoneFrame label="Field: clocked in against today's assignment" className="w-[244px]"><MobileClockIn stage={2} title="Field" /></PhoneFrame>
    </div>
  ),
};

function AppList({ title, items, Icon }: { title: string; items: string[]; Icon: typeof Check }) {
  return (
    <div>
      <h4 className="text-[13px] font-medium text-n-500">{title}</h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-[14.5px] leading-6 text-n-800">
            <Icon className="mt-1 size-3.5 shrink-0 text-brand-600" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CollaborationPage() {
  const appPanels = publicApps.map((a) => (
    <div key={a.id} className="grid gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-14">
      <div>
        <p className="flex items-center gap-2 text-[13px] font-medium text-brand-700">
          {a.device === "Web" ? <Monitor className="size-4" aria-hidden="true" /> : <Smartphone className="size-4" aria-hidden="true" />}
          {a.device} · {a.who}
        </p>
        <h3 className="t-h3 mt-3 text-n-950">{a.name}</h3>
        <p className="mt-3 text-[16px] leading-7 text-n-600">{a.summary}</p>
        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <AppList title="Contributes" items={a.contributes} Icon={Check} />
          <AppList title="Reviews" items={a.reviews} Icon={Check} />
          <AppList title="Sees" items={a.sees} Icon={Eye} />
          <AppList title="Keeps private" items={a.keepsPrivate} Icon={Lock} />
        </div>
      </div>
      <div className="min-w-0">
        <div className="rounded-2xl bg-n-100/70 p-3 shadow-[inset_0_0_0_1px_var(--n-150)] sm:p-5">{previews[a.id]}</div>
        <IllustrativeNote className="mt-3" />
      </div>
    </div>
  ));

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="collab-title" className="relative overflow-hidden pb-16 pt-12 lg:pb-24 lg:pt-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[640px] [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_10%,transparent_75%)]" />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Collaboration</Eyebrow>
            <h1 id="collab-title" className="t-h1 mt-5 text-n-950">Shared projects. Separate companies.</h1>
          </div>
          <div className="lg:col-span-5">
            <p className="t-lead text-n-600">
              General contractors, developers and subcontractors work from the same project record in Axtara — while each company keeps its own payroll, rates and customers to itself.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/demo?interest=platform" arrow>Request a Demo</LinkButton>
              <LinkButton href="#apps" variant="secondary">See the four apps</LinkButton>
            </div>
          </div>
        </div>

        {/* Shared records strip */}
        <div className="container-x relative mt-14">
          <div className="grid gap-px overflow-hidden rounded-xl bg-n-150 md:grid-cols-[1fr_auto_1fr]">
            <div className="bg-white p-6">
              <p className="text-[13px] font-medium text-n-500">{demoCompanies.gc.role}</p>
              <p className="mt-1 text-[17px] font-medium text-n-950">{demoCompanies.gc.name}</p>
              <p className="mt-3 flex items-center gap-1.5 text-[13.5px] text-n-600"><Lock className="size-3.5 text-n-400" aria-hidden="true" />Own payroll, contract values and internal notes</p>
            </div>
            <div className="bg-n-25 p-6 md:w-[340px]">
              <p className="text-[13px] font-medium text-brand-700">Shared in the package workspace</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13.5px] text-n-800">
                {sharedRecords.map((r) => (
                  <li key={r} className="flex gap-1.5"><Eye className="mt-0.5 size-3.5 shrink-0 text-brand-600" aria-hidden="true" />{r}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6">
              <p className="text-[13px] font-medium text-n-500">{demoCompanies.sub.role}</p>
              <p className="mt-1 text-[17px] font-medium text-n-950">{demoCompanies.sub.name}</p>
              <p className="mt-3 flex items-center gap-1.5 text-[13.5px] text-n-600"><Lock className="size-3.5 text-n-400" aria-hidden="true" />Own payroll, rates, other projects and customers</p>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-n-500">Example companies · demonstration data</p>
        </div>
      </section>

      {/* Four apps */}
      {appPanels.length > 0 && (
        <section id="apps" aria-labelledby="apps-title" className="scroll-mt-20 border-y border-n-150 bg-white py-20 lg:py-28">
          <div className="container-x">
            <SectionIntro id="apps-title" eyebrow="Four connected apps" title="The right app for each person on the project." lead="Two web apps for the companies, two mobile apps for the people on site. Every one of them works from the same project record." />
            <Tabs
              label="Axtara applications"
              tabs={publicApps.map((a) => ({ id: a.id, label: a.name }))}
              panels={appPanels}
              layoutClassName="mt-12"
              listClassName="-mx-4 flex gap-1 overflow-x-auto border-b border-n-150 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
              tabClass="relative h-11 shrink-0 whitespace-nowrap px-3.5 text-[14.5px] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full"
              tabActiveClass="text-n-950 after:bg-brand-600"
              tabInactiveClass="text-n-500 hover:text-n-900 after:bg-transparent"
              panelClassName="mt-10 outline-none"
            />
          </div>
        </section>
      )}

      {/* Visibility explorer */}
      {publicVisibility.length > 0 && (
        <section aria-labelledby="see-title" className="py-20 lg:py-28">
          <div className="container-x">
            <SectionIntro
              id="see-title"
              eyebrow="Data ownership"
              title="What can the GC see?"
              lead="Exactly what you share on its packages — and nothing else. Choose a point of view to see where the line sits."
            />
            <div className="mt-10">
              <VisibilityExplorer rows={publicVisibility} gcName={demoCompanies.gc.short} subName={demoCompanies.sub.short} />
            </div>
          </div>
        </section>
      )}

      {/* Independent use */}
      {publicIndependentUse.length > 0 && (
        <section aria-labelledby="indep-title" className="dark-surface relative overflow-hidden bg-ink-900 py-20 text-white lg:py-28">
          <div aria-hidden="true" className="grid-lines-dark pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_80%)]" />
          <div className="container-x relative grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionIntro dark id="indep-title" eyebrow="Independent use" title="Useful on day one — even if nobody else uses it." lead="Axtara doesn't depend on your clients or partners adopting it. Run your own company in it, and bring partners in package by package when it suits you." />
            </div>
            <ol className="lg:col-span-6 lg:col-start-7">
              {publicIndependentUse.map((u, i) => (
                <li key={u.title} className="grid grid-cols-[40px_1fr] gap-4 border-t border-white/10 py-6 first:border-t-0 first:pt-0">
                  <span className="font-mono text-[13px] text-brand-200">0{i + 1}</span>
                  <div>
                    <h3 className="text-[17px] font-medium text-white">{u.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-7 text-white/70">{u.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Clear lines */}
      {publicClearLines.length > 0 && (
        <section aria-labelledby="lines-title" className="py-20 lg:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionIntro id="lines-title" eyebrow="Clear lines" title="Every record means one thing." />
              <p className="mt-5 max-w-sm text-[15.5px] leading-7 text-n-600">
                Disputes start when one approval is taken to mean another. Axtara keeps each decision separate, attributed and on the record.
              </p>
              <TextLink href="/lifecycle" className="mt-6">See where Axtara fits in a project</TextLink>
            </div>
            <dl className="grid gap-x-10 border-t border-n-200 sm:grid-cols-2 lg:col-span-8">
              {publicClearLines.map((l) => (
                <div key={l.title} className="border-b border-n-150 py-5">
                  <dt className="text-[16px] font-medium text-n-950">{l.title}</dt>
                  <dd className="mt-1.5 text-[15px] leading-6 text-n-600">{l.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Next steps */}
      <section aria-label="Explore further" className="border-t border-n-150 bg-white py-14">
        <div className="container-x flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[16px] text-n-700">See how a contractor, a subcontractor and their site teams share one project, step by step.</p>
          <div className="flex flex-wrap gap-4">
            <TextLink href="/lifecycle">Where Axtara fits</TextLink>
            <TextLink href="/industries/subcontractors">For subcontractors</TextLink>
            <a href="/industries/general-contractors" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-brand-700 underline-offset-4 hover:underline">For general contractors <ArrowRight className="size-4" aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <FinalCta title="See a shared project from both sides." lead="We'll show you the contractor's view and the subcontractor's view of the same package — and exactly where the line between them sits." />
    </>
  );
}
