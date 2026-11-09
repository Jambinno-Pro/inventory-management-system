const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api";

export type Warehouse = {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  createdAt: string;
  productCount: number;
};

export type CreateWarehousePayload = {
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
};

export type UpdateWarehousePayload = {
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
};

type ApiError = {
  message?: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "Something went wrong.";

    try {
      const error: ApiError = await response.json();

      if (error.message) {
        errorMessage = error.message;
      }
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function getWarehouses(): Promise<Warehouse[]> {
  const response = await fetch(`${API_URL}/warehouses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Warehouse[]>(response);
}

export async function getWarehouse(id: number): Promise<Warehouse> {
  const response = await fetch(`${API_URL}/warehouses/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Warehouse>(response);
}

export async function createWarehouse(
  data: CreateWarehousePayload,
): Promise<Warehouse> {
  const response = await fetch(`${API_URL}/warehouses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Warehouse>(response);
}

export async function updateWarehouse(
  id: number,
  data: UpdateWarehousePayload,
): Promise<void> {
  const response = await fetch(`${API_URL}/warehouses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await handleResponse<void>(response);
}

export async function deleteWarehouse(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/warehouses/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  await handleResponse<void>(response);
}
