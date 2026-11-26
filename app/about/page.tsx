import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { regions } from "@/config/regions";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { EditorialImage } from "@/components/ui/editorial-image";
import { FinalCta } from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "About Axtara",
  description:
    "Axtara is the connected workforce and project operations platform from Anchor Bridge, serving construction and project-driven businesses in Jamaica, Nigeria, Guyana and the United States.",
  path: "/about",
});

const principles = [
  { title: "Start where the work happens", body: "If it doesn't work at the site gate at 6 a.m., it doesn't work. Field experiences come first." },
  { title: "One record, many people", body: "Supervisors, project managers, finance and leadership should be looking at the same approved information." },
  { title: "Say exactly what it does", body: "Plain language about what Axtara does and what it connects to. No inflated claims, no invented numbers." },
  { title: "Respect the people being recorded", body: "Attendance, location and identity features are designed around the worker's privacy and rights, not only the employer's convenience." },
];

export default function AboutPage() {
  return (
    <>
      <section className="pb-20 pt-10 sm:pt-16 lg:pb-28">
        <div className="container-x">
          <div className="max-w-4xl">
            <Eyebrow>About</Eyebrow>
            <h1 className="t-h1 mt-4 text-n-950">Software for the businesses that build things.</h1>
            <p className="t-lead mt-6 max-w-2xl text-n-600">
              {site.name} connects the people doing the work with the people managing it. One platform for workforce, field operations, projects, approvals and payroll preparation — built for construction and project-driven businesses, and a product of {site.parentCompany}.
            </p>
          </div>
          <EditorialImage slot="about" variant={0} className="mt-14 aspect-[16/9] rounded-2xl sm:aspect-[21/9]" sizes="100vw" />
        </div>
      </section>

      <section aria-labelledby="why-title" className="border-y border-n-150 bg-white py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro id="why-title" eyebrow="Why Axtara" title="The work is connected. The tools weren't." />
          </div>
          <div className="space-y-5 text-[16.5px] leading-8 text-n-700 lg:col-span-7 lg:pt-12">
            <p>
              On most construction and project sites, the information that matters most — who turned up, what they did, what it cost — starts on paper, in a group chat or in someone&apos;s memory. It is rebuilt by hand in spreadsheets before it reaches the people who approve it, pay for it or make decisions from it.
            </p>
            <p>
              Large software suites were built for large enterprises in a handful of markets. Many growing contractors, subcontractors and developers — particularly in the Caribbean and West Africa — have been left choosing between tools that don&apos;t fit and processes that don&apos;t scale.
            </p>
            <p>
              Axtara closes that gap: a single connected record that starts with the person doing the work and carries through to the supervisors, project managers, finance teams and leaders who rely on it.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="py-24">
        <div className="container-x">
          <SectionIntro id="principles-title" eyebrow="How we build" title="The principles behind the product." />
          <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <li key={p.title} className="border-t border-n-200 pt-5">
                <span className="text-[13px] font-medium tabular-nums text-n-400">0{i + 1}</span>
                <h3 className="mt-3 text-[17px] font-medium tracking-[-0.01em] text-n-950">{p.title}</h3>
                <p className="mt-2 text-[14.5px] leading-6 text-n-600">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="company-title" className="border-t border-n-150 bg-white py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro id="company-title" eyebrow="Company and markets" title="Where Axtara operates." />
          </div>
          <div className="lg:col-span-7 lg:pt-12">
            <dl className="divide-y divide-n-150 border-y border-n-150">
              <div className="grid gap-1 py-5 sm:grid-cols-[200px_1fr]">
                <dt className="text-[14px] text-n-500">Product of</dt>
                <dd className="text-[15.5px] text-n-900">{site.parentCompany}</dd>
              </div>
              {regions.map((r) => (
                <div key={r.code} className="grid gap-1 py-5 sm:grid-cols-[200px_1fr]">
                  <dt className="text-[14px] text-n-500">{r.name}</dt>
                  <dd className="text-[15.5px] text-n-900">
                    {r.contractingEntity?.verified ? `Offered by ${r.contractingEntity.name}` : "Serving construction and project-driven businesses"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
