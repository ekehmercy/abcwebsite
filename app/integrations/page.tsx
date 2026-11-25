import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/config/site";
import { integrationCategories, integrationStatusLabels, publicIntegrations, type IntegrationStatus } from "@/config/integrations";
import { strictClaims } from "@/lib/claims";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { LeadForm } from "@/components/forms/lead-form";
import { IntegrationDirectory } from "@/components/marketing/integration-directory";
import { FinalCta } from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "Integrations",
  description:
    "How Axtara connects with accounting, payroll, payments, identity verification, estimating, procurement and document systems — and how to request a new integration.",
  path: "/integrations",
});

const statusDefs: Record<IntegrationStatus, string> = {
  available: "Live in the product today and confirmed by our team.",
  planned: "On the roadmap. Timing depends on customer demand and regional requirements.",
  "under-evaluation": "We are assessing options and providers. No partnership is implied.",
  "customer-requested": "Requested by customers. Add your voice using the form below.",
};

export default function IntegrationsPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-10 sm:pt-16 lg:pb-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(60%_70%_at_20%_10%,#000_10%,transparent_70%)]" />
        <div className="container-x relative grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Integrations</Eyebrow>
            <h1 className="t-h1 mt-4 text-n-950">Keep the tools you trust. Connect the work that matters.</h1>
            <p className="t-lead mt-5 text-n-600">
              Axtara is designed to complement specialist systems, not replace them. Approved records from the field — hours, expenses, project costs — should flow into the accounting, payroll and document tools you already rely on.
            </p>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <div className="rounded-xl bg-white p-5 shadow-[0_0_0_1px_var(--n-150)]">
              <p className="text-[13px] font-medium text-n-900">How to read this page</p>
              <dl className="mt-3 space-y-2.5">
                {(Object.keys(statusDefs) as IntegrationStatus[]).map((s) => (
                  <div key={s} className="text-[14px] leading-5">
                    <dt className="font-medium text-n-800">{integrationStatusLabels[s]}</dt>
                    <dd className="text-n-600">{statusDefs[s]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="dir-title" className="pb-24">
        <div className="container-x">
          <h2 id="dir-title" className="sr-only">Integration directory</h2>
          <IntegrationDirectory items={publicIntegrations} strict={strictClaims} />
          <p className="mt-5 max-w-3xl text-[13.5px] leading-6 text-n-500">
            Third-party products are not named here until an integration and any commercial relationship have been confirmed. Where a third-party service is used, it is subscribed to and billed separately by its provider.
          </p>
        </div>
      </section>

      <section aria-labelledby="cat-title" className="border-y border-n-150 bg-white py-24">
        <div className="container-x">
          <SectionIntro id="cat-title" eyebrow="Categories" title="Where Axtara fits alongside your systems." />
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {integrationCategories.map((c) => (
              <li key={c.id} className="border-t border-n-150 pt-5">
                <Icon name={c.icon} className="size-5 text-brand-600" />
                <h3 className="mt-3 text-[16px] font-medium text-n-950">{c.name}</h3>
                <p className="mt-1.5 text-[14.5px] leading-6 text-n-600">{c.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="request" aria-labelledby="req-title" className="scroll-mt-20 py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionIntro id="req-title" eyebrow="Request an integration" title="Need Axtara to connect with something you already use?" lead="Tell us which application and what should move between the two. Requests shape our integration roadmap." />
          </div>
          <div className="lg:col-span-7">
            <LeadForm form="integration-request" fallbackEmail={contact.salesEmail} />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
