"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Command,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Topbar({
  onMenu,
  onTheme,
  dark,
}: {
  onMenu: () => void;
  onTheme: () => void;
  dark: boolean;
}) {
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        setNotificationsOpen(false);
        setAccountOpen(false);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setAccountOpen(false);
      }
    }

    window.addEventListener("keydown", handleShortcut);

    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus();
    }
  }, [searchOpen]);

  const searchItems = [
    { label: "Dashboard", description: "Overview and statistics", path: "/" },
    {
      label: "Products",
      description: "Manage inventory products",
      path: "/products",
    },
    {
      label: "Categories",
      description: "Manage product categories",
      path: "/categories",
    },
    { label: "Orders", description: "View and manage orders", path: "/orders" },
    { label: "Suppliers", description: "Manage suppliers", path: "/suppliers" },
    { label: "Customers", description: "Manage customers", path: "/customers" },
    {
      label: "Warehouses",
      description: "Manage warehouse locations",
      path: "/warehouses",
    },
    {
      label: "Stock Transactions",
      description: "Track stock movements",
      path: "/stock-transactions",
    },
    {
      label: "Reports",
      description: "View inventory reports",
      path: "/reports",
    },
    {
      label: "Settings",
      description: "Configure your company",
      path: "/settings",
    },
  ];

  const filteredItems = searchItems.filter((item) =>
    `${item.label} ${item.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  function navigateTo(path: string) {
    router.push(path);
    setSearchOpen(false);
    setSearchQuery("");
    setNotificationsOpen(false);
    setAccountOpen(false);
  }

  function handleSignOut() {
    const confirmed = window.confirm("Are you sure you want to sign out?");

    if (!confirmed) return;

    setAccountOpen(false);

    window.alert(
      "Authentication is not connected yet. Sign out will be available once login and authentication are implemented.",
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-[var(--border)] bg-[var(--background)]/95 px-4 backdrop-blur md:px-7">
        <button
          onClick={onMenu}
          className="rounded-xl p-2 text-[var(--muted)] hover:bg-blue-50 dark:hover:bg-blue-500/10 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>

        {/* Quick Search */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-left text-[var(--muted)] hover:border-blue-500/50 md:max-w-xl"
        >
          <Search size={18} className="shrink-0" />
          <span className="flex-1 truncate text-sm">
            Search for products, orders, suppliers...
          </span>
          <kbd className="hidden items-center gap-1 rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] md:flex">
            Ctrl K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          {/* Theme Toggle */}
          <button
            onClick={onTheme}
            className="grid h-10 w-10 place-items-center rounded-xl text-[var(--muted)] transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen((value) => !value);
                setAccountOpen(false);
              }}
              className={`relative grid h-10 w-10 place-items-center rounded-xl transition ${
                notificationsOpen
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                  : "text-[var(--muted)] hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              }`}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell size={19} />
              <span className="absolute right-1.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                  <div>
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    <p className="text-xs text-[var(--muted)]">
                      You have 3 unread notifications
                    </p>
                  </div>
                  <Bell size={18} className="text-blue-600" />
                </div>

                <div className="divide-y divide-[var(--border)]">
                  <button
                    onClick={() => navigateTo("/products")}
                    className="flex w-full gap-3 px-4 py-3 text-left hover:bg-blue-50/70 dark:hover:bg-blue-500/5"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    <span>
                      <span className="block text-sm font-medium">
                        Inventory overview
                      </span>
                      <span className="mt-1 block text-xs text-[var(--muted)]">
                        Review your current product stock levels.
                      </span>
                    </span>
                  </button>

                  <button
                    onClick={() => navigateTo("/orders")}
                    className="flex w-full gap-3 px-4 py-3 text-left hover:bg-blue-50/70 dark:hover:bg-blue-500/5"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    <span>
                      <span className="block text-sm font-medium">
                        Order management
                      </span>
                      <span className="mt-1 block text-xs text-[var(--muted)]">
                        Check pending orders and their statuses.
                      </span>
                    </span>
                  </button>

                  <button
                    onClick={() => navigateTo("/reports")}
                    className="flex w-full gap-3 px-4 py-3 text-left hover:bg-blue-50/70 dark:hover:bg-blue-500/5"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    <span>
                      <span className="block text-sm font-medium">
                        Inventory reports
                      </span>
                      <span className="mt-1 block text-xs text-[var(--muted)]">
                        View your latest inventory summary.
                      </span>
                    </span>
                  </button>
                </div>

                <div className="border-t border-[var(--border)] px-4 py-3">
                  <p className="text-xs text-[var(--muted)]">
                    Demo notifications — live alerts can be connected later.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Administrator Account */}
          <div className="relative ml-1 border-l border-[var(--border)] pl-3">
            <button
              onClick={() => {
                setAccountOpen((value) => !value);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-blue-50 dark:hover:bg-blue-500/10"
              aria-label="Administrator account menu"
              aria-expanded={accountOpen}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 ring-1 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/20">
                IJ
              </div>

              <div className="hidden lg:block">
                <div className="text-sm font-semibold text-[var(--text)]">
                  Innocent Jambaya
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  Administrator
                </div>
              </div>

              <ChevronDown
                size={15}
                className={`text-[var(--muted)] transition-transform ${
                  accountOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
                <div className="border-b border-[var(--border)] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                      IJ
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        Innocent Jambaya
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        Company Administrator
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => navigateTo("/profile")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text)] hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                  >
                    <UserRound size={17} />
                    My Profile
                  </button>

                  <button
                    onClick={() => navigateTo("/settings")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text)] hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                  >
                    <Settings size={17} />
                    Company Settings
                  </button>

                  <div className="my-2 border-t border-[var(--border)]" />

                  <button
                    onClick={() => navigateTo("/settings")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text)] hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                  >
                    <ShieldCheck size={17} />
                    Account & Security
                  </button>
                </div>

                {/* Sign Out */}
                <div className="border-t border-[var(--border)] p-2">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </div>

                <div className="border-t border-[var(--border)] px-4 py-3">
                  <p className="text-[11px] text-[var(--muted)]">
                    StockFlow Inventory System
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Search Dialog */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/50 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSearchOpen(false);
            }
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
              <Search size={20} className="shrink-0 text-blue-600" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search dashboard pages..."
                className="h-14 min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigateTo(item.path)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-500/10"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                      <Command size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text)]">
                        {item.label}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--muted)]">Open ↵</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-10 text-center">
                  <Search
                    size={25}
                    className="mx-auto mb-3 text-[var(--muted)]"
                  />
                  <p className="text-sm font-medium">No matching pages found</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Try searching for products, orders, or settings.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-[11px] text-[var(--muted)]">
              <span>Navigate to a page</span>
              <span>Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
