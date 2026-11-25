import type { Metadata } from "next";
import { CalendarCheck, MessagesSquare, MonitorPlay } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/config/site";
import { industries } from "@/config/industries";
import { LeadForm } from "@/components/forms/lead-form";
import { Eyebrow } from "@/components/ui/section";
import { MobileApprovals } from "@/components/product-demo/mobile-screens";
import { IllustrativeNote, PhoneFrame } from "@/components/product-demo/primitives";

export const metadata: Metadata = pageMetadata({
  title: "Request a Demo",
  description:
    "See Axtara with your own operation in mind. Request a demonstration of workforce, attendance, field operations, project and payroll preparation workflows.",
  path: "/demo",
});

const expect = [
  { I: MessagesSquare, title: "A short conversation first", body: "We ask how your sites, crews and approvals work today, so the demo reflects your operation." },
  { I: MonitorPlay, title: "A walkthrough of the product", body: "Follow work from clock-in on site through approval, project cost and payroll preparation." },
  { I: CalendarCheck, title: "Clear next steps", body: "Confirmed availability for your market, implementation scope and a quote for your workforce." },
];

export default function DemoPage() {
  return (
    <section className="relative overflow-hidden pb-24 pt-10 sm:pt-16 lg:pb-32">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[620px] [mask-image:radial-gradient(60%_60%_at_30%_20%,#000_10%,transparent_70%)]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-10">
        <div className="lg:col-span-5">
          <Eyebrow>Request a demo</Eyebrow>
          <h1 className="t-h1 mt-4 text-n-950">See Axtara with your operation in mind.</h1>
          <p className="t-lead mt-5 text-n-600">
            Tell us a little about your business. We&apos;ll show you how Axtara connects the people on site with the people approving, costing and paying for the work.
          </p>
        </div>

        <div className="lg:col-span-7 lg:row-span-2">
          <LeadForm form="demo" fallbackEmail={contact.salesEmail} />
        </div>

        <div className="lg:col-span-5">
          <ol className="space-y-6">
            {expect.map(({ I, title, body }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-600 shadow-[0_0_0_1px_var(--n-150)]">
                  <I className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-[15.5px] font-medium text-n-950"><span className="sr-only">Step {i + 1}: </span>{title}</h2>
                  <p className="mt-1 text-[14.5px] leading-6 text-n-600">{body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 hidden items-end gap-6 lg:flex">
            <PhoneFrame label="Supervisor approving attendance in the Axtara mobile app" className="w-[210px]">
              <MobileApprovals approved />
            </PhoneFrame>
            <div className="pb-6">
              <p className="text-[13px] font-medium text-n-500">Common starting points</p>
              <ul className="mt-3 space-y-2">
                {["Replacing paper sign-in sheets", "Approving hours before payroll", "Labour cost by project", "Daily reports from every site"].map((u) => (
                  <li key={u} className="text-[14.5px] text-n-800">{u}</li>
                ))}
              </ul>
              <IllustrativeNote className="mt-6" />
            </div>
          </div>

          <div className="mt-12 border-t border-n-150 pt-6">
            <p className="text-[13px] font-medium text-n-500">Built for</p>
            <p className="mt-2 text-[14.5px] leading-6 text-n-700">{industries.map((i) => i.name).join(" · ")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
