const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5250/api";

export type AppSettings = {
  id: number;

  // Company profile
  companyName: string;
  registrationNumber: string;

  // Business address
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;

  // Contact details
  email: string;
  phone: string;
  alternativePhone: string;
  website: string;

  updatedAt: string;
};

export type UpdateSettingsPayload = {
  companyName: string;
  registrationNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
  alternativePhone: string;
  website: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to communicate with the API.");
  }

  return response.json() as Promise<T>;
}

export async function getSettings(): Promise<AppSettings> {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    cache: "no-store",
  });

  return handleResponse<AppSettings>(response);
}

export async function updateSettings(
  payload: UpdateSettingsPayload,
): Promise<AppSettings> {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<AppSettings>(response);
}
