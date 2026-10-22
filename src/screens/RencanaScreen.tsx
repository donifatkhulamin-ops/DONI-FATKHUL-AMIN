import React, { useState } from 'react';
import { TripRecommendation } from '../types.ts';
import { DEFAULT_RECOMMENDATIONS, POPULAR_LOCATIONS } from '../data/mockData.ts';
import { launchFeederApp } from '../utils/deepLinkHelper.ts';

interface RencanaScreenProps {
  initialOrigin?: string;
  initialDestination?: string;
  onSelectRoute: (rec: TripRecommendation) => void;
  onOpenTimePicker: () => void;
  departureTime: string;
}

export const RencanaScreen: React.FC<RencanaScreenProps> = ({
  initialOrigin = 'Jl. Raden Patah, Ledug',
  initialDestination = 'Stasiun Purwokerto',
  onSelectRoute,
  onOpenTimePicker,
  departureTime,
}) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [isSwapping, setIsSwapping] = useState(false);
  const [filterPreference, setFilterPreference] = useState<
    'all' | 'fastest' | 'cheapest' | 'transit' | 'accessible'
  >('cheapest');
  const [showLocationPickerFor, setShowLocationPickerFor] = useState<'origin' | 'dest' | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setTimeout(() => setIsSwapping(false), 200);
  };

  const handleOpenFeederApp = (provider: 'gojek' | 'grab', pickup: string, dropoff: string, fare: number) => {
    launchFeederApp({
      provider,
      serviceType: 'bike',
      pickupName: pickup,
      dropoffName: dropoff,
      estimatedFare: fare,
    });

    setToastMsg(`Membuka aplikasi ${provider === 'gojek' ? 'Gojek (GoRide)' : 'Grab (GrabBike)'}...`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filter recommendations based on chip
  const recommendations = [...DEFAULT_RECOMMENDATIONS].sort((a, b) => {
    if (filterPreference === 'fastest') {
      return a.durationMinutes - b.durationMinutes;
    }
    if (filterPreference === 'cheapest') {
      return a.totalCost - b.totalCost;
    }
    if (filterPreference === 'accessible') {
      return a.isBest ? -1 : 1;
    }
    return 0;
  });

  return (
    <div className="w-full max-w-screen-sm mx-auto flex flex-col flex-1 pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-secondary text-base">near_me</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Departure Time Selector Bar */}
      <div className="bg-surface-container-lowest px-4 py-2.5 border-b border-outline-variant/30 flex items-center justify-between shadow-xs">
        <div className="inline-flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full text-primary">
          <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
          <span className="text-xs font-bold font-headline">{departureTime}</span>
        </div>
        <button
          onClick={onOpenTimePicker}
          type="button"
          className="text-primary hover:text-primary-container text-xs font-bold flex items-center gap-0.5 cursor-pointer"
        >
          <span>Ubah Waktu</span>
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </button>
      </div>

      {/* Main Content Container */}
      <main className="px-4 py-3 space-y-4 flex-1">
        {/* Route Origin & Destination Input Card */}
        <section className="bg-surface-container-lowest p-3.5 rounded-2xl shadow-xs border border-outline-variant/50 relative">
          <div className="space-y-3">
            {/* Origin (Dari Mana) */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  trip_origin
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-on-surface-variant">
                    Titik Asal (Dari Mana)
                  </label>
                  <button
                    onClick={() => setOrigin('Lokasi GPS Saya Saat Ini')}
                    className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[12px]">my_location</span>
                    <span>GPS Saya</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  onFocus={() => setShowLocationPickerFor('origin')}
                  placeholder="Ketik alamat asal atau halte keberangkatan..."
                  className="w-full bg-transparent p-0 border-none text-sm font-semibold text-on-surface focus:outline-none truncate"
                />
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant/30 ml-11" />

            {/* Destination (Ke Mana) */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-error/15 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-error text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-bold text-on-surface-variant">
                  Titik Tujuan (Ke Mana)
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setShowLocationPickerFor('dest')}
                  placeholder="Ketik nama tempat atau halte tujuan..."
                  className="w-full bg-transparent p-0 border-none text-sm font-semibold text-on-surface focus:outline-none truncate"
                />
              </div>
            </div>
          </div>

          {/* Floating Swap Route Button */}
          <button
            onClick={handleSwap}
            type="button"
            aria-label="Tukar Posisi Asal dan Tujuan"
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant/60 shadow-md flex items-center justify-center text-primary hover:bg-surface-container active:scale-90 transition-transform cursor-pointer ${
              isSwapping ? 'rotate-180' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">swap_vert</span>
          </button>
        </section>

        {/* Quick Popular Location Chips (When input is tapped) */}
        {showLocationPickerFor && (
          <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/50 shadow-sm space-y-2 animate-in fade-in duration-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-on-surface">Pilih Cepat Landmark & Halte Populer:</span>
              <button
                onClick={() => setShowLocationPickerFor(null)}
                className="text-primary font-bold text-[11px] cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    if (showLocationPickerFor === 'origin') setOrigin(loc);
                    else setDestination(loc);
                    setShowLocationPickerFor(null);
                  }}
                  className="px-2.5 py-1 rounded-full text-xs bg-surface-container-low hover:bg-primary-fixed hover:text-primary transition-colors text-on-surface-variant font-medium cursor-pointer border border-outline-variant/30"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preference Filter Chips */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">
              OPSI RUTE DARI {origin.split(',')[0]} ➔ {destination.split(',')[0]}
            </span>
            <span className="text-[11px] font-bold text-secondary">
              {recommendations.length} Rekomendasi
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto custom-scroll-hide py-1">
            <button
              onClick={() => setFilterPreference('cheapest')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer ${
                filterPreference === 'cheapest'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/50'
              }`}
            >
              <span>Termurah</span>
              <span>💰</span>
            </button>

            <button
              onClick={() => setFilterPreference('fastest')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer ${
                filterPreference === 'fastest'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/50'
              }`}
            >
              <span>Paling Cepat</span>
              <span>⚡</span>
            </button>

            <button
              onClick={() => setFilterPreference('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer ${
                filterPreference === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/50'
              }`}
            >
              <span>Semua Moda</span>
            </button>
          </div>
        </section>

        {/* CARD 1: PRIMARY BEST MULTIMODAL ROUTE (FEEDEER + BUS + LAST-MILE) */}
        <section className="bg-surface-container-lowest rounded-2xl border-2 border-primary shadow-sm p-4 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-2.5 py-1 rounded-full text-[11px] font-bold mb-2.5">
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              recommend
            </span>
            <span>Rute Rekomendasi Terpadu MaaS</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-on-surface font-headline leading-snug">
            Feeder Ojek Online + Bus Trans Banyumas Koridor 2
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-on-surface-variant pb-3 border-b border-outline-variant/30 font-medium">
            <span className="flex items-center gap-1 font-bold text-primary">
              <span className="material-symbols-outlined text-[18px]">timer</span>
              32 Menit
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1 font-bold text-secondary">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              Rp 8.500 (Terpadu)
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">straighten</span>
              Jarak 7.8 km
            </span>
          </div>

          {/* Multimodal Timeline with Direct Gojek/Grab Action */}
          <div className="mt-4 space-y-4 relative">
            <div className="absolute left-[19px] top-3 bottom-4 w-0.5 bg-outline-variant/40 -z-0" />

            {/* Step 1: Feeder Gojek / Grab */}
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-xs border-2 border-surface-container-lowest">
                <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
              </div>
              <div className="flex-1 bg-surface-container-low/80 p-3 rounded-xl border border-outline-variant/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary">
                    First-Mile: Ojek Online Feeder ke Halte Bus
                  </span>
                  <span className="text-xs font-bold text-on-surface">Rp 5.000</span>
                </div>
                <p className="text-xs text-on-surface leading-tight">
                  {origin} ➔ Halte RS Margono Soekarjo
                </p>

                {/* Direct Deep Link Action Buttons to Gojek & Grab */}
                <div className="pt-1.5 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenFeederApp('gojek', origin, 'Halte RS Margono Soekarjo', 5000)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#00880C] hover:bg-[#00700A] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-white text-[#00880C] flex items-center justify-center text-[9px] font-extrabold">
                      G
                    </span>
                    <span>Buka Gojek</span>
                  </button>

                  <button
                    onClick={() => handleOpenFeederApp('grab', origin, 'Halte RS Margono Soekarjo', 5000)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#00B14F] hover:bg-[#009241] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-white text-[#00B14F] flex items-center justify-center text-[9px] font-extrabold">
                      Gr
                    </span>
                    <span>Buka Grab</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Transit Hub Node */}
            <div className="flex items-center gap-3 pl-1 relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest border-4 border-primary flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1 bg-surface-container px-3 py-1.5 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-primary font-bold tracking-wider uppercase">
                    TITIK TRANSIT HUB
                  </span>
                  <div className="text-xs font-bold text-on-surface">Halte RS Margono Soekarjo</div>
                </div>
                <div className="bg-surface-container-lowest px-2 py-0.5 rounded text-[11px] text-secondary font-bold flex items-center gap-1 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                  Tunggu Bus 4 mnt
                </div>
              </div>
            </div>

            {/* Step 2: Trans Banyumas Bus */}
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs border-2 border-surface-container-lowest">
                <span className="material-symbols-outlined text-[20px]">directions_bus</span>
              </div>
              <div className="flex-1 bg-surface-container-low/80 p-3 rounded-xl border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#ea580c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      K2
                    </span>
                    <span className="text-xs font-bold text-primary">Trans Banyumas Koridor 2</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface">Rp 3.500</span>
                </div>
                <p className="text-xs text-on-surface mt-1">Halte RS Margono menuju Halte Pasar Wage</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-on-surface-variant font-medium">
                  <span>5.6 km</span>
                  <span>•</span>
                  <span>18 menit perjalanan</span>
                  <span className="text-secondary font-semibold">AC Dingin</span>
                </div>
              </div>
            </div>

            {/* Step 3: Walking or Destination */}
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 shadow-xs border-2 border-surface-container-lowest">
                <span className="material-symbols-outlined text-[20px]">directions_walk</span>
              </div>
              <div className="flex-1 bg-surface-container-low/80 p-3 rounded-xl border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Jalan Kaki Menuju Tujuan</span>
                  <span className="text-xs text-secondary font-bold">Gratis (Rp 0)</span>
                </div>
                <p className="text-xs text-on-surface mt-1">
                  Menuju pintu masuk {destination} (150 meter)
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onSelectRoute(DEFAULT_RECOMMENDATIONS[0])}
            type="button"
            className="mt-4 w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span>Pilih Tiket Terpadu MaaS (Rp 8.500)</span>
          </button>
        </section>

        {/* CARD 2: DIRECT RIDE-HAILING (GOJEK / GRAB LANGSUNG) */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs p-3.5 space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  TERCEPAT ⚡
                </span>
                <span className="text-xs font-bold text-on-surface">Ojek Online Point-to-Point Langsung</span>
              </div>
              <p className="text-xs text-on-surface-variant">Dari {origin.split(',')[0]} langsung ke {destination.split(',')[0]}</p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-on-surface font-headline">Rp 16.000 - 18.000</span>
              <span className="block text-[10px] text-on-surface-variant font-medium">Estimasi 18-22 mnt</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleOpenFeederApp('gojek', origin, destination, 18000)}
              className="py-2.5 px-3 rounded-xl bg-[#00880C] hover:bg-[#00700A] text-white flex items-center justify-center gap-2 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-white text-[#00880C] flex items-center justify-center text-[10px] font-extrabold">
                G
              </div>
              <span>Buka di Gojek</span>
            </button>

            <button
              onClick={() => handleOpenFeederApp('grab', origin, destination, 18000)}
              className="py-2.5 px-3 rounded-xl bg-[#00B14F] hover:bg-[#009241] text-white flex items-center justify-center gap-2 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-white text-[#00B14F] flex items-center justify-center text-[10px] font-extrabold">
                Gr
              </div>
              <span>Buka di Grab</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
