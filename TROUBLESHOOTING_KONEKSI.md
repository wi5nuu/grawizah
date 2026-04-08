# Troubleshooting Koneksi Backend-Frontend

## Status Saat Ini

✅ **Backend Hugging Face**: Berjalan dengan baik (migrations sukses, server binding ke port 7860)
✅ **Environment Variables Vercel**: Sudah dikonfigurasi dengan benar
❓ **Koneksi**: Perlu diverifikasi

## Langkah-Langkah Troubleshooting

### 1. Verifikasi URL Hugging Face Space yang Benar

Hugging Face Space memiliki beberapa format URL yang berbeda:

**Format URL yang mungkin:**
- `https://wisnu-ashar-grawizah.hf.space` (format lama)
- `https://wisnu-ashar-grawizah.hf.space/` (dengan trailing slash)
- `https://huggingface.co/spaces/wisnu-ashar/grawizah` (URL halaman Space)

**Cara mendapatkan URL yang benar:**

1. Buka https://huggingface.co/spaces/wisnu-ashar/grawizah
2. Klik tab "App" 
3. Lihat URL yang muncul di address bar browser
4. Atau klik tombol "Open in new tab" untuk mendapatkan URL langsung

### 2. Test Backend Langsung dari Browser

Buka URL berikut di browser Anda:

```
https://[URL-SPACE-ANDA]/health
https://[URL-SPACE-ANDA]/api/v1/products
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "grawizah-backend"
}
```

### 3. Cek Status Hugging Face Space

**Kemungkinan masalah:**

#### A. Space dalam mode Sleep
- Free tier Hugging Face Spaces akan sleep setelah tidak aktif
- **Solusi**: Kunjungi URL Space untuk membangunkannya
- Tunggu 1-2 menit sampai container restart

#### B. Space masih Building
- Cek tab "Logs" di Hugging Face Space
- Pastikan tidak ada error saat build
- Tunggu sampai status berubah menjadi "Running"

#### C. Health Check Timeout
Dari log Anda, terlihat:
```
Launch timed out, workload was not healthy after 30 min
```

**Ini adalah masalah utama!** Backend tidak merespons health check Hugging Face.

### 4. Perbaikan Health Check Issue

Hugging Face Spaces memerlukan aplikasi merespons pada root path `/` atau `/health` dalam waktu 30 menit.

**Cek konfigurasi Dockerfile:**

Backend Anda sudah benar:
- ✅ Binding ke `0.0.0.0:7860`
- ✅ Port 7860 (default Hugging Face)
- ✅ Health endpoint tersedia di `/` dan `/health`

**Kemungkinan penyebab timeout:**

1. **Database Connection Timeout**
   - Migrations memakan waktu terlalu lama
   - Database tidak dapat diakses dari Hugging Face

2. **Environment Variables Missing**
   - Cek apakah semua secrets sudah diset di Hugging Face

3. **Memory/CPU Limit**
   - CPU Basic mungkin tidak cukup untuk aplikasi Go + PostgreSQL migrations

### 5. Solusi untuk Health Check Timeout

#### Opsi A: Pindahkan Migrations ke Proses Terpisah

Ubah `backend/cmd/main.go` untuk menjalankan migrations secara async:

```go
// Run migrations in background
go func() {
    if err := database.RunMigrations(db); err != nil {
        log.Printf("⚠️  Migration failed: %v", err)
    }
}()

// Start server immediately (don't wait for migrations)
```

#### Opsi B: Skip Migrations pada Startup

Jika database sudah ter-migrate, skip migrations:

```go
// Skip migrations if already done
if os.Getenv("SKIP_MIGRATIONS") == "true" {
    log.Println("⏭️  Skipping migrations (SKIP_MIGRATIONS=true)")
} else {
    if err := database.RunMigrations(db); err != nil {
        log.Fatalf("CRITICAL: Failed to run migrations: %v", err)
    }
}
```

Tambahkan environment variable di Hugging Face:
```
SKIP_MIGRATIONS=true
```

#### Opsi C: Upgrade Hardware

Upgrade dari "CPU basic" ke "CPU upgrade" untuk performa lebih baik:
- CPU basic: 2 vCPU, 16 GB RAM (Free)
- CPU upgrade: 8 vCPU, 32 GB RAM ($0.03/hour)

### 6. Verifikasi Environment Variables di Hugging Face

Pastikan semua secrets sudah diset:

```
✅ DATABASE_URL
✅ JWT_SECRET
✅ GROQ_API_KEY
✅ SUPABASE_SERVICE_KEY
✅ SUPABASE_URL
✅ ENVIRONMENT=production
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
```

**Tambahkan yang missing:**
```
FRONTEND_URL=https://grawizah.vercel.app
APP_URL=https://grawizah.vercel.app
PORT=7860
```

### 7. Cek Logs Hugging Face

Buka Hugging Face Space → Tab "Logs"

**Cari error seperti:**
- Database connection failed
- Migration timeout
- Port binding error
- Environment variable missing

### 8. Test Koneksi dari Frontend

Setelah backend running, test dari browser console:

```javascript
// Buka frontend Vercel Anda
// Tekan F12 → Console tab
// Jalankan:

fetch('https://[URL-SPACE-ANDA]/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### 9. Alternatif: Deploy Backend ke Platform Lain

Jika Hugging Face terus timeout, pertimbangkan platform lain:

**Opsi gratis:**
- Railway.app (500 jam/bulan gratis)
- Render.com (750 jam/bulan gratis)
- Fly.io (3 shared-cpu VMs gratis)

**Keuntungan:**
- Lebih stabil untuk production
- Tidak ada sleep mode
- Better health check handling

## Checklist Debugging

- [ ] Verifikasi URL Space yang benar
- [ ] Cek status Space (Running/Sleeping/Building)
- [ ] Test health endpoint dari browser
- [ ] Cek logs Hugging Face untuk error
- [ ] Verifikasi semua environment variables
- [ ] Test database connection
- [ ] Pertimbangkan skip migrations atau async migrations
- [ ] Upgrade hardware jika perlu
- [ ] Test koneksi dari frontend

## Next Steps

1. **Prioritas Tinggi**: Perbaiki health check timeout
   - Implementasi Opsi B (Skip Migrations) adalah yang tercepat
   
2. **Verifikasi**: Test backend dapat diakses dari browser

3. **Deploy**: Redeploy frontend Vercel setelah backend confirmed working

4. **Monitor**: Cek logs untuk memastikan tidak ada error

## Kontak Support

Jika masalah berlanjut:
- Hugging Face Community: https://huggingface.co/spaces/wisnu-ashar/grawizah/discussions
- Vercel Support: https://vercel.com/support
