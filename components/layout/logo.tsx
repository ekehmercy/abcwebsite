import Image from "next/image";
import { cn } from "@/lib/cn";
import logo from "@/public/brand/axtara-logo.png";
import logoLight from "@/public/brand/axtara-logo-light.png";

/**
 * The original Axtara logo (teal "A" mark + navy wordmark), extracted from the
 * supplied brand reference. `dark` uses the light-wordmark variant for dark surfaces.
 */
export function Logo({ className, dark, height = 26 }: { className?: string; dark?: boolean; height?: number }) {
  const src = dark ? logoLight : logo;
  return (
    <Image
      src={src}
      alt="Axtara"
      height={height}
      width={Math.round((src.width / src.height) * height)}
      priority
      className={cn("h-auto select-none", className)}
      style={{ height, width: "auto" }}
    />
  );
}
