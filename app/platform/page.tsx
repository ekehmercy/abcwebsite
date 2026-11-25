import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowDown, CheckCircle2, Landmark, BookOpen, FileSpreadsheet } from "lucide-react";
import { getModule, modules, type ModuleSlug } from "@/config/features";
import { pageMetadata } from "@/lib/seo";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow, SectionIntro } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { OverviewScreen } from "@/components/product-demo/screens";
import { IllustrativeNote } from "@/components/product-demo/primitives";
import { FinalCta } from "@/components/marketing/home-sections";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Platform Overview — One connected operations platform",
  description:
    "See how Axtara connects workforce, field operations, projects, approvals, costs, payroll preparation, compliance and reporting — and how information flows from the site to management.",
  path: "/platform",
});

function Node({ slug, tone = "record" }: { slug: ModuleSlug; tone?: "record" | "decision" }) {
  const m = getModule(slug)!;
  return (
    <Link
      href={`/platform/${slug}`}
      className={cn(
        "group flex items-center gap-3 rounded-lg bg-white px-3.5 py-3 shadow-[0_0_0_1px_var(--n-150)] transition-[box-shadow,transform] hover:-translate-y-px hover:shadow-[0_0_0_1px_var(--brand-300),var(--shadow-card)]",
      )}
    >
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", tone === "record" ? "bg-brand-50 text-brand-700" : "bg-n-100 text-n-700")}>
        <Icon name={m.icon} className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-medium text-n-950">{m.name}</span>
        <span className="block truncate text-[12.5px] text-n-500">{m.navDescription}</span>
      </span>
      <ArrowRight className="size-3.5 shrink-0 text-n-300 transition-colors group-hover:text-brand-600" aria-hidden="true" />
    </Link>
  );
}

function Lane({ n, title, kind, children, className }: { n: string; title: string; kind: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col rounded-2xl p-4", className)}>
      <p className="flex items-center gap-2 text-[12.5px] font-medium text-n-500"><span className="font-mono text-n-400">{n}</span>{kind}</p>
      <h3 className="mt-1 text-[17px] font-medium tracking-[-0.01em] text-n-950">{title}</h3>
      <div className="mt-4 flex flex-1 flex-col gap-2">{children}</div>
    </div>
  );
}

const Arrow = () => (
  <div aria-hidden="true" className="flex items-center justify-center text-brand-400">
    <ArrowRight className="hidden size-5 lg:block" />
    <ArrowDown className="size-5 lg:hidden" />
  </div>
);

export default function PlatformPage() {
  return (
    <>
      <section aria-labelledby="platform-title" className="relative overflow-hidden pb-16 pt-12 lg:pb-24 lg:pt-20">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[760px] [mask-image:radial-gradient(60%_60%_at_50%_25%,#000_10%,transparent_75%)]" />
        <div className="container-x relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Platform overview</Eyebrow>
              <h1 id="platform-title" className="t-h1 mt-5 text-n-950">One connected environment, from the site to the boardroom.</h1>
            </div>
            <div className="lg:col-span-5">
              <p className="t-lead text-n-600">
                Axtara is not a set of separate tools. Work recorded in the field is reviewed, approved and then used — by project managers, finance and leadership — without being re-keyed.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton href="/demo" arrow>Request a Demo</LinkButton>
                <LinkButton href="/#journey" variant="secondary">Take the product tour</LinkButton>
              </div>
            </div>
          </div>
          <div className="mt-14" data-reveal>
            <OverviewScreen stage={3} />
            <IllustrativeNote className="mt-3" />
          </div>
        </div>
      </section>

      {/* Product map */}
      <section aria-labelledby="map-title" className="border-y border-n-150 bg-white py-20 lg:py-28">
        <div className="container-x">
          <SectionIntro
            id="map-title"
            eyebrow="Product map"
            title="How information moves through Axtara."
            lead="Select any module to explore it. Records are captured in the field, approved by the right person, and only then used for project, cost and payroll decisions. Payment itself happens outside Axtara."
          />

          <div className="mt-14 grid gap-3 lg:grid-cols-[1fr_auto_0.8fr_auto_1fr_auto_0.85fr] lg:items-stretch" data-reveal>
            <Lane n="01" kind="Operational records" title="Captured in the field" className="bg-n-50">
              <Node slug="workforce" />
              <Node slug="time-attendance" />
              <Node slug="field-operations" />
              <Node slug="expenses" />
            </Lane>
            <Arrow />
            <Lane n="02" kind="Approval stage" title="Reviewed and approved" className="bg-brand-50/60">
              <div className="flex flex-1 flex-col justify-center gap-3 rounded-lg border border-dashed border-brand-300 bg-white p-4">
                {["Supervisor reviews attendance and reports", "Corrections are recorded, not overwritten", "Approvals are attributed and time-stamped"].map((t) => (
                  <p key={t} className="flex gap-2 text-[13.5px] leading-5 text-n-700"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />{t}</p>
                ))}
              </div>
            </Lane>
            <Arrow />
            <Lane n="03" kind="Decisions" title="Used by the business" className="bg-n-50">
              <Node slug="project-operations" tone="decision" />
              <Node slug="payroll" tone="decision" />
              <Node slug="reporting" tone="decision" />
            </Lane>
            <Arrow />
            <Lane n="04" kind="Outside Axtara" title="Processed externally" className="border border-dashed border-n-300">
              {[
                { I: FileSpreadsheet, t: "Payroll provider", d: "Calculates and runs payroll" },
                { I: Landmark, t: "Bank or payment provider", d: "Transfers wages and reimbursements" },
                { I: BookOpen, t: "Accounting system", d: "Records financial transactions" },
              ].map(({ I, t, d }) => (
                <div key={t} className="flex items-center gap-3 rounded-lg bg-n-25 px-3.5 py-3">
                  <I className="size-4 shrink-0 text-n-500" aria-hidden="true" />
                  <span><span className="block text-[14px] font-medium text-n-800">{t}</span><span className="block text-[12.5px] text-n-500">{d}</span></span>
                </div>
              ))}
            </Lane>
          </div>

          <div className="mt-3" data-reveal>
            <Link href="/platform/compliance" className="group flex flex-col gap-2 rounded-2xl bg-ink-900 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-3">
                <Icon name="ShieldCheck" className="size-5 text-brand-300" />
                <span><span className="block text-[15px] font-medium">Safety and Compliance runs across every stage</span><span className="block text-[13.5px] text-white/60">Certifications, incidents, credentials and approval records — attached to the people and projects they relate to.</span></span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-white/60 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <dl className="mt-10 grid gap-6 border-t border-n-150 pt-8 text-[14px] sm:grid-cols-3">
            <div><dt className="flex items-center gap-2 font-medium text-n-900"><span className="size-2.5 rounded-sm bg-brand-500" />Operational records</dt><dd className="mt-1 text-n-600">What happened: hours, reports, expenses, incidents. Captured once, where the work is done.</dd></div>
            <div><dt className="flex items-center gap-2 font-medium text-n-900"><span className="size-2.5 rounded-sm border border-dashed border-brand-400" />Approval stages</dt><dd className="mt-1 text-n-600">Who confirmed it. Nothing reaches projects or payroll preparation without the right approval.</dd></div>
            <div><dt className="flex items-center gap-2 font-medium text-n-900"><span className="size-2.5 rounded-sm border border-dashed border-n-400" />External transactions</dt><dd className="mt-1 text-n-600">Payment of wages and reimbursements is carried out by your payroll provider or bank. Axtara does not hold funds.</dd></div>
          </dl>
        </div>
      </section>

      {/* All modules */}
      <section aria-labelledby="modules-title" className="py-20 lg:py-28">
        <div className="container-x">
          <SectionIntro id="modules-title" eyebrow="Modules" title="Eight parts. One record of the work." />
          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            {(["People", "Operations", "Control"] as const).map((g) => (
              <div key={g}>
                <h3 className="border-b border-n-200 pb-3 text-[13px] font-medium text-n-500">{g}</h3>
                <ul>
                  {modules.filter((m) => m.navGroup === g).map((m) => (
                    <li key={m.slug} className="border-b border-n-150">
                      <Link href={`/platform/${m.slug}`} className="group block py-5">
                        <span className="flex items-center justify-between text-[17px] font-medium text-n-950">
                          {m.name}
                          <ArrowRight className="size-4 text-n-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
                        </span>
                        <span className="mt-1 block text-[14.5px] leading-6 text-n-600">{m.outcome}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
