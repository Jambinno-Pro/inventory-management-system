"use client";

import {
  Eye,
  MoreHorizontal,
  PackageOpen,
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Product } from "./Products";
import {
  deleteProduct,
  getProduct,
  updateProduct,
  type ApiProduct,
} from "@/lib/productsApi";

type Props = {
  products: Product[];
};

type ModalType = "view" | "edit" | "delete" | null;

type EditForm = {
  name: string;
  sku: string;
  categoryId: number;
  supplierId: number | null;
  warehouseId: number | null;
  price: number;
  stockQuantity: number;
  reorderLevel: number;
};

export default function ProductTable({ products }: Props) {
  const [rows, setRows] = useState<Product[]>(products);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editForm, setEditForm] = useState<EditForm | null>(null);

  /*
   * Keep table synchronized with Products.tsx
   */
  useEffect(() => {
    setRows(products);
  }, [products]);

  /*
   * Convert API ProductDto into frontend Product shape.
   */
  function mapApiProduct(product: ApiProduct): Product {
    let status: Product["status"];

    if (product.stockQuantity <= 0) {
      status = "Out of Stock";
    } else if (product.stockQuantity <= product.reorderLevel) {
      status = "Low Stock";
    } else {
      status = "In Stock";
    }

    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,

      // Your current API has Price but no CostPrice.
      costPrice: 0,
      sellingPrice: product.price,

      stock: product.stockQuantity,
      minStock: product.reorderLevel,
      status,
    };
  }

  /*
   * Close any modal and reset modal state.
   */
  function closeModal() {
    setModal(null);
    setSelectedProduct(null);
    setEditForm(null);
    setError("");
    setOpenMenu(null);
  }

  /*
   * VIEW PRODUCT
   */
  async function handleView(id: number) {
    setOpenMenu(null);
    setModal("view");
    setLoading(true);
    setError("");
    setSelectedProduct(null);

    try {
      const product = await getProduct(id);
      setSelectedProduct(product);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  /*
   * EDIT PRODUCT
   */
  async function handleEdit(id: number) {
    setOpenMenu(null);
    setModal("edit");
    setLoading(true);
    setError("");
    setSelectedProduct(null);
    setEditForm(null);

    try {
      const product = await getProduct(id);

      setSelectedProduct(product);

      setEditForm({
        name: product.name,
        sku: product.sku,
        categoryId: product.categoryId,
        supplierId: product.supplierId,
        warehouseId: product.warehouseId,
        price: product.price,
        stockQuantity: product.stockQuantity,
        reorderLevel: product.reorderLevel,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  /*
   * SAVE EDIT
   */
  async function handleSaveEdit() {
    if (!selectedProduct || !editForm) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateProduct(selectedProduct.id, {
        name: editForm.name,
        sku: editForm.sku,
        categoryId: editForm.categoryId,
        supplierId: editForm.supplierId,
        warehouseId: editForm.warehouseId,
        price: editForm.price,
        stockQuantity: editForm.stockQuantity,
        reorderLevel: editForm.reorderLevel,
      });

      /*
       * PUT returns 204 No Content.
       * Fetch the product again to get the latest data.
       */
      const updatedProduct = await getProduct(selectedProduct.id);

      setRows((currentRows) =>
        currentRows.map((product) =>
          product.id === updatedProduct.id
            ? mapApiProduct(updatedProduct)
            : product,
        ),
      );

      closeModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update product.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * DELETE PRODUCT
   */
  async function handleDelete() {
    if (!selectedProduct) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteProduct(selectedProduct.id);

      setRows((currentRows) =>
        currentRows.filter((product) => product.id !== selectedProduct.id),
      );

      closeModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete product.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * EMPTY STATE
   */
  if (rows.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
          <PackageOpen size={26} />
        </div>

        <h3 className="mt-4 text-sm font-semibold">No products found</h3>

        <p className="mt-1 max-w-sm text-xs text-[var(--muted)]">
          Try adjusting your search or filters to find the products you are
          looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="scrollbar overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-xs">
          <thead className="border-b border-[var(--border)] bg-gray-50 text-[var(--muted)] dark:bg-white/[.02]">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Cost Price</th>
              <th className="px-5 py-3 font-medium">Selling Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50/70 dark:hover:bg-white/[.02]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                      <PackageOpen size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-semibold">
                        {product.name}
                      </div>

                      <div className="mt-0.5 text-[11px] text-[var(--muted)]">
                        Product #{String(product.id).padStart(4, "0")}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 font-medium text-[var(--muted)]">
                  {product.sku}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-lg bg-gray-100 px-2 py-1 text-[11px] font-medium dark:bg-white/5">
                    {product.category}
                  </span>
                </td>

                <td className="px-5 py-4">
                  R
                  {product.costPrice.toLocaleString("en-ZA", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td className="px-5 py-4 font-semibold">
                  R
                  {product.sellingPrice.toLocaleString("en-ZA", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td className="px-5 py-4">
                  <span className="font-semibold">{product.stock}</span>
                  <span className="ml-1 text-[var(--muted)]">units</span>
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={product.status} />
                </td>

                <td className="relative px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(openMenu === product.id ? null : product.id)
                    }
                    className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-gray-100 hover:text-[var(--text)] dark:hover:bg-white/5"
                    aria-label={`Actions for ${product.name}`}
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenu === product.id && (
                    <div className="absolute right-5 top-12 z-20 w-40 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 text-left shadow-xl">
                      <ActionItem
                        icon={<Eye size={14} />}
                        label="View"
                        onClick={() => handleView(product.id)}
                      />

                      <ActionItem
                        icon={<Pencil size={14} />}
                        label="Edit"
                        onClick={() => handleEdit(product.id)}
                      />

                      <ActionItem
                        icon={<Trash2 size={14} />}
                        label="Delete"
                        danger
                        onClick={() => {
                          setOpenMenu(null);

                          /*
                           * We already know the product ID.
                           * Only the fields required by DeleteModal
                           * are needed here.
                           */
                          setSelectedProduct({
                            id: product.id,
                            name: product.name,
                            sku: product.sku,
                            categoryId: 0,
                            category: product.category,
                            supplierId: null,
                            supplier: "",
                            warehouseId: null,
                            warehouse: "",
                            price: product.sellingPrice,
                            stockQuantity: product.stock,
                            reorderLevel: product.minStock,
                            createdAt: "",
                          });

                          setModal("delete");
                          setError("");
                        }}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === "view" && (
        <ViewModal
          product={selectedProduct}
          loading={loading}
          error={error}
          onClose={closeModal}
        />
      )}

      {modal === "edit" && (
        <EditModal
          product={selectedProduct}
          form={editForm}
          loading={loading}
          error={error}
          onChange={setEditForm}
          onClose={closeModal}
          onSave={handleSaveEdit}
        />
      )}

      {modal === "delete" && (
        <DeleteModal
          product={selectedProduct}
          loading={loading}
          error={error}
          onClose={closeModal}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* STATUS                                                                     */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: Product["status"] }) {
  const styles = {
    "In Stock":
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",

    "Low Stock":
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300",

    "Out of Stock":
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* ACTION ITEM                                                                */
/* -------------------------------------------------------------------------- */

function ActionItem({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          : "text-[var(--muted)] hover:bg-gray-100 hover:text-[var(--text)] dark:hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* MODAL SHELL                                                                */
/* -------------------------------------------------------------------------- */

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-sm font-semibold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-gray-100 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* VIEW MODAL                                                                 */
/* -------------------------------------------------------------------------- */

function ViewModal({
  product,
  loading,
  error,
  onClose,
}: {
  product: ApiProduct | null;
  loading: boolean;
  error: string;
  onClose: () => void;
}) {
  return (
    <ModalShell title="Product Details" onClose={onClose}>
      <div className="p-5">
        {loading && (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && product && (
          <div className="space-y-4">
            <div>
              <p className="text-lg font-semibold">{product.name}</p>
              <p className="text-xs text-[var(--muted)]">{product.sku}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Detail label="Category" value={product.category} />

              <Detail
                label="Selling Price"
                value={`R${product.price.toLocaleString("en-ZA", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              />

              <Detail label="Stock" value={`${product.stockQuantity} units`} />

              <Detail
                label="Reorder Level"
                value={String(product.reorderLevel)}
              />

              <Detail label="Supplier" value={product.supplier || "None"} />

              <Detail label="Warehouse" value={product.warehouse || "None"} />
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/* EDIT MODAL                                                                 */
/* -------------------------------------------------------------------------- */

function EditModal({
  product,
  form,
  loading,
  error,
  onChange,
  onClose,
  onSave,
}: {
  product: ApiProduct | null;
  form: EditForm | null;
  loading: boolean;
  error: string;
  onChange: (form: EditForm | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!product || !form) {
    return (
      <ModalShell title="Edit Product" onClose={onClose}>
        <div className="p-5">
          {loading && (
            <div className="flex min-h-[180px] items-center justify-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          )}

          {error && <ErrorMessage message={error} />}
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title={`Edit ${product.name}`} onClose={onClose}>
      <div className="max-h-[75vh] overflow-y-auto p-5">
        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="space-y-4">
          <FormField label="Product Name">
            <input
              value={form.name}
              onChange={(e) =>
                onChange({
                  ...form,
                  name: e.target.value,
                })
              }
              className="input"
            />
          </FormField>

          <FormField label="SKU">
            <input
              value={form.sku}
              onChange={(e) =>
                onChange({
                  ...form,
                  sku: e.target.value,
                })
              }
              className="input"
            />
          </FormField>

          <FormField label="Category ID">
            <input
              type="number"
              min="1"
              value={form.categoryId}
              onChange={(e) =>
                onChange({
                  ...form,
                  categoryId: Number(e.target.value),
                })
              }
              className="input"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Supplier ID">
              <input
                type="number"
                min="1"
                value={form.supplierId ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    supplierId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="input"
              />
            </FormField>

            <FormField label="Warehouse ID">
              <input
                type="number"
                min="1"
                value={form.warehouseId ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    warehouseId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="input"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Price">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  onChange({
                    ...form,
                    price: Number(e.target.value),
                  })
                }
                className="input"
              />
            </FormField>

            <FormField label="Stock">
              <input
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) =>
                  onChange({
                    ...form,
                    stockQuantity: Number(e.target.value),
                  })
                }
                className="input"
              />
            </FormField>

            <FormField label="Reorder Level">
              <input
                type="number"
                min="0"
                value={form.reorderLevel}
                onChange={(e) =>
                  onChange({
                    ...form,
                    reorderLevel: Number(e.target.value),
                  })
                }
                className="input"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}

            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/* DELETE MODAL                                                               */
/* -------------------------------------------------------------------------- */

function DeleteModal({
  product,
  loading,
  error,
  onClose,
  onDelete,
}: {
  product: ApiProduct | null;
  loading: boolean;
  error: string;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <ModalShell title="Delete Product" onClose={onClose}>
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="rounded-xl bg-red-50 p-4 dark:bg-red-500/10">
          <div className="flex gap-3">
            <Trash2 size={20} className="mt-0.5 shrink-0 text-red-500" />

            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Delete {product?.name}?
              </p>

              <p className="mt-1 text-xs text-red-600/80 dark:text-red-300/70">
                This action cannot be undone. Products with stock transaction
                history cannot be deleted.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}

            {loading ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/* FORM HELPERS                                                               */
/* -------------------------------------------------------------------------- */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
        {label}
      </span>

      {children}
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-3">
      <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold">{value}</p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      {message}
    </div>
  );
}
