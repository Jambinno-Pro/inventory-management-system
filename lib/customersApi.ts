const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api";

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  createdAt: string;
  orderCount: number;
};

export type CreateCustomerPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

export type UpdateCustomerPayload = {
  name: string;
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

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_URL}/customers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Customer[]>(response);
}

export async function getCustomer(id: number): Promise<Customer> {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Customer>(response);
}

export async function createCustomer(
  data: CreateCustomerPayload,
): Promise<Customer> {
  const response = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Customer>(response);
}

export async function updateCustomer(
  id: number,
  data: UpdateCustomerPayload,
): Promise<void> {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await handleResponse<void>(response);
}

export async function deleteCustomer(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  await handleResponse<void>(response);
}
