"use client";

import { useEffect, useState } from "react";
import type {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  ReactNode,
} from "react";
import {
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings2,
} from "lucide-react";
import {
  getSettings,
  updateSettings,
  type AppSettings,
  type UpdateSettingsPayload,
} from "@/lib/settingsApi";

type FormValues = UpdateSettingsPayload;
type FieldName = keyof FormValues;

const emptyForm: FormValues = {
  companyName: "",
  registrationNumber: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  country: "",
  email: "",
  phone: "",
  alternativePhone: "",
  website: "",
};

const inputClass =
  "mt-2 block w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "block text-sm font-medium text-[var(--foreground)]";

type FieldProps = {
  id: FieldName;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  required?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
};

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  required = false,
  icon,
  disabled = false,
}: FieldProps) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-blue-500">*</span>}
      </label>

      <div className={icon ? "relative" : undefined}>
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
            {icon}
          </span>
        )}

        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          className={`${inputClass}${icon ? " pl-10" : ""}`}
        />
      </div>
    </div>
  );
}

type TextAreaFieldProps = {
  id: FieldName;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
};

function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
  disabled = false,
}: TextAreaFieldProps) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={`${inputClass} resize-y`}
      />
    </div>
  );
}

function PreviewItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="mt-0.5 shrink-0 text-blue-500">{icon}</span>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
        <div className="mt-1 break-words text-sm text-[var(--foreground)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [settingsId, setSettingsId] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const data: AppSettings = await getSettings();

        if (!active) return;

        setSettingsId(data.id);
        setUpdatedAt(data.updatedAt);

        setForm({
          companyName: data.companyName ?? "",
          registrationNumber: data.registrationNumber ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          province: data.province ?? "",
          postalCode: data.postalCode ?? "",
          country: data.country ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          alternativePhone: data.alternativePhone ?? "",
          website: data.website ?? "",
        });
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load company settings.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name as FieldName]: value,
    }));

    setSuccess("");
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: UpdateSettingsPayload = {
        companyName: form.companyName.trim(),
        registrationNumber: form.registrationNumber.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        alternativePhone: form.alternativePhone.trim(),
        website: form.website.trim(),
      };

      const saved = await updateSettings(payload);

      setSettingsId(saved.id);
      setUpdatedAt(saved.updatedAt);

      setForm({
        companyName: saved.companyName ?? "",
        registrationNumber: saved.registrationNumber ?? "",
        address: saved.address ?? "",
        city: saved.city ?? "",
        province: saved.province ?? "",
        postalCode: saved.postalCode ?? "",
        country: saved.country ?? "",
        email: saved.email ?? "",
        phone: saved.phone ?? "",
        alternativePhone: saved.alternativePhone ?? "",
        website: saved.website ?? "",
      });

      setSuccess("Company settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save company settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  const sidebarAddress = [
    form.address,
    form.city,
    form.province,
    form.postalCode,
    form.country,
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

  const sidebarHasDetails = Boolean(
    form.registrationNumber.trim() ||
    sidebarAddress ||
    form.email.trim() ||
    form.phone.trim() ||
    form.alternativePhone.trim() ||
    form.website.trim(),
  );

  if (loading) {
    return (
      <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            Loading company settings...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Settings2 className="h-4 w-4 shrink-0 text-blue-500" />
              <span>System configuration</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
              Manage your company profile, business address, and contact
              information used throughout StockFlow.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-blue-500 shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300"
          >
            <span className="break-words">{error}</span>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-700 dark:text-blue-300"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <form onSubmit={handleSave} className="min-w-0 space-y-6">
            {/* Company profile */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-[var(--foreground)]">
                      Company profile
                    </h2>
                    <p className="mt-1 text-sm leading-5 text-[var(--muted-foreground)]">
                      Your registered business identity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 md:grid-cols-2">
                <div className="min-w-0 md:col-span-2">
                  <Field
                    id="companyName"
                    label="Company name"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    maxLength={150}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="min-w-0 md:col-span-2">
                  <Field
                    id="registrationNumber"
                    label="Registration number"
                    value={form.registrationNumber}
                    onChange={handleChange}
                    placeholder="Company registration number (optional)"
                    maxLength={100}
                    icon={<FileText className="h-4 w-4" />}
                    disabled={saving}
                  />
                </div>
              </div>
            </section>

            {/* Business address */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-[var(--foreground)]">
                      Business address
                    </h2>
                    <p className="mt-1 text-sm leading-5 text-[var(--muted-foreground)]">
                      Address details for reports and business documents.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 md:grid-cols-2">
                <div className="min-w-0 md:col-span-2">
                  <TextAreaField
                    id="address"
                    label="Street address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street, building, or business premises"
                    rows={3}
                    maxLength={500}
                    disabled={saving}
                  />
                </div>

                <Field
                  id="city"
                  label="City / Town"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Cape Town"
                  maxLength={100}
                  disabled={saving}
                />

                <Field
                  id="province"
                  label="Province / State"
                  value={form.province}
                  onChange={handleChange}
                  placeholder="e.g. Western Cape"
                  maxLength={100}
                  disabled={saving}
                />

                <Field
                  id="postalCode"
                  label="Postal code"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  maxLength={20}
                  disabled={saving}
                />

                <Field
                  id="country"
                  label="Country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="e.g. South Africa"
                  maxLength={100}
                  disabled={saving}
                />
              </div>
            </section>

            {/* Contact information */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-[var(--foreground)]">
                      Contact information
                    </h2>
                    <p className="mt-1 text-sm leading-5 text-[var(--muted-foreground)]">
                      How customers and suppliers can reach your business.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 md:grid-cols-2">
                <div className="min-w-0 md:col-span-2">
                  <Field
                    id="email"
                    label="Email address"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="company@example.com"
                    maxLength={254}
                    icon={<Mail className="h-4 w-4" />}
                    disabled={saving}
                  />
                </div>

                <Field
                  id="phone"
                  label="Primary phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+27 ..."
                  maxLength={30}
                  icon={<Phone className="h-4 w-4" />}
                  disabled={saving}
                />

                <Field
                  id="alternativePhone"
                  label="Alternative phone"
                  type="tel"
                  value={form.alternativePhone}
                  onChange={handleChange}
                  placeholder="Optional alternative number"
                  maxLength={30}
                  icon={<Phone className="h-4 w-4" />}
                  disabled={saving}
                />

                <div className="min-w-0 md:col-span-2">
                  <Field
                    id="website"
                    label="Company website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                    maxLength={250}
                    icon={<Globe className="h-4 w-4" />}
                    disabled={saving}
                  />
                </div>
              </div>
            </section>

            {/* Save actions */}
            <section className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                {settingsId !== null && updatedAt
                  ? `Last updated ${new Date(updatedAt).toLocaleString()}`
                  : "Your changes will be saved to the database."}
              </p>

              <button
                type="submit"
                disabled={saving || !form.companyName.trim()}
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving changes..." : "Save changes"}
              </button>
            </section>
          </form>

          {/* Settings sidebar */}
          <aside className="min-w-0 space-y-6">
            {/* General settings information */}

            {/* Live company profile preview */}
            <section className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Building2 className="h-5 w-5" />
              </div>

              <h2 className="mt-4 break-words text-lg font-semibold text-[var(--foreground)]">
                {form.companyName.trim() || "Your company"}
              </h2>

              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Company profile preview
              </p>

              <div className="mt-5 space-y-4 border-t border-[var(--border)] pt-4">
                {form.registrationNumber.trim() && (
                  <PreviewItem
                    icon={<FileText className="h-4 w-4" />}
                    label="Registration number"
                  >
                    {form.registrationNumber}
                  </PreviewItem>
                )}

                {sidebarAddress && (
                  <PreviewItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Business address"
                  >
                    {sidebarAddress}
                  </PreviewItem>
                )}

                {form.email.trim() && (
                  <PreviewItem
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                  >
                    <a
                      href={`mailto:${form.email}`}
                      className="hover:text-blue-500"
                    >
                      {form.email}
                    </a>
                  </PreviewItem>
                )}

                {(form.phone.trim() || form.alternativePhone.trim()) && (
                  <PreviewItem
                    icon={<Phone className="h-4 w-4" />}
                    label="Telephone"
                  >
                    <div className="space-y-1">
                      {form.phone.trim() && <p>{form.phone}</p>}
                      {form.alternativePhone.trim() && (
                        <p className="text-[var(--muted-foreground)]">
                          {form.alternativePhone}
                        </p>
                      )}
                    </div>
                  </PreviewItem>
                )}

                {form.website.trim() && (
                  <PreviewItem
                    icon={<Globe className="h-4 w-4" />}
                    label="Website"
                  >
                    {form.website}
                  </PreviewItem>
                )}

                {!sidebarHasDetails && (
                  <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                    Add your company details in the form. Your profile
                    information will appear here as you type.
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
                  {settingsId !== null
                    ? "Connected to StockFlow"
                    : "New company profile"}
                </div>

                <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                  {settingsId !== null
                    ? "Your saved company settings are loaded. Save any edits to update the database."
                    : "Save your company details to store them in the database."}
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
