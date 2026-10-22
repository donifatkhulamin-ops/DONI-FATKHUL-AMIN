import React from 'react';
import { TabType } from '../types.ts';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasActiveTicket?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  hasActiveTicket = true,
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'rencana', label: 'Rencana', icon: 'route' },
    { id: 'tracking', label: 'Tracking', icon: 'directions_bus' },
    { id: 'tiket', label: 'Tiket', icon: 'qr_code_scanner' },
    { id: 'antarmoda', label: 'Antar Moda', icon: 'alt_route' },
    { id: 'history', label: 'Riwayat', icon: 'history' },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center w-full max-w-screen-sm mx-auto px-2 py-2 safe-area-inset-bottom bg-surface-container-lowest border-t border-outline-variant/30 shadow-[0_-2px_6px_rgba(15,23,42,0.06)]"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
            className={`relative flex flex-col items-center justify-center px-2 sm:px-2.5 py-1 transition-all duration-150 active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-primary-fixed text-on-primary-fixed rounded-full font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px] sm:text-[22px]"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold mt-0.5 tracking-tight whitespace-nowrap">
              {tab.label}
            </span>

            {/* Badge for active ticket on Tiket tab */}
            {tab.id === 'tiket' && hasActiveTicket && !isActive && (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-secondary animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
