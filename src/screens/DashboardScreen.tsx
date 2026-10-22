import React, { useState } from 'react';
import { TabType, UserProfile } from '../types.ts';

interface DashboardScreenProps {
  onNavigateTab: (tab: TabType) => void;
  userProfile: UserProfile;
  onOpenTopUp: () => void;
  onSearchRoute: (origin: string, destination: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateTab,
  userProfile,
  onOpenTopUp,
  onSearchRoute,
}) => {
  const [origin, setOrigin] = useState('Rumah (Jl. Supriyadi)');
  const [destination, setDestination] = useState('Stasiun Purwokerto');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setTimeout(() => setIsSwapping(false), 200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchRoute(origin, destination);
    onNavigateTab('rencana');
  };

  return (
    <main className="w-full max-w-screen-sm mx-auto px-4 pt-3 pb-8 space-y-4">
      {/* Greeting & Live Status Micro-Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-on-surface-variant font-medium">Selamat Pagi</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface font-headline tracking-tight">
            Halo, {userProfile.name.split(' ')[0]} 👋
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[11px] font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span>Layanan Aktif</span>
        </div>
      </div>

      {/* Widget Saldo & Pembayaran Cepat (MaaS Pass Card) */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-container to-primary text-on-primary p-4 shadow-md">
        {/* Watermark civic pattern */}
        <div className="absolute -right-6 -bottom-8 opacity-10 pointer-events-none text-surface-container-lowest select-none">
          <span className="material-symbols-outlined text-[130px]">directions_bus</span>
        </div>
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 text-surface-variant text-xs">
                <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                <span>Saldo Terpadu BanyumasPay</span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-surface-container-lowest tracking-tight font-headline">
                  Rp {userProfile.walletBalance.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] font-bold bg-primary px-2 py-0.5 rounded text-surface-variant">
                  e-Money / QRIS
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest/15 backdrop-blur-md px-2.5 py-1 rounded-lg text-right border border-surface-container-lowest/20">
              <span className="text-[10px] text-surface-variant block font-medium">Tarif Pelajar/Lansia</span>
              <span className="text-xs font-bold text-surface-container-lowest">
                {userProfile.isSubsidyVerified ? 'Subsidi 100% Aktif' : 'Tarif Terintegrasi'}
              </span>
            </div>
          </div>

          {/* Quick Payment Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-container-lowest/20">
            <button
              onClick={onOpenTopUp}
              type="button"
              className="flex items-center justify-center gap-2 bg-surface-container-lowest text-primary hover:bg-surface-bright active:scale-95 transition-transform py-2.5 px-3 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-base">add_circle</span>
              <span>Top-Up Cepat</span>
            </button>
            <button
              onClick={() => onNavigateTab('tiket')}
              type="button"
              className="flex items-center justify-center gap-2 bg-secondary text-on-secondary hover:bg-opacity-95 active:scale-95 transition-transform py-2.5 px-3 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-on-secondary text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                qr_code_scanner
              </span>
              <span>QR Tiket Aktif (1-Tap)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pencarian Perjalanan Instan (Multimodal Route Finder) */}
      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/40 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">alt_route</span>
            <h3 className="font-bold text-sm text-on-surface font-headline">Pencarian Perjalanan Instan</h3>
          </div>
          <span className="text-[10px] font-bold text-secondary bg-secondary-container/50 px-2 py-0.5 rounded-full">
            Antarmoda Real-time
          </span>
        </div>

        <form onSubmit={handleSearch} className="relative space-y-2">
          {/* Origin Input */}
          <div className="flex items-center gap-3 bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant/30 focus-within:border-primary transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0 ring-4 ring-secondary-container/40" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] text-on-surface-variant font-medium">Titik Asal</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Pilih titik keberangkatan"
                className="w-full bg-transparent p-0 border-none text-xs font-bold text-on-surface focus:outline-none"
              />
            </div>
            <span className="material-symbols-outlined text-outline text-lg">my_location</span>
          </div>

          {/* Swap Route Floating Button */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Tukar arah perjalanan"
              className={`w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant shadow-sm flex items-center justify-center text-primary hover:bg-surface-container active:scale-90 transition-transform cursor-pointer ${
                isSwapping ? 'rotate-180' : ''
              }`}
            >
              <span className="material-symbols-outlined text-base">swap_vert</span>
            </button>
          </div>

          {/* Destination Input */}
          <div className="flex items-center gap-3 bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant/30 focus-within:border-primary transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-error shrink-0 ring-4 ring-error-container/40" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] text-on-surface-variant font-medium">Tujuan</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Cari stasiun, halte, kampus..."
                className="w-full bg-transparent p-0 border-none text-xs font-bold text-on-surface focus:outline-none"
              />
            </div>
            <span className="material-symbols-outlined text-outline text-lg">flag</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full mt-3 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Cari Rute Terpadu (Feeder + Bus)</span>
          </button>
        </form>
      </section>

      {/* Aksi Cepat (4 Kolom Bento Grid) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-xs text-on-surface font-headline uppercase tracking-wider">
            Layanan Terintegrasi
          </h3>
          <span className="text-[11px] text-on-surface-variant">Pintas Cepat</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* 1. Live Tracking */}
          <button
            onClick={() => onNavigateTab('tracking')}
            type="button"
            className="relative bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/40 flex flex-col items-center text-center gap-1 hover:bg-surface-container-low active:scale-95 transition-all shadow-xs group cursor-pointer"
          >
            <span className="absolute -top-1.5 px-1.5 py-0.2 bg-secondary text-on-secondary rounded-full text-[9px] font-bold tracking-tight shadow-xs">
              3 Bus Dekat
            </span>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mt-1">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                directions_bus
              </span>
            </div>
            <span className="text-[11px] font-semibold text-on-surface line-clamp-2 leading-tight">
              Live Tracking
            </span>
          </button>

          {/* 2. Rencana Perjalanan */}
          <button
            onClick={() => onNavigateTab('rencana')}
            type="button"
            className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/40 flex flex-col items-center text-center gap-1 hover:bg-surface-container-low active:scale-95 transition-all shadow-xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mt-1">
              <span className="material-symbols-outlined text-xl">route</span>
            </div>
            <span className="text-[11px] font-semibold text-on-surface line-clamp-2 leading-tight">
              Rencana Multimoda
            </span>
          </button>

          {/* 3. Beli Tiket QRIS */}
          <button
            onClick={() => onNavigateTab('tiket')}
            type="button"
            className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/40 flex flex-col items-center text-center gap-1 hover:bg-surface-container-low active:scale-95 transition-all shadow-xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mt-1">
              <span className="material-symbols-outlined text-xl">qr_code_2</span>
            </div>
            <span className="text-[11px] font-semibold text-on-surface line-clamp-2 leading-tight">
              Tiket QRIS Pas
            </span>
          </button>

          {/* 4. Antar Moda Feeder */}
          <button
            onClick={() => onNavigateTab('antarmoda')}
            type="button"
            className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/40 flex flex-col items-center text-center gap-1 hover:bg-surface-container-low active:scale-95 transition-all shadow-xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant group-hover:bg-secondary group-hover:text-on-secondary transition-colors mt-1">
              <span className="material-symbols-outlined text-xl">two_wheeler</span>
            </div>
            <span className="text-[11px] font-semibold text-on-surface line-clamp-2 leading-tight">
              Feeder Ojol/Angkot
            </span>
          </button>
        </div>
      </section>

      {/* Peta Interaktif Ringkas & Radar Bus Banyumas */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden shadow-sm">
        <div className="p-3 border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">radar</span>
            <div>
              <h4 className="text-xs font-bold text-on-surface leading-tight font-headline">
                Peta & Radar Bus Koridor Banyumas
              </h4>
              <p className="text-[11px] text-on-surface-variant">K1, K2, K3A, K3B, K4 & Trans Jateng B1</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('tracking')}
            className="text-[10px] bg-primary text-white hover:bg-primary-container px-2.5 py-1 rounded-full font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[12px]">map</span>
            <span>Buka Peta Jalur</span>
          </button>
        </div>

        {/* Vector Map representation */}
        <div
          onClick={() => onNavigateTab('tracking')}
          className="relative h-44 bg-surface-container-low overflow-hidden cursor-pointer"
          title="Klik untuk membuka Live Tracking penuh"
        >
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 176">
            <path d="M 0 90 Q 120 70 200 85 T 400 80" fill="none" stroke="#dae2fd" strokeLinecap="round" strokeWidth="12" />
            <path d="M 90 0 L 110 176" fill="none" stroke="#eaedff" strokeWidth="8" />
            <path d="M 310 0 L 290 176" fill="none" stroke="#eaedff" strokeWidth="8" />
            <path d="M 0 140 Q 180 120 400 150" fill="none" stroke="#d2d9f4" strokeDasharray="6,4" strokeWidth="4" />
            <path d="M 20 88 Q 120 68 200 83 T 380 78" fill="none" stroke="#1e40af" strokeLinecap="round" strokeWidth="4" />
          </svg>

          {/* Halte Alun-Alun Purwokerto */}
          <div className="absolute left-1/3 top-14 -translate-x-1/2 flex flex-col items-center z-10">
            <div className="w-4 h-4 rounded-full bg-surface-container-lowest border-2 border-primary shadow flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <span className="mt-1 px-1.5 py-0.5 bg-surface-container-lowest/90 backdrop-blur-xs text-[9px] font-bold text-on-surface rounded shadow-xs border border-outline-variant/40">
              Halte Alun-Alun
            </span>
          </div>

          {/* Halte Pasar Pon */}
          <div className="absolute left-8 top-16 -translate-x-1/2 flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-surface-container-lowest border-2 border-outline shadow flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-outline" />
            </div>
            <span className="mt-0.5 text-[8px] font-medium text-on-surface-variant">Ps. Pon</span>
          </div>

          {/* Halte Bulupitu */}
          <div className="absolute right-8 top-14 -translate-x-1/2 flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-surface-container-lowest border-2 border-outline shadow flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-outline" />
            </div>
            <span className="mt-0.5 text-[8px] font-medium text-on-surface-variant">Bulupitu</span>
          </div>

          {/* Moving Bus Pin TB-104 */}
          <div className="absolute left-[26%] top-12 -translate-x-1/2 flex flex-col items-center z-20">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-7 h-7 rounded-full bg-secondary ping-slow" />
              <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary shadow-md flex items-center justify-center">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  directions_bus
                </span>
              </div>
            </div>
            <div className="bg-on-surface text-surface-bright px-1.5 py-0.5 rounded text-[9px] font-bold tracking-tight shadow mt-0.5">
              TB-104
            </div>
          </div>

          {/* Floating Live ETA Banner */}
          <div className="absolute bottom-2 left-2 right-2 bg-surface-container-lowest/95 backdrop-blur-sm rounded-lg p-2.5 border border-outline-variant/40 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-lg">timer</span>
              </div>
              <div>
                <p className="text-[11px] text-on-surface-variant font-medium">
                  Halte Terdekat: <strong className="text-on-surface font-bold">Alun-Alun Pwt</strong>
                </p>
                <p className="text-[10px] text-on-surface-variant">Bus TB-104 sedang menuju halte</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-secondary block font-headline leading-none">
                4 mnt
              </span>
              <span className="text-[9px] text-on-surface-variant font-medium">Jarak ~450m</span>
            </div>
          </div>
        </div>
      </section>

      {/* Status Koridor Beroperasi */}
      <section className="bg-surface-container-lowest rounded-xl p-3.5 border border-outline-variant/40 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-secondary text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="text-xs font-bold text-on-surface font-headline">Status Koridor Hari Ini</span>
          </div>
          <span className="text-[10px] text-on-surface-variant font-medium">Jam: 05.00 - 19.30 WIB</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Koridor 1 */}
          <div
            onClick={() => onNavigateTab('tracking')}
            className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors"
          >
            <span className="w-6 h-6 rounded bg-[#0284c7] text-white font-bold text-xs flex items-center justify-center shrink-0">
              K1
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-on-surface truncate">Pasar Pon - Ajibarang</p>
              <p className="text-[10px] text-secondary font-bold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" /> Lancar
              </p>
            </div>
          </div>

          {/* Koridor 2 */}
          <div
            onClick={() => onNavigateTab('tracking')}
            className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors"
          >
            <span className="w-6 h-6 rounded bg-[#ea580c] text-white font-bold text-xs flex items-center justify-center shrink-0">
              K2
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-on-surface truncate">Notog - Baturraden</p>
              <p className="text-[10px] text-secondary font-bold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" /> Normal
              </p>
            </div>
          </div>

          {/* Koridor 3A & 3B */}
          <div
            onClick={() => onNavigateTab('tracking')}
            className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors"
          >
            <span className="w-6 h-6 rounded bg-[#dc2626] text-white font-bold text-xs flex items-center justify-center shrink-0">
              K3
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-on-surface truncate">Bulupitu - Kebondalem</p>
              <p className="text-[10px] text-secondary font-bold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" /> 2 Rute Loop
              </p>
            </div>
          </div>

          {/* Koridor 4 */}
          <div
            onClick={() => onNavigateTab('tracking')}
            className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors"
          >
            <span className="w-6 h-6 rounded bg-[#ca8a04] text-white font-bold text-xs flex items-center justify-center shrink-0">
              K4
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-on-surface truncate">Bulupitu - Kejawar BMS</p>
              <p className="text-[10px] text-secondary font-bold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" /> Normal
              </p>
            </div>
          </div>

          {/* Trans Jateng B1 */}
          <div
            onClick={() => onNavigateTab('tracking')}
            className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors col-span-2 sm:col-span-2"
          >
            <span className="w-6 h-6 rounded bg-[#16a34a] text-white font-bold text-xs flex items-center justify-center shrink-0">
              B1
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-on-surface truncate">Trans Jateng: Bulupitu - Bukateja (Purbalingga)</p>
              <p className="text-[10px] text-secondary font-bold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" /> Aglomerasi • Lancar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rekomendasi Rute Terakhir */}
      <section className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/40 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-outline text-lg">history</span>
            <h4 className="text-xs font-bold text-on-surface font-headline uppercase tracking-wider">
              Rute Terakhir & Favorit
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-[11px] text-primary font-bold cursor-pointer hover:underline"
          >
            Lihat Semua
          </button>
        </div>

        <div className="bg-surface-container-low/70 rounded-xl p-3 border border-outline-variant/30 hover:border-primary transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded">
                Hemat Terpadu
              </span>
              <span className="text-[11px] text-on-surface-variant">Est. 28 mnt</span>
            </div>
            <span className="text-sm font-extrabold text-primary font-headline">Rp 5.500</span>
          </div>

          <div className="mt-3 flex items-center gap-2 overflow-x-auto custom-scroll-hide py-0.5">
            <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant/30 shrink-0">
              <span className="material-symbols-outlined text-secondary text-sm">two_wheeler</span>
              <span className="text-[11px] font-medium">Feeder Ojek</span>
            </div>
            <span className="text-outline text-xs">➔</span>
            <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant/30 shrink-0">
              <span
                className="material-symbols-outlined text-primary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                directions_bus
              </span>
              <span className="text-[11px] font-bold text-primary">K2 Trans Banyumas</span>
            </div>
            <span className="text-outline text-xs">➔</span>
            <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant/30 shrink-0">
              <span className="material-symbols-outlined text-outline text-sm">directions_walk</span>
              <span className="text-[11px] font-medium">30m</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <p className="truncate">Rumah (Supriyadi) ➔ Kampus UNSOED Grendeng</p>
            <button
              onClick={() => {
                onSearchRoute('Rumah (Supriyadi)', 'Kampus UNSOED Grendeng');
                onNavigateTab('rencana');
              }}
              className="shrink-0 text-primary font-bold text-xs hover:text-primary-container ml-2 cursor-pointer"
            >
              Pesan Lagi
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
