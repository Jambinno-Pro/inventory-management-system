"use client";

import { Edit, Package, Trash2 } from "lucide-react";
import type { Category } from "@/lib/categoriesApi";

type CategoryTableProps = {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export default function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-[var(--muted)]">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--background)]">
            <Package size={22} className="text-[var(--muted)]" />
          </div>

          <h3 className="text-sm font-semibold">No categories found</h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            No categories are available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Category
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Description
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Products
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Created
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--background)]/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                      <Package size={17} className="text-[var(--primary)]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{category.name}</p>

                      <p className="text-xs text-[var(--muted)]">
                        #{category.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="max-w-[320px] px-5 py-4">
                  <p className="truncate text-sm text-[var(--muted)]">
                    {category.description || "No description"}
                  </p>
                </td>

                <td className="px-5 py-4 text-center">
                  <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-[var(--background)] px-2.5 py-1 text-xs font-semibold">
                    {category.productCount}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-[var(--muted)]">
                  {new Date(category.createdAt).toLocaleDateString("en-ZA", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      title="Edit category"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      title="Delete category"
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
          Showing {categories.length}{" "}
          {categories.length === 1 ? "category" : "categories"}
        </p>
      </div>
    </div>
  );
}
