"use client";

import { useCallback, useSyncExternalStore } from "react";
import { defaultRegion, regions, type RegionCode } from "@/config/regions";

const KEY = "axtara-region";
const EVENT = "axtara:region";

function read(): RegionCode {
  try {
    const v = localStorage.getItem(KEY);
    if (v && regions.some((r) => r.code === v)) return v as RegionCode;
  } catch {
    /* ignore */
  }
  return defaultRegion;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** The visitor's selected market, shared across the footer, pricing and trust pages. */
export function useRegion(): [RegionCode, (r: RegionCode) => void] {
  const region = useSyncExternalStore(subscribe, read, () => defaultRegion);
  const set = useCallback((r: RegionCode) => {
    try {
      localStorage.setItem(KEY, r);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [region, set];
}
