import Link from "next/link";
import { footerNav } from "@/config/navigation";
import { site } from "@/config/site";
import { Logo } from "./logo";
import { FooterRegion } from "./footer-region";
import { CookiePreferencesButton } from "./cookie-consent";

export function SiteFooter() {
  return (
    <footer className="border-t border-n-150 bg-n-25">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.1fr_2.4fr] lg:gap-16">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-[14.5px] leading-6 text-n-600">{site.shortDescription}</p>
          <p className="mt-2 text-[13.5px] leading-6 text-n-500">Axtara is a product of {site.parentCompany}.</p>
          <FooterRegion />
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
          {footerNav.map((g) => (
            <div key={g.label}>
              <h2 className="text-[13px] font-medium text-n-900">{g.label}</h2>
              <ul className="mt-3.5 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[14px] text-n-600 transition-colors hover:text-n-950">
                      {l.label}
                    </Link>
                  </li>
                ))}
                {g.label === "Legal" && (
                  <li>
                    <CookiePreferencesButton className="text-[14px] text-n-600 transition-colors hover:text-n-950" />
                  </li>
                )}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-n-150">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-n-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.parentCompany}. All rights reserved.</p>
          <p>Product interfaces shown on this site are illustrative and use fictional data.</p>
        </div>
      </div>
    </footer>
  );
}
