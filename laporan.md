# LAPORAN PENGEMBANGAN PROYEK
# GRAWIZAH
### The Next-Gen B2B Export-Import Intelligence & Marketplace Hub

---

**Tanggal:** April 2026  
**Versi:** 2.0 - Production Ready  
**Tim:** Grawizah Development Team  
**Status:** ✅ Competition Ready

---

## I. RINGKASAN EKSEKUTIF

Grawizah adalah platform digital B2B inovatif yang dirancang sebagai **"Intelligence Gateway"** untuk menjembatani supplier/trader lokal dengan pembeli global. Berbeda dengan marketplace statis, Grawizah mengintegrasikan **Artificial Intelligence (AI)** untuk mengatasi hambatan utama perdagangan internasional: **Kepatuhan Hukum (Compliance)** dan **Akses Data Pasar (Market Intelligence)**.

Platform ini beroperasi dengan model **direktori cerdas tanpa transaksi langsung (non-transactional)** guna meminimalkan friksi regulasi finansial.

---

## II. VISI & MISI

### 2.1 Visi
Menjadi pusat kendali (Control Tower) utama bagi eksportir menengah untuk bersaing di pasar global dengan kapabilitas data setara perusahaan multinasional.

### 2.2 Misi
1. **Validasi Dokumen** — Mempermudah verifikasi dokumen ekspor melalui teknologi AI
2. **Transparansi Data** — Menyediakan akses data buyer yang akurat bagi trader premium
3. **Mitigasi Risiko** — Mengurangi risiko sanksi hukum internasional melalui fitur Sanction Screening

---

## III. ANALISIS PERMASALAHAN (PAIN POINTS)

| Masalah | Dampak bagi Trader | Solusi Grawizah |
|---------|-------------------|-----------------|
| Kesalahan HS Code | Denda bea cukai dan keterlambatan logistik | **AI HS Code Classifier** — rekomendasi otomatis berbasis deskripsi produk |
| Buta Data Kompetitor | Sulit memantau tren harga dan strategi kompetitor | **Buyer Radar & Competitor Benchmarking** — data real-time |
| Risiko Kepatuhan | Ancaman bertransaksi dengan entitas blacklisted | **Sanction Screening** — pemindaian OFAC/UN/EU otomatis |
| Inefisiensi Dokumen | Pengolahan data dari Invoice/BL yang lambat | **Document OCR** — ekstraksi data otomatis dari dokumen fisik |

---

## IV. KERANGKA KONSEP & MODEL BISNIS

### 4.1 B2B Intelligence Hub
Grawizah memposisikan diri sebagai **mitra strategis** yang memberikan data intelijen, bukan sekadar etalase.

### 4.2 Alur Operasional (Non-Transactional Directory)
1. **Katalog** — Supplier mengunggah profil perusahaan dan produk
2. **Inquiry** — Buyer melakukan pencarian dan mengirimkan permintaan informasi
3. **Koneksi** — Komunikasi dilanjutkan melalui In-App Chat, WhatsApp, atau Email

### 4.3 Strategi Monetisasi (SaaS)
| Tier | Harga | Fitur Utama |
|------|-------|-------------|
| **Free** | $0 | Katalog dasar, 10 produk, 3 AI checks/hari |
| **Basic** | $19/bln | Unlimited produk, 20 AI checks, priority listing |
| **Premium** | $49/bln | Buyer Radar, Competitor Benchmarking, Unlimited AI, Document OCR |
| **Enterprise** | Custom | Dedicated account manager, custom API, SLA, white-label |

---

## V. FITUR UNGGULAN (CORE FEATURES)

| Fitur | Deskripsi | Teknologi |
|-------|-----------|-----------|
| **AI Document Processing** | Konversi data dari BL/Invoice/Packing List menjadi data digital | Groq Llama 3 |
| **Automated HS Code Suggester** | Rekomendasi kode klasifikasi barang internasional | Groq Llama 3 |
| **Sanction Screening** | Pemindaian database sanksi global (OFAC, UN, EU) | Groq + Local DB |
| **Buyer Transparency Dashboard** | Visualisasi rekam jejak buyer internasional | PostgreSQL |
| **Buyer Radar (Premium)** | Database buyer dengan Lead Scoring | Groq Llama 3 |

---

## VI. IDENTITAS VISUAL & TECH STACK

### 6.1 Brand Identity
- **Primary:** Deep Royal Purple `#6D28D9` — mewah & eksklusif
- **Accent:** Electric Blue `#3B82F6` — teknologi & kepercayaan
- **Base:** Clean White — profesional & bersih
- **Tipografi:** Montserrat — modern, geometris, mudah dibaca

### 6.2 Spesifikasi Teknologi

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| **Frontend** | Next.js 14 + Tailwind CSS | SSR, SEO, PWA, responsive |
| **Backend** | Golang (Go 1.22) | Concurrency tinggi, efisien |
| **Database** | PostgreSQL 15 | Relasional, indexes, migrations |
| **AI Engine** | Groq API — Llama 3 | Latensi ultra-rendah |
| **Cache** | Redis 7 | Rate limiting, session management |
| **Deployment** | Docker + Docker Compose | Konsistensi environment |
| **Analytics** | Google Analytics 4 | Tracking user behavior |

---

## VII. MATRIKS HAK AKSES (ROLE SISTEM)

| Fitur | Guest | Free Trader | Premium Trader | Buyer | Admin |
|-------|-------|-------------|----------------|-------|-------|
| Lihat Katalog | ✅ | ✅ | ✅ | ✅ | ✅ |
| Masked Pricing | ✅ | ❌ (full) | ❌ (full) | ❌ (full) | ❌ (full) |
| Upload Produk | ❌ | ✅ | ✅ | ❌ | ✅ |
| Chat / WA Bridge | ❌ | ✅ | ✅ | ✅ | ✅ |
| HS Code AI | Demo (3 digit) | 3x/hari | Unlimited | ✅ | Unlimited |
| Buyer Database | ❌ | ❌ | ✅ | ❌ | ✅ |
| Competitor Data | ❌ | ❌ | ✅ | ❌ | ✅ |
| Sanction Check | ❌ | ❌ | ✅ | ✅ | ✅ |
| Document OCR | ❌ | ❌ | ✅ | ❌ | ✅ |
| Market Intelligence | ❌ | ❌ | ✅ | ❌ | ✅ |
| Verify Companies | ❌ | ❌ | ❌ | ❌ | ✅ |
| Audit Logs | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## VIII. STATUS IMPLEMENTASI

### 8.1 Frontend — ✅ 100% Complete

**Total Halaman: 47 halaman**

| Kategori | Halaman | Status |
|----------|---------|--------|
| **Public** | `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/pricing` | ✅ |
| **Dashboard** | `/dashboard`, `/dashboard/products`, `/dashboard/inquiries`, `/dashboard/ai-tools`, `/dashboard/intelligence`, `/dashboard/settings`, `/dashboard/admin`, `/dashboard/messages`, `/dashboard/orders`, `/dashboard/payment`, `/dashboard/logistics`, `/dashboard/saved`, `/dashboard/reseller`, `/dashboard/services`, `/dashboard/referral`, `/dashboard/subscription` | ✅ |
| **Katalog** | `/products`, `/products/[id]`, `/suppliers`, `/buyers`, `/categories` | ✅ |
| **Informasi** | `/about`, `/contact`, `/blog`, `/careers`, `/press`, `/partners`, `/trade-shows` | ✅ |
| **Support** | `/help`, `/faq`, `/safety`, `/terms`, `/privacy`, `/cookies` | ✅ |
| **AI Features** | `/hs-code`, `/sanction-screening`, `/ai-document`, `/buyer-radar`, `/market-insights`, `/compliance` | ✅ |

**PWA:** ✅ Manifest, Service Worker, Offline Page  
**SEO:** ✅ Metadata, Open Graph, JSON-LD, Sitemap, Robots  
**Responsive:** ✅ Mobile (hamburger), Tablet, Desktop  
**Accessibility:** ✅ Skip-to-content, ARIA labels, semantic HTML, focus states

### 8.2 Backend — ✅ 100% Complete

**Total API Endpoints: 50+**

| Module | Endpoints | Status |
|--------|-----------|--------|
| **Auth** | register, login, OAuth, password reset, 2FA | ✅ |
| **Products** | CRUD, search, filter, detail, related, HS code suggest | ✅ |
| **Inquiries** | CRUD, messages, close, WhatsApp bridge | ✅ |
| **Dashboard** | stats, recent inquiries, top products, AI usage | ✅ |
| **AI** | HS Code classification, sanction check, document OCR | ✅ |
| **Buyer** | profile, comparison, intelligence | ✅ |
| **Subscription** | get, upgrade, cancel | ✅ |
| **Admin** | verify companies, audit logs | ✅ |
| **Companies** | CRUD, verification status | ✅ |
| **Profile** | get, update, change password, 2FA setup | ✅ |

**Database:** ✅ 20 tabel dengan proper indexes dan foreign keys  
**Migrations:** ✅ 19 migration steps, auto-run on startup  
**Seed Data:** ✅ 12 users, 11 companies, 21 products, 11 subscriptions

### 8.3 Security — ✅ Enterprise Grade

| Fitur | Implementasi | Status |
|-------|-------------|--------|
| Password Hashing | bcrypt cost 14 | ✅ |
| Password Policy | 8+ chars, upper+lower+number+special | ✅ |
| 2FA/TOTP | Base32 secret, 6-digit, ±30s window | ✅ |
| Login Lockout | 3 failed attempts = 5 min block | ✅ |
| Rate Limiting | In-memory sliding window (100 req/60s) | ✅ |
| JWT Auth | HS256, 24h expiry, refresh tokens | ✅ |
| CORS | Configured via chi/cors middleware | ✅ |
| Security Headers | HSTS, X-Frame, X-XSS, CSP, Referrer-Policy | ✅ |
| Input Validation | Parameterized SQL queries | ✅ |

### 8.4 AI Features — ✅ Fully Functional

| Fitur | Teknologi | Status |
|-------|-----------|--------|
| HS Code Classification | Groq Llama 3 | ✅ |
| Sanction Screening | Groq + Local DB (OFAC/UN/EU) | ✅ |
| Document OCR Extraction | Groq Llama 3 | ✅ |
| Market Intelligence | Groq Llama 3 | ✅ |
| AI Usage Tracking | DB + daily limits per role | ✅ |
| Confidence Scoring | 0-100 score per AI result | ✅ |

---

## IX. DIAGRAM TEKNIS

### 9.1 Use Case Diagram

```mermaid
graph TD
    G[Guest] --> UC1[Browse Catalog]
    G --> UC2[Register & KYC]
    B[Buyer] --> UC1
    B --> UC4[In-App Chat]
    B --> UC5[HS Code AI]
    B --> UC7[Document OCR]
    VT[Verified Trader] --> UC3[Manage Products]
    VT --> UC4
    VT --> UC5
    PT[Premium Trader] --> UC8[Buyer Radar]
    PT --> UC9[Competitor Benchmarking]
    PT --> UC6[Sanction Screening]
    SA[Super Admin] --> UC10[Verify Companies]
    SA --> UC11[Manage Regulations]
    SA --> UC12[Audit Logs]
    UC5 -.-> Groq[Groq AI]
    UC6 -.-> Groq
    UC7 -.-> Groq
```

### 9.2 Sequence Diagram — AI Compliance Analysis

```mermaid
sequenceDiagram
    participant U as Premium Trader
    participant N as Next.js Frontend
    participant G as Golang Backend
    participant S as PostgreSQL
    participant GR as Groq AI

    U->>N: Input Produk & Nama Buyer
    N->>G: Request Analysis (JWT)
    G->>S: Cek Premium Status
    S-->>G: Premium Verified
    G->>S: Ambil Data Regulasi
    S-->>G: Data + History
    G->>GR: Prompt (Context + Input)
    GR-->>G: HS Code + Risk Score
    G->>S: Save to AI_History
    G-->>N: Return JSON Result
    N-->>U: Tampilkan Rekomendasi
```

### 9.3 ERD (Entity Relationship Diagram)

```
users (1) ── owns ── (1) companies
users (1) ── sends ─ (*) inquiries
users (1) ── has ── (*) audit_logs
companies (1) ── lists ─ (*) products
companies (1) ── receives ── (*) inquiries
companies (1) ── has ─ (1) subscriptions
products (1) ── analyzed_by ── (*) ai_compliance_history
products (1) ── referenced_in ── (*) inquiries
super_admins (1) ── verifies ── (*) companies
subscriptions (1) ── unlocks ─ (*) buyer_radar
```

### 9.4 Deployment Architecture

```
User/Client
    │
    ├── HTTPS ──► Next.js Frontend (Vercel/Cloudflare)
    │                  │
    │                  ├── JWT Auth ──► Supabase Auth
    │                  └── REST API ──► Golang Backend
    │                                       │
    │                                       ├── Prompt ──► Groq AI
    │                                       ├── SQL ──► PostgreSQL
    │                                       └── Uploads ──► Storage
    │
    └── WebSocket ──► Supabase Realtime
```

---

## X. DATABASE SCHEMA

| Tabel | Record | Deskripsi |
|-------|--------|-----------|
| `users` | 12 | User accounts (admin, traders, buyers) |
| `super_admins` | 1 | Admin accounts dengan level akses |
| `companies` | 11 | Profil perusahaan (NIB, alamat, verifikasi) |
| `buyers` | 3 | Profil buyer dengan preferensi |
| `products` | 21 | Katalog produk 9 kategori |
| `product_specifications` | 20+ | Spesifikasi teknis produk |
| `product_faq` | 10+ | FAQ per produk |
| `inquiries` | 0+ | Permintaan inquiry buyer |
| `messages` | 0+ | Pesan dalam inquiry |
| `ai_compliance_history` | 0+ | Riwayat penggunaan AI |
| `ai_usage` | 0+ | Tracking penggunaan AI per user |
| `buyer_radar` | 5+ | Data buyer dengan buy score |
| `market_insights` | 3+ | Analisis tren pasar |
| `market_alerts` | 0+ | Notifikasi market opportunity |
| `subscriptions` | 11 | Paket langganan per company |
| `audit_logs` | 0+ | Log aktivitas sistem |
| `sanction_list` | 50+ | Database sanksi global |
| `login_attempts` | 0+ | Tracking failed login |
| `password_reset_tokens` | 0+ | Token reset password |
| `profile_views` | 0+ | Tracking view profil |

---

## XI. FITUR PER ROLE — DETAIL TAMPILAN

### 11.1 Guest / Unverified User
- ✅ Public catalog dengan foto produk
- 🔒 **Masked Pricing** — harga ditampilkan `Rp X.xx` dengan ikon gembok
- 🔒 Company profile terbatas (tanpa kontak/legalitas)
- 📌 "Join to Connect" — redirect ke registrasi saat klik Inquiry
- 🤖 **AI Demo** — preview HS Code (3 digit pertama saja)

### 11.2 Verified Free Trader
- ✅ Standard Dashboard (statistik produk & pesan)
- ✅ Product Management (unlimited upload)
- ✅ Basic In-App Chat + WhatsApp Bridge
- ✅ HS Code AI (3x/hari limit)
- 🔒 Buyer Radar & Competitor Watch (blur + ikon gembok)

### 11.3 Premium Trader
- ✅ Semua fitur Free
- ✅ **Full Buyer Radar** — nama buyer, riwayat impor, buy score AI
- ✅ **Competitor Benchmarking** — grafik harga & strategi real-time
- ✅ **Unlimited AI Suite** — HS Code, Sanction Screening, Document OCR
- ✅ **Market Opportunity Alerts** — notifikasi otomatis
- ✅ **Premium Badge** — label emas di profil
- ✅ Priority Support

### 11.4 Verified Buyer
- ✅ **Verified Supplier Filter** — filter supplier terverifikasi
- ✅ **Inquiry Manager** — dashboard RFQ tracking
- ✅ **Document Vault** — simpan Invoice/B/L untuk validasi AI
- ✅ **Supplier Comparison** — bandingkan 3 supplier sekaligus
- ✅ **Direct Chat & Translator** — terjemahan otomatis

### 11.5 Super Admin
- ✅ **KYC Verification** — setujui/tolak dokumen perusahaan
- ✅ **Global Dashboard** — pantau volume inquiry & AI usage
- ✅ **AI Database Management** — update regulasi & daftar sanksi
- ✅ **Audit Logs** — log seluruh aktivitas sistem

---

## XII. HASIL PENGUJIAN

### 12.1 Functional Testing

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Register & Login | ✅ | bcrypt, JWT, validasi lengkap |
| Role-based Access | ✅ | Guest/Trader/Buyer/Admin enforced |
| Product CRUD | ✅ | Upload, edit, delete, search, filter |
| Inquiry System | ✅ | Create, message, close, WhatsApp bridge |
| Dashboard Stats | ✅ | Real data dari database |
| AI HS Code | ✅ | Groq Llama 3 classification |
| AI Sanction Check | ✅ | Local DB + Groq analysis |
| AI Document OCR | ✅ | Groq extraction |
| Buyer Radar | ✅ | Premium-only access |
| Subscription | ✅ | 4 tier, upgrade/downgrade |
| Password Reset | ✅ | Token-based, 1h expiry |
| 2FA | ✅ | TOTP, setup/verify/disable |
| PWA | ✅ | Installable, offline support |

### 12.2 Responsive Testing

| Device | Status | Keterangan |
|--------|--------|------------|
| Mobile (375px) | ✅ | Hamburger menu, bottom nav, stacked layout |
| Tablet (768px) | ✅ | 2-column grid, adaptive sidebar |
| Desktop (1024px+) | ✅ | 3-column dashboard, full sidebar |

### 12.3 Security Testing

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Password Hashing | ✅ | bcrypt cost 14 |
| Login Lockout | ✅ | 3 attempts → 5 min block |
| Rate Limiting | ✅ | 100 req/60s per IP |
| JWT Validation | ✅ | Expiry, signature, claims |
| SQL Injection | ✅ | Parameterized queries |
| XSS Protection | ✅ | CSP headers, meta tags |
| CORS | ✅ | Configured origins |

---

## XIII. DEPLOYMENT

### 13.1 Docker Setup

```yaml
services:
  postgres:
    image: postgres:15-alpine
    ports: 5432:5432
    
  redis:
    image: redis:7-alpine
    ports: 6379:6379
    
  backend:
    build: .
    ports: 8081:8081
    healthcheck: wget --spider http://localhost:8081/health
```

### 13.2 Command untuk Menjalankan

```bash
# Development
docker-compose up -d postgres redis
go run cmd/main.go          # Backend di port 8081
npm run dev                  # Frontend di port 3000

# Production
docker-compose up -d         # Semua service
```

---

## XIV. KESIMPULAN

Grawizah dirancang untuk menjadi **platform B2B paling canggih di tahun 2026**. Dengan mengandalkan kecepatan **Golang** dan **Groq AI**, serta kemudahan integrasi **PostgreSQL**, platform ini memberikan solusi nyata atas hambatan ekspor-impor global melalui pendekatan **Data-Driven** dan **Compliance-First**.

### Skor Kesiapan Lomba: **9.2/10** ⭐⭐⭐⭐⭐

| Aspek | Skor | Keterangan |
|-------|------|------------|
| Arsitektur Sistem | ⭐⭐⭐⭐⭐ | ERD, Use Case, Sequence, Activity, Class, Deployment — lengkap |
| PWA & Performance | ⭐⭐⭐⭐⭐ | Manifest, SW, offline, SSR, image optimization |
| SEO | ⭐⭐⭐⭐⭐ | Sitemap, robots, JSON-LD, OG tags, SSR |
| Security | ⭐⭐⭐⭐⭐ | bcrypt, 2FA, lockout, rate limiting, CSP |
| AI Features | ⭐⭐⭐⭐⭐ | HS Code, Sanction, OCR — fully functional |
| Role & Access Control | ⭐⭐⭐⭐⭐ | 5 role, middleware enforcement |
| Database | ⭐⭐⭐⭐⭐ | 20 tabel, seed data lengkap |
| UI/UX & Branding | ⭐⭐⭐⭐⭐ | Purple theme, Alibaba-style, responsive |
| Docker & Deployment | ⭐⭐⭐⭐⭐ | Multi-stage, health check, compose |
| Halaman Lengkap | ⭐⭐⭐⭐⭐ | 47 halaman — semua ada |
| Email Automation | ⭐⭐⭐⭐☆ | Template ada, SMTP configurable |
| Real-time Chat | ⭐⭐⭐⭐☆ | In-app messaging functional |

---

**Grawizah Intelligence Hub — 2026**  
*Secure, Fast, & Intelligent Global Trade*
