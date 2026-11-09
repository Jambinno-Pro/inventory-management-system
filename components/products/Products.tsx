"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";

import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";

import { getProducts, type ApiProduct } from "@/lib/productsApi";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  status: ProductStatus;
};

/* -------------------------------------------------------------------------- */
/* API Product Mapper                                                         */
/* -------------------------------------------------------------------------- */

function mapApiProduct(product: ApiProduct): Product {
  let status: ProductStatus;

  if (product.stockQuantity <= 0) {
    status = "Out of Stock";
  } else if (product.stockQuantity <= product.reorderLevel) {
    status = "Low Stock";
  } else {
    status = "In Stock";
  }

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,

    // The current .NET API only has Price.
    costPrice: 0,
    sellingPrice: product.price,

    stock: product.stockQuantity,
    minStock: product.reorderLevel,
    status,
  };
}

/* -------------------------------------------------------------------------- */
/* Products Component                                                         */
/* -------------------------------------------------------------------------- */

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");

  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Load Products                                                            */
  /* ------------------------------------------------------------------------ */

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        page: 1,
        pageSize: 100,
      });

      const mappedProducts = response.items.map(mapApiProduct);

      setProducts(mappedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Categories                                                               */
  /* ------------------------------------------------------------------------ */

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean)),
    );

    return ["All Categories", ...uniqueCategories];
  }, [products]);

  /* ------------------------------------------------------------------------ */
  /* Filter Products                                                          */
  /* ------------------------------------------------------------------------ */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);

      const matchesCategory =
        category === "All Categories" || product.category === category;

      const matchesStatus =
        status === "All Status" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  /* ------------------------------------------------------------------------ */
  /* Statistics                                                               */
  /* ------------------------------------------------------------------------ */

  const statistics = useMemo(() => {
    return {
      total: products.length,

      inStock: products.filter((product) => product.status === "In Stock")
        .length,

      lowStock: products.filter((product) => product.status === "Low Stock")
        .length,

      outOfStock: products.filter(
        (product) => product.status === "Out of Stock",
      ).length,
    };
  }, [products]);

  /* ------------------------------------------------------------------------ */
  /* Product Created                                                          */
  /* ------------------------------------------------------------------------ */

  const handleProductCreated = async () => {
    setShowModal(false);

    // Reload from the database so the UI always reflects
    // the actual .NET API / SQL Server data.
    await loadProducts();
  };

  /* ------------------------------------------------------------------------ */
  /* Clear Filters                                                            */
  /* ------------------------------------------------------------------------ */

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setStatus("All Status");
  };

  /* ------------------------------------------------------------------------ */
  /* Loading State                                                            */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="px-4 py-6 md:px-7 md:py-7">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={30} className="animate-spin text-violet-600" />

            <p className="text-sm text-[var(--muted)]">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error State                                                              */
  /* ------------------------------------------------------------------------ */

  if (error) {
    return (
      <main className="px-4 py-6 md:px-7 md:py-7">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
            Products
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your inventory products, pricing and stock levels.
          </p>
        </header>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/10">
          <div className="flex items-start gap-3">
            <XCircle size={20} className="mt-0.5 shrink-0 text-red-500" />

            <div>
              <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">
                Failed to load products
              </h2>

              <p className="mt-1 text-xs text-red-600 dark:text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={loadProducts}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="px-4 py-6 md:px-7 md:py-7">
      {/* Page Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
            Products
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your inventory products, pricing and stock levels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-violet-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500/40"
        >
          <Plus size={17} />
          Add Product
        </button>
      </header>

      {/* Statistics */}
      <section
        aria-label="Product statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <ProductStat
          icon={<Package size={21} />}
          label="Total Products"
          value={statistics.total}
          tone="purple"
        />

        <ProductStat
          icon={<CheckCircle2 size={21} />}
          label="In Stock"
          value={statistics.inStock}
          tone="green"
        />

        <ProductStat
          icon={<AlertTriangle size={21} />}
          label="Low Stock"
          value={statistics.lowStock}
          tone="orange"
        />

        <ProductStat
          icon={<XCircle size={21} />}
          label="Out of Stock"
          value={statistics.outOfStock}
          tone="red"
        />
      </section>

      {/* Products Card */}
      <section className="card mt-4 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-[var(--border)] p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="flex h-10 w-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 transition-colors focus-within:border-violet-500 lg:max-w-md">
              <Search size={17} className="shrink-0 text-[var(--muted)]" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products or SKU..."
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <FilterSelect
                value={category}
                onChange={setCategory}
                options={categories}
                ariaLabel="Filter by category"
              />

              <FilterSelect
                value={status}
                onChange={setStatus}
                options={[
                  "All Status",
                  "In Stock",
                  "Low Stock",
                  "Out of Stock",
                ]}
                ariaLabel="Filter by stock status"
              />

              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                aria-expanded={showFilters}
                className={[
                  "inline-flex h-10 items-center gap-2 rounded-xl border px-3",
                  "text-xs font-semibold transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/30",

                  showFilters
                    ? [
                        "border-violet-300",
                        "bg-violet-50 text-violet-700",
                        "dark:border-violet-500/30",
                        "dark:bg-violet-500/10",
                        "dark:text-violet-300",
                      ].join(" ")
                    : [
                        "border-[var(--border)]",
                        "bg-[var(--surface)]",
                        "text-[var(--muted)]",
                        "hover:text-[var(--text)]",
                      ].join(" "),
                ].join(" ")}
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>
            </div>
          </div>

          {/* Filter Summary */}
          {showFilters && (
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-gray-50 p-3 dark:bg-white/[0.02]">
              <div className="flex flex-col gap-2 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing{" "}
                  <strong className="font-semibold text-[var(--text)]">
                    {filteredProducts.length}
                  </strong>{" "}
                  of{" "}
                  <strong className="font-semibold text-[var(--text)]">
                    {products.length}
                  </strong>{" "}
                  products
                </span>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-fit font-semibold text-violet-600 transition hover:underline dark:text-violet-300"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Table */}
        <ProductTable products={filteredProducts} />
      </section>

      {/* Add Product Modal */}
      {showModal && (
        <ProductModal
          onClose={() => setShowModal(false)}
          onCreated={handleProductCreated}
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter Select                                                              */
/* -------------------------------------------------------------------------- */

function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className={[
          "h-10 appearance-none rounded-xl",
          "border border-[var(--border)]",
          "bg-[var(--surface)]",
          "py-0 pl-3 pr-9",
          "text-xs font-medium text-[var(--text)]",
          "outline-none transition-colors",
          "focus:border-violet-500",
          "focus:ring-2 focus:ring-violet-500/20",
        ].join(" ")}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Product Statistic Card                                                     */
/* -------------------------------------------------------------------------- */

function ProductStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone: "purple" | "green" | "orange" | "red";
}) {
  const styles = {
    purple:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",

    green:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",

    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300",

    red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
  };

  return (
    <article className="card flex items-center gap-4 p-5 transition-shadow duration-200 hover:shadow-sm">
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${styles[tone]}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-sm text-[var(--muted)]">{label}</div>

        <div className="mt-0.5 text-2xl font-bold tracking-tight">
          {value.toLocaleString()}
        </div>
      </div>
    </article>
  );
}
