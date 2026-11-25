"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { ResourceCategory } from "@/content/resources";
import { cn } from "@/lib/cn";

export type ArticleCard = {
  slug: string;
  title: string;
  summary: string;
  category: ResourceCategory;
  categoryName: string;
  date: string;
  readingMinutes: number;
  draft: boolean;
};

const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function ResourceBrowser({ articles, categories }: { articles: ArticleCard[]; categories: { id: ResourceCategory; name: string }[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("category");
  const [category, setCategory] = useState<ResourceCategory | "all">(
    categories.some((c) => c.id === initial) ? (initial as ResourceCategory) : "all",
  );
  const [query, setQuery] = useState(params.get("q") ?? "");

  const choose = (c: ResourceCategory | "all") => {
    setCategory(c);
    const sp = new URLSearchParams(params.toString());
    if (c === "all") sp.delete("category");
    else sp.set("category", c);
    router.replace(`/resources${sp.toString() ? `?${sp}` : ""}`, { scroll: false });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter(
      (a) =>
        (category === "all" || a.category === category) &&
        (!q || `${a.title} ${a.summary} ${a.categoryName}`.toLowerCase().includes(q)),
    );
  }, [articles, category, query]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of articles) m.set(a.category, (m.get(a.category) ?? 0) + 1);
    return m;
  }, [articles]);

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
      <aside className="min-w-0 space-y-6">
        <div className="relative">
          <label htmlFor="resource-search" className="sr-only">Search resources</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-n-400" aria-hidden="true" />
          <input
            id="resource-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources"
            className="h-11 w-full rounded-md bg-white pl-9 pr-9 text-[15px] text-n-900 shadow-[0_0_0_1px_var(--n-200)] placeholder:text-n-400 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-n-400 hover:text-n-800" aria-label="Clear search">
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <nav aria-label="Resource categories">
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0">
            {[{ id: "all" as const, name: "All resources" }, ...categories].map((c) => {
              const n = c.id === "all" ? articles.length : counts.get(c.id) ?? 0;
              const active = category === c.id;
              return (
                <li key={c.id} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(c.id)}
                    className={cn(
                      "flex h-10 w-full items-center justify-between gap-3 whitespace-nowrap rounded-md px-3 text-left text-[14.5px] transition-colors",
                      active ? "bg-white font-medium text-n-950 shadow-[0_0_0_1px_var(--n-150)]" : "text-n-600 hover:bg-n-100 hover:text-n-900",
                    )}
                  >
                    {c.name}
                    <span className="text-[12.5px] tabular-nums text-n-400">{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0">
        <p className="text-[13.5px] text-n-500" aria-live="polite">
          {results.length} {results.length === 1 ? "article" : "articles"}
          {category !== "all" && ` in ${categories.find((c) => c.id === category)?.name}`}
          {query && ` matching “${query}”`}
        </p>
        {results.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white p-10 text-center shadow-[0_0_0_1px_var(--n-150)]">
            <p className="text-[16px] font-medium text-n-900">No articles found.</p>
            <p className="mt-1 text-[14.5px] text-n-600">Try another search term or category.</p>
            <button type="button" onClick={() => { setQuery(""); choose("all"); }} className="mt-4 text-[14.5px] font-medium text-brand-700 underline underline-offset-2">Show all resources</button>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-n-150 border-y border-n-150">
            {results.map((a) => (
              <li key={a.slug}>
                <Link href={`/resources/${a.slug}`} className="group grid gap-2 py-7 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-8">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-n-500 sm:flex-col sm:items-start">
                    <span className="font-medium text-brand-700">{a.categoryName}</span>
                    <time dateTime={a.date}>{fmt(a.date)}</time>
                  </div>
                  <div>
                    <h2 className="flex items-start justify-between gap-4 text-[20px] font-medium leading-snug tracking-[-0.015em] text-n-950 group-hover:text-brand-700">
                      {a.title}
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-n-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
                    </h2>
                    <p className="mt-2 max-w-2xl text-[15px] leading-6 text-n-600">{a.summary}</p>
                    <p className="mt-3 flex items-center gap-3 text-[13px] text-n-500">
                      {a.readingMinutes} min read
                      {a.draft && <span className="rounded-sm bg-accent-100/70 px-1.5 py-0.5 text-[11.5px] font-medium text-accent-700 ring-1 ring-inset ring-accent-300/60">Draft — not published</span>}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
