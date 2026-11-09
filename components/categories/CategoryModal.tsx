"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Category } from "@/lib/categoriesApi";

type CategoryModalProps = {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (name: string, description: string) => Promise<void>;
};

export default function CategoryModal({
  open,
  category,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(category);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (category) {
      setName(category.name);
      setDescription(category.description);
    } else {
      setName("");
      setDescription("");
    }

    setError("");
  }, [open, category]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setError("Category name cannot exceed 100 characters.");
      return;
    }

    if (trimmedDescription.length > 500) {
      setError("Description cannot exceed 500 characters.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave(trimmedName, trimmedDescription);

      setName("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) {
      return;
    }

    setError("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit Category" : "Add Category"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {isEditing
                ? "Update the category details."
                : "Create a new product category."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Category Name */}
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-medium"
              >
                Category Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Computer Accessories"
                maxLength={100}
                disabled={saving}
                autoFocus
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-1.5 flex justify-end">
                <span className="text-xs text-[var(--muted)]">
                  {name.length}/100
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="category-description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe this category..."
                maxLength={500}
                rows={4}
                disabled={saving}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-1.5 flex justify-end">
                <span className="text-xs text-[var(--muted)]">
                  {description.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
