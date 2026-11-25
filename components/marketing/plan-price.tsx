"use client";

import { getRegion } from "@/config/regions";
import type { PlanId } from "@/config/pricing";
import { formatMoney, isBaseAllowance, type RateCard } from "@/lib/pricing-engine";
import { useRegion } from "@/lib/use-region";
import { cn } from "@/lib/cn";

/**
 * A plan's published price in the visitor's selected market (shared with the
 * footer region selector and the estimator). Markets without a price book show
 * a local-currency quote line instead.
 */
export function PlanPrice({ plan, rateCards, compact, className }: { plan: PlanId; rateCards: RateCard[]; compact?: boolean; className?: string }) {
  const [code] = useRegion();
  const region = getRegion(code);
  const rates = rateCards.find((c) => c.region === region.code)?.plans[plan];
  const money = (n: number) => formatMoney(n, region.currency.code);

  if (!rates || !isBaseAllowance(rates)) {
    return (
      <div className={className}>
        <p className={cn("font-semibold tracking-[-0.02em] text-n-950", compact ? "text-[18px]" : "text-[26px]")}>Quoted in {region.currency.code}</p>
        {!compact && <p className="mt-1 text-[13px] text-n-500">Priced for {region.name} on request.</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="flex items-baseline gap-1.5">
        {rates.indicative && <span className="text-[13px] font-medium text-n-500">From</span>}
        <span className={cn("font-semibold tabular-nums tracking-[-0.03em] text-n-950", compact ? "text-[22px]" : "text-[32px]")}>{money(rates.baseMonthly)}</span>
        <span className="text-[13.5px] text-n-500">/ month</span>
      </p>
      {compact ? (
        <p className="mt-0.5 text-[12.5px] text-n-500">{region.name} · {region.currency.code}</p>
      ) : (
        <ul className="mt-2 space-y-0.5 text-[13px] text-n-600">
          <li>+{money(rates.perExtraProjectMonthly)} per additional project · +{money(rates.perExtraWorkerMonthly)} per additional worker</li>
          <li className="text-n-500">{region.name} · {region.currency.code} · 10% off the base when paid annually</li>
        </ul>
      )}
    </div>
  );
}
