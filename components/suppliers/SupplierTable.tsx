"use client";

import { Edit, Store, Trash2 } from "lucide-react";
import type { Supplier } from "@/lib/suppliersApi";

type SupplierTableProps = {
  suppliers: Supplier[];
  loading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
};

export default function SupplierTable({
  suppliers,
  loading,
  onEdit,
  onDelete,
}: SupplierTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-[var(--muted)]">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--background)]">
            <Store size={22} className="text-[var(--muted)]" />
          </div>

          <h3 className="text-sm font-semibold">No suppliers found</h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            No suppliers are available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Supplier
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Contact
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Email
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Phone
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Location
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Products
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--background)]/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                      <Store size={17} className="text-[var(--primary)]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{supplier.name}</p>

                      <p className="text-xs text-[var(--muted)]">
                        #{supplier.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm">{supplier.contactPerson || "—"}</p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-[var(--muted)]">
                    {supplier.email || "—"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-[var(--muted)]">
                    {supplier.phone || "—"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <div className="text-sm">
                    <p>{supplier.city || "—"}</p>

                    <p className="text-xs text-[var(--muted)]">
                      {supplier.country || ""}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-center">
                  <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-[var(--background)] px-2.5 py-1 text-xs font-semibold">
                    {supplier.productCount}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(supplier)}
                      title="Edit supplier"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(supplier)}
                      title="Delete supplier"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500"
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

      <div className="border-t border-[var(--border)] px-5 py-3">
        <p className="text-xs text-[var(--muted)]">
          Showing {suppliers.length}{" "}
          {suppliers.length === 1 ? "supplier" : "suppliers"}
        </p>
      </div>
    </div>
  );
}
