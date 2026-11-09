import { ArrowDownRight, ArrowLeftRight, ArrowUpRight } from "lucide-react";

import type { DashboardTransaction } from "@/types/dashboard";

interface TransactionsTableProps {
  transactions: DashboardTransaction[];
}

const getTransactionLabel = (type: string) => {
  switch (type) {
    case "STOCK_IN":
      return "Stock In";

    case "STOCK_OUT":
      return "Stock Out";

    case "ADJUSTMENT":
      return "Adjustment";

    default:
      return type;
  }
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "STOCK_IN":
      return <ArrowUpRight size={13} />;

    case "STOCK_OUT":
      return <ArrowDownRight size={13} />;

    default:
      return <ArrowLeftRight size={13} />;
  }
};

const getTransactionStyle = (type: string) => {
  switch (type) {
    case "STOCK_IN":
      return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10";

    case "STOCK_OUT":
      return "bg-red-50 text-red-600 dark:bg-red-500/10";

    default:
      return "bg-blue-50 text-blue-600 dark:bg-blue-500/10";
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  return (
    <article className="card overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <h2 className="font-semibold">Recent Transactions</h2>

        <button className="text-xs font-semibold text-violet-600 hover:underline dark:text-violet-300">
          View all
        </button>
      </div>

      <div className="scrollbar overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-xs">
          <thead className="border-y border-[var(--border)] bg-gray-50 text-[var(--muted)] dark:bg-white/[.02]">
            <tr>
              {[
                "ID",
                "Type",
                "Product",
                "Reference",
                "Warehouse",
                "Quantity",
                "Date",
              ].map((column) => (
                <th key={column} className="px-5 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-center text-[var(--muted)]"
                >
                  No recent transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50/70 dark:hover:bg-white/[.02]"
                >
                  <td className="px-5 py-3 font-medium text-[var(--muted)]">
                    #{transaction.id}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium ${getTransactionStyle(
                        transaction.type,
                      )}`}
                    >
                      {getTransactionIcon(transaction.type)}

                      {getTransactionLabel(transaction.type)}
                    </span>
                  </td>

                  <td className="px-5 py-3 font-medium">
                    {transaction.product}
                  </td>

                  <td className="px-5 py-3">{transaction.reference || "—"}</td>

                  <td className="px-5 py-3">{transaction.warehouse}</td>

                  <td
                    className={`px-5 py-3 font-semibold ${
                      transaction.type === "STOCK_OUT"
                        ? "text-red-500"
                        : transaction.type === "STOCK_IN"
                          ? "text-emerald-500"
                          : "text-blue-500"
                    }`}
                  >
                    {transaction.type === "STOCK_OUT" ? "-" : "+"}
                    {transaction.quantity}
                  </td>

                  <td className="px-5 py-3">
                    {formatDate(transaction.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}
