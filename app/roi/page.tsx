import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SectionIntro } from "@/components/ui/section";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { FinalCta } from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "ROI Calculator — Estimate the value of Axtara",
  description:
    "Estimate the administrative time Axtara could help your construction business recover — crew time, site reports, project updates — and its value against your subscription.",
  path: "/roi",
});

const notes = [
  {
    t: "Start with the work, not the software",
    d: "List the hours your office spends each month collecting site updates, correcting time, compiling reports and chasing answers. The starting figures are illustrative — replace them with your own.",
  },
  {
    t: "Choose a figure you could defend",
    d: "The percentage of those hours you expect to recover drives the estimate. Teams usually start with one workflow, measure it for a few weeks, then extend.",
  },
  {
    t: "Time value is not the same as cash",
    d: "Recovered hours are valued at your staff cost. Whether that becomes a cash saving depends on how you use the time — more projects with the same team, less overtime, fewer agency hours.",
  },
  {
    t: "What this leaves out",
    d: "Better records have value that's hard to price: fewer disputed hours, faster answers on site and a clear trail when questions come up. The estimate doesn't include them.",
  },
];

export default function RoiPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-14 sm:pt-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(60%_70%_at_50%_0%,#000,transparent)]" />
        <div className="container-x relative">
          <SectionIntro
            as="h1"
            eyebrow="ROI calculator"
            title="See what your admin time is worth."
            lead="Estimate the hours Axtara could help your team recover each month, what that time is worth and how it compares with your subscription."
          />
        </div>
      </section>

      <section aria-labelledby="roi-calc-title" className="pb-24">
        <div className="container-x">
          <h2 id="roi-calc-title" className="sr-only">Estimate the value</h2>
          <RoiCalculator />
          <p className="mt-4 text-[13px] text-n-500">
            Figures stay in your browser. Nothing you enter here is sent to Axtara.
          </p>
        </div>
      </section>

      <section aria-labelledby="roi-notes-title" className="border-t border-n-150 bg-white py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionIntro id="roi-notes-title" eyebrow="How the estimate works" title="Honest numbers make better decisions." />
          </div>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {notes.map((n) => (
              <div key={n.t} className="border-l-2 border-brand-200 pl-5" data-reveal>
                <dt className="text-[16px] font-medium text-n-950">{n.t}</dt>
                <dd className="mt-1.5 text-[14.5px] leading-6 text-n-600">{n.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FinalCta title="Test the estimate against your own records." lead="We'll walk through the workflows behind your figures and show where Axtara recovers the time." />
    </>
  );
}
