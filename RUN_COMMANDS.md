# 🚀 Grawizah — Quick Start Commands

## Cara Menjalankan Project

### Opsi 1: Jalankan Keduanya Sekaligus (Recommended)
```bash
start.bat
```
Ini akan membuka **Backend** (port 8080) dan **Frontend** (port 3000) secara bersamaan di 2 terminal terpisah.

---

### Opsi 2: Jalankan Satu per Satu

**Terminal 1 — Backend (Go):**
```bash
start-backend.bat
```
Atau manual:
```bash
cd backend
go run cmd\main.go
```
Server akan berjalan di **http://localhost:8080**

**Terminal 2 — Frontend (Next.js):**
```bash
start-frontend.bat
```
Atau manual:
```bash
cd frontend
npm run dev
```
Server akan berjalan di **http://localhost:3000**

---

### Opsi 3: Via NPM Scripts (dari root)

Buka terminal di folder root `d:\grawizah\`, lalu:

```bash
# Backend saja
cd backend && go run cmd\main.go

# Frontend saja
cd frontend && npm run dev

# Build production frontend
cd frontend && npm run build

# Jalankan production build
cd frontend && npm start
```

---

### Opsi 4: Docker (Full Stack)

```bash
cd backend
docker-compose up -d
```
Ini akan menjalankan:
- **PostgreSQL** di port 5432
- **Redis** di port 6379
- **Backend Go** di port 8080

Lalu jalankan frontend secara terpisah:
```bash
cd frontend && npm run dev
```

---

## Prasyarat

| Komponen | Versi Minimum | Keterangan |
|----------|---------------|------------|
| **Go** | 1.21+ | Backend |
| **Node.js** | 18+ | Frontend |
| **PostgreSQL** | 14+ | Via Supabase atau lokal |
| **Docker** (opsional) | Terbaru | Untuk containerization |

---

## Akses URL Setelah Running

| Service | URL | Keterangan |
|---------|-----|------------|
| Frontend | http://localhost:3000 | Next.js App |
| Backend API | http://localhost:8080 | Go REST API |
| Health Check | http://localhost:8080/health | Status server |
| API Docs | http://localhost:8080/api/v1/products | Contoh endpoint publik |

---

## Environment Variables

Pastikan file `.env` sudah diisi di masing-masing folder:

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/grawizah
JWT_SECRET=your-secret-key-here
GROQ_API_KEY=gsk_your-groq-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

**Grawizah Intelligence Hub — 2026**
