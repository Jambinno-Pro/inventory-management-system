"use client";

import { Camera, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your personal information and administrator account.
          </p>
        </div>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="relative grid h-24 w-24 place-items-center rounded-2xl border-4 border-[var(--surface)] bg-blue-100 text-2xl font-bold text-blue-700 shadow-sm dark:bg-blue-500/20 dark:text-blue-300">
                IJ
                <button
                  type="button"
                  disabled
                  title="Profile photo upload will be added later"
                  className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-blue-600 shadow-sm"
                >
                  <Camera size={15} />
                </button>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <ShieldCheck size={15} />
                Company Administrator
              </span>
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-bold text-[var(--text)]">
                Innocent Jambaya
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                StockFlow Administrator
              </p>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[var(--text)]">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Your administrator details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                Full Name
              </label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3">
                <UserRound size={17} className="text-blue-600" />
                <input
                  value="Innocent Jambaya"
                  readOnly
                  className="w-full bg-transparent text-sm text-[var(--text)] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                Email Address
              </label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3">
                <Mail size={17} className="text-blue-600" />
                <input
                  placeholder="Administrator email"
                  readOnly
                  className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                Phone Number
              </label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3">
                <Phone size={17} className="text-blue-600" />
                <input
                  placeholder="Phone number"
                  readOnly
                  className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                Account Role
              </label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3">
                <ShieldCheck size={17} className="text-blue-600" />
                <span className="text-sm text-[var(--text)]">
                  Company Administrator
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-sm font-medium text-[var(--text)]">
              Profile editing is coming next
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              These details are currently a read-only preview. We will connect
              them to the administrator account and database when authentication
              is implemented.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
