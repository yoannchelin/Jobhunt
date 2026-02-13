const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (email: string, password: string) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),

  logout: () => request("/api/auth/logout", { method: "POST" }),

  listApps: () => request("/api/applications"),
  createApp: (payload: any) => request("/api/applications", { method: "POST", body: JSON.stringify(payload) }),
  updateApp: (id: string, payload: any) => request(`/api/applications/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteApp: (id: string) => request(`/api/applications/${id}`, { method: "DELETE" }),

  analytics: () => request("/api/analytics/summary"),
};
