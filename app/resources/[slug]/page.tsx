import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { categoryName, getArticle, visibleArticles } from "@/content/resources";
import { FinalCta } from "@/components/marketing/home-sections";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return visibleArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.summary, path: `/resources/${a.slug}`, noindex: a.status !== "published" });
}

const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const visible = visibleArticles();
  const related = [
    ...visible.filter((x) => x.slug !== a.slug && x.category === a.category),
    ...visible.filter((x) => x.slug !== a.slug && x.category !== a.category),
  ].slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.summary,
          datePublished: a.date,
          publisher: { "@type": "Organization", name: site.parentCompany },
          mainEntityOfPage: new URL(`/resources/${a.slug}`, site.url).toString(),
        })}
      />
      <article className="pb-24 pt-12 sm:pt-16">
        <div className="container-x">
          <div className="mx-auto max-w-[68ch]">
            <Link href="/resources" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-n-600 hover:text-n-950">
              <ArrowLeft className="size-4" aria-hidden="true" />All resources
            </Link>
            <header className="mt-10">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13.5px] text-n-500">
                <Link href={`/resources?category=${a.category}`} className="font-medium text-brand-700 hover:underline">{categoryName(a.category)}</Link>
                <span aria-hidden="true">·</span>
                <time dateTime={a.date}>{fmt(a.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{a.readingMinutes} min read</span>
                {a.status === "draft" && <span className="rounded-sm bg-accent-100/70 px-1.5 py-0.5 text-[11.5px] font-medium text-accent-700 ring-1 ring-inset ring-accent-300/60">Draft — not published</span>}
              </p>
              <h1 className="t-h2 mt-5 text-n-950">{a.title}</h1>
              <p className="t-lead mt-5 text-n-600">{a.summary}</p>
            </header>
            <div className="mt-12 border-t border-n-150 pt-10 text-[17px] leading-[1.75] text-n-800">
              {a.body.map((b, i) =>
                b.type === "h2" ? (
                  <h2 key={i} className="mb-3 mt-10 text-[22px] font-semibold leading-snug tracking-[-0.015em] text-n-950 first:mt-0">{b.text}</h2>
                ) : b.type === "p" ? (
                  <p key={i} className="mb-5">{b.text}</p>
                ) : (
                  <ul key={i} className="mb-6 space-y-2 pl-5 [list-style:disc] marker:text-n-400">
                    {b.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                ),
              )}
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-n-150 bg-white py-20">
          <div className="container-x">
            <h2 id="related-title" className="t-h3 text-n-950">Related reading</h2>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-xl bg-n-150 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="bg-white">
                  <Link href={`/resources/${r.slug}`} className="group flex h-full flex-col p-6 hover:bg-n-25">
                    <span className="text-[13px] font-medium text-brand-700">{categoryName(r.category)}</span>
                    <span className="mt-2 text-[17px] font-medium leading-snug text-n-950 group-hover:text-brand-700">{r.title}</span>
                    <span className="mt-2 text-[14.5px] leading-6 text-n-600">{r.summary}</span>
                    <span className="mt-auto pt-4 text-[13px] text-n-500">{r.readingMinutes} min read</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}

