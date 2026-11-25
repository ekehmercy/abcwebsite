import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/config/site";
import { regions } from "@/config/regions";
import { policies } from "@/config/legal";
import { securityPrinciples, trustTopics } from "@/content/security";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Security and Trust",
  description:
    "How Axtara approaches data protection, access control, employee privacy, location and biometric information, and regional privacy law in Jamaica, Nigeria, Guyana and the United States.",
  path: "/security",
});

const statusLabel = (s: "implemented" | "commitment") => (s === "implemented" ? "In place" : "Design commitment");
const complianceLabel = { verified: "Verified", "in-review": "Assessment in progress", "not-yet-assessed": "Not yet assessed" } as const;

export default function SecurityPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-10 sm:pt-16">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(60%_70%_at_20%_10%,#000_10%,transparent_70%)]" />
        <div className="container-x relative grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Security and Trust</Eyebrow>
            <h1 className="t-h1 mt-4 text-n-950">Operational visibility should never come at the expense of privacy.</h1>
            <p className="t-lead mt-5 text-n-600">
              Axtara holds information about people and the work they do. This page explains how we approach that responsibility — and is precise about what is in place today and what is a design commitment.
            </p>
          </div>
          <aside className="lg:col-span-5 lg:pt-10">
            <div className="rounded-xl bg-white p-5 shadow-[0_0_0_1px_var(--n-150)]">
              <p className="flex items-center gap-2 text-[14px] font-medium text-n-900"><Info className="size-4 text-brand-600" aria-hidden="true" />About the labels on this page</p>
              <dl className="mt-3 space-y-2.5 text-[14px] leading-5">
                <div><dt className="font-medium text-n-800">In place</dt><dd className="text-n-600">Implemented and verified by our engineering team.</dd></div>
                <div><dt className="font-medium text-n-800">Design commitment</dt><dd className="text-n-600">A requirement the product is designed to meet. Ask us for current implementation status during your evaluation.</dd></div>
              </dl>
              <p className="mt-4 border-t border-n-150 pt-4 text-[13.5px] leading-5 text-n-600">
                Nothing on this website claims that Axtara holds ISO 27001, SOC 2 or any other certification, or regulatory approval in any jurisdiction. Any certification will be published here only once it has been formally obtained.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="border-y border-n-150 bg-white py-24">
        <div className="container-x">
          <SectionIntro id="principles-title" eyebrow="Principles" title="How Axtara is designed to protect your data." />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-xl bg-n-150 shadow-[0_0_0_1px_var(--n-150)] sm:grid-cols-2 lg:grid-cols-3">
            {securityPrinciples.map((p) => (
              <li key={p.id} className="bg-white p-6">
                <span className={cn("rounded px-1.5 py-0.5 text-[11.5px] font-medium", p.status === "implemented" ? "bg-ok-bg text-ok" : "bg-n-100 text-n-600")}>{statusLabel(p.status)}</span>
                <h3 className="mt-3 text-[16px] font-medium text-n-950">{p.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-6 text-n-600">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="topics-title" className="py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <SectionIntro id="topics-title" eyebrow="In detail" title="Trust centre" />
              <nav aria-label="Trust centre topics" className="mt-8 hidden lg:block">
                <ul className="space-y-1.5 text-[14px]">
                  {trustTopics.map((t) => (
                    <li key={t.id}><a href={`#${t.id}`} className="text-n-600 hover:text-n-950">{t.title}</a></li>
                  ))}
                  <li><a href="#regions" className="text-n-600 hover:text-n-950">Regional privacy law</a></li>
                  <li><a href="#contact" className="text-n-600 hover:text-n-950">Contact the security team</a></li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="divide-y divide-n-150 border-y border-n-150 lg:col-span-8">
            {trustTopics.map((t) => (
              <article key={t.id} id={t.id} className="scroll-mt-24 py-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[18px] font-medium tracking-[-0.01em] text-n-950">{t.title}</h3>
                  <span className="text-[12px] font-medium text-n-500">{statusLabel(t.status)}</span>
                </div>
                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-n-600">{t.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="regions" aria-labelledby="regions-title" className="dark-surface scroll-mt-20 bg-ink-900 py-24 text-white">
        <div className="container-x">
          <SectionIntro dark id="regions-title" eyebrow="By market" title="Regional privacy and compliance." lead="The frameworks below are relevant to customers in each market. Listing a framework is not a statement that Axtara is registered, certified or compliant under it — the status shown is our own verified position." />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-xl bg-white/10 md:grid-cols-2">
            {regions.map((r) => (
              <li key={r.code} className="bg-ink-900 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[20px] font-medium tracking-[-0.01em]">{r.name}</h3>
                  <span className="rounded bg-white/8 px-2 py-0.5 text-[12px] font-medium text-white/80 ring-1 ring-white/15">{complianceLabel[r.complianceStatus]}</span>
                </div>
                <ul className="mt-5 space-y-4">
                  {r.privacyFrameworks.map((f) => (
                    <li key={f.name}>
                      <p className="text-[15px] font-medium text-white">{f.name}</p>
                      <p className="mt-1 text-[14px] leading-6 text-white/65">{f.note}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-white/10 pt-4 text-[14px] leading-6 text-white/75">{r.complianceNote}</p>
                {r.contractingEntity?.verified && <p className="mt-2 text-[13px] text-white/55">Contracting entity: {r.contractingEntity.name}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionIntro id="contact-title" eyebrow="Contact" title="Security or privacy question?" lead="Use this form for privacy requests, security questions or to report a vulnerability responsibly." />
            {(contact.securityEmail || contact.privacyEmail) && (
              <p className="mt-6 text-[15px] text-n-700">
                Or email{" "}
                {contact.securityEmail && <a className="font-medium text-brand-700 underline" href={`mailto:${contact.securityEmail}`}>{contact.securityEmail}</a>}
                {contact.securityEmail && contact.privacyEmail && " / "}
                {contact.privacyEmail && <a className="font-medium text-brand-700 underline" href={`mailto:${contact.privacyEmail}`}>{contact.privacyEmail}</a>}
              </p>
            )}
            <div className="mt-10">
              <p className="text-[13px] font-medium text-n-900">Policies</p>
              <ul className="mt-3 divide-y divide-n-150 border-y border-n-150">
                {policies.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/legal/${p.slug}`} className="group flex items-center justify-between py-3 text-[15px] text-n-800 hover:text-n-950">
                      <span>{p.title}{p.status !== "published" && <span className="ml-2 text-[12.5px] text-n-500">Being finalised</span>}</span>
                      <ArrowRight className="size-4 text-n-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7">
            <LeadForm form="security-contact" fallbackEmail={contact.securityEmail ?? contact.privacyEmail} />
          </div>
        </div>
      </section>
    </>
  );
}
