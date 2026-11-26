/**
 * Legal policy registry. Policies stay UNPUBLISHED until approved content is
 * supplied. Unpublished policy routes render a clear notice and are excluded
 * from search indexing and the sitemap.
 *
 * To publish: add approved content as Markdown-like blocks in `content`, set
 * `status: "published"`, `effectiveDate` and `approvedBy`.
 */

export type PolicySlug = "privacy" | "terms" | "subscription" | "cookies";

export type Policy = {
  slug: PolicySlug;
  title: string;
  summary: string;
  status: "published" | "unpublished";
  effectiveDate: string | null;
  approvedBy: string | null;
  /** Approved policy text, as paragraphs / headings. */
  content: { type: "h2" | "p"; text: string }[];
};

export const policies: Policy[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "How Axtara and its operating entities collect, use and protect personal information.",
    status: "unpublished",
    effectiveDate: null,
    approvedBy: null,
    content: [],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "The terms that govern use of the Axtara platform and website.",
    status: "unpublished",
    effectiveDate: null,
    approvedBy: null,
    content: [],
  },
  {
    slug: "subscription",
    title: "Subscription Policy",
    summary: "Subscription terms, billing arrangements, renewals and cancellation.",
    status: "unpublished",
    effectiveDate: null,
    approvedBy: null,
    content: [],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    summary: "The cookies and similar technologies used on this website, and how to control them.",
    status: "unpublished",
    effectiveDate: null,
    approvedBy: null,
    content: [],
  },
];

export function getPolicy(slug: string) {
  return policies.find((p) => p.slug === slug);
}
