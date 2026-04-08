# Panduan Memperbaiki Koneksi Backend-Frontend

## Masalah yang Ditemukan

Backend Anda di Hugging Face sudah berjalan dengan baik di `https://wisnu-ashar-grawizah.hf.space`, tetapi frontend di Vercel masih mengarah ke `localhost`.

## Langkah-Langkah Perbaikan

### 1. Update Environment Variables di Vercel

Masuk ke Vercel Dashboard → Project Settings → Environment Variables, lalu update:

```
NEXT_PUBLIC_API_URL=https://wisnu-ashar-grawizah.hf.space/api/v1
```

**PENTING**: Pastikan URL Hugging Face Space Anda benar. Format umumnya:
- `https://[username]-[space-name].hf.space`
- Atau cek di Hugging Face Space Settings untuk URL yang tepat

### 2. Redeploy Frontend di Vercel

Setelah mengupdate environment variable:
1. Klik tab "Deployments" di Vercel
2. Klik tombol "Redeploy" pada deployment terakhir
3. Atau push commit baru ke repository untuk trigger deployment otomatis

### 3. Verifikasi Koneksi

Setelah deployment selesai, test koneksi:

```bash
# Test backend langsung
curl https://wisnu-ashar-grawizah.hf.space/api/v1/health

# Test dari browser
# Buka frontend Vercel Anda dan cek Network tab di DevTools
```

## Checklist Environment Variables

### Vercel (Frontend)
- ✅ `NEXT_PUBLIC_API_URL` → URL backend Hugging Face
- ✅ `NEXT_PUBLIC_APP_URL` → URL frontend Vercel Anda
- ✅ `NEXT_PUBLIC_SITE_URL` → URL frontend Vercel Anda
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`

### Hugging Face (Backend)
- ✅ `DATABASE_URL` (sudah ada)
- ✅ `JWT_SECRET` (sudah ada)
- ✅ `GROQ_API_KEY` (sudah ada)
- ✅ `SUPABASE_SERVICE_KEY` (sudah ada)
- ✅ `SUPABASE_URL` (sudah ada)
- ✅ `ENVIRONMENT` (sudah ada)
- ✅ `GOOGLE_CLIENT_ID` (sudah ada)
- ✅ `GOOGLE_CLIENT_SECRET` (sudah ada)

**Tambahkan jika belum ada:**
```
FRONTEND_URL=https://[your-vercel-app].vercel.app
APP_URL=https://[your-vercel-app].vercel.app
```

## Troubleshooting

### Jika masih tidak terhubung:

1. **Cek CORS**: Backend sudah dikonfigurasi dengan `Access-Control-Allow-Origin: *`, jadi seharusnya tidak ada masalah CORS.

2. **Cek URL Hugging Face Space**:
   - Buka https://huggingface.co/spaces/wisnu-ashar/grawizah
   - Klik tab "App" untuk melihat URL yang aktif
   - Pastikan Space dalam status "Running" (bukan "Sleeping")

3. **Cek Health Endpoint**:
   ```bash
   curl https://wisnu-ashar-grawizah.hf.space/api/v1/health
   ```
   Seharusnya return response JSON.

4. **Cek Browser Console**:
   - Buka frontend di browser
   - Tekan F12 → Network tab
   - Lihat apakah ada request ke backend yang gagal
   - Cek error message di Console tab

5. **Hugging Face Space Sleep Mode**:
   - Free tier Hugging Face Spaces akan sleep setelah tidak aktif
   - Kunjungi URL Space untuk "membangunkannya"
   - Pertimbangkan upgrade hardware jika perlu always-on

## Catatan Penting

- Backend Anda sudah berjalan dengan baik (migrations berhasil, server binding ke port 7860)
- CORS sudah dikonfigurasi dengan benar (`Access-Control-Allow-Origin: *`)
- Masalah utama adalah frontend masih mengarah ke localhost
- Setelah update environment variable di Vercel, masalah akan teratasi

## Contoh URL yang Benar

```javascript
// ❌ SALAH (localhost)
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1

// ✅ BENAR (Hugging Face Space)
NEXT_PUBLIC_API_URL=https://wisnu-ashar-grawizah.hf.space/api/v1
```
