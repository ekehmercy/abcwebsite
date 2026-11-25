import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { appUrls, contact } from "@/config/site";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = pageMetadata({
  title: "Log in",
  description: "Sign in to your organisation's Axtara workspace.",
  path: "/login",
  noindex: true,
});

export default function LoginPage() {
  if (appUrls.login) redirect(appUrls.login);
  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-[0_0_0_1px_var(--n-150),var(--shadow-card)]">
          <span className="mx-auto flex size-11 items-center justify-center rounded-lg bg-n-50 text-brand-600 shadow-[0_0_0_1px_var(--n-150)]">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.02em] text-n-950">Sign in to Axtara</h1>
          <p className="mt-3 text-[15px] leading-6 text-n-600">
            Customers sign in through their organisation&apos;s Axtara workspace link, provided during onboarding. Field workers use the sign-in details provided by their employer.
          </p>
          <p className="mt-3 text-[15px] leading-6 text-n-600">
            Can&apos;t find your link?{" "}
            {contact.supportEmail ? (
              <a href={`mailto:${contact.supportEmail}`} className="font-medium text-brand-700 underline">{contact.supportEmail}</a>
            ) : (
              <Link href="/contact?topic=existing" className="font-medium text-brand-700 underline">Contact support</Link>
            )}
          </p>
          <div className="mt-7 flex flex-col gap-2">
            <Link href="/demo" className={buttonClass("primary", "md")}>Not a customer yet? Request a Demo</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
