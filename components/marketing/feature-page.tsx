import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { getModule, type ProductModule } from "@/config/features";
import { getIndustry } from "@/config/industries";
import { screenComponents } from "@/components/product-demo/screens";
import { IllustrativeNote } from "@/components/product-demo/primitives";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { AvailabilityBadge } from "@/components/ui/availability-badge";
import { TrackView } from "@/components/ui/track-view";
import { FinalCta } from "./home-sections";
import { WorkflowSteps } from "./workflow-steps";

export function FeaturePage({ m }: { m: ProductModule }) {
  const Screen = screenComponents[m.screen];
  return (
    <>
      <TrackView event="feature_page_viewed" page={m.slug} />

      {/* Hero */}
      <section aria-labelledby="feature-title" className="relative overflow-hidden pb-16 pt-12 lg:pb-24 lg:pt-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[700px] [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_10%,transparent_75%)]" />
        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="text-[13.5px] text-n-500">
            <Link href="/platform" className="hover:text-n-900">Platform</Link>
            <span aria-hidden="true" className="mx-2 text-n-300">/</span>
            <span className="text-n-800">{m.name}</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="t-eyebrow flex items-center gap-2 text-brand-700">
                <span className="flex size-7 items-center justify-center rounded-md bg-white text-brand-600 shadow-[0_0_0_1px_var(--n-150)]"><Icon name={m.icon} className="size-4" /></span>
                {m.name}
              </p>
              <h1 id="feature-title" className="t-h1 mt-5 text-n-950">{m.headline}</h1>
            </div>
            <div className="lg:col-span-4">
              <p className="t-lead text-n-600">{m.intro}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton href={`/demo?interest=${m.slug}`} arrow>Request a Demo</LinkButton>
                <LinkButton href="/#journey" variant="secondary">Take the tour</LinkButton>
              </div>
            </div>
          </div>
          <div className="mt-14" data-reveal>
            <Screen />
            <IllustrativeNote className="mt-3" />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section aria-labelledby="problem-title" className="border-y border-n-150 bg-white py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionIntro id="problem-title" eyebrow="The problem" title={m.problem.heading} />
            <p className="mt-5 max-w-xl text-[16px] leading-7 text-n-600" data-reveal>{m.problem.body}</p>
          </div>
          <ul className="space-y-px self-end overflow-hidden rounded-xl bg-n-150 lg:col-span-5 lg:col-start-8" data-reveal>
            {m.problem.points.map((p) => (
              <li key={p} className="flex items-start gap-3 bg-n-25 px-5 py-4 text-[15px] text-n-700">
                <X className="mt-0.5 size-4 shrink-0 text-bad" aria-hidden="true" />
                {p}
              </li>
            ))}
            <li className="bg-ink-900 px-5 py-4 text-[15px] text-white">
              <span className="text-[12.5px] font-medium text-brand-200">With Axtara</span>
              <span className="mt-1 block">{m.outcome}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" aria-labelledby="cap-title" className="scroll-mt-20 py-20 lg:py-28">
        <div className="container-x">
          <SectionIntro id="cap-title" eyebrow="Capabilities" title={`What ${m.shortName === "Payroll Prep" ? "payroll preparation" : m.name.toLowerCase()} covers`} lead="Availability varies by plan and market. We confirm exactly what is included for your organisation during your demo." />
          <ul className="mt-12 grid border-t border-n-150 md:grid-cols-2 md:gap-x-12">
            {m.capabilities.map((c) => (
              <li key={c.id} className="border-b border-n-150 py-6" data-reveal>
                <h3 className="flex flex-wrap items-center gap-2.5 text-[17px] font-medium text-n-950">
                  {c.name}
                  <AvailabilityBadge cap={c} />
                </h3>
                <p className="mt-1.5 max-w-lg text-[15px] leading-6 text-n-600">{c.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Workflow */}
      <section aria-labelledby="wf-title" className="border-t border-n-150 bg-white py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <SectionIntro id="wf-title" eyebrow="How it works" title={m.workflow.title} />
            <p className="text-[13px] text-n-500">Illustrative example · fictional people and projects</p>
          </div>
          <div className="mt-12">
            <WorkflowSteps steps={m.workflow.steps} />
          </div>
        </div>
      </section>

      {/* Related + industries */}
      <section aria-labelledby="rel-title" className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>Connected modules</Eyebrow>
            <h2 id="rel-title" className="t-h3 mt-4 text-n-950">Works with the rest of Axtara</h2>
            <ul className="mt-8 space-y-px overflow-hidden rounded-xl bg-n-150">
              {m.related.map((slug) => {
                const r = getModule(slug)!;
                return (
                  <li key={slug}>
                    <Link href={`/platform/${slug}`} className="group flex items-center gap-4 bg-white px-5 py-4 transition-colors hover:bg-n-25">
                      <Icon name={r.icon} className="size-5 text-n-500 group-hover:text-brand-600" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15.5px] font-medium text-n-950">{r.name}</span>
                        <span className="block text-[14px] text-n-500">{r.navDescription}</span>
                      </span>
                      <ArrowUpRight className="size-4 text-n-400 group-hover:text-brand-600" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <Eyebrow>In your industry</Eyebrow>
            <h2 className="t-h3 mt-4 text-n-950">Where it matters most</h2>
            <ul className="mt-8 space-y-6">
              {m.industryNotes.map((n) => {
                const ind = getIndustry(n.industry)!;
                return (
                  <li key={n.industry} className="border-l-2 border-brand-200 pl-5">
                    <Link href={`/industries/${ind.slug}`} className="text-[15.5px] font-medium text-n-950 hover:text-brand-700">{ind.name}</Link>
                    <p className="mt-1 text-[15px] leading-6 text-n-600">{n.note}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <FinalCta title={`See ${m.shortName === "Payroll Prep" ? "payroll preparation" : m.name.toLowerCase()} in a live demo.`} lead="We'll walk through it with examples from your own projects, crews and approval process." />
    </>
  );
}
