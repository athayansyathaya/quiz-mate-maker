import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, setToken, clearToken, isLoggedIn } from "@/lib/api";

type User = { id: string; name: string; email: string };
type Ctx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { setLoading(false); return; }
    api.me().then(setUser).catch(() => clearToken()).finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUser(data.user);
  };
  const register = async (name: string, email: string, password: string) => {
    const data = await api.register({ name, email, password });
    setToken(data.token);
    setUser(data.user);
  };
  const logout = () => { clearToken(); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
