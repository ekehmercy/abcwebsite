import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModule, modules } from "@/config/features";
import { pageMetadata } from "@/lib/seo";
import { FeaturePage } from "@/components/marketing/feature-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const m = getModule((await params).module);
  if (!m) return {};
  return pageMetadata({ title: m.seo.title, description: m.seo.description, path: `/platform/${m.slug}`, ogTitle: m.headline });
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const m = getModule((await params).module);
  if (!m) notFound();
  return <FeaturePage m={m} />;
}
