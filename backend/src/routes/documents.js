import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Mock "AI" plagiarism analysis (sesuai permintaan: tidak pakai AI beneran)
function analyze(fileName, fileSize) {
  const seed = (fileName.length * 7 + fileSize) % 100;
  const plagiarism = +(15 + (seed % 40) + Math.random() * 10).toFixed(1);
  const ai = +(5 + (seed % 25) + Math.random() * 8).toFixed(1);
  const paraphrase = +(3 + (seed % 20) + Math.random() * 6).toFixed(1);
  return {
    plagiarismPct: Math.min(plagiarism, 95),
    aiPct: Math.min(ai, 90),
    paraphrasePct: Math.min(paraphrase, 80),
    reportJson: {
      summary: plagiarism > 40
        ? "Tingkat plagiarisme tinggi terdeteksi. Disarankan revisi mendalam."
        : plagiarism > 20
        ? "Tingkat plagiarisme moderat. Periksa bagian yang ditandai."
        : "Tingkat plagiarisme rendah. Dokumen relatif orisinal.",
      sources: [
        { url: "https://scholar.google.com/example-1", match: +(plagiarism * 0.45).toFixed(1) },
        { url: "https://repositori.kampus.ac.id/abc-123", match: +(plagiarism * 0.3).toFixed(1) },
        { url: "https://jurnal-online.id/artikel-89", match: +(plagiarism * 0.18).toFixed(1) },
        { url: "https://wikipedia.org/wiki/Topik-Terkait", match: +(plagiarism * 0.07).toFixed(1) },
      ],
      flagged: [
        "Paragraf 1 halaman 2: kemiripan dengan jurnal online.",
        "Bagian metodologi: indikasi parafrase otomatis.",
        ai > 20 ? "Beberapa kalimat menunjukkan pola tulisan AI generatif." : "Gaya tulisan natural.",
      ],
    },
  };
}

router.get("/", requireAuth, async (req, res) => {
  const docs = await prisma.document.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(docs);
});

router.get("/:id", requireAuth, async (req, res) => {
  const doc = await prisma.document.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!doc) return res.status(404).json({ error: "Tidak ditemukan" });
  res.json(doc);
});

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File tidak ada" });
  const result = analyze(req.file.originalname, req.file.size);
  const doc = await prisma.document.create({
    data: {
      userId: req.user.id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      storedPath: `/uploads/${req.file.filename}`,
      ...result,
    },
  });
  res.json(doc);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const doc = await prisma.document.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!doc) return res.status(404).json({ error: "Tidak ditemukan" });
  await prisma.document.delete({ where: { id: doc.id } });
  res.json({ ok: true });
});

export default router;
