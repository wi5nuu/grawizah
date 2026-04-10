# Solusi Koneksi Backend-Frontend

## 🔍 Analisis Masalah

Dari log Hugging Face Anda:
```
Launch timed out, workload was not healthy after 30 min
```

**Root Cause**: Backend timeout karena migrations memakan waktu >30 menit.

**Status Saat Ini**:
- ✅ Backend code: Sudah benar
- ✅ Environment variables Vercel: Sudah benar
- ✅ CORS configuration: Sudah benar
- ❌ Backend Hugging Face: Timeout saat startup

## 🚀 Solusi yang Sudah Diterapkan

### 1. Update Backend Code

File `backend/cmd/main.go` sudah diupdate dengan opsi skip migrations:

```go
// Run database migrations (can be skipped if already done)
if os.Getenv("SKIP_MIGRATIONS") == "true" {
    log.Println("⏭️  Skipping migrations (SKIP_MIGRATIONS=true)")
} else {
    log.Println("🔄 Running database migrations...")
    if err := database.RunMigrations(db); err != nil {
        log.Fatalf("CRITICAL: Failed to run migrations: %v", err)
    }
}
```

### 2. Environment Variables Vercel (Sudah Benar)

```
✅ NEXT_PUBLIC_API_URL=https://wisnu-ashar-grawizah.hf.space/api/v1
✅ NEXT_PUBLIC_APP_URL=https://grawizah.vercel.app
✅ NEXT_PUBLIC_SITE_URL=https://grawizah.vercel.app
✅ NEXT_PUBLIC_SUPABASE_URL=https://wsdhumiwikldvpjiksag.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tLEHbxUZ_7q1Wa7OJqT0kw_H5WGHvXu
✅ GOOGLE_CLIENT_ID=333494356278-4lc6bsmjkjj7k5gupiogv1romfci081j.apps.googleusercontent.com
✅ GOOGLE_CLIENT_SECRET=[hidden]
```

## 📋 Action Items untuk Anda

### STEP 1: Push Update ke Hugging Face

```bash
# Pastikan Anda di folder backend
cd backend

# Push ke Hugging Face
git push
```

Atau jika backend adalah submodule/separate repo, push dari root:
```bash
git push
```

### STEP 2: Tambahkan Environment Variable di Hugging Face

1. Buka: https://huggingface.co/spaces/wisnu-ashar/grawizah
2. Klik tab **"Settings"**
3. Scroll ke **"Variables and secrets"** → **"Secrets"**
4. Klik **"Add a new secret"**
5. Tambahkan:
   - **Name**: `SKIP_MIGRATIONS`
   - **Value**: `true`
6. Klik **"Save"**

### STEP 3: Restart Hugging Face Space

1. Masih di tab **"Settings"**
2. Scroll ke **"Restart this Space"**
3. Klik **"Restart this Space"**
4. Tunggu 2-3 menit

### STEP 4: Verifikasi Backend Running

1. Klik tab **"App"** di Hugging Face Space
2. Tunggu sampai status **"Running"** (bukan "Building" atau "Sleeping")
3. Copy URL yang muncul di address bar
4. Buka tab browser baru, paste URL + `/health`
   - Contoh: `https://wisnu-ashar-grawizah.hf.space/health`
5. Seharusnya muncul:
   ```json
   {"status":"ok","service":"grawizah-backend"}
   ```

### STEP 5: Update URL di Vercel (Jika Berbeda)

Jika URL Space berbeda dari `https://wisnu-ashar-grawizah.hf.space`:

1. Buka Vercel Dashboard
2. Project Settings → Environment Variables
3. Edit `NEXT_PUBLIC_API_URL`
4. Update dengan URL yang benar + `/api/v1`
5. Redeploy frontend

### STEP 6: Test Koneksi Frontend-Backend

1. Buka frontend Anda: https://grawizah.vercel.app
2. Tekan **F12** → Tab **"Network"**
3. Refresh halaman
4. Lihat request ke backend
5. Seharusnya tidak ada CORS error atau connection error

## 🔧 Troubleshooting

### Jika Backend Masih Timeout

**Opsi A: Jalankan Migrations Sekali**

1. Hapus atau set `SKIP_MIGRATIONS=false` di Hugging Face
2. Restart Space
3. Tunggu sampai migrations selesai (cek tab "Logs")
4. Setelah selesai, set `SKIP_MIGRATIONS=true`
5. Restart lagi

**Opsi B: Upgrade Hardware**

1. Settings → "Space Hardware"
2. Pilih "CPU upgrade" (8 vCPU, 32 GB RAM)
3. Biaya: $0.03/hour (~$22/month)
4. Restart Space

**Opsi C: Deploy ke Platform Lain**

Jika Hugging Face tidak cocok:
- **Railway.app**: Mudah untuk Go + PostgreSQL
- **Render.com**: Free tier dengan database included
- **Fly.io**: Good for Docker deployments

### Jika URL Space Berbeda

Format URL Hugging Face bisa:
- `https://wisnu-ashar-grawizah.hf.space`
- `https://[username]-[spacename].hf.space`
- Atau format lain tergantung konfigurasi

**Cara cek URL yang benar:**
1. Buka Space di browser
2. Klik tab "App"
3. Lihat URL di address bar
4. Itu adalah URL yang harus digunakan

### Jika CORS Error

Backend sudah dikonfigurasi dengan:
```go
AllowedOrigins: []string{"https://*", "http://*"}
```

Seharusnya tidak ada CORS error. Jika ada:
1. Cek browser console untuk error message
2. Pastikan request menggunakan HTTPS (bukan HTTP)
3. Cek apakah backend benar-benar running

## 📊 Expected Results

Setelah semua langkah:

✅ Backend Hugging Face: Running dalam <5 menit
✅ Health endpoint: Response 200 OK
✅ Frontend Vercel: Connect ke backend tanpa error
✅ No CORS errors
✅ API calls working

## 📝 Catatan Penting

1. **Migrations hanya perlu dijalankan sekali**
   - Setelah database ter-setup, set `SKIP_MIGRATIONS=true`
   - Ini akan mempercepat startup time

2. **Hugging Face Free Tier Limitations**
   - Space akan sleep setelah tidak aktif
   - Perlu "dibangunkan" dengan mengunjungi URL
   - Pertimbangkan upgrade jika perlu always-on

3. **Database Connection**
   - Pastikan DATABASE_URL dapat diakses dari Hugging Face
   - Supabase seharusnya accessible dari mana saja
   - Cek firewall/network restrictions jika ada

4. **Environment Variables**
   - Semua secrets sudah benar di Hugging Face
   - Tambahkan `SKIP_MIGRATIONS=true` untuk fix timeout
   - Tidak perlu environment variables lain

## 🎯 Next Steps

1. ✅ Code sudah diupdate (SKIP_MIGRATIONS option)
2. ⏳ Push ke Hugging Face
3. ⏳ Tambahkan SKIP_MIGRATIONS=true di Hugging Face
4. ⏳ Restart Space
5. ⏳ Verifikasi backend running
6. ⏳ Test koneksi dari frontend

## 📞 Jika Masih Ada Masalah

Lihat file-file berikut untuk detail lebih lanjut:
- `QUICK_FIX.md` - Solusi cepat 5 menit
- `TROUBLESHOOTING_KONEKSI.md` - Debugging detail
- `DEPLOYMENT_FIX.md` - Panduan deployment lengkap

Atau hubungi:
- Hugging Face Community: https://huggingface.co/spaces/wisnu-ashar/grawizah/discussions
- Vercel Support: https://vercel.com/support
