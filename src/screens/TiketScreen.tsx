import React, { useState, useEffect } from 'react';
import { UserTicket, TabType } from '../types.ts';

interface TiketScreenProps {
  ticket: UserTicket;
  onNavigateTab: (tab: TabType) => void;
  onOpenDownloadModal: () => void;
  walletBalance: number;
}

export const TiketScreen: React.FC<TiketScreenProps> = ({
  ticket,
  onNavigateTab,
  onOpenDownloadModal,
  walletBalance,
}) => {
  const [countdown, setCountdown] = useState<number>(45);
  const [highBrightness, setHighBrightness] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'nfc' | 'wallet'>(ticket.paymentMethod);

  // QR security counter countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenMitra = () => {
    onNavigateTab('antarmoda');
  };

  return (
    <div
      className={`w-full max-w-screen-sm mx-auto px-4 pt-3 pb-24 space-y-4 transition-all ${
        highBrightness ? 'brightness-110 contrast-105' : ''
      }`}
    >
      {/* Status Transaksi Bar */}
      <div className="flex items-center justify-between bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/60 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
          </span>
          <div>
            <span className="text-xs font-bold text-secondary block">
              Tiket Aktif • Perjalanan Berlangsung
            </span>
            <span className="text-[11px] text-on-surface-variant font-medium">
              Koridor 2 & Mitra Multimoda
            </span>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-bold">
          Terkonfirmasi
        </span>
      </div>

      {/* Digital Boarding Pass Card */}
      <section className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/70 shadow-sm overflow-hidden">
        {/* Card Header: Blue Gradient with Branding */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-4 text-on-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-surface-bright">directions_bus</span>
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight text-white leading-none font-headline">
                  MaaS Banyumas Pass
                </p>
                <p className="text-[11px] text-primary-fixed opacity-90 mt-0.5">
                  Tiket Tunggal Antar Moda
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Resmi Dishub
            </span>
          </div>

          {/* Badges & Journey Code */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-primary-fixed block uppercase font-bold tracking-wider">
                ID PERJALANAN
              </span>
              <span className="text-sm font-bold text-white tracking-wider font-headline">
                {ticket.ticketId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-primary-fixed block uppercase font-bold tracking-wider">
                MASA BERLAKU
              </span>
              <span className="text-xs font-bold text-white font-headline">{ticket.expiresAt}</span>
            </div>
          </div>
        </div>

        {/* Ticket Body: Notch Separator */}
        <div className="relative flex items-center justify-between px-3 py-1 bg-surface-container-lowest">
          <div className="w-4 h-4 rounded-full bg-background -ml-5 border-r border-outline-variant/60" />
          <div className="w-full border-t-2 border-dashed border-outline-variant mx-2" />
          <div className="w-4 h-4 rounded-full bg-background -mr-5 border-l border-outline-variant/60" />
        </div>

        {/* Interactive QR Matrix Section */}
        <div className="px-5 pb-5 pt-2 text-center bg-surface-container-lowest">
          <div className="inline-block p-1 rounded-full bg-secondary-container/60 text-on-secondary-container text-[11px] font-bold px-3 mb-3">
            Siap Digunakan • Sekali Bayar Multimoda
          </div>

          {/* QR Pass Container */}
          <div className="mx-auto w-52 h-52 p-3 bg-surface-container-lowest border-2 border-outline-variant/80 rounded-2xl shadow-inner flex flex-col items-center justify-center relative">
            {/* High-contrast Stylized SVG QR Matrix */}
            <svg
              className="w-44 h-44 text-on-background"
              fill="currentColor"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner Finders */}
              <rect x="5" y="5" width="28" height="28" rx="4" fill="currentColor" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="#FFFFFF" />
              <rect x="13" y="13" width="12" height="12" rx="1" fill="currentColor" />
              <rect x="67" y="5" width="28" height="28" rx="4" fill="currentColor" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="#FFFFFF" />
              <rect x="75" y="13" width="12" height="12" rx="1" fill="currentColor" />
              <rect x="5" y="67" width="28" height="28" rx="4" fill="currentColor" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="#FFFFFF" />
              <rect x="13" y="75" width="12" height="12" rx="1" fill="currentColor" />

              {/* Center Logo Anchor */}
              <rect x="42" y="42" width="16" height="16" rx="4" fill="#00288e" />
              <circle cx="50" cy="50" r="4" fill="#ffffff" />

              {/* QR Pattern Blocks */}
              <rect x="38" y="7" width="5" height="5" />
              <rect x="48" y="7" width="5" height="10" />
              <rect x="58" y="12" width="5" height="5" />
              <rect x="38" y="22" width="10" height="5" />
              <rect x="54" y="22" width="8" height="6" />
              <rect x="8" y="38" width="6" height="6" />
              <rect x="20" y="40" width="8" height="5" />
              <rect x="30" y="48" width="6" height="6" />
              <rect x="64" y="38" width="10" height="6" />
              <rect x="80" y="40" width="12" height="5" />
              <rect x="38" y="66" width="6" height="8" />
              <rect x="48" y="62" width="8" height="5" />
              <rect x="62" y="60" width="8" height="8" />
              <rect x="76" y="66" width="6" height="12" />
              <rect x="88" y="68" width="6" height="6" />
              <rect x="38" y="80" width="8" height="12" />
              <rect x="52" y="76" width="8" height="6" />
              <rect x="64" y="84" width="14" height="8" />
              <rect x="84" y="86" width="8" height="8" />
            </svg>

            {/* Security Live Bar */}
            <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-primary text-white text-[11px] font-bold shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined text-xs animate-spin">sync</span>
              Diperbarui: <span>{countdown}s</span>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant mt-4 max-w-xs mx-auto leading-relaxed">
            Pindai di validator bus Trans Banyumas atau tunjukkan ke driver feeder mitra.
          </p>

          {/* Brightness Prompt Button */}
          <button
            onClick={() => setHighBrightness(!highBrightness)}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">brightness_high</span>
            {highBrightness
              ? 'Kecerahan Layar Maksimal (Aktif)'
              : 'Tingkatkan Kecerahan Layar Otomatis'}
          </button>
        </div>

        {/* Route Overview Strip */}
        <div className="bg-surface-container-low px-4 py-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-[11px]">
              1
            </span>
            <span className="font-bold text-on-surface">Margono</span>
          </div>
          <span className="material-symbols-outlined text-outline text-base">arrow_forward</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-[11px]">
              2
            </span>
            <span className="font-bold text-on-surface">Ps. Wage</span>
          </div>
          <span className="material-symbols-outlined text-outline text-base">arrow_forward</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-[11px]">
              3
            </span>
            <span className="font-bold text-on-surface">Stasiun PWT</span>
          </div>
        </div>
      </section>

      {/* Rincian Tarif Terpadu */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
          <h2 className="text-sm font-bold text-on-surface font-headline">Rincian Tarif Terpadu</h2>
          <span className="text-[10px] font-bold bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded">
            1 Tiket / 3 Moda
          </span>
        </div>

        {/* Segment Rows */}
        <div className="space-y-3 text-xs">
          {/* Leg 1: First-Mile */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base">two_wheeler</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">First-Mile Feeder (GoRide / GrabBike)</p>
                <p className="text-on-surface-variant">Jemput: Rumah → Halte RS Margono</p>
              </div>
            </div>
            <span className="font-bold text-on-surface">Rp 5.000</span>
          </div>

          {/* Leg 2: Trans Banyumas Bus */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base">directions_bus</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">Trans Banyumas Koridor 2</p>
                <p className="text-on-surface-variant">Halte RS Margono → Halte Pasar Wage</p>
              </div>
            </div>
            <span className="font-bold text-on-surface">Rp 3.500</span>
          </div>

          {/* Leg 3: Last-Mile Walk */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base">directions_walk</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">Last-Mile (Jalan Kaki)</p>
                <p className="text-on-surface-variant">Halte Pasar Wage → Stasiun Purwokerto</p>
              </div>
            </div>
            <span className="font-bold text-secondary">Gratis (Rp 0)</span>
          </div>

          {/* Service & Insurance */}
          <div className="flex items-start justify-between pt-1 border-t border-outline-variant/30 text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">health_and_safety</span>
              <span>Asuransi Jasa Raharja & Layanan MaaS</span>
            </div>
            <div className="text-right">
              <span className="line-through text-outline">Rp 500</span>
              <span className="text-[11px] font-bold text-secondary block">Promo MaaS (-Rp 500)</span>
            </div>
          </div>

          {/* Grand Total Breakdown Card */}
          <div className="pt-3 border-t-2 border-outline-variant/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">
                TOTAL TARIF TERINTEGRASI
              </span>
              <span className="text-xs text-secondary font-medium">
                Hemat Rp 2.500 dibanding tarif parsial
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-primary font-headline">
                Rp {ticket.totalFare.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pilihan Metode Pembayaran */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-sm font-bold text-on-surface font-headline">Metode Pembayaran</h2>
          <span className="text-xs text-primary font-bold">Ubah</span>
        </div>

        {/* QRIS */}
        <label
          onClick={() => setPaymentMethod('qris')}
          className={`relative flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
            paymentMethod === 'qris'
              ? 'border-primary bg-primary-fixed/20'
              : 'border-outline-variant/60 hover:bg-surface-container-low'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              checked={paymentMethod === 'qris'}
              onChange={() => setPaymentMethod('qris')}
              className="w-4 h-4 text-primary focus:ring-primary border-outline"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">QRIS Terpadu</span>
                <span className="px-1.5 py-0.5 rounded bg-primary text-white text-[10px] font-bold">
                  Utama
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant">
                Semua Bank / GoPay, OVO, Dana, ShopeePay
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-2xl">qr_code_2</span>
        </label>

        {/* Kartu Elektronik Tap NFC */}
        <label
          onClick={() => setPaymentMethod('nfc')}
          className={`relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
            paymentMethod === 'nfc'
              ? 'border-primary bg-primary-fixed/20'
              : 'border-outline-variant/60 hover:bg-surface-container-low'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              checked={paymentMethod === 'nfc'}
              onChange={() => setPaymentMethod('nfc')}
              className="w-4 h-4 text-primary focus:ring-primary border-outline"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Kartu Elektronik (Tap NFC)</span>
              <span className="text-[11px] text-on-surface-variant">
                e-Money Mandiri, BRI Brizzi, TapCash BNI
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-2xl">contactless</span>
        </label>

        {/* Saldo BanyumasPay */}
        <label
          onClick={() => setPaymentMethod('wallet')}
          className={`relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
            paymentMethod === 'wallet'
              ? 'border-primary bg-primary-fixed/20'
              : 'border-outline-variant/60 hover:bg-surface-container-low'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              checked={paymentMethod === 'wallet'}
              onChange={() => setPaymentMethod('wallet')}
              className="w-4 h-4 text-primary focus:ring-primary border-outline"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Saldo Banyumas Pay</span>
              <span className="text-[11px] text-on-surface-variant">
                Saldo Aktif:{' '}
                <strong className="text-on-surface font-bold">
                  Rp {walletBalance.toLocaleString('id-ID')}
                </strong>
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary text-2xl">
            account_balance_wallet
          </span>
        </label>
      </section>

      {/* Action Buttons Cluster */}
      <section className="space-y-2.5 pt-1">
        <button
          onClick={handleOpenMitra}
          type="button"
          className="w-full h-12 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">two_wheeler</span>
          <span>Buka Aplikasi Feeder Mitra (GoRide / Grab)</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onOpenDownloadModal}
            type="button"
            className="h-11 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low text-on-surface rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Unduh E-Tiket</span>
          </button>
          <button
            onClick={() => onNavigateTab('history')}
            type="button"
            className="h-11 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low text-on-surface rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">history</span>
            <span>Riwayat Perjalanan</span>
          </button>
        </div>
      </section>

      {/* Note Box */}
      <aside className="p-3 bg-surface-container rounded-xl border border-outline-variant/50 flex items-start gap-2.5">
        <span className="material-symbols-outlined text-on-surface-variant shrink-0 mt-0.5 text-lg">
          info
        </span>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Simulasi Pembayaran Terintegrasi untuk Demonstrasi Prototipe MaaS Banyumas. Tiket QR berlaku di seluruh koridor Trans Banyumas dan jaringan feeder bermitra.
        </p>
      </aside>
    </div>
  );
};
