export interface DashboardProduct {
  id: number;
  name: string;
  sku: string;
  stockQuantity: number;
  reorderLevel: number;
  price: number;
  stockValue: number;
}

export interface DashboardTransaction {
  id: number;
  product: string;
  warehouse: string;
  type: string;
  quantity: number;
  reference: string;
  createdAt: string;
}

export interface DashboardInventoryOverview {
  date: string;
  stockIn: number;
  stockOut: number;
}

export interface DashboardWarehouse {
  id: number;
  name: string;
  stockQuantity: number;
  percentage: number;
}

export interface DashboardSummary {
  totalProducts: number;
  totalStock: number;
  totalStockValue: number;
  totalCategories: number;
  totalSuppliers: number;
  totalWarehouses: number;
  totalTransactions: number;
  lowStockProducts: number;
  lowStockItems: DashboardProduct[];
  recentTransactions: DashboardTransaction[];

  inventoryOverview: DashboardInventoryOverview[];
  stockByWarehouse: DashboardWarehouse[];
}
