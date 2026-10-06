# Reel: "Mama Kembali Kuliah di Usia 47"

Iklan IG Reels (1080x1920, 30fps, 45 detik) untuk Gemini Notebook Workshop, dibuat dengan Remotion.

## Menjalankan

```bash
npm install
npm run dev      # buka Remotion Studio untuk preview
npm run render   # hasil: out/mama-kuliah-lagi.mp4
```

## Menambahkan voiceover dan musik

Taruh file audio di folder `public/`, lalu render dengan props:

```bash
npx remotion render MamaKuliahLagi out/mama-kuliah-lagi.mp4 \
  --props='{"voiceoverSrc":"voiceover.mp3","musicSrc":"musik.mp3"}'
```

Musik otomatis diputar di volume 25%. Timing subtitle ada di `SUBTITLES` dalam `src/MamaKuliahLagi.tsx`; sesuaikan kalau tempo rekaman VO berbeda.

## Struktur adegan

| Waktu | Adegan |
|---|---|
| 0 sampai 3 dtk | Mama dari belakang, larut malam, kertas berserakan |
| 3 sampai 10 dtk | Laptop, halaman yang sama dibaca berulang, lalu ditutup |
| 10 sampai 18 dtk | Mama dan anak mencoba Gemini Notebook |
| 18 sampai 28 dtk | Momen "masuk akal", Mama menjelaskan ke anaknya |
| 28 sampai 36 dtk | Mama presentasi di kelas |
| 36 sampai 45 dtk | Kartu penutup workshop dan "Link di bio" |

Font Poppins disertakan secara lokal di `public/fonts` (dari @fontsource/poppins, lisensi OFL) supaya render bisa berjalan offline.
