import type { DashboardSummary } from "@/types/dashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5250/api";

function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem("stockflow_access_token");
}

async function apiFetch(path: string): Promise<Response> {
  const token = getAccessToken();

  const headers = new Headers({
    Accept: "application/json",
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_URL}${path}`, {
    headers,
    cache: "no-store",
  });
}

export async function getDashboard(): Promise<DashboardSummary> {
  const response = await apiFetch("/dashboard");

  if (response.status === 401) {
    throw new Error("Your session has expired or you are not logged in.");
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch dashboard data: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
