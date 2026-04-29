import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const link = (to: string, label: string) => (
    <Link to={to} className={`text-sm font-medium transition-colors hover:text-primary ${pathname === to ? "text-primary" : "text-foreground/80"}`}>{label}</Link>
  );
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-cta shadow-glow">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">PLAGIX</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {link("/", "Beranda")}
          {user && link("/dashboard", "Dashboard")}
          {user && link("/upload", "Cek Dokumen")}
          {link("/quiz", "Kuis")}
          {link("/pricing", "Harga")}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:block">Hai, {user.name.split(" ")[0]}</span>
              <Button variant="ghost" size="sm" onClick={() => { logout(); nav("/"); }}>
                <LogOut className="mr-2 h-4 w-4" />Keluar
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/login")}>Masuk</Button>
              <Button size="sm" className="bg-gradient-cta text-primary-foreground shadow-md hover:opacity-90" onClick={() => nav("/register")}>Daftar</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
