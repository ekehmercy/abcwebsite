import type { Metadata } from "next";
import { pageMetadata, jsonLd } from "@/lib/seo";
import { site } from "@/config/site";
import { publishedRateCards } from "@/config/pricing/published-rates";
import {
  Hero, Segments, Problem, ProductExplorer, OperationalJourney, SharedProjects, FieldSection, Personas, Ecosystem, SecurityTeaser,
  PricingIntro, FinalCta,
} from "@/components/marketing/home-sections";

export const metadata: Metadata = pageMetadata({
  title: "Axtara — Workforce and project operations for construction",
  ogTitle: "Built for the way work really happens.",
  description:
    "Axtara connects field workers, supervisors, project managers and finance — verified attendance, approvals, project costs and payroll preparation for construction and project-driven businesses.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: site.name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: site.description,
          publisher: { "@type": "Organization", name: site.parentCompany },
        })}
      />
      <Hero />
      <Segments />
      <Problem />
      <ProductExplorer />
      <OperationalJourney />
      <SharedProjects />
      <FieldSection />
      <Personas />
      <Ecosystem />
      <SecurityTeaser />
      <PricingIntro rateCards={publishedRateCards} />
      <FinalCta />
    </>
  );
}
