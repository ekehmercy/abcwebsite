import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

const links = [
  { href: "/platform", label: "Platform overview" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_40%,#000_10%,transparent_70%)]" />
      <div className="container-x relative text-center">
        <p className="font-mono text-[13px] text-n-500">404</p>
        <h1 className="t-h1 mx-auto mt-4 max-w-2xl text-n-950">This page isn&apos;t on the site plan.</h1>
        <p className="t-lead mx-auto mt-5 max-w-lg text-n-600">The link may be out of date, or the page may have moved.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <LinkButton href="/" size="lg">Back to home</LinkButton>
          <LinkButton href="/demo" size="lg" variant="secondary">Request a Demo</LinkButton>
        </div>
        <ul className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14.5px]">
          {links.map((l) => <li key={l.href}><Link href={l.href} className="text-brand-700 hover:underline">{l.label}</Link></li>)}
        </ul>
      </div>
    </section>
  );
}
