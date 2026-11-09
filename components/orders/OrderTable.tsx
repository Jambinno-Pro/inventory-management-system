"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { Order } from "@/lib/ordersApi";

interface OrderTableProps {
  orders: Order[];
  onStatusChange: (id: number, status: string) => Promise<void>;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

function getStatusClasses(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";

    case "PROCESSING":
      return "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300";

    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";

    case "CANCELLED":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300";

    default:
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
}

export default function OrderTable({
  orders,
  onStatusChange,
}: OrderTableProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const toggleOrder = (id: number) => {
    setExpandedOrderId((current) => (current === id ? null : id));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs text-[var(--muted)]">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const expanded = expandedOrderId === order.id;

              return (
                <tr
                  key={order.id}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  <td colSpan={7} className="p-0">
                    <div>
                      <div className="flex min-w-[900px] items-center">
                        <button
                          type="button"
                          onClick={() => toggleOrder(order.id)}
                          aria-label={
                            expanded ? "Collapse order" : "Expand order"
                          }
                          className="w-10 px-4 py-4 text-[var(--muted)] hover:text-[var(--text)]"
                        >
                          {expanded ? (
                            <ChevronUp size={17} />
                          ) : (
                            <ChevronDown size={17} />
                          )}
                        </button>

                        <div className="w-[160px] px-4 py-4 font-medium">
                          {order.orderNumber}
                        </div>

                        <div className="w-[180px] px-4 py-4">
                          {order.customerName}
                        </div>

                        <div className="w-[150px] px-4 py-4 text-[var(--muted)]">
                          {formatDate(order.orderDate)}
                        </div>

                        <div className="w-[100px] px-4 py-4">
                          {order.items.length}
                        </div>

                        <div className="w-[140px] px-4 py-4 font-medium">
                          {formatCurrency(order.totalAmount)}
                        </div>

                        <div className="flex-1 px-4 py-4">
                          <select
                            value={order.status}
                            onChange={(event) =>
                              onStatusChange(order.id, event.target.value)
                            }
                            className={[
                              "rounded-full border-0 px-3 py-1.5",
                              "text-xs font-semibold outline-none",
                              "cursor-pointer",
                              getStatusClasses(order.status),
                            ].join(" ")}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {expanded && (
                        <div className="border-t border-[var(--border)] bg-gray-50/60 px-12 py-4 dark:bg-white/[0.02]">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                              Order Items
                            </h3>

                            {order.notes && (
                              <span className="text-xs text-[var(--muted)]">
                                {order.notes}
                              </span>
                            )}
                          </div>

                          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-[var(--border)] text-xs text-[var(--muted)]">
                                  <th className="px-4 py-2 text-left font-medium">
                                    Product
                                  </th>
                                  <th className="px-4 py-2 text-left font-medium">
                                    SKU
                                  </th>
                                  <th className="px-4 py-2 text-right font-medium">
                                    Quantity
                                  </th>
                                  <th className="px-4 py-2 text-right font-medium">
                                    Unit Price
                                  </th>
                                  <th className="px-4 py-2 text-right font-medium">
                                    Line Total
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {order.items.map((item) => (
                                  <tr
                                    key={item.id}
                                    className="border-b border-[var(--border)] last:border-b-0"
                                  >
                                    <td className="px-4 py-3 font-medium">
                                      {item.product}
                                    </td>

                                    <td className="px-4 py-3 text-[var(--muted)]">
                                      {item.sku}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                      {item.quantity}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                      {formatCurrency(item.unitPrice)}
                                    </td>

                                    <td className="px-4 py-3 text-right font-medium">
                                      {formatCurrency(item.lineTotal)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-[var(--muted)]"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
