import { Box, Database, ShoppingCart, TrendingUp, Users } from "lucide-react";
const icons = {
  box: Box,
  database: Database,
  cart: ShoppingCart,
  users: Users,
};
const tones = {
  purple:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
  green:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300",
};
export default function StatCard({
  icon,
  label,
  value,
  change,
  tone,
}: {
  icon: keyof typeof icons;
  label: string;
  value: string;
  change: string;
  tone: keyof typeof tones;
}) {
  const Icon = icons[icon];
  return (
    <article className="card flex items-center gap-4 p-5">
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tones[tone]}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <div className="text-sm text-[var(--muted)]">{label}</div>
        <div className="mt-0.5 text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <TrendingUp size={13} />
          <span>{change}</span>
          <span className="text-[var(--muted)]">from last week</span>
        </div>
      </div>
    </article>
  );
}
