import { Building2, Lock, Users } from "lucide-react";
import { demoCompanies, demoPackages, demoPartnerPeople } from "@/content/demo-data";
import { AppFrame, Avatar, Panel, Tag } from "@/components/product-demo/primitives";

const gcIdentity = { initials: demoCompanies.gc.initials, name: demoCompanies.gc.short, app: "GC/Developer Web", variant: "gc" as const };
const subIdentity = { initials: demoCompanies.sub.initials, name: demoCompanies.sub.short, app: "Subcontractor Web", variant: "sub" as const };

/** GC/Developer Web — Harbour Point work packages shared with partners. */
export function GcPackagesPreview({ className }: { className?: string }) {
  return (
    <AppFrame active="packages" crumbs={["Meridian", "Harbour Point", "Packages"]} identity={gcIdentity} className={className}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="ui-sm text-n-500">Harbour Point Commercial Development · for {demoCompanies.developer.name}</p>
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-n-950">Work packages and invitations</p>
        </div>
        <Tag tone="brand"><Users className="size-3" aria-hidden="true" />4 partner companies</Tag>
      </div>
      <Panel className="mt-2.5" bodyClass="pt-1 pb-1">
        <ul className="divide-y divide-n-100">
          {demoPackages.map((p) => (
            <li key={p.code} className="-mx-3.5 flex items-center gap-3 px-3.5 py-2.5">
              <span className="ui-sm flex size-7 shrink-0 items-center justify-center rounded-md bg-n-50 font-mono font-semibold text-n-700 shadow-[0_0_0_1px_var(--n-150)]">{p.code}</span>
              <span className="min-w-0 flex-1">
                <span className="ui-md block truncate font-medium text-n-900">{p.name}</span>
                <span className="ui-xs block truncate text-n-500">{p.partner} · {p.note}</span>
              </span>
              <span className="hidden @xl:inline"><Tag tone={p.kind === "Bid invitation" ? "warn" : "neutral"}>{p.kind}</Tag></span>
              <Tag tone={p.tone === "warn" ? "warn" : "ok"}>{p.status}</Tag>
            </li>
          ))}
        </ul>
      </Panel>
      <p className="ui-xs mt-2 flex items-center gap-1.5 text-n-500">
        <Lock className="size-3" aria-hidden="true" />Each partner sees only its own packages. Payroll, rates and other projects stay in each company's own account.
      </p>
    </AppFrame>
  );
}

/** Subcontractor Web — shared GC packages alongside the company's own work. */
export function SubWorkspacePreview({ className }: { className?: string }) {
  const own = [
    { name: "Mona Road clinic fit-out", client: "Direct client", crew: "Crew E3 · 5" },
    { name: "Portmore warehouse lighting", client: "Direct client", crew: "Crew E4 · 4" },
  ];
  return (
    <AppFrame active="packages" crumbs={["Volt Line", "Work"]} identity={subIdentity} className={className}>
      <div className="grid gap-2.5 @3xl:grid-cols-2">
        <Panel title="Shared with you" meta="By your GCs">
          <div className="flex items-start gap-2.5">
            <span className="ui-sm flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-50 font-mono font-semibold text-brand-800">E2</span>
            <div className="min-w-0">
              <p className="ui-md font-medium text-n-900">Electrical rough-in, Block A</p>
              <p className="ui-xs text-n-500">{demoCompanies.gc.name} · Harbour Point</p>
              <div className="mt-1.5 flex flex-wrap gap-1"><Tag tone="ok">Active</Tag><Tag>RFI-021 answered</Tag></div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-n-100 pt-2.5">
            <Avatar name={demoPartnerPeople.subSupervisor.name} tone={demoPartnerPeople.subSupervisor.tone} size={22} />
            <p className="ui-sm text-n-700">{demoPartnerPeople.subSupervisor.name} · supervisor on site</p>
          </div>
        </Panel>
        <Panel title="Your own projects" meta="Clients outside Axtara">
          <ul className="space-y-2">
            {own.map((o) => (
              <li key={o.name} className="flex items-center gap-2.5">
                <Building2 className="size-4 shrink-0 text-n-400" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="ui-md block truncate font-medium text-n-900">{o.name}</span>
                  <span className="ui-xs block text-n-500">{o.client} · {o.crew}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel className="mt-2.5" title={<span className="flex items-center gap-1.5"><Lock className="size-3.5 text-n-500" aria-hidden="true" />Private to Volt Line</span>}>
        <div className="ui-sm grid grid-cols-2 gap-x-4 gap-y-1.5 text-n-700 @xl:grid-cols-4">
          {["Employees' payroll", "Labour and plant rates", "Other projects", "Other customers"].map((t) => (
            <span key={t} className="flex items-center gap-1.5"><Lock className="size-3 text-n-400" aria-hidden="true" />{t}</span>
          ))}
        </div>
      </Panel>
    </AppFrame>
  );
}
