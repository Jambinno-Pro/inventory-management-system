"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, X, ChevronLeft } from "lucide-react";

import { mainNav, inventoryNav, systemNav } from "@/lib/navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderNavItems = (items: typeof mainNav) => (
    <div className="space-y-1">
      {items.map(({ label, icon: Icon, href }) => {
        const active = isActive(href);

        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            title={collapsed ? label : undefined}
            className={[
              "group relative flex h-11 w-full items-center rounded-xl",
              collapsed ? "justify-center px-0" : "gap-3 px-3",
              "text-sm transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-violet-500/40",
              active
                ? "bg-violet-50 font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                : "text-[var(--muted)] hover:bg-gray-50 hover:text-[var(--text)] dark:hover:bg-white/5",
            ].join(" ")}
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.2 : 1.9}
              className="shrink-0"
            />

            {!collapsed && <span className="truncate">{label}</span>}

            {collapsed && (
              <span className="pointer-events-none absolute left-[calc(100%+12px)] z-[70] whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {label}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  const renderSection = (title: string, items: typeof mainNav) => (
    <div>
      {!collapsed && (
        <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-[var(--muted)]">
          {title}
        </div>
      )}

      {renderNavItems(items)}
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]",
          "transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Sidebar */}
      <aside
        aria-label="Main navigation"
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          collapsed ? "w-[76px]" : "w-[260px]",
          "border-r border-[var(--border)] bg-[var(--sidebar)]",
          "px-3 py-5",
          "transition-[width,transform] duration-300 ease-in-out",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand and toggle */}
        <div
          className={[
            "mb-8 flex items-center",
            collapsed ? "justify-center" : "justify-between px-1",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-600 text-white shadow-sm transition hover:bg-violet-700"
          >
            <Boxes size={23} strokeWidth={2} />
          </button>

          {!collapsed && (
            <>
              <div className="ml-3 min-w-0 flex-1">
                <div className="truncate font-bold tracking-tight text-[var(--text)]">
                  StockFlow
                </div>
                <div className="truncate text-xs text-[var(--muted)]">
                  Inventory System
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                className="hidden rounded-lg p-2 text-[var(--muted)] hover:bg-gray-100 dark:hover:bg-white/5 md:block"
              >
                <ChevronLeft size={18} />
              </button>
            </>
          )}

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="absolute right-2 top-2 rounded-lg p-2 text-[var(--muted)] hover:bg-gray-100 dark:hover:bg-white/5 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="scrollbar flex-1 space-y-7 overflow-y-auto overflow-x-hidden">
          {renderSection("MAIN", mainNav)}
          {renderSection("INVENTORY", inventoryNav)}
          {renderSection("SYSTEM", systemNav)}
        </nav>
      </aside>
    </>
  );
}
