import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { categoryName, resourceCategories, showDrafts, visibleArticles } from "@/content/resources";
import { SectionIntro } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { ResourceBrowser, type ArticleCard } from "@/components/marketing/resource-browser";

export const metadata: Metadata = pageMetadata({
  title: "Resources — Guides and Insights",
  description:
    "Practical guides on construction workforce management, site attendance, field reporting, project visibility and safety records — plus Axtara product guides.",
  path: "/resources",
});

export default function ResourcesPage() {
  const list = visibleArticles();
  const cards: ArticleCard[] = list.map((a) => ({
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    category: a.category,
    categoryName: categoryName(a.category),
    date: a.date,
    readingMinutes: a.readingMinutes,
    draft: a.status === "draft",
  }));

  return (
    <>
      <section className="border-b border-n-150 pb-14 pt-14 sm:pt-20">
        <div className="container-x">
          <SectionIntro
            as="h1"
            eyebrow="Resources"
            title="Guides for running work on site and in the office."
            lead="Practical thinking on workforce, field operations and project visibility — and step-by-step guides to how Axtara works."
          />
          {showDrafts && list.some((a) => a.status === "draft") && (
            <p className="mt-6 max-w-2xl rounded-lg bg-accent-100/50 px-4 py-3 text-[13.5px] text-accent-700 ring-1 ring-inset ring-accent-300/60">
              Preview mode: draft articles are shown for review. They are hidden on the production site until approved.
            </p>
          )}
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-x">
          {cards.length === 0 ? (
            <div className="mx-auto max-w-xl py-16 text-center">
              <h2 className="t-h3 text-n-950">Guides and insights are on the way.</h2>
              <p className="mt-4 text-[16px] leading-7 text-n-600">
                We&apos;re preparing practical guides on attendance, field reporting and project visibility. In the meantime, the platform pages and FAQs cover how Axtara works.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <LinkButton href="/platform" variant="secondary">Explore the Platform</LinkButton>
                <LinkButton href="/faq" variant="secondary">Read the FAQs</LinkButton>
              </div>
            </div>
          ) : (
            <Suspense fallback={null}>
              <ResourceBrowser articles={cards} categories={resourceCategories} />
            </Suspense>
          )}
        </div>
      </section>
    </>
  );
}
