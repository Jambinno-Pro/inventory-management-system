"use client";

import { MoreHorizontal } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { DashboardInventoryOverview } from "@/types/dashboard";

interface InventoryChartProps {
  data: DashboardInventoryOverview[];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function InventoryChart({ data }: InventoryChartProps) {
  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    stockIn: item.stockIn,
    stockOut: item.stockOut,
  }));

  return (
    <article className="card p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h2 className="font-semibold">Inventory Overview</h2>

          <div className="mt-2 flex gap-4 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-violet-500" />
              Stock In
            </span>

            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-sky-500" />
              Stock Out
            </span>
          </div>
        </div>

        <button className="rounded-lg p-1 text-[var(--muted)] hover:bg-gray-100 dark:hover:bg-white/5">
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div className="h-[245px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--text)",
              }}
            />

            <Line
              type="monotone"
              dataKey="stockIn"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            <Line
              type="monotone"
              dataKey="stockOut"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
