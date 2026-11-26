"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { buttonClass } from "@/components/ui/button";

const PATHWAY_EVENT = "axtara:partner-pathway";

/** Pre-selects a pathway in the enquiry form (via ?pathway=) and scrolls to it. */
export function EnquireButton({ pathway, name }: { pathway: string; name: string }) {
  return (
    <button
      type="button"
      className={buttonClass("primary", "md")}
      onClick={() => {
        const url = new URL(window.location.href);
        url.searchParams.set("pathway", pathway);
        window.history.replaceState(null, "", url.toString());
        window.dispatchEvent(new Event(PATHWAY_EVENT));
        document.getElementById("partner-enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      Enquire about {name.toLowerCase()} <ArrowRight className="size-4" aria-hidden="true" />
    </button>
  );
}

/** Partner enquiry form. Remounts (re-reading the URL pre-fill) when a pathway is chosen above. */
export function PartnerEnquiryForm({ fallbackEmail }: { fallbackEmail: string | null }) {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const onChoose = () => {
      setKey((k) => k + 1);
      // Move focus into the form so keyboard users land where the page scrolled to.
      requestAnimationFrame(() => document.querySelector<HTMLElement>("#partner-enquiry input")?.focus({ preventScroll: true }));
    };
    window.addEventListener(PATHWAY_EVENT, onChoose);
    return () => window.removeEventListener(PATHWAY_EVENT, onChoose);
  }, []);
  return <LeadForm key={key} form="partner" fallbackEmail={fallbackEmail} />;
}
