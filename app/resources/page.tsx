import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { categoryName, resourceCategories, visibleArticles } from "@/content/resources";
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
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-x">
          {cards.length === 0 ? (
            <div className="mx-auto max-w-xl py-16 text-center">
              <h2 className="t-h3 text-n-950">See how Axtara works, step by step.</h2>
              <p className="mt-4 text-[16px] leading-7 text-n-600">
                Follow a clock-in from the site gate to payroll preparation in the product tour, browse answers to common questions, or see Axtara with your own projects in a demo.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <LinkButton href="/#journey" variant="secondary">Take the product tour</LinkButton>
                <LinkButton href="/faq" variant="secondary">Read the FAQs</LinkButton>
                <LinkButton href="/demo">Request a Demo</LinkButton>
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
