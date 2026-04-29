const API = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("plagix_token");
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  health: () => request("/health"),
  register: (body: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  documents: () => request("/documents"),
  document: (id: string) => request(`/documents/${id}`),
  uploadDocument: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return request("/documents/upload", { method: "POST", body: fd });
  },
  deleteDocument: (id: string) => request(`/documents/${id}`, { method: "DELETE" }),
  quizzes: () => request("/quiz"),
  submitQuiz: (quizId: string, answers: Record<string, number>) =>
    request(`/quiz/${quizId}/submit`, { method: "POST", body: JSON.stringify({ answers }) }),
  myAttempts: () => request("/quiz/attempts/me"),
  plans: () => request("/subscriptions/plans"),
  mySubs: () => request("/subscriptions/me"),
  subscribe: (planKey: string) =>
    request("/subscriptions/subscribe", { method: "POST", body: JSON.stringify({ planKey }) }),
};

export function setToken(t: string) { localStorage.setItem("plagix_token", t); }
export function clearToken() { localStorage.removeItem("plagix_token"); }
export function isLoggedIn() { return !!getToken(); }
