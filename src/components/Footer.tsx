import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-cta">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">PLAGIX</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Check Beyond Words. Deteksi plagiarisme berbasis konteks, semantik, dan gaya penulisan.</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Produk</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Cek Dokumen</li><li>API Integrasi</li><li>LMS Plugin</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Tentang Kami</li><li>Tim Triple HelIX</li><li>Kontak</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Kontak</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>+62 851-5694-6837</li><li>hello@plagix.id</li><li>IPB University</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 PLAGIX by Triple HelIX — Karya Salemba Empat Juara
        </div>
      </div>
    </footer>
  );
}
