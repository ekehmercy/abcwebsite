import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/config/site";
import { availableIntegrations } from "@/config/integrations";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { IntegrationDirectory, IntegrationRequestForm } from "@/components/marketing/integration-directory";
import { FinalCta } from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "Integrations",
  description:
    "Axtara connects approved field records — hours, expenses and project costs — with your accounting, payroll, payments, identity verification, estimating, procurement and document systems.",
  path: "/integrations",
});

const principles = [
  { title: "Approved records only", body: "Only information a supervisor or manager has approved leaves Axtara for another system." },
  { title: "The minimum data needed", body: "Each connection carries only the fields the receiving system requires." },
  { title: "Your systems stay in charge", body: "Payroll providers run payroll. Banks move money. Accounting systems keep the books. Axtara feeds them clean information." },
];

export default function IntegrationsPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-10 sm:pt-16 lg:pb-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(60%_70%_at_20%_10%,#000_10%,transparent_70%)]" />
        <div className="container-x relative grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Integrations</Eyebrow>
            <h1 className="t-h1 mt-4 text-n-950">Your operation, connected to the tools you trust.</h1>
            <p className="t-lead mt-5 text-n-600">
              Axtara works alongside the specialist systems you already rely on. Approved hours, expenses and project costs move from the field into accounting, payroll and document tools — without re-keying.
            </p>
          </div>
          <ul className="space-y-4 lg:col-span-5 lg:pt-10">
            {principles.map((p) => (
              <li key={p.title} className="border-l-2 border-brand-200 pl-4">
                <p className="text-[15px] font-medium text-n-900">{p.title}</p>
                <p className="mt-0.5 text-[14.5px] leading-6 text-n-600">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="dir-title" className="pb-24">
        <div className="container-x">
          <h2 id="dir-title" className="t-h3 mb-8 text-n-950">Connect by category</h2>
          <IntegrationDirectory available={availableIntegrations} />
          <p className="mt-6 max-w-3xl text-[13.5px] leading-6 text-n-500">
            Third-party services connected to Axtara are subscribed to and billed separately by their providers.
          </p>
        </div>
      </section>

      <section id="request" aria-labelledby="req-title" className="scroll-mt-20 border-t border-n-150 bg-white py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionIntro id="req-title" eyebrow="Connect your systems" title="Use a system that isn't listed?" lead="Tell us which application you use and what should move between it and Axtara. Our team replies with how the connection works for your organisation." />
          </div>
          <div className="lg:col-span-7">
            <IntegrationRequestForm fallbackEmail={contact.salesEmail} />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
