"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/lib/customersApi";

interface CustomerModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm: CreateCustomerPayload = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
};

export default function CustomerModal({
  open,
  customer,
  onClose,
  onSaved,
}: CustomerModalProps) {
  const [form, setForm] = useState<CreateCustomerPayload>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = customer !== null;

  useEffect(() => {
    if (!open) return;

    if (customer) {
      setForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: customer.country,
      });
    } else {
      setForm(emptyForm);
    }

    setError("");
  }, [open, customer]);

  if (!open) {
    return null;
  }

  const updateField = (field: keyof CreateCustomerPayload, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Customer name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setSaving(true);

      if (isEditing && customer) {
        const payload: UpdateCustomerPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
        };

        const { updateCustomer } = await import("@/lib/customersApi");

        await updateCustomer(customer.id, payload);
      } else {
        const payload: CreateCustomerPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
        };

        const { createCustomer } = await import("@/lib/customersApi");

        await createCustomer(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save customer.");
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
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Customer" : "Add Customer"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update customer information."
                : "Add a new customer to StockFlow."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="customer-name"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Full Name
              </label>

              <input
                id="customer-name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="e.g. John Smith"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="customer-email"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Email
              </label>

              <input
                id="customer-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="customer@example.com"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="customer-phone"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Phone
              </label>

              <input
                id="customer-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+27 71 123 4567"
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label
                htmlFor="customer-address"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Address
              </label>

              <input
                id="customer-address"
                type="text"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Street address"
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="customer-city"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                City
              </label>

              <input
                id="customer-city"
                type="text"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="Cape Town"
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="customer-country"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Country
              </label>

              <input
                id="customer-country"
                type="text"
                value={form.country}
                onChange={(event) => updateField("country", event.target.value)}
                placeholder="South Africa"
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
