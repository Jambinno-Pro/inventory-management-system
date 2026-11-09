"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";

import {
  createOrder,
  getOrders,
  updateOrderStatus,
  type Order,
} from "@/lib/ordersApi";

import OrderModal from "./OrderModal";
import OrderTable from "./OrderTable";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getOrders();

      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOrderCreated = async (order: Order) => {
    setOrders((current) => [order, ...current]);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      setError("");

      await updateOrderStatus(id, {
        status,
      });

      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? {
                ...order,
                status,
              }
            : order,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update order status.",
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      order.orderNumber.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.items.some(
        (item) =>
          item.product.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query),
      )
    );
  });

  return (
    <>
      <main className="px-4 py-6 md:px-7 md:py-7">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
              Orders
            </h1>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Manage customer orders and order status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            <Plus size={17} />
            New Order
          </button>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
            />
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/5"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="card flex min-h-[300px] items-center justify-center">
            <div className="text-sm text-[var(--muted)]">Loading orders...</div>
          </div>
        ) : (
          <OrderTable
            orders={filteredOrders}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Result count */}
        {!loading && (
          <div className="mt-3 text-xs text-[var(--muted)]">
            Showing {filteredOrders.length} of {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"}
          </div>
        )}
      </main>

      <OrderModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleOrderCreated}
      />
    </>
  );
}
