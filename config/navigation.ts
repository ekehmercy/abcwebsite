import { modules } from "./features";
import { industries } from "./industries";

export type NavLink = { label: string; href: string; description?: string; icon?: string };
export type NavGroup = { label: string; links: NavLink[] };

const m = (slug: string, label?: string, hash?: string): NavLink => {
  const mod = modules.find((x) => x.slug === slug)!;
  return {
    label: label ?? mod.name,
    href: `/platform/${mod.slug}${hash ? `#${hash}` : ""}`,
    description: label === "Scheduling" ? "Shifts and crew plans by site" : mod.navDescription,
    icon: label === "Scheduling" ? "CalendarDays" : mod.icon,
  };
};

export const platformMenu: NavGroup[] = [
  { label: "People", links: [m("workforce"), m("workforce", "Scheduling", "capabilities"), m("time-attendance")] },
  { label: "Operations", links: [m("field-operations"), m("project-operations"), m("expenses", "Expenses")] },
  { label: "Control", links: [m("payroll"), m("compliance"), m("reporting")] },
];

export const solutionsMenu: NavLink[] = [
  { label: "Replace paper attendance", href: "/platform/time-attendance", description: "Verified clock-in and approvals", icon: "Clock" },
  { label: "Connect field and office", href: "/platform/field-operations", description: "Daily reports, evidence and incidents", icon: "HardHat" },
  { label: "Prepare payroll from approved hours", href: "/platform/payroll", description: "Approved time, ready for payroll", icon: "FileSpreadsheet" },
  { label: "See labour cost by project", href: "/platform/project-operations", description: "Cost codes and project health", icon: "Building2" },
  { label: "Mobile apps for the field", href: "/mobile", description: "For workers and supervisors", icon: "Smartphone" },
];

export const industriesMenu: NavLink[] = industries.map((i) => ({
  label: i.name,
  href: `/industries/${i.slug}`,
  description: i.navDescription,
  icon: { "general-contractors": "Building2", subcontractors: "Wrench", "real-estate": "Building", infrastructure: "Route" }[i.slug],
}));

export const resourcesMenu: NavLink[] = [
  { label: "Product Guides", href: "/resources?category=product-guides", description: "How Axtara works, step by step", icon: "BookOpen" },
  { label: "Insights", href: "/resources", description: "Construction operations thinking", icon: "Newspaper" },
  { label: "FAQs", href: "/faq", description: "Answers to common questions", icon: "CircleHelp" },
  { label: "Security and Trust", href: "/security", description: "How we protect your data", icon: "ShieldCheck" },
  { label: "Integrations", href: "/integrations", description: "Connect the tools you use", icon: "Blocks" },
];

export const footerNav: NavGroup[] = [
  {
    label: "Product",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Workforce", href: "/platform/workforce" },
      { label: "Attendance", href: "/platform/time-attendance" },
      { label: "Field Operations", href: "/platform/field-operations" },
      { label: "Projects", href: "/platform/project-operations" },
      { label: "Payroll Preparation", href: "/platform/payroll" },
      { label: "Mobile", href: "/mobile" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { label: "General Contractors", href: "/industries/general-contractors" },
      { label: "Subcontractors", href: "/industries/subcontractors" },
      { label: "Developers", href: "/industries/real-estate" },
      { label: "Infrastructure", href: "/industries/infrastructure" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Guides", href: "/resources" },
      { label: "Integrations", href: "/integrations" },
      { label: "Security", href: "/security" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Request a Demo", href: "/demo" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Subscription Policy", href: "/legal/subscription" },
      { label: "Cookie Policy", href: "/legal/cookies" },
    ],
  },
];
