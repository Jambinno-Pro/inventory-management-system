import { CalendarDays } from "lucide-react";
import StatCard from "./StatCard";
import InventoryChart from "./InventoryChart";
import WarehouseChart from "./WarehouseChart";
import LowStock from "./LowStock";
import TransactionsTable from "./TransactionsTable";
import { getDashboard } from "@/lib/api";

export default async function Dashboard() {
  const dashboard = await getDashboard();

  const inventoryDates = dashboard.inventoryOverview;

  const startDate = inventoryDates[0]?.date;
  const endDate = inventoryDates[inventoryDates.length - 1]?.date;

  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const dateRange =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : "No date range available";

  return (
    <main className="px-4 py-6 md:px-7 md:py-7">
      {/* Dashboard Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Welcome back, Innocent!
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-medium text-[var(--muted)]">
          <CalendarDays size={16} />
          {dateRange}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="box"
          label="Total Products"
          value={dashboard.totalProducts.toLocaleString()}
          change=""
          tone="purple"
        />

        <StatCard
          icon="database"
          label="Total Stock"
          value={dashboard.totalStock.toLocaleString()}
          change=""
          tone="green"
        />

        <StatCard
          icon="cart"
          label="Stock Value"
          value={`$${dashboard.totalStockValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change=""
          tone="blue"
        />

        <StatCard
          icon="users"
          label="Total Suppliers"
          value={dashboard.totalSuppliers.toLocaleString()}
          change=""
          tone="orange"
        />
      </div>

      {/* Inventory & Warehouse Charts */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <InventoryChart data={dashboard.inventoryOverview} />

        <WarehouseChart
          warehouses={dashboard.stockByWarehouse}
          totalStock={dashboard.totalStock}
        />
      </div>
      {/* Low Stock & Transactions */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_2fr]">
        <LowStock products={dashboard.lowStockItems} />
        <TransactionsTable transactions={dashboard.recentTransactions} />
      </div>
    </main>
  );
}
