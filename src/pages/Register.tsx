import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password minimal 6 karakter");
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Akun dibuat");
      nav("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal daftar");
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
        <h1 className="text-center text-2xl font-bold">Buat akun gratis</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Mulai cek dokumen pertamamu</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Nama lengkap</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="pass">Password</Label>
            <Input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-cta text-primary-foreground hover:opacity-90">
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Sudah punya akun? <Link to="/login" className="font-semibold text-primary hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
