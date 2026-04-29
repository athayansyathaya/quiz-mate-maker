import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function UploadDoc() {
  const nav = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  const submit = async () => {
    if (!file) return toast.error("Pilih file dulu");
    setLoading(true);
    try {
      const doc = await api.uploadDocument(file);
      toast.success("Analisis selesai");
      nav(`/document/${doc.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold">Cek Dokumen</h1>
        <p className="mt-2 text-muted-foreground">Upload dokumen .pdf, .docx, atau .txt untuk dianalisis (max 10MB).</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
          className={`mt-8 rounded-3xl border-2 border-dashed p-12 text-center transition-colors ${drag ? "border-primary bg-primary/5" : "border-border bg-card"}`}
        >
          <UploadCloud className="mx-auto h-14 w-14 text-primary" />
          <p className="mt-4 text-lg font-semibold">Drag & drop file di sini</p>
          <p className="text-sm text-muted-foreground">atau klik untuk pilih file</p>
          <input id="file" type="file" className="hidden" accept=".pdf,.docx,.txt,.doc"
            onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <label htmlFor="file" className="mt-4 inline-block cursor-pointer rounded-xl border border-border bg-background px-5 py-2 text-sm font-semibold hover:bg-muted">
            Pilih file
          </label>
          {file && (
            <div className="mx-auto mt-6 flex max-w-sm items-center gap-3 rounded-xl border border-border bg-background p-3 text-left">
              <FileText className="h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}
        </div>

        <Button onClick={submit} disabled={!file || loading} className="mt-6 w-full bg-gradient-cta text-primary-foreground hover:opacity-90" size="lg">
          {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menganalisis...</>) : "Analisis dokumen"}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Catatan: Analisis menggunakan algoritma simulasi (mock) sesuai scope proyek — tidak memanggil AI eksternal.
        </p>
      </div>
    </Layout>
  );
}
