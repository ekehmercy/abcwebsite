import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { getPublicRateCards } from "@/lib/pricing-rates.server";
import { billingRules, comparison, plans, pricingDisclosures, separateCharges, type PlanId } from "@/config/pricing";
import { PlanPrice } from "@/components/marketing/plan-price";
import { SectionIntro, Eyebrow } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { PricingCalculator } from "@/components/marketing/pricing-calculator";
import { FinalCta } from "@/components/marketing/home-sections";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Axtara plans from US$199, J$19,900 or ₦99,000 a month. Core, Scale and Enterprise are sized by the projects your company manages and your own active workers — estimate your subscription by market.",
  path: "/pricing",
});

// Rate cards are read at request time on the server so private values never enter the static bundle.
export const dynamic = "force-dynamic";

const faqs = [
  {
    q: "How is the monthly charge calculated?",
    a: "Each plan has a monthly base that includes a number of company-managed active projects and your own active workers. Additional projects and workers are charged per month at your market's published rate.",
  },
  {
    q: "What counts as an active worker?",
    a: "Your own employees who record time or activity in Axtara during the month. Office users and invited collaborators are included, and a GC isn't billed for its subcontractors' workers.",
  },
  {
    q: "How does annual prepayment work?",
    a: "Paying the base subscription a year in advance takes 10% off the base. Any additional projects or workers are still billed monthly at the standard rate.",
  },
  {
    q: "If a GC invites us, can they see our payroll?",
    a: "No. An invitation shares the packages the GC chooses with you. Your employees' payroll, your private rates, your other projects and your other customer relationships stay in your company account.",
  },
  {
    q: "Which plan includes payroll preparation?",
    a: "Core includes an export of approved time. Scale adds payroll calculation, review, approval and payroll-schedule export. Enterprise includes everything in Scale and adds entity payroll controls. On every plan, your payroll provider runs payroll.",
  },
  {
    q: "Is implementation included?",
    a: "Implementation, data migration, training beyond standard onboarding and integrations are scoped for each customer and quoted separately.",
  },
  {
    q: "Does Axtara pay our workers?",
    a: "No. Axtara prepares approved payroll information. Wages are paid by your payroll provider or bank under your own arrangements. Axtara does not hold funds or transfer wages.",
  },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <><Check className="mx-auto size-4 text-brand-600" aria-hidden="true" /><span className="sr-only">Included</span></>;
  if (v === false) return <><Minus className="mx-auto size-4 text-n-300" aria-hidden="true" /><span className="sr-only">Not included</span></>;
  return <span className="text-[13.5px] text-n-700">{v}</span>;
}

export default function PricingPage() {
  const { cards, preview } = getPublicRateCards();
  const groups = Array.from(new Set(comparison.map((r) => r.group)));

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden pb-14 pt-14 sm:pt-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(60%_70%_at_50%_0%,#000,transparent)]" />
        <div className="container-x relative">
          <SectionIntro
            as="h1"
            eyebrow="Pricing"
            title="Pay for the workforce you run, not the seats you fill."
            lead="Plans are sized by the projects your company manages and your own active workers — for general contractors, subcontractors and developers, from a first project to multi-entity operations."
          />
        </div>
      </section>

      {/* Calculator */}
      <section aria-labelledby="calc-title" className="pb-24">
        <div className="container-x">
          <h2 id="calc-title" className="sr-only">Estimate your subscription</h2>
          <PricingCalculator rateCards={cards} preview={preview} />
          <p className="mt-4 text-[13px] text-n-500">
            Prices exclude applicable taxes. Your subscription is confirmed in your order form.
          </p>

          <div className="mt-16 grid gap-10 border-t border-n-150 pt-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="t-h3 text-n-950">How subscriptions are sized</h3>
              <p className="mt-3 text-[15px] leading-6 text-n-600">Built around how construction companies actually work together.</p>
              <ul className="mt-6 space-y-2 text-[13.5px] leading-5 text-n-500">
                {pricingDisclosures.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
            <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:col-span-8">
              {billingRules.map(({ t, d }) => (
                <div key={t} className="border-l-2 border-brand-200 pl-5">
                  <dt className="text-[15.5px] font-medium text-n-950">{t}</dt>
                  <dd className="mt-1.5 text-[14.5px] leading-6 text-n-600">{d}</dd>
                </div>              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section aria-labelledby="plans-title" className="border-t border-n-150 bg-white py-24">
        <div className="container-x">
          <SectionIntro id="plans-title" eyebrow="Plans" title="Three plans. One connected platform." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-n-150 md:grid-cols-3">
            {plans.map((p, i) => (
              <article key={p.id} id={`plan-${p.id}`} className={cn("flex scroll-mt-24 flex-col p-7 sm:p-8", i === 1 ? "bg-n-25" : "bg-white")}>
                <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-n-950">{p.name}</h3>
                <p className="mt-2 text-[15px] font-medium text-n-700">{p.forWhom}</p>
                <p className="mt-3 text-[14.5px] leading-6 text-n-600">{p.summary}</p>
                <PlanPrice plan={p.id} rateCards={cards} className="mt-6" />
                <ul className="mt-5 space-y-2.5 border-t border-n-150 pt-5">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 text-[14.5px] text-n-700"><Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />{h}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  {p.quotedOnly ? (
                    <LinkButton href="/demo?interest=enterprise" variant="primary" arrow className="w-full">Get an Enterprise quote</LinkButton>
                  ) : (
                    <LinkButton href={`/demo?interest=pricing&plan=${p.id}`} variant="secondary" className="w-full">Start with {p.name}</LinkButton>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section aria-labelledby="compare-title" className="py-24">
        <div className="container-x">
          <SectionIntro id="compare-title" eyebrow="Compare" title="What each plan includes." />
          <p className="mt-4 text-[13.5px] text-n-500">Plan entitlements are confirmed in your order form.</p>

          {/* Desktop / tablet table */}
          <div className="mt-10 hidden overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_var(--n-150)] md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Plan comparison</caption>
              <thead>
                <tr className="border-b border-n-150">
                  <th scope="col" className="w-[40%] px-6 py-4 text-[13px] font-medium text-n-500">Capability</th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className="px-6 py-4 text-center text-[15px] font-semibold text-n-950">{p.name}</th>
                  ))}
                </tr>
              </thead>
              {groups.map((g) => (
                <tbody key={g}>
                  <tr>
                    <th colSpan={4} scope="colgroup" className="bg-n-25 px-6 pb-2 pt-5 text-[12.5px] font-medium text-n-500">{g}</th>
                  </tr>
                  {comparison.filter((r) => r.group === g).map((r) => (
                    <tr key={r.name} className="border-t border-n-100">
                      <th scope="row" className="px-6 py-3 text-[14.5px] font-normal text-n-800">{r.name}</th>
                      {plans.map((p) => (
                        <td key={p.id} className="px-6 py-3 text-center"><Cell v={r.values[p.id as PlanId]} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>

          {/* Mobile: stacked per plan */}
          <div className="mt-8 space-y-4 md:hidden">
            {plans.map((p) => (
              <details key={p.id} className="group rounded-xl bg-white shadow-[0_0_0_1px_var(--n-150)]" open={p.id === "scale"}>
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 py-4 text-[16px] font-semibold text-n-950">
                  {p.name}
                  <span className="text-[13px] font-normal text-n-500 group-open:hidden">Show</span>
                  <span className="hidden text-[13px] font-normal text-n-500 group-open:inline">Hide</span>
                </summary>
                <ul className="border-t border-n-150 px-5 py-3">
                  {comparison.map((r) => {
                    const v = r.values[p.id as PlanId];
                    return (
                      <li key={r.name} className="flex items-center justify-between gap-4 py-2 text-[14px]">
                        <span className={v === false ? "text-n-400" : "text-n-800"}>{r.name}</span>
                        <span className="shrink-0"><Cell v={v} /></span>
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Separate charges */}
      <section aria-labelledby="charges-title" className="border-y border-n-150 bg-white py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Clear about costs</Eyebrow>
            <h2 id="charges-title" className="t-h3 mt-4 text-n-950">What sits outside your subscription.</h2>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-xl bg-n-150 sm:grid-cols-2 lg:col-span-8">
            {separateCharges.map((c) => (
              <div key={c.title} className="bg-n-25 p-6">
                <dt className="text-[16px] font-medium text-n-950">{c.title}</dt>
                <dd className="mt-1.5 text-[14.5px] leading-6 text-n-600">{c.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="pfaq-title" className="py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <h2 id="pfaq-title" className="t-h3 mt-4 text-n-950">Pricing questions.</h2>
            <p className="mt-4 text-[15px] leading-7 text-n-600">Running a larger or more complex organisation? Enterprise plans include advanced permissions, governance and integration support.</p>
            <LinkButton href="/demo?interest=enterprise" variant="secondary" arrow className="mt-6">Talk to us about Enterprise</LinkButton>
          </div>
          <div className="divide-y divide-n-150 border-y border-n-150 lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-medium text-n-950 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="relative size-4 shrink-0 text-n-500 before:absolute before:left-0 before:top-1/2 before:h-px before:w-4 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-4 after:w-px after:bg-current after:transition-transform group-open:after:scale-y-0" />
                </summary>
                <p className="max-w-2xl pb-6 text-[15px] leading-7 text-n-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FinalCta title="Get a quote for your team." lead="Tell us about your workforce and sites, and we'll show you Axtara with a written quote for your market." />
    </>
  );
}
