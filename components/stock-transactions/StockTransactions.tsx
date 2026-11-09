"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import {
  getStockTransactions,
  type StockTransaction,
} from "@/lib/stockTransactionsApi";

import StockTransactionTable from "./StockTransactionTable";
import StockTransactionModal from "./StockTransactionModal";

export default function StockTransactions() {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStockTransactions();

      setTransactions(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load stock transactions.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleTransactionCreated = async () => {
    await loadTransactions();
  };

  return (
    <main className="px-4 py-6 md:px-7 md:py-7">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-[28px]">
              Stock Transactions
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track stock movements across your warehouses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-violet-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            <Plus size={17} />
            New Transaction
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Transactions Table */}
        <StockTransactionTable transactions={transactions} loading={loading} />

        {/* New Transaction Modal */}
        <StockTransactionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={handleTransactionCreated}
        />
      </div>
    </main>
  );
}
