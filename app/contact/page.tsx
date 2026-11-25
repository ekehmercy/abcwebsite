import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/config/site";
import { LeadForm } from "@/components/forms/lead-form";
import { Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = pageMetadata({
  title: "Contact Axtara",
  description: "Get in touch with the Axtara team about sales, support, partnerships or anything else.",
  path: "/contact",
});

const emails = [
  { label: "Sales", value: contact.salesEmail },
  { label: "Support", value: contact.supportEmail },
  { label: "Privacy", value: contact.privacyEmail },
].filter((e): e is { label: string; value: string } => Boolean(e.value));

const routes = [
  { href: "/demo", title: "See the product", body: "Request a demonstration tailored to your business." },
  { href: "/security", title: "Security and privacy", body: "Questions about data protection or reporting a vulnerability." },
  { href: "/integrations#request", title: "Integration requests", body: "Tell us which system you need Axtara to connect with." },
];

export default function ContactPage() {
  return (
    <section className="pb-24 pt-10 sm:pt-16 lg:pb-32">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="t-h1 mt-4 text-n-950">Talk to the Axtara team.</h1>
          <p className="t-lead mt-5 text-n-600">Send us a message and the right person will reply by email.</p>

          {emails.length > 0 && (
            <dl className="mt-10 space-y-3">
              {emails.map((e) => (
                <div key={e.label} className="flex gap-4 text-[15px]">
                  <dt className="w-20 text-n-500">{e.label}</dt>
                  <dd><a href={`mailto:${e.value}`} className="font-medium text-brand-700 underline-offset-4 hover:underline">{e.value}</a></dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-10 divide-y divide-n-150 border-y border-n-150">
            {routes.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="group flex items-start justify-between gap-4 py-4">
                  <span>
                    <span className="block text-[15.5px] font-medium text-n-950">{r.title}</span>
                    <span className="mt-0.5 block text-[14px] text-n-600">{r.body}</span>
                  </span>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-n-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <LeadForm form="contact" fallbackEmail={contact.salesEmail} />
        </div>
      </div>
    </section>
  );
}
