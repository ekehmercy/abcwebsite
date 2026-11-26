import type { Metadata } from "next";
import { pageMetadata, jsonLd } from "@/lib/seo";
import { contact } from "@/config/site";
import { partnerFaq, partnerMarkets, partnerPathways, partnerSteps } from "@/content/partners";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { Tabs } from "@/components/ui/tabs";
import { Icon } from "@/components/ui/icon";
import { EnquireButton, PartnerEnquiryForm } from "@/components/marketing/partner-pathways";

export const metadata: Metadata = pageMetadata({
  title: "Partners — Referral, reseller, implementation and technology partnerships",
  description:
    "Work with Axtara as a referral, reseller, implementation or technology partner, helping construction businesses in Nigeria, Jamaica, the wider Caribbean and the United States.",
  path: "/partners",
});

export default function PartnersPage() {
  const panels = partnerPathways.map((p) => (
    <div key={p.id} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-14">
      <div>
        <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon name={p.icon} className="size-5" />
        </span>
        <h3 className="t-h3 mt-5 text-n-950">{p.name}</h3>
        <p className="mt-3 text-[16px] leading-7 text-n-600">{p.short}</p>
        <div className="mt-7">
          <EnquireButton pathway={p.id} name={p.name} />
        </div>
      </div>
      <dl className="grid gap-px overflow-hidden rounded-xl bg-n-150 sm:grid-cols-2">
        {[
          ["Who it suits", p.suits],
          ["What you contribute", p.contribute],
          ["What the customer gets", p.customer],
          ["What it does for both of us", p.both],
        ].map(([t, d]) => (
          <div key={t} className="bg-white p-5">
            <dt className="text-[13px] font-medium text-brand-700">{t}</dt>
            <dd className="mt-1.5 text-[14.5px] leading-6 text-n-700">{d}</dd>
          </div>
        ))}
        <div className="bg-n-25 p-5 sm:col-span-2">
          <dt className="text-[13px] font-medium text-n-500">What we discuss first</dt>
          <dd className="mt-1.5 text-[14.5px] leading-6 text-n-700">{p.discuss}</dd>
        </div>
      </dl>
    </div>
  ));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: partnerFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        })}
      />

      <section className="relative overflow-hidden pb-16 pt-10 sm:pt-16 lg:pb-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(60%_70%_at_20%_10%,#000_10%,transparent_70%)]" />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Partners</Eyebrow>
            <h1 className="t-h1 mt-4 text-n-950">Help construction businesses run connected projects.</h1>
          </div>
          <p className="t-lead text-n-600 lg:col-span-5 lg:pb-2">
            Advisers, regional firms, implementation specialists and software providers each have a part to play. Choose the pathway that fits how you already work with construction businesses.
          </p>
        </div>
      </section>

      {/* Pathways */}
      <section aria-labelledby="pathways-title" className="border-y border-n-150 bg-white py-20 lg:py-28">
        <div className="container-x">
          <SectionIntro id="pathways-title" eyebrow="Pathways" title="Four ways to work with Axtara." />
          <Tabs
            label="Partner pathways"
            tabs={partnerPathways.map((p) => ({ id: p.id, label: p.name }))}
            panels={panels}
            layoutClassName="mt-12"
            listClassName="-mx-4 flex gap-1 overflow-x-auto border-b border-n-150 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
            tabClass="relative h-11 shrink-0 whitespace-nowrap px-3.5 text-[14.5px] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full"
            tabActiveClass="text-n-950 after:bg-brand-600"
            tabInactiveClass="text-n-500 hover:text-n-900 after:bg-transparent"
            panelClassName="mt-10 outline-none"
          />
        </div>
      </section>

      {/* Markets + process */}
      <section aria-labelledby="markets-title" className="py-20 lg:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <div>
            <SectionIntro id="markets-title" eyebrow="Markets" title="Where we're building partnerships." />
            <ul className="mt-10 border-t border-n-200">
              {partnerMarkets.map((m) => (
                <li key={m.name} className="grid gap-1 border-b border-n-150 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <p className="text-[15.5px] font-medium text-n-950">{m.name}</p>
                  <p className="text-[14.5px] leading-6 text-n-600">{m.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionIntro eyebrow="How it works" title="From first enquiry to working together." />
            <ol className="mt-10 space-y-6">
              {partnerSteps.map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-n-700 shadow-[0_0_0_1px_var(--n-200)] tabular-nums">{i + 1}</span>
                  <div>
                    <p className="text-[15.5px] font-medium text-n-950">{s.t}</p>
                    <p className="mt-1 text-[14.5px] leading-6 text-n-600">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Enquiry + FAQ */}
      <section id="partner-enquiry" aria-labelledby="enquiry-title" className="scroll-mt-20 border-t border-n-150 bg-white py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionIntro id="enquiry-title" eyebrow="Partner enquiry" title="Tell us how you'd like to work together." lead="We reply to every enquiry and arrange a fit discussion where it makes sense for both sides." />
            <div className="mt-10 space-y-2">
              {partnerFaq.map((f) => (
                <details key={f.q} className="group rounded-lg bg-n-25 px-4 py-3.5 shadow-[0_0_0_1px_var(--n-150)] open:bg-white">
                  <summary className="cursor-pointer list-none text-[15px] font-medium text-n-950 marker:hidden [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-4">
                      {f.q}
                      <span aria-hidden="true" className="mt-0.5 text-n-400 transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-2 text-[14.5px] leading-6 text-n-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <PartnerEnquiryForm fallbackEmail={contact.salesEmail} />
          </div>
        </div>
      </section>
    </>
  );
}
