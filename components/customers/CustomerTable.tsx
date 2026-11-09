"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Customer } from "@/lib/customersApi";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-12 text-center">
        <p className="text-sm font-medium text-[var(--text)]">
          No customers found
        </p>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Add your first customer to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Customer
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Contact
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Location
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Orders
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-[var(--text)]">
                        {customer.name}
                      </div>

                      <div className="truncate text-xs text-[var(--muted)]">
                        ID #{customer.id}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-[var(--text)]">
                      {customer.email}
                    </div>

                    <div className="text-xs text-[var(--muted)]">
                      {customer.phone || "No phone"}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-[var(--text)]">
                      {customer.city || "—"}
                    </div>

                    <div className="text-xs text-[var(--muted)]">
                      {customer.country || "—"}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-300">
                    {customer.orderCount}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(customer)}
                      aria-label={`Edit ${customer.name}`}
                      className="rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(customer)}
                      aria-label={`Delete ${customer.name}`}
                      className="rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300"
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
