const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api";

export type Category = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  productCount: number;
};

export type CreateCategoryPayload = {
  name: string;
  description: string;
};

export type UpdateCategoryPayload = {
  name: string;
  description: string;
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

// GET: /api/categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Category[]>(response);
}

// GET: /api/categories/{id}
export async function getCategory(id: number): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return handleResponse<Category>(response);
}

// POST: /api/categories
export async function createCategory(
  data: CreateCategoryPayload,
): Promise<Category> {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Category>(response);
}

// PUT: /api/categories/{id}
export async function updateCategory(
  id: number,
  data: UpdateCategoryPayload,
): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await handleResponse<void>(response);
}

// DELETE: /api/categories/{id}
export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  await handleResponse<void>(response);
}
