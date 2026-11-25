"use client";

import { analyticsConfig, type AnalyticsEvent } from "@/config/analytics";

export const CONSENT_KEY = "axtara-consent-v1";
export type Consent = { analytics: boolean; decidedAt: string };

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean) {
  const value: Consent = { analytics, decidedAt: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable — consent applies for this page view only */
  }
  window.dispatchEvent(new CustomEvent("axtara:consent", { detail: value }));
}

export function analyticsAllowed(): boolean {
  if (analyticsConfig.provider === "none") return false;
  if (!analyticsConfig.requireConsent) return true;
  return readConsent()?.analytics === true;
}

type W = Window & { plausible?: (e: string, o?: { props?: Record<string, unknown> }) => void; dataLayer?: unknown[] };

/** Records a conversion event. No-ops unless analytics is configured and permitted. */
export function track(event: AnalyticsEvent, props: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !analyticsAllowed()) return;
  const w = window as W;
  if (analyticsConfig.provider === "plausible") w.plausible?.(event, { props });
  if (analyticsConfig.provider === "custom") {
    (w.dataLayer ||= []).push({ event, ...props });
    window.dispatchEvent(new CustomEvent("axtara:analytics", { detail: { event, props } }));
  }
}
