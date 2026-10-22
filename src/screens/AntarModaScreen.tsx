import React, { useState } from 'react';
import { BUS_STOPS } from '../data/mockData.ts';
import { TabType } from '../types.ts';
import { launchFeederApp } from '../utils/deepLinkHelper.ts';

interface AntarModaScreenProps {
  onNavigateTab: (tab: TabType) => void;
  preselectedStop?: string;
}

export const AntarModaScreen: React.FC<AntarModaScreenProps> = ({
  onNavigateTab,
  preselectedStop = 'Halte Alun-Alun Purwokerto',
}) => {
  const [selectedHub, setSelectedHub] = useState<string>(preselectedStop);
  const [partner, setPartner] = useState<'goride' | 'grabbike' | 'angkot'>('goride');
  const [tripType, setTripType] = useState<'first_mile' | 'last_mile'>('first_mile');
  const [pickupAddress, setPickupAddress] = useState('Rumah (Jl. Raden Patah, Ledug)');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'searching' | 'matched'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const partners = [
    {
      id: 'goride',
      name: 'GoRide (Gojek)',
      brand: 'Gojek Official MaaS',
      eta: '2-4 Menit',
      fare: 5000,
      icon: 'two_wheeler',
      color: '#00880C',
      readyCount: 14,
    },
    {
      id: 'grabbike',
      name: 'GrabBike',
      brand: 'Grab Official MaaS',
      eta: '3-5 Menit',
      fare: 5000,
      icon: 'two_wheeler',
      color: '#00B14F',
      readyCount: 11,
    },
    {
      id: 'angkot',
      name: 'Angkot Feeder Kobamas',
      brand: 'Koperasi Angkutan Banyumas',
      eta: '5-7 Menit',
      fare: 4000,
      icon: 'airport_shuttle',
      color: '#1e40af',
      readyCount: 5,
    },
  ];

  const handleLaunchDirectApp = (provider: 'gojek' | 'grab') => {
    const pickup = tripType === 'first_mile' ? pickupAddress : selectedHub;
    const dropoff = tripType === 'first_mile' ? selectedHub : pickupAddress;

    launchFeederApp({
      provider,
      serviceType: 'bike',
      pickupName: pickup,
      dropoffName: dropoff,
      estimatedFare: 5000,
    });

    setToastMessage(`Membuka aplikasi ${provider === 'gojek' ? 'Gojek' : 'Grab'}...`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOrderFeeder = () => {
    if (partner === 'goride') {
      handleLaunchDirectApp('gojek');
    } else if (partner === 'grabbike') {
      handleLaunchDirectApp('grab');
    }

    setBookingStatus('searching');
    setTimeout(() => {
      setBookingStatus('matched');
    }, 1200);
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-secondary text-base">near_me</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner Hub */}
      <section className="bg-gradient-to-r from-secondary to-[#004d34] text-white p-4 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
            <span className="material-symbols-outlined text-sm">alt_route</span>
            <span>Jaringan Angkutan Pengumpan Banyumas</span>
          </div>
          <span className="text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full">
            Integrasi Gojek & Grab
          </span>
        </div>
        <h2 className="text-base font-bold font-headline">Feeder First-Mile & Last-Mile Terpadu</h2>
        <p className="text-xs text-white/90 leading-relaxed">
          Koneksikan titik penjemputan ke halte Trans Banyumas terdekat. Sekali klik langsung membuka aplikasi Gojek atau Grab di perangkat Anda.
        </p>
      </section>

      {/* Booking Form Card */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
          <h3 className="font-bold text-sm text-on-surface font-headline">Pesan Feeder Penghubung</h3>
          <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
            Subsidi MaaS Rp 2.500
          </span>
        </div>

        {/* Direction Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-xl">
          <button
            onClick={() => setTripType('first_mile')}
            type="button"
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tripType === 'first_mile'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Rumah ➔ Halte Bus
          </button>
          <button
            onClick={() => setTripType('last_mile')}
            type="button"
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tripType === 'last_mile'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Halte Bus ➔ Tujuan
          </button>
        </div>

        {/* Selected Hub Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
            Titik Halte Transit Trans Banyumas
          </label>
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs font-bold text-on-surface focus:outline-none focus:border-primary"
          >
            {BUS_STOPS.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.isHub ? 'Hub Utama' : s.platform})
              </option>
            ))}
          </select>
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
            {tripType === 'first_mile' ? 'Alamat Penjemputan Anda' : 'Alamat Pengantaran Terakhir'}
          </label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-low">
            <span className="material-symbols-outlined text-secondary text-base">my_location</span>
            <input
              type="text"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-semibold text-on-surface focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Direct 1-Tap Open Buttons */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-[11px] font-bold text-on-surface-variant">
            Akses Langsung ke Aplikasi Resmi:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleLaunchDirectApp('gojek')}
              type="button"
              className="py-2.5 px-3 rounded-xl bg-[#00880C] hover:bg-[#00700A] text-white flex items-center justify-center gap-2 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-white text-[#00880C] flex items-center justify-center text-[10px] font-extrabold">
                G
              </div>
              <span>Buka di Gojek</span>
            </button>

            <button
              onClick={() => handleLaunchDirectApp('grab')}
              type="button"
              className="py-2.5 px-3 rounded-xl bg-[#00B14F] hover:bg-[#009241] text-white flex items-center justify-center gap-2 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-white text-[#00B14F] flex items-center justify-center text-[10px] font-extrabold">
                Gr
              </div>
              <span>Buka di Grab</span>
            </button>
          </div>
        </div>

        {/* Partner Selection */}
        <div className="pt-1">
          <label className="block text-[11px] font-bold text-on-surface-variant mb-1.5">
            Pilihan Mitra Transportasi Pengumpan:
          </label>
          <div className="space-y-2">
            {partners.map((p) => (
              <label
                key={p.id}
                onClick={() => setPartner(p.id as any)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  partner === p.id
                    ? 'border-primary bg-primary-fixed/20 shadow-xs ring-1 ring-primary'
                    : 'border-outline-variant/40 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-2xs"
                    style={{ backgroundColor: p.color }}
                  >
                    <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-on-surface">{p.name}</span>
                      <span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 rounded font-semibold">
                        {p.readyCount} Siap
                      </span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant block">{p.brand} • {p.eta}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-on-surface font-headline">
                    Rp {p.fare.toLocaleString('id-ID')}
                  </span>
                  <span className="block text-[9px] text-secondary font-bold">Tarif Terpadu</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Booking State Output */}
        {bookingStatus === 'matched' ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Mitra Feeder Terhubung & Aplikasi Dibuka!
              </span>
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                2 Mnt Menuju Lokasi
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                S
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-on-surface">Pak Slamet Riyadi</p>
                <p className="text-[11px] text-on-surface-variant">Honda Vario 125 • Plat R 4821 AA</p>
              </div>
              <button
                onClick={() => alert('Menghubungi driver via WhatsApp / Telepon...')}
                className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Hubungi
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleOrderFeeder}
            disabled={bookingStatus === 'searching'}
            type="button"
            className="w-full py-3 bg-secondary hover:bg-opacity-95 text-on-secondary rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {bookingStatus === 'searching' ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                <span>Menghubungkan ke Aplikasi Mitra di {selectedHub}...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">two_wheeler</span>
                <span>Pesan Feeder Terpadu & Buka Aplikasi (Rp 5.000)</span>
              </>
            )}
          </button>
        )}
      </section>

      {/* Transit Hub Status Directory */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-4 shadow-xs space-y-2.5">
        <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider font-headline">
          Ketersediaan Armada Ojol di Halte Transit
        </h4>
        <div className="space-y-2">
          {BUS_STOPS.filter((s) => s.isHub).map((hub) => (
            <div
              key={hub.id}
              onClick={() => setSelectedHub(hub.name)}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                selectedHub === hub.name
                  ? 'border-secondary bg-secondary-container/20 ring-1 ring-secondary'
                  : 'border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div>
                <p className="font-bold text-on-surface">{hub.name}</p>
                <p className="text-[10px] text-on-surface-variant">
                  {hub.distanceToUser} dari posisi Anda • {hub.platform}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-secondary">
                  {hub.feederCount} Armada Siaga
                </span>
                <span className="block text-[9px] text-outline font-medium">Gojek & Grab</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
