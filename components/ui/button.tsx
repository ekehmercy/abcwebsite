import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline-light";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out-soft disabled:pointer-events-none disabled:opacity-60 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(14_26_63/0.3)] hover:bg-brand-700",
  secondary: "bg-n-0 text-n-900 shadow-[0_0_0_1px_var(--n-200),0_1px_2px_rgb(12_13_13/0.05)] hover:shadow-[0_0_0_1px_var(--n-300),0_1px_2px_rgb(12_13_13/0.08)] hover:bg-n-25",
  ghost: "text-n-700 hover:text-n-950 hover:bg-n-100",
  light: "bg-white text-ink-900 hover:bg-brand-50",
  "outline-light": "text-white shadow-[0_0_0_1px_rgb(255_255_255/0.22)] hover:bg-white/8 hover:shadow-[0_0_0_1px_rgb(255_255_255/0.4)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13.5px] rounded-md",
  md: "h-11 px-5 text-[15px] rounded-md",
  lg: "h-12 px-6 text-[15.5px] rounded-lg",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type LinkButtonProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  children: ReactNode;
};

export function LinkButton({ variant = "primary", size = "md", className, arrow, children, ...rest }: LinkButtonProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />}
    </Link>
  );
}

export function TextLink({ href, children, className, dark }: { href: string; children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-[15px] font-medium underline-offset-4 hover:underline",
        dark ? "text-brand-200" : "text-brand-700",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}
