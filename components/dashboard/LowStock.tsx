import type { DashboardProduct } from "@/types/dashboard";

interface LowStockProps {
  products: DashboardProduct[];
}

export default function LowStock({ products }: LowStockProps) {
  return (
    <article className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Low Stock Alerts</h2>

        <button className="text-xs font-semibold text-violet-600 hover:underline dark:text-violet-300">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] p-4 text-center">
            <div className="text-sm font-medium">No low stock items</div>

            <div className="mt-1 text-xs text-[var(--muted)]">
              All products are currently above their reorder levels.
            </div>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-2.5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-gray-100 text-sm dark:bg-white/5">
                ▰
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {product.name}
                </div>

                <div className="text-[11px] text-[var(--muted)]">
                  SKU: {product.sku}
                </div>
              </div>

              <b className="text-sm text-orange-500">
                {product.stockQuantity} units
              </b>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
