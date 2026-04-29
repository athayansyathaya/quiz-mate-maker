import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { api, isLoggedIn } from "@/lib/api";
import { toast } from "sonner";

type Plan = { plan: string; price: number; days: number };

const features: Record<string, string[]> = {
  "b2c-payperuse": ["1 dokumen", "Laporan lengkap", "Riwayat 30 hari"],
  "b2c-monthly": ["Unlimited dokumen", "Laporan lengkap", "Prioritas support", "Berlaku 30 hari"],
  "b2b-annual": ["Unlimited user kampus", "Integrasi LMS", "API access", "Dedicated support", "Berlaku 1 tahun"],
};

export default function Pricing() {
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const nav = useNavigate();

  useEffect(() => { api.plans().then(setPlans); }, []);

  const subscribe = async (key: string) => {
    if (!isLoggedIn()) { toast.error("Login dulu"); nav("/login"); return; }
    try {
      await api.subscribe(key);
      toast.success("Berlangganan berhasil!");
      nav("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal");
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);

  return (
    <Layout>
      <div className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Pilih paket yang pas</h1>
          <p className="mt-3 text-muted-foreground">Dari mahasiswa sampai institusi — ada paket untuk semua.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {Object.entries(plans).map(([key, p], i) => {
            const highlight = i === 1;
            return (
              <div key={key} className={`relative rounded-3xl border p-8 shadow-sm transition-all hover:shadow-elegant ${highlight ? "border-primary bg-gradient-card scale-[1.02]" : "border-border bg-card"}`}>
                {highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-cta px-4 py-1 text-xs font-bold text-primary-foreground">Populer</span>
                )}
                <h3 className="text-xl font-bold">{p.plan}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold">Rp{fmt(p.price)}</span>
                  <span className="text-sm text-muted-foreground"> / {p.days} hari</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm">
                  {(features[key] || []).map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />{f}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => subscribe(key)} className={`mt-8 w-full ${highlight ? "bg-gradient-cta text-primary-foreground hover:opacity-90" : ""}`} variant={highlight ? "default" : "outline"}>
                  Berlangganan
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
