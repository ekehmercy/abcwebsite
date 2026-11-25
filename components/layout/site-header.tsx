"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight, ChevronDown, Menu, PlayCircle, X } from "lucide-react";
import { platformMenu, industriesMenu, resourcesMenu, solutionsMenu, type NavLink } from "@/config/navigation";
import { appUrls } from "@/config/site";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { Logo } from "./logo";

type MenuId = "platform" | "solutions" | "industries" | "resources";

function MenuLink({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className="group flex items-start gap-3 rounded-lg p-2.5 outline-offset-0 transition-colors hover:bg-n-50 focus-visible:bg-n-50"
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-white text-n-600 shadow-[0_0_0_1px_var(--n-150)] transition-colors group-hover:text-brand-600">
        <Icon name={link.icon} className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-medium text-n-900">{link.label}</span>
        {link.description && <span className="block text-[13px] leading-5 text-n-500">{link.description}</span>}
      </span>
    </Link>
  );
}

function Panel({ id, children, wide }: { id: string; children: ReactNode; wide?: boolean }) {
  return (
    <div
      id={id}
      className={cn(
        "absolute top-full z-50 mt-2 rounded-xl bg-white p-2 shadow-[0_0_0_1px_var(--n-150),0_24px_48px_-12px_rgb(14_26_63/0.18)] anim-fade",
        wide ? "left-0 w-[min(940px,calc(100vw-48px))]" : "left-1/2 w-[380px] -translate-x-1/2",
      )}
    >
      {children}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);
  const pathname = usePathname();
  const uid = useId();

  const close = useCallback((refocus?: MenuId | null) => {
    setOpen(null);
    if (refocus) triggers.current[refocus]?.focus();
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close(open);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const onTriggerKey = (id: MenuId) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(id);
      requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>(`#${CSS.escape(`${uid}-${id}`)} a`)?.focus());
    }
  };

  const onPanelKey = (id: MenuId) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>("a"));
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (i === -1) return;
    e.preventDefault();
    links[(i + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length]?.focus();
    void id;
  };

  const trigger = (id: MenuId, label: string) => (
    <button
      ref={(el) => {
        triggers.current[id] = el;
      }}
      type="button"
      aria-expanded={open === id}
      aria-controls={`${uid}-${id}`}
      onClick={() => {
        // A click immediately after hover-open should keep the menu open, not toggle it shut.
        if (Date.now() - hoverOpenedAt.current < 400) return;
        setOpen((o) => (o === id ? null : id));
      }}
      onKeyDown={onTriggerKey(id)}
      onMouseEnter={() => {
        window.clearTimeout(hoverTimer.current);
        hoverTimer.current = window.setTimeout(() => {
          setOpen((o) => {
            if (o !== id) hoverOpenedAt.current = Date.now();
            return id;
          });
        }, 90);
      }}
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-md px-3 text-[14.5px] font-medium transition-colors",
        open === id ? "bg-n-100 text-n-950" : "text-n-700 hover:text-n-950",
      )}
    >
      {label}
      <ChevronDown className={cn("size-3.5 transition-transform duration-200", open === id && "rotate-180")} aria-hidden="true" />
    </button>
  );

  const onNavigate = () => setOpen(null);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-300",
        scrolled || open ? "bg-n-25/88 shadow-[0_1px_0_var(--n-150)] backdrop-blur-xl backdrop-saturate-150" : "bg-n-25/0",
      )}
    >
      <div className="container-x flex h-16 items-center gap-6">
        <Link href="/" aria-label="Axtara home" className="shrink-0 rounded-md">
          <Logo />
        </Link>

        <nav
          ref={navRef}
          aria-label="Main"
          className="relative hidden flex-1 items-center gap-0.5 lg:flex"
          onMouseLeave={() => {
            window.clearTimeout(hoverTimer.current);
            hoverTimer.current = window.setTimeout(() => setOpen(null), 160);
          }}
          onMouseEnter={() => window.clearTimeout(hoverTimer.current)}
        >
          <div>
            {trigger("platform", "Platform")}
            {open === "platform" && (
              <div onKeyDown={onPanelKey("platform")}>
                <Panel id={`${uid}-platform`} wide>
                  <div className="grid grid-cols-[1fr_1fr_1fr_250px] gap-1">
                    {platformMenu.map((g) => (
                      <div key={g.label} className="p-1.5">
                        <p className="px-2.5 pb-1.5 pt-1 text-[12px] font-medium text-n-400">{g.label}</p>
                        <ul>
                          {g.links.map((l) => (
                            <li key={l.label}><MenuLink link={l} onNavigate={onNavigate} /></li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="flex flex-col rounded-lg bg-ink-900 p-4 text-white">
                      <p className="text-[12px] font-medium text-brand-200">Product tour</p>
                      <p className="mt-1.5 text-[15px] font-medium leading-snug">Follow one package from invitation to payroll — across the GC, subcontractor and developer.</p>
                      <div className="mt-4 rounded-md bg-white/6 p-2.5 ring-1 ring-white/10" aria-hidden="true">
                        {["GC invites the partner", "Crew reports from site", "Owner sees the update"].map((s, i) => (
                          <p key={s} className="flex items-center gap-2 py-0.5 text-[12px] text-white/75">
                            <span className={cn("size-1.5 rounded-full", i === 0 ? "bg-accent-500" : "bg-brand-400")} />{s}
                          </p>
                        ))}
                      </div>
                      <Link href="/tour" onClick={onNavigate} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13.5px] font-medium text-white hover:underline">
                        <PlayCircle className="size-4" aria-hidden="true" />Start the tour
                      </Link>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between rounded-lg bg-n-50 px-4 py-2.5">
                    <p className="text-[13px] text-n-600">See how every module connects</p>
                    <span className="flex items-center gap-5">
                      <Link href="/collaboration" onClick={onNavigate} className="text-[13px] font-medium text-brand-700 hover:underline">Shared projects</Link>
                      <Link href="/lifecycle" onClick={onNavigate} className="text-[13px] font-medium text-brand-700 hover:underline">Where Axtara fits</Link>
                      <Link href="/platform" onClick={onNavigate} className="inline-flex items-center gap-1 text-[13px] font-medium text-brand-700 hover:underline">
                        Platform overview <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </span>
                  </div>
                </Panel>
              </div>
            )}
          </div>
          {(
            [
              ["solutions", "Solutions", solutionsMenu],
              ["industries", "Industries", industriesMenu],
            ] as const
          ).map(([id, label, links]) => (
            <div key={id} className="relative">
              {trigger(id, label)}
              {open === id && (
                <div onKeyDown={onPanelKey(id)}>
                  <Panel id={`${uid}-${id}`}>
                    <ul>{links.map((l) => <li key={l.href + l.label}><MenuLink link={l} onNavigate={onNavigate} /></li>)}</ul>
                  </Panel>
                </div>
              )}
            </div>
          ))}
          <Link href="/pricing" className="inline-flex h-9 items-center rounded-md px-3 text-[14.5px] font-medium text-n-700 transition-colors hover:text-n-950" aria-current={pathname === "/pricing" ? "page" : undefined}>
            Pricing
          </Link>
          <div className="relative">
            {trigger("resources", "Resources")}
            {open === "resources" && (
              <div onKeyDown={onPanelKey("resources")}>
                <Panel id={`${uid}-resources`}>
                  <ul>{resourcesMenu.map((l) => <li key={l.href}><MenuLink link={l} onNavigate={onNavigate} /></li>)}</ul>
                </Panel>
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <a href={appUrls.login ?? "/login"} className="hidden h-9 items-center rounded-md px-3 text-[14.5px] font-medium text-n-700 hover:text-n-950 sm:inline-flex">
            Log in
          </a>
          <Link href="/demo" onClick={() => track("demo_cta_clicked", { location: "header" })} className={buttonClass("primary", "sm", "hidden sm:inline-flex")}>
            Request a Demo
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-n-800 hover:bg-n-100 lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<string | null>("Platform");

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"));
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const groups: { label: string; links: NavLink[] }[] = [
    { label: "Platform", links: [{ label: "Platform overview", href: "/platform", icon: "Blocks", description: "How every module connects" }, ...platformMenu.flatMap((g) => g.links).filter((l) => !l.href.includes("#"))] },
    { label: "Solutions", links: solutionsMenu },
    { label: "Industries", links: industriesMenu },
    { label: "Resources", links: resourcesMenu },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site navigation" id="mobile-nav">
      <div className="absolute inset-0 bg-ink-950/30 anim-fade" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-n-25 shadow-2xl" style={{ animation: "fade-in 260ms var(--ease-out) both" }}>
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <Link href="/" onClick={onClose} aria-label="Axtara home"><Logo /></Link>
          <button type="button" onClick={onClose} className="inline-flex size-10 items-center justify-center rounded-md hover:bg-n-100" aria-label="Close menu">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 pb-6">
          {groups.map((g) => {
            const expanded = section === g.label;
            return (
              <div key={g.label} className="border-b border-n-150">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setSection(expanded ? null : g.label)}
                  className="flex w-full items-center justify-between py-4 text-left text-[17px] font-medium text-n-900"
                >
                  {g.label}
                  <ChevronDown className={cn("size-4 text-n-500 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
                </button>
                {expanded && (
                  <ul className="pb-3">
                    {g.links.map((l) => (
                      <li key={l.href + l.label}>
                        <Link href={l.href} onClick={onClose} className="flex min-h-11 items-center gap-3 rounded-md px-1 py-2 text-[15px] text-n-700 hover:bg-n-50">
                          <Icon name={l.icon} className="size-4 text-n-400" />
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          <Link href="/pricing" onClick={onClose} className="flex border-b border-n-150 py-4 text-[17px] font-medium text-n-900">Pricing</Link>
          <a href={appUrls.login ?? "/login"} className="flex border-b border-n-150 py-4 text-[17px] font-medium text-n-900">Log in</a>
        </nav>
        <div className="border-t border-n-150 p-4">
          <Link href="/demo" onClick={() => { track("demo_cta_clicked", { location: "mobile-nav" }); onClose(); }} className={buttonClass("primary", "lg", "w-full")}>
            Request a Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
