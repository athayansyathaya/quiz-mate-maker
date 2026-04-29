import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Upload, BadgeCheck, Calendar, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Doc = { id: string; fileName: string; plagiarismPct: number; aiPct: number; createdAt: string };
type Sub = { id: string; plan: string; price: number; endDate: string; status: string };

export default function Dashboard() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);

  useEffect(() => {
    api.documents().then(setDocs).catch(() => {});
    api.mySubs().then(setSubs).catch(() => {});
  }, []);

  const avgPlag = docs.length ? (docs.reduce((s, d) => s + d.plagiarismPct, 0) / docs.length).toFixed(1) : "—";
  const activeSub = subs.find((s) => s.status === "active");

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Halo, {user?.name} 👋</h1>
            <p className="mt-1 text-muted-foreground">Selamat datang kembali di dashboard PLAGIX</p>
          </div>
          <Button asChild className="bg-gradient-cta text-primary-foreground hover:opacity-90">
            <Link to="/upload"><Upload className="mr-2 h-4 w-4" />Cek dokumen baru</Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <StatCard icon={FileText} label="Total dokumen" value={docs.length.toString()} />
          <StatCard icon={TrendingUp} label="Rata-rata plagiarisme" value={`${avgPlag}%`} />
          <StatCard icon={BadgeCheck} label="Langganan aktif" value={activeSub?.plan || "Belum ada"} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Riwayat dokumen</h2>
              <Link to="/upload" className="text-sm font-semibold text-primary hover:underline">+ Tambah</Link>
            </div>
            {docs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
                Belum ada dokumen. <Link to="/upload" className="font-semibold text-primary">Upload sekarang</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {docs.map((d) => (
                  <Link key={d.id} to={`/document/${d.id}`} className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{d.fileName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${d.plagiarismPct > 40 ? "bg-danger/10 text-danger" : d.plagiarismPct > 20 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                      {d.plagiarismPct}%
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Langganan</h2>
            {activeSub ? (
              <div>
                <div className="rounded-xl bg-gradient-cta p-5 text-primary-foreground">
                  <p className="text-xs uppercase opacity-90">Paket aktif</p>
                  <p className="mt-1 text-xl font-bold">{activeSub.plan}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm opacity-90">
                    <Calendar className="h-4 w-4" />
                    Berakhir {new Date(activeSub.endDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada langganan aktif.</p>
            )}
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/pricing">Lihat semua paket</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
