const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);
export const logout = () => localStorage.removeItem("token");

async function req(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API}/api${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export const api = {
  health: () => req("/health"),
  events: () => req("/events"),
  event: (id) => req(`/events/${id}`),
  login: (email, password) =>
    req("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password) =>
    req("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  createOrder: (payload) => req("/orders", { method: "POST", body: JSON.stringify(payload) }),
  myOrders: () => req("/orders/me"),
  deleteOrder: (id) => req(`/orders/${id}`, { method: "DELETE" }), // ✅ tambahkan ini
};
