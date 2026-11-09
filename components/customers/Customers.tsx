"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";

import {
  deleteCustomer,
  getCustomers,
  type Customer,
} from "@/lib/customersApi";

import CustomerModal from "./CustomerModal";
import CustomerTable from "./CustomerTable";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const loadCustomers = useCallback(async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getCustomers();

      setCustomers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load customers.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${customer.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCustomer(customer.id);

      await loadCustomers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete customer.",
      );
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      customer.city.toLowerCase().includes(query) ||
      customer.country.toLowerCase().includes(query)
    );
  });

  return (
    <main className="px-4 py-6 md:px-7 md:py-7">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Customers
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your customers and their contact information.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <button
          type="button"
          onClick={() => loadCustomers(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/5"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-12 text-center">
          <RefreshCw
            size={20}
            className="mx-auto animate-spin text-violet-600"
          />

          <p className="mt-3 text-sm text-[var(--muted)]">
            Loading customers...
          </p>
        </div>
      ) : (
        <CustomerTable
          customers={filteredCustomers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      <CustomerModal
        open={modalOpen}
        customer={selectedCustomer}
        onClose={() => setModalOpen(false)}
        onSaved={() => loadCustomers()}
      />
    </main>
  );
}
