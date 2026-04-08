# Quick Fix - Health Check Timeout

## Masalah Utama

Backend Anda timeout karena migrations memakan waktu terlalu lama (>30 menit).

```
Launch timed out, workload was not healthy after 30 min
```

## Solusi Cepat (5 Menit)

### Step 1: Tambahkan Environment Variable di Hugging Face

1. Buka https://huggingface.co/spaces/wisnu-ashar/grawizah
2. Klik tab "Settings"
3. Scroll ke "Variables and secrets" → "Secrets"
4. Klik "Add a new secret"
5. Tambahkan:
   ```
   Name: SKIP_MIGRATIONS
   Value: true
   ```
6. Klik "Save"

### Step 2: Restart Space

1. Masih di tab "Settings"
2. Scroll ke "Restart this Space"
3. Klik "Restart this Space"
4. Tunggu 2-3 menit

### Step 3: Verifikasi

1. Klik tab "App"
2. Tunggu sampai Space status "Running"
3. Buka URL Space di browser baru
4. Tambahkan `/health` di akhir URL
5. Seharusnya muncul:
   ```json
   {"status":"ok","service":"grawizah-backend"}
   ```

## Penjelasan

Saya sudah update `backend/cmd/main.go` untuk:
- Skip migrations jika `SKIP_MIGRATIONS=true`
- Migrations hanya perlu dijalankan sekali
- Setelah database ter-setup, tidak perlu run migrations lagi

## Jika Masih Timeout

### Opsi 1: Jalankan Migrations Manual

1. Set `SKIP_MIGRATIONS=false` (atau hapus variable)
2. Restart Space
3. Tunggu sampai migrations selesai (cek Logs)
4. Setelah selesai, set `SKIP_MIGRATIONS=true`
5. Restart lagi

### Opsi 2: Upgrade Hardware

1. Di Settings → "Space Hardware"
2. Pilih "CPU upgrade" (8 vCPU, 32 GB RAM)
3. Biaya: $0.03/hour
4. Restart Space

### Opsi 3: Deploy ke Platform Lain

Jika Hugging Face tidak cocok, coba:
- **Railway.app**: Lebih mudah untuk Go apps
- **Render.com**: Free tier dengan PostgreSQL included
- **Fly.io**: Good for Docker deployments

## URL Backend yang Benar

Format URL Hugging Face Space bisa berbeda:

**Cek di browser:**
1. Buka https://huggingface.co/spaces/wisnu-ashar/grawizah
2. Klik tab "App"
3. Lihat URL di address bar

**Format umum:**
- `https://wisnu-ashar-grawizah.hf.space`
- `https://[username]-[spacename].hf.space`

**Update di Vercel jika berbeda:**
```
NEXT_PUBLIC_API_URL=https://[URL-YANG-BENAR]/api/v1
```

## Test Koneksi

Setelah backend running, test:

```bash
# Test health
curl https://[URL-SPACE]/health

# Test API
curl https://[URL-SPACE]/api/v1/products
```

Atau dari browser console (F12):
```javascript
fetch('https://[URL-SPACE]/health')
  .then(r => r.json())
  .then(console.log)
```

## Hasil yang Diharapkan

✅ Backend Hugging Face: Running dalam <5 menit
✅ Health check: Response 200 OK
✅ Frontend Vercel: Dapat connect ke backend
✅ No CORS errors

## Jika Berhasil

1. Frontend Anda di Vercel akan otomatis connect ke backend
2. Tidak perlu redeploy frontend (environment variables sudah benar)
3. Test dengan membuka frontend dan cek Network tab (F12)

## Jika Masih Gagal

Cek file `TROUBLESHOOTING_KONEKSI.md` untuk debugging lebih detail.
