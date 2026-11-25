import type { Metadata } from "next";
import { site } from "@/config/site";
import { indexingAllowed } from "@/lib/release";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogTitle?: string;
};

/** Builds unique, canonical metadata for a page. */
export function pageMetadata({ title, description, path, noindex, ogTitle }: PageMeta): Metadata {
  const url = new URL(path, site.url).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle ?? title,
      description,
      url,
      siteName: site.name,
      type: "website",
      locale: "en",
      images: [{ url: `/og?title=${encodeURIComponent(ogTitle ?? title)}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description,
      images: [`/og?title=${encodeURIComponent(ogTitle ?? title)}`],
    },
    robots: !indexingAllowed ? { index: false, follow: false } : noindex ? { index: false, follow: true } : undefined,
  };
}

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
