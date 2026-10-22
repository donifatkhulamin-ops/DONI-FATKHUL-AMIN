import React, { useState } from 'react';
import { TabType } from '../types.ts';
import { RealLeafletMap } from '../components/RealLeafletMap.tsx';
import { TransitNetworkMap } from '../components/TransitNetworkMap.tsx';
import {
  OFFICIAL_BANYUMAS_CORRIDORS,
  DetailedCorridorRoute,
} from '../data/banyumasRoutes.ts';
import { REAL_BANYUMAS_STOPS, GeographicStop, RealTimeGeoBus } from '../data/realMapRoutes.ts';
import { launchFeederApp } from '../utils/deepLinkHelper.ts';

interface TrackingScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onBookFeederAtStop: (stopName: string) => void;
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  onNavigateTab,
  onBookFeederAtStop,
}) => {
  const [activeCorridorId, setActiveCorridorId] = useState<string>('all');
  const [mapMode, setMapMode] = useState<'real_leaflet' | 'schematic_svg' | 'official_pdf' | 'schedule_list'>('real_leaflet');
  const [selectedStationName, setSelectedStationName] = useState<string>('Alun-Alun Pwt (Rita SuperMall)');
  const [showTarifModal, setShowTarifModal] = useState<boolean>(false);
  const [pdfZoom, setPdfZoom] = useState<number>(1);
  const [isPdfFullscreen, setIsPdfFullscreen] = useState<boolean>(false);
  const [feederToast, setFeederToast] = useState<string | null>(null);

  const handleLaunchFeeder = (provider: 'gojek' | 'grab', destinationStop: string) => {
    launchFeederApp({
      provider,
      serviceType: 'bike',
      pickupName: 'Lokasi Anda Saat Ini',
      pickupLat: -7.4278,
      pickupLng: 109.2275,
      dropoffName: destinationStop,
      estimatedFare: provider === 'gojek' ? 7000 : 7500,
    });

    setFeederToast(`Membuka aplikasi ${provider === 'gojek' ? 'Gojek' : 'Grab'}...`);
    setTimeout(() => setFeederToast(null), 3500);

    onBookFeederAtStop(destinationStop);
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto flex flex-col flex-1 pb-32">
      {/* Toast Feedback */}
      {feederToast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-secondary text-base">near_me</span>
          <span>{feederToast}</span>
        </div>
      )}

      {/* 4-Way Segmented Map Mode Switcher */}
      <div className="bg-surface-container-lowest px-4 pt-2.5 pb-2 border-b border-outline-variant/30 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl w-full overflow-x-auto custom-scroll-hide">
          <button
            onClick={() => setMapMode('real_leaflet')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              mapMode === 'real_leaflet'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">pin_drop</span>
            <span>Peta Jalan Nyata</span>
          </button>

          <button
            onClick={() => setMapMode('schematic_svg')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              mapMode === 'schematic_svg'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">radar</span>
            <span>Skematik Live</span>
          </button>

          <button
            onClick={() => setMapMode('official_pdf')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              mapMode === 'official_pdf'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>Peta Resmi PDF</span>
          </button>

          <button
            onClick={() => setMapMode('schedule_list')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              mapMode === 'schedule_list'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Jadwal & Armada</span>
          </button>
        </div>

        {/* Quick Info & Tarif Bar */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-outline-variant/20 text-xs">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse" />
            <span className="font-semibold text-[11px]">
              {mapMode === 'real_leaflet'
                ? 'Peta Jalan Riil Banyumas (OpenStreetMap GPS)'
                : 'Sistem Aktif PT Banyumas Raya Transportasi'}
            </span>
          </div>
          <button
            onClick={() => setShowTarifModal(true)}
            className="text-[11px] font-bold text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">info</span>
            <span>Tarif & Aturan</span>
          </button>
        </div>
      </div>

      {/* MODE 1: REAL LEAFLET GEOGRAPHIC MAP WITH REAL ROAD ROUTES & LIVE BUSES */}
      {mapMode === 'real_leaflet' && (
        <div className="p-3 space-y-3 animate-in fade-in duration-200">
          <RealLeafletMap
            selectedCorridorId={activeCorridorId}
            onSelectCorridor={(id) => setActiveCorridorId(id)}
            onSelectStop={(stop) => setSelectedStationName(stop.name)}
            onBookFeeder={(stopName, provider) => handleLaunchFeeder(provider, stopName)}
          />

          {/* Quick Hub Station Selector */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                TITIK TRANSIT POPULER BANYUMAS:
              </span>
              <span className="text-[11px] text-primary font-bold">Pilih & Pesan Ojol</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REAL_BANYUMAS_STOPS.slice(0, 6).map((stop) => {
                const isSelected = selectedStationName === stop.name;
                return (
                  <div
                    key={stop.id}
                    className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary-fixed/20 shadow-xs ring-1 ring-primary'
                        : 'border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-container-low'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-primary block truncate">
                        {stop.corridorIds.map((c) => c.toUpperCase()).join(', ')}
                      </span>
                      <p className="text-xs font-bold text-on-surface truncate leading-snug">
                        {stop.name.split('(')[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                      <button
                        onClick={() => handleLaunchFeeder('gojek', stop.name)}
                        className="flex-1 py-1 rounded bg-[#00880C] hover:bg-[#00700A] text-white text-[9px] font-bold flex items-center justify-center gap-0.5 active:scale-95 transition-all cursor-pointer"
                        title="Buka Aplikasi Gojek"
                      >
                        <span>Gojek</span>
                      </button>
                      <button
                        onClick={() => handleLaunchFeeder('grab', stop.name)}
                        className="flex-1 py-1 rounded bg-[#00B14F] hover:bg-[#009241] text-white text-[9px] font-bold flex items-center justify-center gap-0.5 active:scale-95 transition-all cursor-pointer"
                        title="Buka Aplikasi Grab"
                      >
                        <span>Grab</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: SCHEMATIC RADAR MAP */}
      {mapMode === 'schematic_svg' && (
        <div className="p-3 space-y-3 animate-in fade-in duration-200">
          <TransitNetworkMap
            selectedCorridorId={activeCorridorId}
            onSelectCorridor={(id) => setActiveCorridorId(id)}
            onSelectStop={(stopName) => setSelectedStationName(stopName)}
            onBookFeederAtStop={(stopName) => handleLaunchFeeder('gojek', stopName)}
            onNavigateToRute={() => onNavigateTab('rencana')}
          />
        </div>
      )}

      {/* MODE 3: OFFICIAL HD PDF / INFOGRAPHIC MAP */}
      {mapMode === 'official_pdf' && (
        <div className="p-3 space-y-3 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface font-headline">
                  Peta Jaringan Transportasi Banyumas Resmi
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Edisi Resmi 2026 • Transportasi untuk Banyumas Raya
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <a
                  href="/assets/aistudio/Transit_Network_Map_of_Banyumas_afe98846.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-primary-container transition-all"
                  title="Unduh / Buka Dokumen Asli PDF"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>Unduh PDF</span>
                </a>
                <button
                  onClick={() => setIsPdfFullscreen(!isPdfFullscreen)}
                  className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high cursor-pointer"
                  title="Perbesar Layar"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPdfFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                  </span>
                </button>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center justify-between bg-surface-container-low px-3 py-1.5 rounded-xl text-xs">
              <span className="text-on-surface-variant font-medium">Zoom Gambar: {Math.round(pdfZoom * 100)}%</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPdfZoom((z) => Math.min(2.5, z + 0.25))}
                  className="w-7 h-7 rounded-lg bg-surface-container-lowest font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
                >
                  +
                </button>
                <button
                  onClick={() => setPdfZoom((z) => Math.max(0.75, z - 0.25))}
                  className="w-7 h-7 rounded-lg bg-surface-container-lowest font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
                >
                  -
                </button>
                <button
                  onClick={() => setPdfZoom(1)}
                  className="px-2 h-7 rounded-lg bg-surface-container-lowest font-bold text-[11px] flex items-center justify-center shadow-xs cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* High-Resolution Map Image Canvas */}
            <div
              className={`w-full overflow-auto rounded-xl border border-outline-variant/60 bg-slate-900 flex items-center justify-center relative ${
                isPdfFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black/90 p-4' : 'min-h-[480px] max-h-[560px]'
              }`}
            >
              {isPdfFullscreen && (
                <button
                  onClick={() => setIsPdfFullscreen(false)}
                  className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              )}
              <img
                src="/assets/aistudio/banyumas_transit_map_official.png"
                alt="Peta Jaringan Transportasi Banyumas Resmi PDF"
                className="transition-transform duration-200 select-none max-w-none"
                style={{ transform: `scale(${pdfZoom})`, transformOrigin: 'top center' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: TIMETABLE & ARMADA */}
      {mapMode === 'schedule_list' && (
        <div className="p-3 space-y-3 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface font-headline">
                  Jadwal & Profil 6 Koridor Banyumas
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Trans Banyumas & Trans Jateng Aglomerasi
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full">
                6 Koridor Beroperasi
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {OFFICIAL_BANYUMAS_CORRIDORS.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-outline-variant/50 overflow-hidden bg-surface-container-low space-y-2 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: c.color }}
                        className="w-8 h-8 rounded-lg text-white font-bold flex items-center justify-center text-xs shadow-xs"
                      >
                        K{c.code}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-on-surface leading-tight">
                          {c.name}
                        </h4>
                        <span className="text-[11px] text-on-surface-variant font-medium">
                          {c.operatingHours} • Headway ~{c.frequencyMinutes} menit
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-primary">
                      Rp {c.fareGeneral.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => {
                        setActiveCorridorId(c.id);
                        setMapMode('real_leaflet');
                      }}
                      className="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Lacak di Peta Nyata
                    </button>
                    <button
                      onClick={() => onNavigateTab('rencana')}
                      className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      Rencanakan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official Tarif & Regulations Modal (Grounded from PDF) */}
      {showTarifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl border border-outline-variant/60 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-4 py-3 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">policy</span>
                <h3 className="font-bold text-sm font-headline">Informasi Tarif & Aturan Resmi</h3>
              </div>
              <button
                onClick={() => setShowTarifModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase block">
                    Trans Banyumas (K1, 2, 3A, 3B, 4)
                  </span>
                  <p className="text-base font-extrabold text-blue-900">Rp 3.900</p>
                  <p className="text-[11px] text-blue-700">Tarif Umum / Penumpang</p>
                  <div className="pt-1 border-t border-blue-200 text-[10px] text-blue-800 font-semibold">
                    Tarif Khusus: <span className="font-bold">Rp 2.000</span> (Pelajar/Mhs/Lansia/Disabilitas)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Trans Jateng (B1 Bukateja)
                  </span>
                  <p className="text-base font-extrabold text-emerald-900">Rp 5.000</p>
                  <p className="text-[11px] text-emerald-700">Tarif Umum Aglomerasi</p>
                  <div className="pt-1 border-t border-emerald-200 text-[10px] text-emerald-800 font-semibold">
                    Tarif Khusus: <span className="font-bold">Rp 1.000</span> (Pelajar/Buruh/Veteran)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1 text-xs">
                <span className="font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  Ketentuan Penting Dishub:
                </span>
                <p>• <strong>Mulai 04 Mei 2026</strong>, transit gratis sudah TIDAK BERLAKU.</p>
                <p>• Perpindahan antara Trans Banyumas dan Trans Jateng dikenakan biaya masing-masing.</p>
                <p>• Barang bawaan dengan ukuran di atas <strong>50 x 30 x 30 cm</strong> dikenakan tarif umum.</p>
              </div>
            </div>

            <div className="p-3 border-t border-outline-variant/30 flex justify-end bg-surface-container-low">
              <button
                onClick={() => setShowTarifModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-container transition-colors cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
