import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { pageMetadata, jsonLd } from "@/lib/seo";
import { faqGroups } from "@/content/faq";
import { Eyebrow } from "@/components/ui/section";
import { FinalCta } from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description: "Answers to common questions about Axtara — attendance and location, payroll preparation, pricing, markets, security and data.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqGroups.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))),
        })}
      />
      <section className="pb-24 pt-10 sm:pt-16 lg:pb-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Eyebrow>FAQs</Eyebrow>
              <h1 className="t-h1 mt-4 text-n-950">Questions, answered.</h1>
              <p className="t-lead mt-5 text-n-600">Can&apos;t find what you need? <Link href="/contact" className="font-medium text-brand-700 underline-offset-4 hover:underline">Contact us</Link>.</p>
              <nav aria-label="FAQ sections" className="mt-8">
                <ul className="flex flex-wrap gap-2 lg:block lg:space-y-1.5">
                  {faqGroups.map((g) => (
                    <li key={g.id}>
                      <a href={`#${g.id}`} className="inline-flex rounded-md bg-white px-3 py-1.5 text-[14px] text-n-700 shadow-[0_0_0_1px_var(--n-150)] hover:text-n-950 lg:bg-transparent lg:p-0 lg:shadow-none">{g.title}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          <div className="space-y-14 lg:col-span-8">
            {faqGroups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-24">
                <h2 id={`${g.id}-title`} className="text-[13px] font-medium text-n-500">{g.title}</h2>
                <div className="mt-3 divide-y divide-n-150 border-y border-n-150">
                  {g.items.map((i) => (
                    <details key={i.q} className="group">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] font-medium tracking-[-0.01em] text-n-950 [&::-webkit-details-marker]:hidden">
                        {i.q}
                        <Plus className="mt-1 size-4 shrink-0 text-n-500 transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                      </summary>
                      <p className="-mt-1 max-w-2xl pb-6 text-[15.5px] leading-7 text-n-600">{i.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
