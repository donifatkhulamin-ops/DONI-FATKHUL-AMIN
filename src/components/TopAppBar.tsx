import React from 'react';
import { TabType } from '../types.ts';

interface TopAppBarProps {
  activeTab: TabType;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onRefresh?: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  onOpenAuth: () => void;
  userName?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  title,
  subtitle,
  onBack,
  onRefresh,
  onOpenNotifications,
  unreadCount = 2,
  onOpenAuth,
  userName,
}) => {
  // If in Rencana tab with custom back
  if (activeTab === 'rencana') {
    return (
      <header className="sticky top-0 z-40 bg-surface-container-lowest shadow-sm px-4 py-3 border-b border-outline-variant/30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container active:scale-95 transition-transform text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-[22px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-[17px] leading-tight text-primary tracking-tight font-bold font-headline">
                {title || 'Rencanakan Perjalanan'}
              </h1>
              <p className="text-xs text-on-surface-variant font-medium">
                {subtitle || 'Trans Banyumas Integrated MaaS'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onRefresh}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-transform cursor-pointer"
              title="Reset Formulir"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
            </button>
            <button
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-transform cursor-pointer"
              title="Notifikasi"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-surface-container-lowest"></span>
              )}
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Dashboard / Tracking / Tiket / Antar Moda layout
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center w-full px-4 py-3 bg-surface-container-lowest shadow-sm border-b border-outline-variant/20">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenAuth}
          aria-label="Akun Pengguna"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 transition-transform text-primary bg-primary-fixed/40 cursor-pointer"
          type="button"
          title="Profil & Masuk Akun"
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            location_on
          </span>
        </button>
        <div>
          <h1 className="text-[18px] leading-tight text-primary font-bold tracking-tight font-headline">
            Trans Banyumas
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse"></span>
            <span className="text-[11px] font-semibold text-on-surface-variant">
              {activeTab === 'tracking'
                ? 'Sistem Aktif Purwokerto'
                : activeTab === 'tiket'
                ? 'Tiket & Pembayaran Terpadu'
                : activeTab === 'antarmoda'
                ? 'Integrasi Feeder Banyumas'
                : activeTab === 'history'
                ? 'Rekap Perjalanan & Transaksi'
                : 'Purwokerto Timur'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onRefresh && (
          <button
            onClick={onRefresh}
            aria-label="Refresh Data GPS"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 transition-transform text-on-surface-variant cursor-pointer"
            type="button"
            title="Refresh GPS"
          >
            <span className="material-symbols-outlined text-[20px]">sync</span>
          </button>
        )}
        <button
          onClick={onOpenNotifications}
          aria-label="Pemberitahuan"
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 transition-transform text-on-surface-variant cursor-pointer"
          type="button"
          title="Notifikasi"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-surface-container-lowest"></span>
          )}
        </button>
        <button
          onClick={onOpenAuth}
          className="ml-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary text-white hover:bg-primary-container transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
          title="Buka Halaman Login / Ganti Akun"
        >
          <span className="material-symbols-outlined text-[15px]">account_circle</span>
          <span className="max-w-[85px] truncate">
            {userName ? userName.split(' ')[0] : 'Masuk'}
          </span>
        </button>
      </div>
    </header>
  );
};
