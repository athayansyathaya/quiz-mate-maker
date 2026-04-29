import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Demo user
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@plagix.id" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@plagix.id",
      passwordHash,
    },
  });

  // Sample subscription
  await prisma.subscription.deleteMany({ where: { userId: user.id } });
  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: "B2C Pay-per-use",
      price: 20000,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Sample document
  await prisma.document.deleteMany({ where: { userId: user.id } });
  await prisma.document.create({
    data: {
      userId: user.id,
      fileName: "Contoh-Skripsi.pdf",
      fileSize: 234567,
      fileType: "application/pdf",
      storedPath: "/uploads/sample.pdf",
      plagiarismPct: 23.4,
      aiPct: 12.1,
      paraphrasePct: 8.7,
      reportJson: {
        summary: "Dokumen mengandung kemiripan moderat dengan beberapa sumber online.",
        sources: [
          { url: "https://contoh-jurnal.com/artikel-1", match: 12.3 },
          { url: "https://repositori.kampus.ac.id/skripsi-22", match: 6.1 },
          { url: "https://wikipedia.org/wiki/Plagiarisme", match: 5.0 },
        ],
        flagged: [
          "Paragraf 2 halaman 3: kemiripan tinggi dengan jurnal online.",
          "Indikasi parafrase otomatis pada bagian metodologi.",
        ],
      },
    },
  });

  // Quiz
  await prisma.quizAttempt.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.quiz.deleteMany({});

  const quiz = await prisma.quiz.create({
    data: {
      title: "Kuis Integritas Akademik",
      questions: {
        create: [
          {
            order: 1,
            question: "Apa definisi plagiarisme yang paling tepat?",
            options: ["Mengutip dengan sumber", "Mengambil karya orang lain tanpa atribusi", "Membaca jurnal", "Menulis ulang ide sendiri"],
            correctIndex: 1,
            explanation: "Plagiarisme adalah mengambil/menggunakan karya, ide, atau kata-kata orang lain tanpa memberikan atribusi yang layak.",
          },
          {
            order: 2,
            question: "Mana yang BUKAN bentuk plagiarisme?",
            options: ["Copy-paste tanpa kutipan", "Parafrase tanpa sumber", "Mengutip dengan sitasi yang benar", "Self-plagiarism"],
            correctIndex: 2,
            explanation: "Mengutip dengan sitasi yang benar adalah praktik akademik yang sah.",
          },
          {
            order: 3,
            question: "Mengapa parafrase otomatis dengan AI berisiko?",
            options: ["Selalu salah ejaan", "Mengubah kata tanpa memahami konteks dan tetap menjiplak ide", "Tidak bisa diakses", "Selalu terdeteksi"],
            correctIndex: 1,
            explanation: "Parafrase otomatis hanya mengganti kata, ide aslinya tetap milik orang lain — itu masih plagiarisme.",
          },
          {
            order: 4,
            question: "Apa kelebihan deteksi berbasis konteks (seperti PLAGIX) dibanding deteksi leksikal biasa?",
            options: ["Lebih murah", "Lebih cepat saja", "Mampu mendeteksi parafrase & teks AI berdasarkan makna", "Tidak butuh internet"],
            correctIndex: 2,
            explanation: "Deteksi semantik menganalisis makna, bukan hanya kemiripan kata, sehingga parafrase pun terdeteksi.",
          },
          {
            order: 5,
            question: "Cara terbaik menghindari plagiarisme adalah...",
            options: ["Tidak pernah membaca jurnal", "Menulis dengan kata-kata sendiri & mencantumkan semua sumber", "Menggunakan AI sebanyak mungkin", "Menyalin dari banyak sumber sekaligus"],
            correctIndex: 1,
            explanation: "Menulis dengan pemahaman sendiri dan memberikan sitasi yang benar adalah praktik terbaik.",
          },
        ],
      },
    },
  });

  console.log("✅ Seed selesai!");
  console.log("   Login demo: demo@plagix.id / password123");
  console.log(`   Quiz dibuat: ${quiz.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
