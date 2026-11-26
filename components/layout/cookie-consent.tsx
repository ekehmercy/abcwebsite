"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { analyticsConfig } from "@/config/analytics";
import { analyticsAllowed, readConsent, writeConsent } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";

const OPEN_EVENT = "axtara:open-cookie-preferences";

/** Footer link that opens the preferences dialog. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie preferences
    </button>
  );
}

/**
 * Consent banner + preferences dialog + analytics loader.
 * Non-essential analytics never loads until consent is given (when consent is required).
 */
export function CookieConsent() {
  const enabled = analyticsConfig.provider !== "none";
  const [showBanner, setShowBanner] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [loadScript, setLoadScript] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const sync = () => {
      setAnalyticsOn(readConsent()?.analytics ?? false);
      setLoadScript(analyticsAllowed());
    };
    sync();
    if (enabled && analyticsConfig.requireConsent && !readConsent()) setShowBanner(true);
    const open = () => setDialogOpen(true);
    window.addEventListener(OPEN_EVENT, open);
    window.addEventListener("axtara:consent", sync);
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      window.removeEventListener("axtara:consent", sync);
    };
  }, [enabled]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (dialogOpen && !d.open) d.showModal();
    if (!dialogOpen && d.open) d.close();
  }, [dialogOpen]);

  const decide = (value: boolean) => {
    writeConsent(value);
    setShowBanner(false);
    setDialogOpen(false);
  };

  return (
    <>
      {loadScript && analyticsConfig.provider === "plausible" && analyticsConfig.plausibleDomain && (
        <Script src={analyticsConfig.plausibleSrc} data-domain={analyticsConfig.plausibleDomain} strategy="afterInteractive" />
      )}

      {showBanner && (
        <div role="region" aria-label="Cookie consent" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl bg-white p-4 shadow-[0_0_0_1px_var(--n-150),var(--shadow-float)] anim-fade sm:inset-x-6 sm:bottom-6">
          <p className="text-[14px] leading-6 text-n-700">
            We use privacy-conscious analytics to understand which pages help visitors. It stays off unless you allow it.{" "}
            <Link href="/legal/cookies" className="font-medium text-brand-700 underline underline-offset-2">Cookie policy</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={buttonClass("primary", "sm")} onClick={() => decide(true)}>Allow analytics</button>
            <button type="button" className={buttonClass("secondary", "sm")} onClick={() => decide(false)}>Essential only</button>
            <button type="button" className={buttonClass("ghost", "sm")} onClick={() => setDialogOpen(true)}>Preferences</button>
          </div>
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="cookie-dialog-title"
        className="m-auto w-[min(520px,calc(100vw-32px))] rounded-xl bg-white p-0 text-n-900 shadow-[var(--shadow-float)] backdrop:bg-ink-950/40"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="cookie-dialog-title" className="text-[18px] font-semibold tracking-[-0.01em]">Cookie preferences</h2>
            <button type="button" onClick={() => setDialogOpen(false)} className="-m-2 rounded-md p-2 text-n-500 hover:bg-n-100" aria-label="Close">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-lg bg-n-50 p-4">
              <p className="flex items-center justify-between text-[14.5px] font-medium">Essential <span className="text-[13px] font-normal text-n-500">Always on</span></p>
              <p className="mt-1 text-[13.5px] leading-5 text-n-600">Remembers your region and these preferences in your browser. Needed for the site to work as expected.</p>
            </div>
            <div className="rounded-lg bg-n-50 p-4">
              <label className="flex items-center justify-between gap-4 text-[14.5px] font-medium">
                Analytics
                <input
                  type="checkbox"
                  className="size-5 accent-[var(--brand-600)]"
                  checked={analyticsOn}
                  disabled={!enabled}
                  onChange={(e) => setAnalyticsOn(e.target.checked)}
                />
              </label>
              <p className="mt-1 text-[13.5px] leading-5 text-n-600">
                {enabled
                  ? "Aggregate, privacy-conscious measurement of page views and key actions such as demo requests."
                  : "Analytics is not currently enabled on this website, so no analytics cookies or scripts are used."}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className={buttonClass("secondary", "sm")} onClick={() => setDialogOpen(false)}>Cancel</button>
            <button type="button" className={buttonClass("primary", "sm")} onClick={() => decide(analyticsOn)}>Save preferences</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
