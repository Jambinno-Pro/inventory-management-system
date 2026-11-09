"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Barcode,
  Boxes,
  CheckCircle2,
  DollarSign,
  Loader2,
  Package,
  Tag,
  X,
} from "lucide-react";

import {
  createProduct,
  getCategories,
  type ApiCategory,
} from "@/lib/productsApi";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function ProductModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("5");
  const [barcode, setBarcode] = useState("");

  const [categories, setCategories] = useState<ApiCategory[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Load Categories                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        setError("");

        const data = await getCategories();

        setCategories(data);

        if (data.length > 0) {
          setCategoryId(String(data[0].id));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories.",
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const stockNumber = Number(stock);
    const minimumStock = Number(minStock);
    const sellingPriceNumber = Number(sellingPrice);

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!sku.trim()) {
      setError("SKU is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (Number.isNaN(sellingPriceNumber) || sellingPriceNumber < 0) {
      setError("Please enter a valid selling price.");
      return;
    }

    if (Number.isNaN(stockNumber) || stockNumber < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (Number.isNaN(minimumStock) || minimumStock < 0) {
      setError("Please enter a valid minimum stock level.");
      return;
    }

    try {
      setSaving(true);

      await createProduct({
        name: name.trim(),
        sku: sku.trim(),
        categoryId: Number(categoryId),
        supplierId: null,
        warehouseId: null,
        price: sellingPriceNumber,
        stockQuantity: stockNumber,
        reorderLevel: minimumStock,
      });

      setSuccess(true);

      /*
       * Give the user a short visual confirmation before
       * closing and refreshing the product list.
       */
      setTimeout(() => {
        onCreated();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create product.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              <Package size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold">Add Product</h2>

              <p className="text-xs text-[var(--muted)]">
                Add a new product to your inventory.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-gray-100 hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto px-5 py-5 md:px-6">
            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 size={16} className="shrink-0" />

                <span>Product created successfully.</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Product Name */}
              <Field label="Product Name" icon={<Package size={15} />} required>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. HP Laptop 15"
                  className="input"
                  disabled={saving}
                />
              </Field>

              {/* SKU */}
              <Field label="SKU" icon={<Tag size={15} />} required>
                <input
                  required
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder="e.g. HPL15-001"
                  className="input"
                  disabled={saving}
                />
              </Field>

              {/* Barcode */}
              <Field label="Barcode" icon={<Barcode size={15} />}>
                <input
                  value={barcode}
                  onChange={(event) => setBarcode(event.target.value)}
                  placeholder="Optional barcode"
                  className="input"
                  disabled={saving}
                />
              </Field>

              {/* Category */}
              <Field label="Category" icon={<Tag size={15} />} required>
                <select
                  required
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="input"
                  disabled={saving || loadingCategories}
                >
                  {loadingCategories ? (
                    <option value="">Loading categories...</option>
                  ) : categories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </Field>

              {/* Cost Price */}
              <Field label="Cost Price" icon={<DollarSign size={15} />}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                    R
                  </span>

                  <input
                    min="0"
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(event) => setCostPrice(event.target.value)}
                    placeholder="0.00"
                    className="input pl-7"
                    disabled={saving}
                  />
                </div>
              </Field>

              {/* Selling Price */}
              <Field
                label="Selling Price"
                icon={<DollarSign size={15} />}
                required
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                    R
                  </span>

                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={sellingPrice}
                    onChange={(event) => setSellingPrice(event.target.value)}
                    placeholder="0.00"
                    className="input pl-7"
                    disabled={saving}
                  />
                </div>
              </Field>

              {/* Initial Stock */}
              <Field label="Initial Stock" icon={<Boxes size={15} />} required>
                <input
                  required
                  min="0"
                  type="number"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  placeholder="0"
                  className="input"
                  disabled={saving}
                />
              </Field>

              {/* Minimum Stock */}
              <Field
                label="Minimum Stock Level"
                icon={<Boxes size={15} />}
                required
              >
                <input
                  required
                  min="0"
                  type="number"
                  value={minStock}
                  onChange={(event) => setMinStock(event.target.value)}
                  placeholder="5"
                  className="input"
                  disabled={saving}
                />
              </Field>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  placeholder="Add a short product description..."
                  className="input resize-none py-2.5"
                  disabled={saving}
                />
              </div>
            </div>

            {/* API note */}
            <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
              <strong>Inventory note:</strong> The current API stores the
              product name, SKU, category, selling price, stock quantity and
              reorder level. Cost price, barcode and description are currently
              kept in the form but are not yet stored by the backend.
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-[var(--border)] px-5 py-4 sm:flex-row sm:justify-end md:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:bg-gray-50 hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loadingCategories || categories.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Package size={16} />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          height: 40px;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--surface);
          padding: 0 0.75rem;
          font-size: 0.75rem;
          color: var(--text);
          outline: none;
        }

        .input::placeholder {
          color: var(--muted);
        }

        .input:focus {
          border-color: rgb(139 92 246);
          box-shadow: 0 0 0 3px rgb(139 92 246 / 0.08);
        }

        .input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        textarea.input {
          height: auto;
        }

        select.input {
          cursor: pointer;
        }

        select.input:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Field                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  icon,
  required,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
        {icon}

        {label}

        {required && <span className="text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}
