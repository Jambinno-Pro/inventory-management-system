const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api";

export type OrderItem = {
  id: number;
  productId: number;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: number;
  orderNumber: string;

  // Customer relationship
  customerId: number | null;
  customerName: string;

  orderDate: string;
  status: string;
  totalAmount: number;
  notes: string;
  items: OrderItem[];
};

export type CreateOrderItemPayload = {
  productId: number;
  quantity: number;
};

export type CreateOrderPayload = {
  customerId?: number;
  customerName?: string;
  items: CreateOrderItemPayload[];
  notes: string;
};

export type UpdateOrderStatusPayload = {
  status: string;
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

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Order[]>(response);
}

export async function getOrder(id: number): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Order>(response);
}

export async function createOrder(data: CreateOrderPayload): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Order>(response);
}

export async function updateOrderStatus(
  id: number,
  data: UpdateOrderStatusPayload,
): Promise<void> {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await handleResponse<void>(response);
}
