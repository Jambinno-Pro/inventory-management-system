"use client";

import { MoreHorizontal } from "lucide-react";
import type { DashboardWarehouse } from "@/types/dashboard";

interface WarehouseChartProps {
  warehouses: DashboardWarehouse[];
  totalStock: number;
}

const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#9ca3af"];

export default function WarehouseChart({
  warehouses,
  totalStock,
}: WarehouseChartProps) {
  let currentPercentage = 0;

  const gradientSegments = warehouses.map((warehouse, index) => {
    const start = currentPercentage;
    const end = currentPercentage + warehouse.percentage;

    currentPercentage = end;

    return `${colors[index % colors.length]} ${start}% ${end}%`;
  });

  const gradient =
    warehouses.length > 0
      ? `conic-gradient(${gradientSegments.join(", ")})`
      : "var(--border)";

  return (
    <article className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Stock by Warehouse</h2>

        <button className="rounded-lg p-1 text-[var(--muted)] hover:bg-gray-100 dark:hover:bg-white/5">
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
        <div
          className="relative grid h-44 w-44 shrink-0 place-items-center rounded-full"
          style={{
            background: gradient,
          }}
        >
          <div className="grid h-28 w-28 place-items-center rounded-full bg-[var(--surface)]">
            <div className="text-center">
              <strong className="block text-xl">
                {totalStock.toLocaleString()}
              </strong>

              <span className="text-[11px] text-[var(--muted)]">
                Total Stock
              </span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-3">
          {warehouses.map((warehouse, index) => (
            <div key={warehouse.id} className="flex items-center gap-2 text-xs">
              <i
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: colors[index % colors.length],
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{warehouse.name}</div>
              </div>

              <span className="text-[var(--muted)]">
                {warehouse.percentage}% (
                {warehouse.stockQuantity.toLocaleString()})
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
