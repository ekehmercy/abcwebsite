import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { modules } from "@/config/features";
import { industries } from "@/config/industries";
import { policies } from "@/config/legal";
import { articles, isArticleVisible } from "@/content/resources";

/** Lists the routes visible in the current release stage. Unpublished legal policies are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string, priority = 0.7): MetadataRoute.Sitemap[number] => ({ url: new URL(p, site.url).toString(), changeFrequency: "monthly", priority });
  return [
    u("/", 1),
    u("/platform", 0.9),
    ...modules.map((m) => u(`/platform/${m.slug}`, 0.8)),
    u("/mobile", 0.8),
    ...industries.map((i) => u(`/industries/${i.slug}`, 0.8)),
    u("/pricing", 0.8),
    u("/integrations"),
    u("/security"),
    u("/resources", 0.6),
    ...articles.filter(isArticleVisible).map((a) => u(`/resources/${a.slug}`, 0.5)),
    u("/about", 0.5),
    u("/demo", 0.9),
    u("/contact", 0.5),
    u("/faq", 0.6),
    ...policies.filter((p) => p.status === "published").map((p) => u(`/legal/${p.slug}`, 0.3)),
  ];
}
