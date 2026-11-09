"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Package,
  ReceiptText,
  RefreshCw,
  TrendingUp,
  Warehouse,
  XCircle,
  AlertTriangle,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileText,
} from "lucide-react";
import { getSettings, type AppSettings } from "@/lib/settingsApi";

type ReportsSummary = {
  totalSales: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  totalStock: number;
  inventoryValue: number;
  lowStockProducts: number;
  totalStockTransactions: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api";

export default function Reports() {
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/reports/summary`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load reports.");
      }

      const data: ReportsSummary = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCompanySettings() {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      // Keep the reports available even if company settings cannot load.
      console.error("Unable to load company settings:", err);
    }
  }

  useEffect(() => {
    void loadReports();
    void loadCompanySettings();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(value);

  const companyName = settings?.companyName?.trim() || "StockFlow";

  const companyAddress = [
    settings?.address,
    settings?.city,
    settings?.province,
    settings?.postalCode,
    settings?.country,
  ]
    .filter((part) => part?.trim())
    .join(", ");

  const hasCompanyDetails = Boolean(
    settings?.registrationNumber?.trim() ||
    companyAddress ||
    settings?.email?.trim() ||
    settings?.phone?.trim() ||
    settings?.alternativePhone?.trim() ||
    settings?.website?.trim(),
  );

  if (loading) {
    return (
      <main className="px-4 py-6 md:px-7 md:py-7">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 rounded-lg bg-[var(--card)]" />

          <div className="h-32 rounded-2xl border border-[var(--border)] bg-[var(--card)]" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
              />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-64 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 py-6 md:px-7 md:py-7">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 text-red-500" />

            <div>
              <p className="font-semibold text-red-500">
                Unable to load reports
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">{error}</p>

              <button
                type="button"
                onClick={loadReports}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <main className="px-4 py-6 md:px-7 md:py-7">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/10">
              <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Analytics
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Reports
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Monitor sales, inventory and order performance.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReports}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium transition hover:bg-[var(--muted)]/10"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Company information from Settings */}
      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10">
              <Building2 className="h-5 w-5 text-[var(--primary)]" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                Company profile
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {companyName}
              </h2>

              {settings?.registrationNumber?.trim() && (
                <p className="mt-1 flex items-center gap-2 text-sm text-[var(--muted)]">
                  <FileText className="h-4 w-4 shrink-0" />
                  Registration No: {settings.registrationNumber}
                </p>
              )}
            </div>
          </div>

          {settings?.website?.trim() && (
            <a
              href={
                /^https?:\/\//i.test(settings.website)
                  ? settings.website
                  : `https://${settings.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline"
            >
              <Globe className="h-4 w-4 shrink-0" />
              {settings.website}
            </a>
          )}
        </div>

        {hasCompanyDetails ? (
          <div className="mt-5 grid gap-4 border-t border-[var(--border)] pt-5 sm:grid-cols-2 lg:grid-cols-3">
            {companyAddress && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                <div className="min-w-0">
                  <p className="text-xs text-[var(--muted)]">
                    Business address
                  </p>
                  <p className="mt-1 break-words text-sm font-medium">
                    {companyAddress}
                  </p>
                </div>
              </div>
            )}

            {settings?.email?.trim() && (
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                <div className="min-w-0">
                  <p className="text-xs text-[var(--muted)]">Email address</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-1 block break-words text-sm font-medium hover:text-[var(--primary)]"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>
            )}

            {(settings?.phone?.trim() ||
              settings?.alternativePhone?.trim()) && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                <div className="min-w-0">
                  <p className="text-xs text-[var(--muted)]">Contact numbers</p>

                  {settings.phone?.trim() && (
                    <a
                      href={`tel:${settings.phone}`}
                      className="mt-1 block text-sm font-medium hover:text-[var(--primary)]"
                    >
                      {settings.phone}
                    </a>
                  )}

                  {settings.alternativePhone?.trim() && (
                    <a
                      href={`tel:${settings.alternativePhone}`}
                      className="mt-1 block text-sm text-[var(--muted)] hover:text-[var(--primary)]"
                    >
                      {settings.alternativePhone}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
            Add your company registration, address and contact information in
            Settings to display it here.
          </p>
        )}
      </section>

      {/* Primary metrics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Sales */}
        <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">
                Total Sales
              </p>

              <p className="mt-3 text-2xl font-bold tracking-tight">
                {formatCurrency(summary.totalSales)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <CircleDollarSign className="h-5 w-5 text-emerald-500" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            Revenue from completed orders
          </div>
        </div>

        {/* Orders */}
        <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">
                Total Orders
              </p>

              <p className="mt-3 text-2xl font-bold tracking-tight">
                {summary.totalOrders}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <ReceiptText className="h-5 w-5 text-blue-500" />
            </div>
          </div>

          <div className="mt-4 text-xs text-[var(--muted)]">
            {summary.completedOrders} completed orders
          </div>
        </div>

        {/* Inventory */}
        <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">
                Inventory Value
              </p>

              <p className="mt-3 text-2xl font-bold tracking-tight">
                {formatCurrency(summary.inventoryValue)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Warehouse className="h-5 w-5 text-violet-500" />
            </div>
          </div>

          <div className="mt-4 text-xs text-[var(--muted)]">
            Current value of available stock
          </div>
        </div>

        {/* Stock */}
        <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">
                Total Stock
              </p>

              <p className="mt-3 text-2xl font-bold tracking-tight">
                {summary.totalStock.toLocaleString()}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <Package className="h-5 w-5 text-cyan-500" />
            </div>
          </div>

          <div className="mt-4 text-xs text-[var(--muted)]">
            Units currently in inventory
          </div>
        </div>
      </section>

      {/* Performance panels */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Order performance */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                <ReceiptText className="h-4 w-4 text-blue-500" />
              </div>

              <div>
                <h2 className="font-semibold">Order Performance</h2>
                <p className="text-xs text-[var(--muted)]">
                  Current order status breakdown
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <span className="font-bold">{summary.completedOrders}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]/10">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${
                      summary.totalOrders > 0
                        ? (summary.completedOrders / summary.totalOrders) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <span className="font-bold">{summary.pendingOrders}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]/10">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all"
                  style={{
                    width: `${
                      summary.totalOrders > 0
                        ? (summary.pendingOrders / summary.totalOrders) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">Cancelled</span>
                </div>
                <span className="font-bold">{summary.cancelledOrders}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]/10">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{
                    width: `${
                      summary.totalOrders > 0
                        ? (summary.cancelledOrders / summary.totalOrders) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory health */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
                <Package className="h-4 w-4 text-violet-500" />
              </div>

              <div>
                <h2 className="font-semibold">Inventory Health</h2>
                <p className="text-xs text-[var(--muted)]">
                  Current inventory overview
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5">
            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="text-xs text-[var(--muted)]">Products</p>
              <p className="mt-2 text-2xl font-bold">{summary.totalProducts}</p>
            </div>

            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="text-xs text-[var(--muted)]">Stock Units</p>
              <p className="mt-2 text-2xl font-bold">{summary.totalStock}</p>
            </div>

            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="text-xs text-[var(--muted)]">Transactions</p>
              <p className="mt-2 text-2xl font-bold">
                {summary.totalStockTransactions}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="text-xs text-[var(--muted)]">Low Stock</p>

              <div className="mt-2 flex items-center gap-2">
                {summary.lowStockProducts > 0 ? (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                )}

                <span className="text-2xl font-bold">
                  {summary.lowStockProducts}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary footer */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Inventory overview</p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {companyName} is currently tracking{" "}
              <span className="font-medium text-[var(--foreground)]">
                {summary.totalProducts}
              </span>{" "}
              products across its inventory.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            System data is up to date
          </div>
        </div>
      </section>
    </main>
  );
}
