"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import type { AnalyticsEvent } from "@/config/analytics";

/** Fires a page-view style conversion event once on mount. */
export function TrackView({ event, page }: { event: AnalyticsEvent; page: string }) {
  useEffect(() => {
    track(event, { page });
  }, [event, page]);
  return null;
}
