# 🛡️ PLAGIX — Check Beyond Words

Sistem deteksi plagiarisme berbasis konteks, struktur argumen, dan gaya penulisan akademik.
Dibuat untuk Praktikum 10–11 Technopreneurship for AI — IPB University, 2026.
Tim: **Triple HelIX** (Javier Adya Pratama, Athaya Nasywa, Aydin Riefky).

---

## 🎯 Apa yang sudah jadi?

✅ **Frontend** React + Vite + Tailwind + shadcn/ui (8 halaman, full design system)
✅ **Backend** Node.js + Express + Prisma (REST API: auth, upload, kuis, langganan)
✅ **Database** PostgreSQL via Docker, langsung bisa dibuka di **DBeaver**
✅ **Seeded data** demo user, dokumen contoh, kuis 5 soal
✅ **Figma Mockup Pack** 9 halaman HTML siap import via plugin `html.to.design`
✅ **Tutorial** menjalankan + push GitHub (di bawah)

> ⚠️ Sesuai permintaan: fitur **match destinasi pakai AI tidak diimplementasi**. Skor plagiarisme dihasilkan oleh algoritma simulasi (mock) deterministik berdasarkan ukuran & nama file. Kuis tetap berfungsi penuh.

---

## 📁 Struktur Project

```
plagix/
├── backend/                 # Express + Prisma API (port 4000)
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Data awal
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/          # auth, documents, quiz, subscriptions
│   │   └── middleware/
│   ├── .env
│   └── package.json
├── src/                     # Frontend React (port 8080)
│   ├── pages/               # Home, Login, Dashboard, Upload, dll.
│   ├── components/
│   ├── contexts/
│   └── lib/api.ts
├── figma-mockup/            # 9 mockup HTML untuk Figma
│   ├── index.html           # Buka ini dulu!
│   └── 01-landing.html ...
├── docker-compose.yml       # PostgreSQL service
└── README.md                # File ini
```

---

## 🚀 Cara Menjalankan (Step-by-Step)

### Prasyarat (install dulu kalau belum ada)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (untuk PostgreSQL)
- [DBeaver Community](https://dbeaver.io/download/) (untuk lihat database)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone repo

```bash
git clone https://github.com/USERNAME/plagix.git
cd plagix
```

### 2️⃣ Jalankan database PostgreSQL (Docker)

```bash
docker compose up -d
```

Akan membuat container `plagix_db` di `localhost:5432`.
Cek status: `docker ps` (harus ada `plagix_db` running).

### 3️⃣ Setup backend

```bash
cd backend
npm install
npm run setup    # generate Prisma client + push schema + seed data
npm run dev      # jalankan API di http://localhost:4000
```

Cek: buka `http://localhost:4000/api/health` → harus muncul `{"ok":true,"service":"PLAGIX API"}`.

### 4️⃣ Setup frontend (terminal baru)

```bash
cd ..             # kembali ke root project
npm install
npm run dev       # jalankan di http://localhost:8080
```

Buka browser → `http://localhost:8080`
Login pakai akun demo: **demo@plagix.id** / **password123**

---

## 🐘 Membuka Database di DBeaver

1. Buka DBeaver → **Database** → **New Database Connection**
2. Pilih **PostgreSQL** → **Next**
3. Isi koneksi:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `plagix`
   - **Username**: `plagix`
   - **Password**: `plagix123`
4. Klik **Test Connection** (kalau diminta download driver, klik Download)
5. Klik **Finish**
6. Di sidebar kiri: expand `plagix → Schemas → public → Tables`
   Kamu akan lihat: `User`, `Document`, `Subscription`, `Quiz`, `QuizQuestion`, `QuizAttempt`
7. Klik kanan tabel mana saja → **View Data** → **All Rows**

### Bonus: Prisma Studio (UI database alternatif)

```bash
cd backend
npm run db:studio   # buka http://localhost:5555
```

---

## 🐙 Cara Push ke GitHub

### Pertama kali (buat repo baru)

1. Buka https://github.com/new → buat repo kosong, nama: `plagix` (jangan centang README/gitignore, karena sudah ada)
2. Di terminal di folder project:

```bash
git init
git add .
git commit -m "Initial commit: PLAGIX MVP"
git branch -M main
git remote add origin https://github.com/USERNAME/plagix.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub kamu.

### Update berikutnya

```bash
git add .
git commit -m "deskripsi perubahan"
git push
```

> 💡 File `.env` di backend sudah ter-ignore otomatis. Tapi kalau punya secret penting, **jangan pernah commit `.env`**.

---

## 🎨 Import Figma Mockup

1. Buka folder `figma-mockup/` di file explorer
2. Double-click `index.html` → akan terbuka di browser dengan list semua halaman
3. **Cara import ke Figma**:
   - Install Figma Desktop
   - Plugins → Browse plugins in community → cari **html.to.design** → install
   - Buka file Figma kosong → Plugins → html.to.design
   - Tab **Upload** → upload file `.html` per halaman, ATAU
   - Tab **URL** → kalau kamu host file html (misalnya `python -m http.server` di folder `figma-mockup/`)
4. Plugin akan auto-generate frame Figma yang bisa kamu edit

Atau cara cepat: **screenshot** tiap halaman → import sebagai gambar di Figma → pakai sebagai mockup statis.

---

## 🔑 Akun Demo

| Field    | Value              |
| -------- | ------------------ |
| Email    | `demo@plagix.id`   |
| Password | `password123`      |

Sudah ada 1 dokumen contoh + 1 langganan aktif + kuis 5 soal.

---

## 🧪 Endpoint API Utama

| Method | Endpoint                          | Auth | Keterangan                |
| ------ | --------------------------------- | ---- | ------------------------- |
| POST   | `/api/auth/register`              | ❌   | Daftar akun baru          |
| POST   | `/api/auth/login`                 | ❌   | Login → dapat JWT         |
| GET    | `/api/auth/me`                    | ✅   | Profil user aktif         |
| GET    | `/api/documents`                  | ✅   | Riwayat dokumen           |
| POST   | `/api/documents/upload`           | ✅   | Upload + analisis         |
| GET    | `/api/documents/:id`              | ✅   | Detail hasil              |
| GET    | `/api/quiz`                       | ❌   | List kuis + soal          |
| POST   | `/api/quiz/:quizId/submit`        | ✅   | Submit jawaban → skor     |
| GET    | `/api/subscriptions/plans`        | ❌   | Daftar paket              |
| POST   | `/api/subscriptions/subscribe`    | ✅   | Berlangganan paket        |

---

## 🧹 Troubleshooting

- **Port 5432 sudah dipakai?** Edit `docker-compose.yml` → ganti `"5432:5432"` jadi `"5433:5432"`, lalu update `DATABASE_URL` di `backend/.env` jadi `...@localhost:5433/...`
- **`prisma generate` error?** Jalankan `cd backend && rm -rf node_modules && npm install`
- **Frontend tidak konek backend?** Cek `backend` running di port 4000, dan `.env` frontend punya `VITE_API_URL=http://localhost:4000/api`
- **Reset semua data?** `cd backend && npx prisma db push --force-reset && npm run db:seed`

---

## 📜 Lisensi

Educational use — Tim Triple HelIX, IPB University 2026.
