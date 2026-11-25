import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { fitRoles, publicStages } from "@/content/lifecycle";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { LinkButton, TextLink } from "@/components/ui/button";
import { LifecycleExplorer } from "@/components/marketing/lifecycle-explorer";
import { FinalCta } from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "Where Axtara Fits Across a Construction Project",
  description:
    "From package preparation and bidding to mobilisation, execution, inspection, handover and closeout — what general contractors, developers and subcontractors do in Axtara at each stage, and which specialist tools sit alongside.",
  path: "/lifecycle",
  ogTitle: "Where Axtara fits across a construction project",
});

export default function LifecyclePage() {
  return (
    <>
      <section aria-labelledby="life-title" className="relative overflow-hidden pb-12 pt-12 lg:pb-16 lg:pt-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[560px] [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_10%,transparent_75%)]" />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Project lifecycle</Eyebrow>
            <h1 id="life-title" className="t-h1 mt-5 text-n-950">Where Axtara fits across a construction project.</h1>
          </div>
          <div className="lg:col-span-5">
            <p className="t-lead text-n-600">
              From the first work package to the last closeout document. Axtara does its heaviest lifting once work is awarded — and keeps the records that connect every stage before and after.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/demo?interest=platform" arrow>Request a Demo</LinkButton>
              <LinkButton href="/collaboration" variant="secondary">How companies collaborate</LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Roles legend */}
      <section aria-label="How Axtara takes part in each stage" className="pb-10">
        <div className="container-x">
          <dl className="grid gap-px overflow-hidden rounded-xl bg-n-150 md:grid-cols-3">
            {Object.values(fitRoles).map((r) => (
              <div key={r.label} className="bg-white p-5">
                <dt className="text-[15px] font-medium text-n-950">{r.label}</dt>
                <dd className="mt-1 text-[14px] leading-6 text-n-600">{r.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {publicStages.length > 0 && (
        <section aria-labelledby="stages-title" className="border-t border-n-150 py-16 lg:py-24">
          <div className="container-x">
            <SectionIntro id="stages-title" eyebrow="Eight stages" title="Choose a stage. Choose your side of the contract." lead="See the problem each company faces, what it does in Axtara, what happens on site and the records left behind." />
            <div className="mt-10">
              <LifecycleExplorer stages={publicStages} />
            </div>
          </div>
        </section>
      )}

      <section aria-label="Related" className="border-t border-n-150 bg-white py-14">
        <div className="container-x flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[16px] text-n-700">Every stage relies on the same rule: each company shares the work, and keeps its own books.</p>
          <div className="flex flex-wrap gap-5">
            <TextLink href="/collaboration">Shared projects, separate companies</TextLink>
            <TextLink href="/integrations">Integrations</TextLink>
          </div>
        </div>
      </section>

      <FinalCta title="See your project's stages in Axtara." lead="Bring one live project. We'll show you where Axtara takes over from the tools you already use, stage by stage." />
    </>
  );
}
