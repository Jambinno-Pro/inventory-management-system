const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api";

/* =========================================================
   PRODUCT TYPES
========================================================= */

export type ApiProduct = {
  id: number;
  name: string;
  sku: string;

  categoryId: number;
  category: string;

  supplierId: number | null;
  supplier: string;

  warehouseId: number | null;
  warehouse: string;

  price: number;
  stockQuantity: number;
  reorderLevel: number;
  createdAt: string;
};

export type ProductsResponse = {
  items: ApiProduct[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type GetProductsParams = {
  search?: string;
  categoryId?: number;
  supplierId?: number;
  warehouseId?: number;
  lowStock?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type CreateProductPayload = {
  name: string;
  sku: string;
  categoryId: number;
  supplierId: number | null;
  warehouseId: number | null;
  price: number;
  stockQuantity: number;
  reorderLevel: number;
};

export type UpdateProductPayload = {
  name: string;
  sku: string;
  categoryId: number;
  supplierId: number | null;
  warehouseId: number | null;
  price: number;
  stockQuantity: number;
  reorderLevel: number;
};

/* =========================================================
   CATEGORY TYPES
========================================================= */

export type ApiCategory = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  productCount: number;
};

/* =========================================================
   ERROR HANDLING
========================================================= */

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (data?.message) {
      return data.message;
    }

    if (data?.title) {
      return data.title;
    }

    if (data?.errors) {
      const errors = Object.values(data.errors)
        .flat()
        .filter(Boolean)
        .join(" ");

      if (errors) {
        return errors;
      }
    }

    return "Something went wrong.";
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

/* =========================================================
   GET PRODUCTS
========================================================= */

export async function getProducts(
  params?: GetProductsParams,
): Promise<ProductsResponse> {
  const query = new URLSearchParams();

  if (params?.search) {
    query.set("search", params.search);
  }

  if (params?.categoryId !== undefined) {
    query.set("categoryId", String(params.categoryId));
  }

  if (params?.supplierId !== undefined) {
    query.set("supplierId", String(params.supplierId));
  }

  if (params?.warehouseId !== undefined) {
    query.set("warehouseId", String(params.warehouseId));
  }

  if (params?.lowStock !== undefined) {
    query.set("lowStock", String(params.lowStock));
  }

  query.set("page", String(params?.page ?? 1));
  query.set("pageSize", String(params?.pageSize ?? 100));
  query.set("sortBy", params?.sortBy ?? "name");
  query.set("sortOrder", params?.sortOrder ?? "asc");

  const response = await fetch(`${API_URL}/products?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

export async function getProduct(id: number): Promise<ApiProduct> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

/* =========================================================
   CREATE PRODUCT
========================================================= */

export async function createProduct(
  payload: CreateProductPayload,
): Promise<ApiProduct> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export async function updateProduct(
  id: number,
  payload: UpdateProductPayload,
): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

/* =========================================================
   GET CATEGORIES
========================================================= */

export async function getCategories(): Promise<ApiCategory[]> {
  const response = await fetch(`${API_URL}/categories`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}
