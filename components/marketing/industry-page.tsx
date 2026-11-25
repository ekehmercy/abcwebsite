import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getModule } from "@/config/features";
import type { Industry } from "@/config/industries";
import { screenComponents } from "@/components/product-demo/screens";
import { IllustrativeNote } from "@/components/product-demo/primitives";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { EditorialImage } from "@/components/ui/editorial-image";
import { TrackView } from "@/components/ui/track-view";
import { FinalCta } from "./home-sections";

export function IndustryPage({ ind }: { ind: Industry }) {
  const Primary = screenComponents[ind.primaryScreen];
  const Secondary = screenComponents[ind.secondaryScreen];
  return (
    <>
      <TrackView event="industry_page_viewed" page={ind.slug} />

      {/* Hero: editorial headline, photograph, product overlapping */}
      <section aria-labelledby="ind-title" className="pb-20 pt-12 lg:pb-28 lg:pt-20">
        <div className="container-x">
          <div className="max-w-4xl">
            <Eyebrow>{ind.eyebrow}</Eyebrow>
            <h1 id="ind-title" className="t-h1 mt-5 text-n-950">{ind.headline}</h1>
            <p className="t-lead mt-6 max-w-2xl text-n-600">{ind.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={`/demo?interest=platform&business=${ind.slug}`} size="lg" arrow>Request a Demo</LinkButton>
              <LinkButton href="/platform" size="lg" variant="secondary">Explore the Platform</LinkButton>
            </div>
          </div>
          <div className="relative mt-16 lg:mt-20">
            <EditorialImage slot={ind.photoKey} variant={ind.slug === "infrastructure" ? 1 : 0} priority className="h-[300px] rounded-2xl sm:h-[420px] lg:h-[520px] lg:w-[64%]" sizes="(min-width:1024px) 64vw, 100vw" />
            <div className="relative -mt-24 px-3 sm:px-8 lg:absolute lg:right-0 lg:top-16 lg:mt-0 lg:w-[58%] lg:px-0" data-reveal>
              <Primary />
              <IllustrativeNote className="mt-3 lg:text-white/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Realities */}
      <section aria-labelledby="real-title" className="border-y border-n-150 bg-white py-20 lg:py-28">
        <div className="container-x">
          <SectionIntro id="real-title" eyebrow="What you deal with" title="We know how your work actually runs." />
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {ind.realities.map((r, i) => (
              <li key={r.title} className="border-t border-n-200 pt-6" data-reveal>
                <span className="font-mono text-[13px] text-n-400">0{i + 1}</span>
                <h3 className="mt-3 text-[19px] font-medium tracking-[-0.01em] text-n-950">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-6 text-n-600">{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Answers */}
      <section aria-labelledby="ans-title" className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro id="ans-title" eyebrow="How Axtara helps" title={`Built around ${ind.shortName.toLowerCase() === "developers" ? "development" : ind.shortName.toLowerCase()} operations.`} />
            <ul className="mt-10 space-y-px overflow-hidden rounded-xl bg-n-150">
              {ind.answers.map((a) => {
                const m = getModule(a.module)!;
                return (
                  <li key={a.title}>
                    <Link href={`/platform/${m.slug}`} className="group block bg-white px-5 py-5 transition-colors hover:bg-n-25">
                      <span className="flex items-center gap-2 text-[12.5px] font-medium text-brand-700"><Icon name={m.icon} className="size-3.5" />{m.name}</span>
                      <span className="mt-1.5 block text-[16.5px] font-medium text-n-950">{a.title}</span>
                      <span className="mt-1 block text-[15px] leading-6 text-n-600">{a.body}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:pt-28" data-reveal>
            <div className="rounded-2xl bg-n-100/70 p-3 shadow-[inset_0_0_0_1px_var(--n-150)] sm:p-5 lg:sticky lg:top-24">
              <Secondary />
            </div>
            <IllustrativeNote className="mt-3" />
          </div>
        </div>
      </section>

      {/* Scenario */}
      <section aria-labelledby="sc-title" className="dark-surface bg-ink-900 py-20 text-white lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow dark>Illustrative scenario</Eyebrow>
            <h2 id="sc-title" className="t-h2 mt-4">{ind.scenario.title}</h2>
            <p className="mt-5 text-[15.5px] leading-7 text-white/70">{ind.scenario.context}</p>
            <p className="mt-6 text-[13px] text-white/50">A hypothetical example using fictional organisations and people. It does not describe an Axtara customer.</p>
          </div>
          <ol className="relative lg:col-span-7 lg:col-start-6">
            {ind.scenario.beats.map((b, i) => (
              <li key={i} className="relative grid grid-cols-[72px_1fr] gap-4 border-t border-white/10 py-6 first:border-t-0 sm:grid-cols-[96px_1fr]">
                <span className="font-mono text-[14px] text-brand-200">{b.time}</span>
                <div>
                  <p className="text-[13px] font-medium text-white/55">{b.who}</p>
                  <p className="mt-1 text-[16.5px] leading-7 text-white">{b.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Modules used */}
      <section aria-labelledby="mod-title" className="py-20 lg:py-24">
        <div className="container-x">
          <h2 id="mod-title" className="t-h3 text-n-950">The modules {ind.shortName.toLowerCase()} use most</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ind.modules.map((slug) => {
              const m = getModule(slug)!;
              return (
                <li key={slug}>
                  <Link href={`/platform/${slug}`} className="group flex h-full flex-col rounded-xl bg-white p-5 shadow-[0_0_0_1px_var(--n-150)] transition-shadow hover:shadow-[0_0_0_1px_var(--n-300),var(--shadow-card)]">
                    <Icon name={m.icon} className="size-5 text-brand-600" />
                    <span className="mt-4 text-[15.5px] font-medium text-n-950">{m.name}</span>
                    <span className="mt-1 text-[14px] text-n-500">{m.navDescription}</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13.5px] font-medium text-brand-700">Learn more <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <FinalCta title="See Axtara with your own projects in mind." lead={`We'll tailor the demo to how ${ind.name.toLowerCase()} work — your sites, crews and approvals.`} />
    </>
  );
}
