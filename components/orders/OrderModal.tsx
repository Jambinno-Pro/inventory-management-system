"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

import type { Order, CreateOrderPayload } from "@/lib/ordersApi";
import { getProducts, type ApiProduct } from "@/lib/productsApi";
import { getCustomers, type Customer } from "@/lib/customersApi";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (order: Order) => Promise<void>;
}

type OrderLine = {
  productId: number;
  quantity: number;
};

export default function OrderModal({
  open,
  onClose,
  onCreated,
}: OrderModalProps) {
  const [customerId, setCustomerId] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);

  const [items, setItems] = useState<OrderLine[]>([
    {
      productId: 0,
      quantity: 1,
    },
  ]);

  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      try {
        setError("");

        setLoadingCustomers(true);
        setLoadingProducts(true);

        const [customersData, productsResponse] = await Promise.all([
          getCustomers(),
          getProducts({
            page: 1,
            pageSize: 100,
            sortBy: "name",
            sortOrder: "asc",
          }),
        ]);

        setCustomers(customersData);
        setProducts(productsResponse.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load order data.",
        );
      } finally {
        setLoadingCustomers(false);
        setLoadingProducts(false);
      }
    };

    loadData();
  }, [open]);

  if (!open) return null;

  const updateItem = (index: number, field: keyof OrderLine, value: number) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        productId: 0,
        quantity: 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((current) =>
      current.length === 1
        ? current
        : current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (customerId <= 0) {
      setError("Please select a customer.");
      return;
    }

    if (items.length === 0) {
      setError("Add at least one product.");
      return;
    }

    if (items.some((item) => item.productId <= 0)) {
      setError("Please select a product for every order item.");
      return;
    }

    if (items.some((item) => item.quantity <= 0)) {
      setError("Quantity must be greater than zero.");
      return;
    }

    const productIds = items.map((item) => item.productId);

    if (new Set(productIds).size !== productIds.length) {
      setError("A product cannot appear more than once in an order.");
      return;
    }

    const payload: CreateOrderPayload = {
      customerId,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      notes: notes.trim(),
    };

    try {
      setSaving(true);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api"
        }/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        let message = "Failed to create order.";

        try {
          const data = await response.json();

          if (data?.message) {
            message = data.message;
          }
        } catch {
          // Ignore invalid error response
        }

        throw new Error(message);
      }

      const order: Order = await response.json();

      await onCreated(order);

      setCustomerId(0);
      setNotes("");

      setItems([
        {
          productId: 0,
          quantity: 1,
        },
      ]);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order.");
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
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="font-semibold">Create Order</h2>

            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Create a new customer order.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-gray-100 hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Customer */}
            <div>
              <label
                htmlFor="order-customer"
                className="mb-1.5 block text-sm font-medium"
              >
                Customer
              </label>

              <select
                id="order-customer"
                value={customerId}
                disabled={loadingCustomers || saving}
                onChange={(event) => setCustomerId(Number(event.target.value))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value={0}>
                  {loadingCustomers
                    ? "Loading customers..."
                    : customers.length === 0
                      ? "No customers available"
                      : "Select customer"}
                </option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} — {customer.email}
                  </option>
                ))}
              </select>

              {customers.length === 0 && !loadingCustomers && (
                <p className="mt-1.5 text-xs text-[var(--muted)]">
                  Add a customer first before creating an order.
                </p>
              )}
            </div>

            {/* Products */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">Products</label>

                <button
                  type="button"
                  onClick={addItem}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-violet-300 dark:hover:bg-violet-500/10"
                >
                  <Plus size={14} />
                  Add Product
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => {
                  const selectedProduct = products.find(
                    (product) => product.id === item.productId,
                  );

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_110px_40px] items-end gap-3 rounded-xl border border-[var(--border)] p-3"
                    >
                      <div>
                        <label className="mb-1.5 block text-xs text-[var(--muted)]">
                          Product
                        </label>

                        <select
                          value={item.productId}
                          disabled={loadingProducts || saving}
                          onChange={(event) =>
                            updateItem(
                              index,
                              "productId",
                              Number(event.target.value),
                            )
                          }
                          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value={0}>
                            {loadingProducts
                              ? "Loading products..."
                              : "Select product"}
                          </option>

                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} — {product.sku}
                            </option>
                          ))}
                        </select>

                        {selectedProduct && (
                          <p className="mt-1 text-[11px] text-[var(--muted)]">
                            R {selectedProduct.price.toFixed(2)} · Stock:{" "}
                            {selectedProduct.stockQuantity}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-[var(--muted)]">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          disabled={saving}
                          onChange={(event) =>
                            updateItem(
                              index,
                              "quantity",
                              Number(event.target.value),
                            )
                          }
                          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1 || saving}
                        aria-label="Remove product"
                        className="grid h-10 w-10 place-items-center rounded-lg text-[var(--muted)] hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="order-notes"
                className="mb-1.5 block text-sm font-medium"
              >
                Notes
              </label>

              <textarea
                id="order-notes"
                value={notes}
                disabled={saving}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional order notes"
                rows={3}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loadingCustomers ||
                loadingProducts ||
                customers.length === 0
              }
              className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
