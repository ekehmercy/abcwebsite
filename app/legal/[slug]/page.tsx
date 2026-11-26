import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { policies, getPolicy } from "@/config/legal";
import { contact } from "@/config/site";
import { Eyebrow } from "@/components/ui/section";
import { CookiePreferencesButton } from "@/components/layout/cookie-consent";
import { analyticsConfig } from "@/config/analytics";
import { buttonClass } from "@/components/ui/button";

export const dynamicParams = false;

/** What each policy covers — shown alongside the request path until the full text is published here. */
const covers: Record<string, string[]> = {
  privacy: ["What personal information Axtara processes, and why", "Employee, location and biometric information", "How long information is kept", "Your rights and how to exercise them"],
  terms: ["Use of the Axtara platform and website", "Customer and user responsibilities", "Service availability and support", "Liability and governing law"],
  subscription: ["Subscription plans and active-worker billing", "Billing arrangements, renewals and changes", "Cancellation and data export", "Implementation and third-party charges"],
  cookies: ["Storage used by this website", "Optional analytics and consent", "How to change your preferences"],
};

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPolicy(slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.summary, path: `/legal/${p.slug}`, noindex: p.status !== "published" });
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPolicy(slug);
  if (!p) notFound();

  return (
    <section className="pb-24 pt-10 sm:pt-16 lg:pb-32">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <Eyebrow>Legal</Eyebrow>
          <nav aria-label="Legal policies" className="mt-6">
            <ul className="space-y-2">
              {policies.map((x) => (
                <li key={x.slug}>
                  <Link href={`/legal/${x.slug}`} aria-current={x.slug === p.slug ? "page" : undefined} className={x.slug === p.slug ? "text-[14.5px] font-medium text-n-950" : "text-[14.5px] text-n-600 hover:text-n-950"}>
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl lg:col-span-9">
          <h1 className="t-h2 text-n-950">{p.title}</h1>
          <p className="t-lead mt-4 text-n-600">{p.summary}</p>

          {p.status === "published" ? (
            <>
              {p.effectiveDate && <p className="mt-4 text-[14px] text-n-500">Effective {p.effectiveDate}</p>}
              <div className="mt-10 space-y-5 text-[16px] leading-8 text-n-700">
                {p.content.map((b, i) =>
                  b.type === "h2" ? (
                    <h2 key={i} className="pt-4 text-[22px] font-semibold tracking-[-0.015em] text-n-950">{b.text}</h2>
                  ) : (
                    <p key={i}>{b.text}</p>
                  ),
                )}
              </div>
            </>
          ) : (
            <div className="mt-10 rounded-xl bg-white p-6 shadow-[0_0_0_1px_var(--n-150)] sm:p-8">
              <FileText className="size-6 text-brand-600" aria-hidden="true" />
              <h2 className="mt-4 text-[19px] font-semibold tracking-[-0.01em] text-n-950">What this policy covers</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15.5px] leading-7 text-n-600 marker:text-n-300">
                {(covers[p.slug] ?? []).map((c) => <li key={c}>{c}</li>)}
              </ul>
              <p className="mt-5 border-t border-n-150 pt-5 text-[15.5px] leading-7 text-n-600">
                {(p.slug === "terms" || p.slug === "subscription") && "The terms that apply to your subscription are set out in your order form and agreement. "}
                To request the current version of this policy,{" "}
                {contact.privacyEmail ? (
                  <>email <a className="font-medium text-brand-700 underline" href={`mailto:${contact.privacyEmail}`}>{contact.privacyEmail}</a></>
                ) : (
                  <Link className="font-medium text-brand-700 underline" href="/security?topic=privacy#contact">contact our privacy team</Link>
                )}
                .
              </p>
            </div>
          )}

          {p.slug === "cookies" && (
            <section aria-labelledby="storage-title" className="mt-12">
              <h2 id="storage-title" className="text-[20px] font-semibold tracking-[-0.01em] text-n-950">What this website stores</h2>
              <div className="mt-5 overflow-x-auto rounded-xl shadow-[0_0_0_1px_var(--n-150)]">
                <table className="w-full min-w-[520px] border-collapse bg-white text-left text-[14.5px]">
                  <thead className="text-n-500">
                    <tr>
                      {["Name", "Type", "Purpose", "Category"].map((h) => <th key={h} scope="col" className="border-b border-n-150 px-4 py-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="text-n-800 [&_td]:border-b [&_td]:border-n-100 [&_td]:px-4 [&_td]:py-3 [&>tr:last-child>td]:border-b-0">
                    <tr><td className="font-mono text-[13px]">axtara-region</td><td>Local storage</td><td>Remembers the region you select</td><td>Essential</td></tr>
                    <tr><td className="font-mono text-[13px]">axtara-consent-v1</td><td>Local storage</td><td>Remembers your cookie preferences</td><td>Essential</td></tr>
                    <tr>
                      <td>Analytics</td>
                      <td>{analyticsConfig.provider === "none" ? "—" : analyticsConfig.provider === "plausible" ? "Cookieless script" : "Configured provider"}</td>
                      <td>{analyticsConfig.provider === "none" ? "Not enabled on this website" : "Aggregate measurement of visits and key actions"}</td>
                      <td>{analyticsConfig.provider === "none" ? "—" : "Optional — only with your consent"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CookiePreferencesButton className={buttonClass("secondary", "md", "mt-6")} />
            </section>
          )}
        </article>
      </div>
    </section>
  );
}
