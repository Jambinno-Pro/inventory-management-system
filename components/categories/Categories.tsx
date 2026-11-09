"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import CategoryModal from "./CategoryModal";
import CategoryTable from "./CategoryTable";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/lib/categoriesApi";

import type { Category } from "@/lib/categoriesApi";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [error, setError] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query),
    );
  }, [categories, search]);

  function handleAddCategory() {
    setEditingCategory(null);
    setError("");
    setModalOpen(true);
  }

  function handleEditCategory(category: Category) {
    setEditingCategory(category);
    setError("");
    setModalOpen(true);
  }

  async function handleSaveCategory(name: string, description: string) {
    try {
      setError("");

      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name,
          description,
        });
      } else {
        await createCategory({
          name,
          description,
        });
      }

      setModalOpen(false);
      setEditingCategory(null);

      await loadCategories();
    } catch (err) {
      throw err;
    }
  }

  async function handleDeleteCategory(category: Category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCategory(category.id);

      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category.",
      );
    }
  }

  return (
    <main className="px-4 py-6 md:px-7 md:py-7">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
            Categories
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your product categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddCategory}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus size={17} strokeWidth={2.2} />
          Add Category
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Search + Stats */}
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
          />
        </div>

        <div className="flex h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5">
          <span className="text-xs text-[var(--muted)]">Categories</span>

          <span className="ml-2 text-sm font-semibold">
            {categories.length}
          </span>
        </div>

        <div className="flex h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5">
          <span className="text-xs text-[var(--muted)]">Products</span>

          <span className="ml-2 text-sm font-semibold">
            {categories.reduce(
              (total, category) => total + category.productCount,
              0,
            )}
          </span>
        </div>
      </div>

      {/* Table */}
      <CategoryTable
        categories={filteredCategories}
        loading={loading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        category={editingCategory}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
      />
    </main>
  );
}
