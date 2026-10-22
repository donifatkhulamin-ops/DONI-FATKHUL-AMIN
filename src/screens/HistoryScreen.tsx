import React, { useState } from 'react';
import { HistoryTrip, TabType } from '../types.ts';
import { MOCK_HISTORY_TRIPS } from '../data/mockData.ts';

interface HistoryScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onRepeatTrip?: (origin: string, destination: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onNavigateTab,
  onRepeatTrip,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'multimodal' | 'bus' | 'october'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<HistoryTrip | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter trips
  const filteredTrips = MOCK_HISTORY_TRIPS.filter((trip) => {
    if (filterType === 'multimodal') {
      if (!trip.transportModes.includes('feeder')) return false;
    } else if (filterType === 'bus') {
      if (trip.transportModes.includes('feeder')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        trip.origin.toLowerCase().includes(q) ||
        trip.destination.toLowerCase().includes(q) ||
        trip.bookingCode.toLowerCase().includes(q) ||
        trip.date.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSpent = MOCK_HISTORY_TRIPS.reduce((sum, t) => sum + t.totalFare, 0);
  const totalSavings = MOCK_HISTORY_TRIPS.reduce((sum, t) => sum + (t.discountSaved || 0), 0);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Monthly Summary Statistics Banner */}
      <section className="bg-gradient-to-br from-primary to-primary-container text-white p-4 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-white select-none">
          <span className="material-symbols-outlined text-[120px]">history</span>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-primary-fixed uppercase tracking-wider block">
              REKAP MOBILITAS BANYUMAS
            </span>
            <h2 className="text-lg font-bold font-headline mt-0.5">Riwayat Perjalanan</h2>
          </div>
          <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
            {MOCK_HISTORY_TRIPS.length} Total Perjalanan
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-[10px] text-primary-fixed block font-medium">Total Ongkos Dibayar</span>
            <span className="text-base font-extrabold font-headline tabular-nums tracking-tight">
              Rp {totalSpent.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-[10px] text-secondary-fixed block font-medium">Hemat Subsidi & Promo</span>
            <span className="text-base font-extrabold text-secondary-fixed font-headline tabular-nums tracking-tight">
              Rp {totalSavings.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </section>

      {/* Search & Filter Strip */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-xl border border-outline-variant/50 shadow-2xs">
          <span className="material-symbols-outlined text-outline text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari rute, tujuan, atau kode tiket..."
            className="w-full bg-transparent border-none text-xs text-on-surface focus:outline-none placeholder:text-outline"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-outline hover:text-on-surface cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scroll-hide pb-0.5">
          {[
            { id: 'all', label: 'Semua Riwayat' },
            { id: 'multimodal', label: 'Multimoda (Feeder + Bus)' },
            { id: 'bus', label: 'Bus Saja' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterType === f.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trips List */}
      <section className="space-y-3">
        {filteredTrips.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-8 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <h4 className="font-bold text-sm text-on-surface">Tidak Ada Riwayat</h4>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
              Tidak ditemukan perjalanan yang cocok dengan pencarian Anda.
            </p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-3.5 shadow-xs hover:border-primary/60 transition-all space-y-2.5"
            >
              {/* Header: Date, Time & Status */}
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                  <span className="font-bold text-on-surface">{trip.date}</span>
                  <span className="text-outline-variant">•</span>
                  <span className="text-on-surface-variant text-[11px]">{trip.time}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Selesai
                </span>
              </div>

              {/* Route Origin & Destination */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1" />
                  <span className="text-on-surface-variant font-medium">Asal:</span>
                  <span className="font-bold text-on-surface truncate">{trip.origin}</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-error shrink-0 mt-1" />
                  <span className="text-on-surface-variant font-medium">Tujuan:</span>
                  <span className="font-bold text-on-surface truncate">{trip.destination}</span>
                </div>
              </div>

              {/* Corridors, Modes & Fare summary */}
              <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {trip.corridors.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded"
                    >
                      {c}
                    </span>
                  ))}
                  {trip.transportModes.includes('feeder') && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">two_wheeler</span>
                      Feeder
                    </span>
                  )}
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    {trip.durationMinutes} mnt • {trip.distanceKm} km
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-primary font-headline tabular-nums">
                    Rp {trip.totalFare.toLocaleString('id-ID')}
                  </span>
                  {trip.discountSaved && (
                    <span className="block text-[9px] text-secondary font-bold">
                      Hemat Rp {trip.discountSaved.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/20">
                <button
                  onClick={() => setSelectedTrip(trip)}
                  className="py-1.5 px-2 bg-surface-container text-primary hover:bg-surface-container-high rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">receipt</span>
                  <span>Rincian & Bukti</span>
                </button>
                <button
                  onClick={() => {
                    if (onRepeatTrip) {
                      onRepeatTrip(trip.origin, trip.destination);
                    } else {
                      onNavigateTab('rencana');
                    }
                  }}
                  className="py-1.5 px-2 bg-primary-fixed text-primary hover:bg-primary-fixed-dim rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">repeat</span>
                  <span>Pesan Lagi</span>
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Trip Details & Receipt Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl border border-outline-variant/60 shadow-2xl overflow-hidden animate-in fade-in duration-150">
            {/* Header */}
            <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between bg-primary text-white">
              <div>
                <span className="text-[10px] text-primary-fixed block font-bold uppercase tracking-wider">
                  BUKTI PERJALANAN RESMI
                </span>
                <h3 className="font-bold text-sm font-headline">Trans Banyumas MaaS</h3>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3.5 bg-surface-container-low max-h-[75vh] overflow-y-auto">
              {/* Receipt Body */}
              <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/40 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
                  <div>
                    <span className="text-[10px] text-outline block font-bold">KODE TIKET</span>
                    <span className="font-extrabold text-primary font-headline text-sm">
                      {selectedTrip.bookingCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedTrip.bookingCode)}
                    className="px-2 py-1 bg-surface-container rounded-md text-[11px] font-bold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    {copiedCode ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Waktu:</span>
                    <span className="font-bold text-on-surface">
                      {selectedTrip.date}, {selectedTrip.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Rute Asal:</span>
                    <span className="font-semibold text-on-surface">{selectedTrip.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Tujuan:</span>
                    <span className="font-semibold text-on-surface">{selectedTrip.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Total Jarak:</span>
                    <span className="font-semibold text-on-surface">{selectedTrip.distanceKm} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Waktu Tempuh:</span>
                    <span className="font-semibold text-on-surface">{selectedTrip.durationMinutes} menit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Metode Bayar:</span>
                    <span className="font-bold uppercase text-primary">
                      {selectedTrip.paymentMethod === 'qris'
                        ? 'QRIS Terpadu'
                        : selectedTrip.paymentMethod === 'wallet'
                        ? 'Saldo BanyumasPay'
                        : 'Kartu Tap NFC'}
                    </span>
                  </div>
                </div>

                {/* Segments Breakdown */}
                <div className="pt-2 border-t border-dashed border-outline-variant/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    RINCIAN TAHAPAN PERJALANAN
                  </span>
                  {selectedTrip.legs.map((leg, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between text-xs py-1 border-b border-outline-variant/20 last:border-none"
                    >
                      <div className="pr-2">
                        <p className="font-bold text-on-surface">{leg.title}</p>
                        <p className="text-[10px] text-on-surface-variant">{leg.description}</p>
                      </div>
                      <span className="font-bold tabular-nums text-on-surface shrink-0">
                        {leg.fare === 0 ? 'Gratis' : `Rp ${leg.fare.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-2 border-t-2 border-outline-variant/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-on-surface block">Total Biaya Perjalanan</span>
                    {selectedTrip.discountSaved && (
                      <span className="text-[10px] text-secondary font-bold">
                        Hemat Rp {selectedTrip.discountSaved.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <span className="text-base font-extrabold text-primary font-headline tabular-nums">
                    Rp {selectedTrip.totalFare.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    alert(`Bukti tiket ${selectedTrip.bookingCode} berhasil disimpan ke galeri ponsel.`);
                    setSelectedTrip(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-primary-container transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Unduh PDF</span>
                </button>
                <button
                  onClick={() => {
                    if (onRepeatTrip) {
                      onRepeatTrip(selectedTrip.origin, selectedTrip.destination);
                    } else {
                      onNavigateTab('rencana');
                    }
                    setSelectedTrip(null);
                  }}
                  className="py-2.5 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-surface-container transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">repeat</span>
                  <span>Pesan Lagi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
