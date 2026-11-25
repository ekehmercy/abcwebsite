import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndustry, industries } from "@/config/industries";
import { pageMetadata } from "@/lib/seo";
import { IndustryPage } from "@/components/marketing/industry-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const ind = getIndustry((await params).industry);
  if (!ind) return {};
  return pageMetadata({ title: ind.seo.title, description: ind.seo.description, path: `/industries/${ind.slug}`, ogTitle: ind.headline });
}

export default async function Page({ params }: { params: Promise<{ industry: string }> }) {
  const ind = getIndustry((await params).industry);
  if (!ind) notFound();
  return <IndustryPage ind={ind} />;
}
