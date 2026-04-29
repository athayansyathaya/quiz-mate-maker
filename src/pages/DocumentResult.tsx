import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Brain, FileText, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";

type Doc = {
  id: string;
  fileName: string;
  fileSize: number;
  plagiarismPct: number;
  aiPct: number;
  paraphrasePct: number;
  createdAt: string;
  reportJson: { summary: string; sources: { url: string; match: number }[]; flagged: string[] };
};

export default function DocumentResult() {
  const { id } = useParams();
  const [doc, setDoc] = useState<Doc | null>(null);

  useEffect(() => {
    if (id) api.document(id).then(setDoc).catch(() => {});
  }, [id]);

  if (!doc) return <Layout><div className="container py-20 text-center text-muted-foreground">Memuat...</div></Layout>;

  const tone = (v: number) => v > 40 ? "danger" : v > 20 ? "warning" : "success";

  return (
    <Layout>
      <div className="container max-w-5xl py-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />Kembali ke dashboard
        </Link>

        <div className="mt-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-bold">{doc.fileName}</h1>
              <p className="text-sm text-muted-foreground">
                {(doc.fileSize / 1024).toFixed(1)} KB · {new Date(doc.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <ScoreCard label="Plagiarisme" value={doc.plagiarismPct} tone={tone(doc.plagiarismPct)} />
          <ScoreCard label="Indikasi AI" value={doc.aiPct} tone={tone(doc.aiPct)} />
          <ScoreCard label="Parafrase" value={doc.paraphrasePct} tone={tone(doc.paraphrasePct)} />
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-start gap-3">
            <Brain className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">Ringkasan analisis</h3>
              <p className="mt-1 text-muted-foreground">{doc.reportJson.summary}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h3 className="mb-4 font-semibold">Sumber yang cocok</h3>
            <div className="space-y-2">
              {doc.reportJson.sources.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm">{s.url}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{s.match}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h3 className="mb-4 font-semibold">Bagian bermasalah</h3>
            <div className="space-y-2">
              {doc.reportJson.flagged.map((f, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 p-3 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ScoreCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  const colorMap: Record<string, string> = {
    danger: "text-danger bg-danger/10",
    warning: "text-warning bg-warning/10",
    success: "text-success bg-success/10",
  };
  const barMap: Record<string, string> = {
    danger: "bg-danger",
    warning: "bg-warning",
    success: "bg-success",
  };
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-4xl font-bold">{value}%</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${barMap[tone]}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${colorMap[tone]}`}>
        {tone === "danger" ? "Tinggi" : tone === "warning" ? "Sedang" : "Rendah"}
      </span>
    </div>
  );
}
