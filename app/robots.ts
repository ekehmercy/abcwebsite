import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { indexingAllowed } from "@/lib/release";

/** Staging is never crawlable; the public release is, unless ALLOW_INDEXING=false. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexingAllowed ? [{ userAgent: "*", allow: "/", disallow: ["/api/", "/login"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
