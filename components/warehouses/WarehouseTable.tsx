"use client";

import { Edit, Trash2, Warehouse as WarehouseIcon } from "lucide-react";
import type { Warehouse } from "@/lib/warehousesApi";

type WarehouseTableProps = {
  warehouses: Warehouse[];
  loading: boolean;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
};

export default function WarehouseTable({
  warehouses,
  loading,
  onEdit,
  onDelete,
}: WarehouseTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
        <p className="text-sm text-[var(--muted)]">Loading warehouses...</p>
      </div>
    );
  }

  if (warehouses.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
          <WarehouseIcon size={22} />
        </div>

        <h3 className="text-sm font-semibold">No warehouses found</h3>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Add a warehouse to start managing your inventory locations.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Warehouse
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Code
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Location
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Address
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Products
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {warehouses.map((warehouse) => (
              <tr
                key={warehouse.id}
                className="border-b border-[var(--border)] last:border-b-0"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                      <WarehouseIcon size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{warehouse.name}</p>

                      <p className="mt-0.5 text-xs text-[var(--muted)]">
                        ID #{warehouse.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-lg bg-[var(--background)] px-2.5 py-1 font-mono text-xs font-medium">
                    {warehouse.code}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm">{warehouse.city || "—"}</p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      {warehouse.country || "—"}
                    </p>
                  </div>
                </td>

                <td className="max-w-[220px] px-5 py-4">
                  <p
                    className="truncate text-sm text-[var(--muted)]"
                    title={warehouse.address}
                  >
                    {warehouse.address || "—"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm font-semibold">
                    {warehouse.productCount}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(warehouse)}
                      aria-label={`Edit ${warehouse.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:bg-blue-500/10 hover:text-blue-600"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(warehouse)}
                      aria-label={`Delete ${warehouse.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
