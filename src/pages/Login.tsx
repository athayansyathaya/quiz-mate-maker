import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("demo@plagix.id");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Berhasil masuk");
      nav("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elegant">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-cta shadow-glow">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">PLAGIX</span>
        </Link>
        <h1 className="text-center text-2xl font-bold">Masuk ke akunmu</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Selamat datang kembali!</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="pass">Password</Label>
            <Input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-cta text-primary-foreground hover:opacity-90">
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Belum punya akun? <Link to="/register" className="font-semibold text-primary hover:underline">Daftar</Link>
        </p>
        <div className="mt-5 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
          <strong>Demo:</strong> demo@plagix.id / password123
        </div>
      </div>
    </div>
  );
}
