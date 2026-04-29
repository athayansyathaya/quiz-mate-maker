import { Link } from "react-router-dom";
import { ArrowRight, Brain, FileSearch, Lock, Sparkles, Workflow, BadgeCheck, Building2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import hero from "@/assets/hero.jpg";

const features = [
  { icon: Brain, title: "Analisis Semantik", desc: "Bukan sekadar cocokin kata — PLAGIX paham makna kalimat." },
  { icon: Sparkles, title: "Deteksi AI & Parafrase", desc: "Identifikasi teks hasil ChatGPT dan parafrase otomatis." },
  { icon: FileSearch, title: "Laporan Transparan", desc: "Sumber, persentase, paragraf bermasalah — semua jelas." },
  { icon: Workflow, title: "Integrasi LMS", desc: "Plug & play dengan Moodle, Google Classroom, Canvas." },
  { icon: Lock, title: "Aman & Privat", desc: "Dokumen kamu terenkripsi dan tidak dibagikan." },
  { icon: BadgeCheck, title: "Akurasi Tinggi", desc: "Minim false positive dan false negative." },
];

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.07]" />
        <div className="container relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-in">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Generasi baru deteksi plagiarisme
            </div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Check Beyond <span className="text-gradient">Words.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              PLAGIX mendeteksi plagiarisme melalui analisis konteks, struktur argumen, dan gaya penulisan — bahkan untuk parafrase otomatis dan teks dari AI generatif.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-cta text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/register">Coba Gratis <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/pricing">Lihat Harga</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div><span className="text-2xl font-bold text-foreground">98%</span><br/>Akurasi semantik</div>
              <div><span className="text-2xl font-bold text-foreground">5+</span><br/>Institusi pilot</div>
              <div><span className="text-2xl font-bold text-foreground">10K+</span><br/>Dokumen dianalisis</div>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-cta opacity-30 blur-3xl" />
            <img src={hero} alt="PLAGIX semantic plagiarism scan" width={1280} height={896} className="relative rounded-3xl shadow-elegant" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border/60 bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Lebih dari sekadar cocokin teks</h2>
            <p className="mt-3 text-muted-foreground">Sistem konvensional hanya membandingkan kata. PLAGIX membaca makna.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-elegant hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-cta">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-1.5 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARGET */}
      <section className="py-20">
        <div className="container grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-gradient-card p-8 shadow-sm">
            <Building2 className="mb-4 h-10 w-10 text-primary" />
            <h3 className="text-2xl font-bold">Untuk Institusi (B2B)</h3>
            <p className="mt-2 text-muted-foreground">Langganan tahunan dengan unlimited user dan integrasi LMS. Pilot project & free trial 1 semester.</p>
            <p className="mt-5 text-3xl font-bold">Rp10.000.000<span className="text-base font-medium text-muted-foreground">/tahun</span></p>
          </div>
          <div className="rounded-3xl border border-border bg-gradient-card p-8 shadow-sm">
            <GraduationCap className="mb-4 h-10 w-10 text-accent" />
            <h3 className="text-2xl font-bold">Untuk Mahasiswa (B2C)</h3>
            <p className="mt-2 text-muted-foreground">Pengecekan mandiri pay-per-use. Cocok buat skripsi, jurnal, dan tugas.</p>
            <p className="mt-5 text-3xl font-bold">Rp20.000<span className="text-base font-medium text-muted-foreground">/dokumen</span></p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container">
          <div className="overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center shadow-glow md:p-16">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">Jaga integritas akademikmu hari ini</h2>
            <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/90">Daftar gratis dan coba scan dokumen pertamamu dalam 60 detik.</p>
            <Button asChild size="lg" className="mt-6 bg-background text-foreground hover:bg-background/90">
              <Link to="/register">Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
