"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  createStockTransaction,
  type CreateStockTransactionPayload,
} from "@/lib/stockTransactionsApi";
import { getProducts, type ApiProduct } from "@/lib/productsApi";
import { getWarehouses, type Warehouse } from "@/lib/warehousesApi";

type StockTransactionModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function StockTransactionModal({
  open,
  onClose,
  onCreated,
}: StockTransactionModalProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [type, setType] = useState("STOCK_IN");
  const [quantity, setQuantity] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        setError("");

        const [productsData, warehousesData] = await Promise.all([
          getProducts({
            page: 1,
            pageSize: 100,
          }),
          getWarehouses(),
        ]);

        setProducts(productsData.items);
        setWarehouses(warehousesData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load products and warehouses.",
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload: CreateStockTransactionPayload = {
        productId: Number(productId),
        warehouseId: Number(warehouseId),
        type,
        quantity: Number(quantity),
        reference: reference.trim(),
        notes: notes.trim(),
      };

      await createStockTransaction(payload);

      setProductId("");
      setWarehouseId("");
      setType("STOCK_IN");
      setQuantity("");
      setReference("");
      setNotes("");

      onCreated();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create stock transaction.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-8 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              New Stock Transaction
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Record a stock movement.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-6"
        >
          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Product */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product
            </label>

            <select
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              required
              disabled={loadingOptions || loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">
                {loadingOptions ? "Loading products..." : "Select product"}
              </option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — Stock: {product.stockQuantity}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Warehouse
            </label>

            <select
              value={warehouseId}
              onChange={(event) => setWarehouseId(event.target.value)}
              required
              disabled={loadingOptions || loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">
                {loadingOptions ? "Loading warehouses..." : "Select warehouse"}
              </option>

              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.code})
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Transaction Type
            </label>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
              disabled={loading}
              placeholder="Enter quantity"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Reference */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reference
            </label>

            <input
              type="text"
              maxLength={100}
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              disabled={loading}
              placeholder="e.g. PO-1001"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>

            <textarea
              maxLength={500}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              disabled={loading}
              rows={3}
              placeholder="Optional notes..."
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || loadingOptions}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
