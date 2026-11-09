import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Warehouse,
  Truck,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Boxes,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const mainNav: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Tags,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Warehouses",
    href: "/warehouses",
    icon: Warehouse,
  },
];

export const inventoryNav: NavigationItem[] = [
  {
    label: "Stock Transactions",
    href: "/stock-transactions",
    icon: ArrowLeftRight,
  },
];

export const systemNav: NavigationItem[] = [
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export { Boxes };
