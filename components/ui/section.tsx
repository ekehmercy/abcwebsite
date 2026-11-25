import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({ children, dark, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={cn("t-eyebrow flex items-center gap-2", dark ? "text-brand-200" : "text-brand-700", className)}>{children}</p>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  lead,
  dark,
  align = "left",
  className,
  id,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center [&>p:first-child]:justify-center" : "max-w-3xl", className)} data-reveal>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <As id={id} className={cn(As === "h1" ? "t-h1" : "t-h2", "mt-4", dark ? "text-white" : "text-n-950")}>{title}</As>
      {lead && <p className={cn("t-lead mt-5", dark ? "text-white/70" : "text-n-600")}>{lead}</p>}
    </div>
  );
}
