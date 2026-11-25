import {
  BarChart3, BookOpen, Blocks, Building, Building2, Calculator, CalendarDays, CircleHelp, Clock, FileSpreadsheet,
  FolderOpen, HardHat, Landmark, Newspaper, Package, Receipt, Route, ScanFace, ShieldCheck, Smartphone, Users, Wrench,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const icons: Record<string, ComponentType<LucideProps>> = {
  BarChart3, BookOpen, Blocks, Building, Building2, Calculator, CalendarDays, CircleHelp, Clock, FileSpreadsheet,
  FolderOpen, HardHat, Landmark, Newspaper, Package, Receipt, Route, ScanFace, ShieldCheck, Smartphone, Users, Wrench,
};

/** Resolves an icon name stored in config to a Lucide component. */
export function Icon({ name, ...props }: { name?: string } & LucideProps) {
  const C = (name && icons[name]) || Blocks;
  return <C aria-hidden="true" strokeWidth={1.75} {...props} />;
}
