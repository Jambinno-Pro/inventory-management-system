"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import WarehouseModal from "./WarehouseModal";
import WarehouseTable from "./WarehouseTable";

import {
  Warehouse,
  createWarehouse,
  deleteWarehouse,
  getWarehouses,
  updateWarehouse,
} from "@/lib/warehousesApi";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null,
  );

  const [error, setError] = useState("");

  async function loadWarehouses() {
    try {
      setLoading(true);
      setError("");

      const data = await getWarehouses();

      setWarehouses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load warehouses.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWarehouses();
  }, []);

  const filteredWarehouses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return warehouses;
    }

    return warehouses.filter((warehouse) =>
      [
        warehouse.name,
        warehouse.code,
        warehouse.address,
        warehouse.city,
        warehouse.country,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [warehouses, search]);

  function handleAddWarehouse() {
    setEditingWarehouse(null);
    setError("");
    setModalOpen(true);
  }

  function handleEditWarehouse(warehouse: Warehouse) {
    setEditingWarehouse(warehouse);
    setError("");
    setModalOpen(true);
  }

  async function handleSaveWarehouse(
    name: string,
    code: string,
    address: string,
    city: string,
    country: string,
  ) {
    setError("");

    const data = {
      name,
      code,
      address,
      city,
      country,
    };

    if (editingWarehouse) {
      await updateWarehouse(editingWarehouse.id, data);
    } else {
      await createWarehouse(data);
    }

    setModalOpen(false);
    setEditingWarehouse(null);

    await loadWarehouses();
  }

  async function handleDeleteWarehouse(warehouse: Warehouse) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${warehouse.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteWarehouse(warehouse.id);

      setWarehouses((current) =>
        current.filter((item) => item.id !== warehouse.id),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete warehouse.",
      );
    }
  }

  return (
    <main className="px-4 py-6 md:px-7 md:py-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
            Warehouses
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your warehouses and inventory locations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddWarehouse}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus size={17} strokeWidth={2.2} />
          Add Warehouse
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />

          <input
            type="text"
            placeholder="Search warehouses..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
          />
        </div>

        <div className="flex h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5">
          <span className="text-xs text-[var(--muted)]">Warehouses</span>

          <span className="ml-2 text-sm font-semibold">
            {warehouses.length}
          </span>
        </div>

        <div className="flex h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5">
          <span className="text-xs text-[var(--muted)]">Products</span>

          <span className="ml-2 text-sm font-semibold">
            {warehouses.reduce(
              (total, warehouse) => total + warehouse.productCount,
              0,
            )}
          </span>
        </div>
      </div>

      <WarehouseTable
        warehouses={filteredWarehouses}
        loading={loading}
        onEdit={handleEditWarehouse}
        onDelete={handleDeleteWarehouse}
      />

      <WarehouseModal
        open={modalOpen}
        warehouse={editingWarehouse}
        onClose={() => {
          setModalOpen(false);
          setEditingWarehouse(null);
        }}
        onSave={handleSaveWarehouse}
      />
    </main>
  );
}
