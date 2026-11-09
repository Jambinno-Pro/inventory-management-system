const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api";

export type Supplier = {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  createdAt: string;
  productCount: number;
};

export type CreateSupplierPayload = {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

export type UpdateSupplierPayload = {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
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

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await fetch(`${API_URL}/suppliers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Supplier[]>(response);
}

export async function getSupplier(id: number): Promise<Supplier> {
  const response = await fetch(`${API_URL}/suppliers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Supplier>(response);
}

export async function createSupplier(
  data: CreateSupplierPayload,
): Promise<Supplier> {
  const response = await fetch(`${API_URL}/suppliers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Supplier>(response);
}

export async function updateSupplier(
  id: number,
  data: UpdateSupplierPayload,
): Promise<void> {
  const response = await fetch(`${API_URL}/suppliers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await handleResponse<void>(response);
}

export async function deleteSupplier(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/suppliers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  await handleResponse<void>(response);
}
