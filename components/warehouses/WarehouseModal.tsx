"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Warehouse } from "@/lib/warehousesApi";

type WarehouseModalProps = {
  open: boolean;
  warehouse: Warehouse | null;
  onClose: () => void;
  onSave: (
    name: string,
    code: string,
    address: string,
    city: string,
    country: string,
  ) => Promise<void>;
};

export default function WarehouseModal({
  open,
  warehouse,
  onClose,
  onSave,
}: WarehouseModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(warehouse);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (warehouse) {
      setName(warehouse.name);
      setCode(warehouse.code);
      setAddress(warehouse.address);
      setCity(warehouse.city);
      setCountry(warehouse.country);
    } else {
      setName("");
      setCode("");
      setAddress("");
      setCity("");
      setCountry("");
    }

    setError("");
  }, [open, warehouse]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim();
    const trimmedCountry = country.trim();

    if (!trimmedName) {
      setError("Warehouse name is required.");
      return;
    }

    if (trimmedName.length > 150) {
      setError("Warehouse name cannot exceed 150 characters.");
      return;
    }

    if (!trimmedCode) {
      setError("Warehouse code is required.");
      return;
    }

    if (trimmedCode.length > 50) {
      setError("Warehouse code cannot exceed 50 characters.");
      return;
    }

    if (trimmedAddress.length > 250) {
      setError("Address cannot exceed 250 characters.");
      return;
    }

    if (trimmedCity.length > 100) {
      setError("City cannot exceed 100 characters.");
      return;
    }

    if (trimmedCountry.length > 100) {
      setError("Country cannot exceed 100 characters.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave(
        trimmedName,
        trimmedCode,
        trimmedAddress,
        trimmedCity,
        trimmedCountry,
      );

      setName("");
      setCode("");
      setAddress("");
      setCity("");
      setCountry("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save warehouse.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) {
      return;
    }

    setError("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit Warehouse" : "Add Warehouse"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {isEditing
                ? "Update the warehouse details."
                : "Add a new warehouse to your inventory system."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="warehouse-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Warehouse Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="warehouse-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Cape Town Warehouse"
                  maxLength={150}
                  disabled={saving}
                  autoFocus
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="mt-1.5 flex justify-end">
                  <span className="text-xs text-[var(--muted)]">
                    {name.length}/150
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="warehouse-code"
                  className="mb-2 block text-sm font-medium"
                >
                  Warehouse Code
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="warehouse-code"
                  type="text"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="e.g. CT-001"
                  maxLength={50}
                  disabled={saving}
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 font-mono text-sm uppercase outline-none transition placeholder:font-sans placeholder:text-[var(--muted)] focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-1.5 text-xs text-[var(--muted)]">
                  Code will be stored in uppercase.
                </p>
              </div>

              <div>
                <label
                  htmlFor="warehouse-city"
                  className="mb-2 block text-sm font-medium"
                >
                  City
                </label>

                <input
                  id="warehouse-city"
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="e.g. Cape Town"
                  maxLength={100}
                  disabled={saving}
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="warehouse-country"
                  className="mb-2 block text-sm font-medium"
                >
                  Country
                </label>

                <input
                  id="warehouse-country"
                  type="text"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="e.g. South Africa"
                  maxLength={100}
                  disabled={saving}
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="warehouse-address"
                  className="mb-2 block text-sm font-medium"
                >
                  Address
                </label>

                <textarea
                  id="warehouse-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Enter warehouse address..."
                  maxLength={250}
                  rows={3}
                  disabled={saving}
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="mt-1.5 flex justify-end">
                  <span className="text-xs text-[var(--muted)]">
                    {address.length}/250
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Warehouse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
