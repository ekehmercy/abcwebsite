"use client";

import { Globe } from "lucide-react";
import { getRegion, regions, type RegionCode } from "@/config/regions";
import { site } from "@/config/site";
import { useRegion } from "@/lib/use-region";

export function FooterRegion() {
  const [code, setCode] = useRegion();
  const region = getRegion(code);
  const entity = region.contractingEntity;
  return (
    <div className="mt-8">
      <label htmlFor="footer-region" className="text-[13px] font-medium text-n-900">
        Region
      </label>
      <div className="relative mt-2 w-fit">
        <Globe className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-n-500" aria-hidden="true" />
        <select
          id="footer-region"
          value={code}
          onChange={(e) => setCode(e.target.value as RegionCode)}
          className="h-10 appearance-none rounded-md bg-white pl-9 pr-9 text-[14px] text-n-800 shadow-[0_0_0_1px_var(--n-200)] hover:shadow-[0_0_0_1px_var(--n-300)]"
        >
          {regions.map((r) => (
            <option key={r.code} value={r.code}>{r.name}</option>
          ))}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-n-500">▼</span>
      </div>
      <p className="mt-3 text-[13px] leading-5 text-n-500" aria-live="polite">
        {entity?.verified
          ? `In ${region.name}, ${site.name} is offered by ${entity.name}.`
          : `The contracting entity for customers in ${region.name} will be confirmed in your order form.`}
      </p>
    </div>
  );
}
