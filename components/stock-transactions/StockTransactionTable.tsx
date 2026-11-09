"use client";

import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import type { StockTransaction } from "@/lib/stockTransactionsApi";

type StockTransactionTableProps = {
  transactions: StockTransaction[];
  loading: boolean;
};

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function getTypeStyles(type: string) {
  switch (type) {
    case "STOCK_IN":
      return {
        label: "Stock In",
        className:
          "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
      };

    case "STOCK_OUT":
      return {
        label: "Stock Out",
        className:
          "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
      };

    case "ADJUSTMENT":
      return {
        label: "Adjustment",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
      };

    default:
      return {
        label: type,
        className:
          "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
      };
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "STOCK_IN":
      return <ArrowDown size={14} />;

    case "STOCK_OUT":
      return <ArrowUp size={14} />;

    case "ADJUSTMENT":
      return <RefreshCw size={14} />;

    default:
      return null;
  }
}

export default function StockTransactionTable({
  transactions,
  loading,
}: StockTransactionTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading stock transactions...
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No stock transactions found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Product
              </th>

              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Warehouse
              </th>

              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Type
              </th>

              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Quantity
              </th>

              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Reference
              </th>

              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {transactions.map((transaction) => {
              const type = getTypeStyles(transaction.type);

              return (
                <tr
                  key={transaction.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.product}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {transaction.productId}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {transaction.warehouse}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${type.className}`}
                    >
                      {getTypeIcon(transaction.type)}
                      {type.label}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {transaction.quantity}
                  </td>

                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {transaction.reference || "—"}
                  </td>

                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {formatDate(transaction.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
