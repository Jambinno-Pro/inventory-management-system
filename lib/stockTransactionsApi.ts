const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api";

export type StockTransaction = {
  id: number;
  productId: number;
  product: string;
  warehouseId: number;
  warehouse: string;
  type: string;
  quantity: number;
  reference: string;
  notes: string;
  createdAt: string;
};

export type CreateStockTransactionPayload = {
  productId: number;
  warehouseId: number;
  type: string;
  quantity: number;
  reference: string;
  notes: string;
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

export async function getStockTransactions(): Promise<StockTransaction[]> {
  const response = await fetch(`${API_URL}/stocktransactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<StockTransaction[]>(response);
}

export async function getStockTransaction(
  id: number,
): Promise<StockTransaction> {
  const response = await fetch(`${API_URL}/stocktransactions/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<StockTransaction>(response);
}

export async function createStockTransaction(
  data: CreateStockTransactionPayload,
): Promise<StockTransaction> {
  const response = await fetch(`${API_URL}/stocktransactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<StockTransaction>(response);
}
