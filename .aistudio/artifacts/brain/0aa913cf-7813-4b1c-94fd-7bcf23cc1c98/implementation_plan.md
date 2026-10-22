# Rencana Implementasi: Peta Asli Geografis Live Tracking, Rencana Perjalanan Asal-Tujuan, & Integrasi Langsung Gojek / Grab

## 1. Ringkasan Eksekutif & Kebutuhan Pengguna
Pengguna menginginkan peningkatan pada aplikasi **Trans Banyumas MaaS**:
1. **Live Tracking di Peta Nyata**: Menggunakan peta geografis nyata (bukan sekadar diagram skematik), menampilkan jalan-jalan asli Kabupaten Banyumas & Purwokerto dengan koordinat GPS nyata, jalur rute bus di jalan raya, dan pergerakan bus secara *real-time*.
2. **Rencana Perjalanan (Dari Mana ke Mana)**: Fitur penentuan titik asal (*Origin*) dan tujuan (*Destination*) dengan pencarian otomatis, titik populer (Stasiun Purwokerto, Alun-Alun, Unsoed, Baturraden, Bulupitu), serta rekomendasi rute transit multimoda (feeder + bus + transfer).
3. **Integrasi Langsung ke Gojek & Grab**: Tombol pemesanan ojek online / feeder yang dapat **langsung membuka aplikasi Gojek atau Grab di perangkat pengguna** melalui skema deep link resmi (`gojek://` dan `grab://`), dilengkapi *fallback* web/store otomatis.

---

## 2. Arsitektur & Desain Solusi

### A. Peta Geografis Nyata (Real Geographic Map Engine)
- Menggunakan pustaka peta interaktif berbasis Leaflet / OpenStreetMap (ringan, performa tinggi, tanpa batasan API key, peta jalan nyata Indonesia dan Banyumas yang sangat detail).
- **Koordinat Nyata Rute Trans Banyumas**:
  - Pusat Peta: Purwokerto Kota (`-7.4244, 109.2304`).
  - Koordinat GPS akurat untuk semua koridor:
    - **Koridor 1**: Pasar Pon (`-7.4292, 109.2215`) ↔ Karanglewas ↔ Cilongok ↔ Terminal Ajibarang (`-7.4045, 109.0742`).
    - **Koridor 2**: Terminal Notog (`-7.4934, 109.2238`) ↔ Stasiun PWT (`-7.4191, 109.2217`) ↔ Alun-Alun Pwt (`-7.4244, 109.2304`) ↔ Baturraden (`-7.3117, 109.2285`).
    - **Koridor 3A & 3B**: Bulupitu (`-7.4475, 109.2555`) ↔ Moro ↔ Kebondalem ↔ Kampus Unsoed Grendeng (`-7.4011, 109.2505`) ↔ Bulupitu (Loop).
    - **Koridor 4**: Bulupitu ↔ Sokaraja Klenteng (`-7.4586, 109.2974`) ↔ Kota Lama Banyumas (`-7.5186, 109.2942`) ↔ Terminal Kejawar RSUD Banyumas (`-7.5312, 109.2995`).
    - **Trans Jateng B1**: Bulupitu ↔ RS Margono (`-7.4361, 109.2688`) ↔ Sokaraja ↔ Terminal Purbalingga (`-7.3912, 109.3551`) ↔ Terminal Bukateja (`-7.4172, 109.4325`).
- **Fitur Live Tracking Nyata**:
  - Bus bergerak menyusuri jalan raya nyata dengan gelombang radar GPS.
  - Telemetri kecepatan (km/jam), plat nomor, okupansi kursi, dan countdown ETA ke halte berikutnya.
  - Opsi layer: Peta Jalan (Standard OSM) vs Peta Kontras / Gelap / Satelit.

### B. Rencana Perjalanan Terintegrasi (Dari Mana ➔ Ke Mana)
- Modul formulir pencarian asal-tujuan yang intuitif:
  - Deteksi "Lokasi Saya Saat Ini" (GPS Geolocation).
  - Pilihan cepat halte & landmark populer Banyumas.
  - Kemampuan tukar posisi asal-tujuan (Swap Button).
  - Pilihan waktu keberangkatan (Berangkat Sekarang vs Atur Jam).
- Hasil rekomendasi multimoda:
  - **Opsi Tercepat**: Kombinasi Gojek/Grab feeder dari rumah ke halte terdekat + Bus Trans Banyumas.
  - **Opsi Paling Hemat**: Jalan kaki ke halte + Bus Trans Banyumas (hanya Rp 3.900).
  - **Opsi Transit Minimal**: Bus langsung tanpa transfer.
- Detail rute step-by-step dengan panduan estimasi waktu dan tarif terpadu.

### C. Integrasi Langsung ke Gojek & Grab (Deep Linking)
- **Protokol Deep Link**:
  - **Gojek**: Skema URL `gojek://goride` / `gojek://gocar` atau `https://gjk.mobi/` dengan parameter titik jemput dan tujuan.
  - **Grab**: Skema URL `grab://open?screenType=TRANSPORT` atau Universal Link `https://r.grab.com/` / `https://grab.onelink.me/` dengan parameter penjemputan.
- **Mekanisme Eksekusi di Browser / Perangkat**:
  - Ketika pengguna mengklik **"Buka di Gojek"** atau **"Buka di Grab"**, sistem mencoba meluncurkan protokol aplikasi resmi secara langsung (`window.location.href = deepLink`).
  - Dilengkapi *timer fallback* otomatis: jika aplikasi belum terpasang atau diakses via desktop, aplikasi akan membuka versi web resmi Gojek/Grab atau Play Store / App Store, serta menyediakan tombol salin alamat tujuan.
  - Kartu konfirmasi feeder menampilkan estimasi tarif ojol (contoh: GoRide Rp 5.000 - Rp 9.000 ke Halte terdekat), nama pengemudi simulasi, dan waktu penjemputan (2-4 menit).

---

## 3. Rencana Kerja File per File

1. **`package.json`**:
   - Memastikan `leaflet` dan `@types/leaflet` terpasang untuk merender peta geografis jalan nyata Banyumas secara lancar dan interaktif.
2. **`src/data/realMapRoutes.ts`**:
   - Menyediakan data koordinat garis jalan (polylines) GPS nyata untuk Koridor 1, 2, 3A, 3B, 4, dan B1 Trans Jateng di Kabupaten Banyumas.
   - Definisi halte-halte utama beserta koordinat Latitude/Longitude riil.
3. **`src/components/RealLeafletMap.tsx`**:
   - Komponen peta Leaflet yang merender peta jalan nyata Banyumas, garis rute berwarna koridor resmi, halte dengan popup interaktif, serta armada bus yang bergerak nyata di jalan.
4. **`src/screens/TrackingScreen.tsx`**:
   - Mengintegrasikan `RealLeafletMap` sebagai tampilan utama, lengkap dengan pelacak bus, info kecepatan langsung, pencarian halte, dan tombol langsung pesan feeder Gojek/Grab.
5. **`src/screens/RencanaScreen.tsx`**:
   - Memperbarui halaman Rencana agar pengguna dapat memilih titik asal & tujuan dengan peta interaktif, melihat estimasi rute multimoda terpadu, dan langsung mengklik tombol integrasi Gojek/Grab untuk segmen feeder first-mile / last-mile.
6. **`src/screens/AntarModaScreen.tsx`**:
   - Menambahkan peluncur langsung aplikasi Gojek & Grab dengan deep link, opsi pilihan layanan (GoRide, GoCar, GrabBike, GrabCar), kalkulator estimasi tarif, dan penjemputan di halte pilihan.
7. **`src/utils/deepLinkHelper.ts`**:
   - Helper fungsi untuk membuat URL deep link Gojek & Grab dengan koordinat/alamat, menangani *failover* jika aplikasi tidak terinstal, dan menyediakan fallback web.

---

## 4. Verifikasi & Pengujian
- Memverifikasi peta jalan nyata tampil mulus di layar seluler dan desktop dengan pusat Banyumas / Purwokerto.
- Menguji pergerakan live bus di atas jalan nyata pada peta geografis.
- Menguji pengisian rute Asal dan Tujuan pada Rencana Perjalanan.
- Menguji klik tombol Gojek dan Grab untuk memastikan pemanggilan deep link native aplikasi berjalan dengan fallback yang tepat.
- Menjalankan `compile_applet` dan `lint_applet` untuk menjamin tidak ada error sintaks atau build.
