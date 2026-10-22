import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  REAL_BANYUMAS_CORRIDORS,
  REAL_BANYUMAS_STOPS,
  INITIAL_REAL_BUSES,
  GeographicStop,
  RealTimeGeoBus,
  interpolateGeoPath,
} from '../data/realMapRoutes.ts';
import { launchFeederApp } from '../utils/deepLinkHelper.ts';

interface RealLeafletMapProps {
  selectedCorridorId?: string;
  onSelectCorridor?: (id: string) => void;
  onSelectStop?: (stop: GeographicStop) => void;
  onSelectBus?: (bus: RealTimeGeoBus) => void;
  onBookFeeder?: (halteName: string, provider: 'gojek' | 'grab') => void;
}

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({
  selectedCorridorId = 'all',
  onSelectCorridor,
  onSelectStop,
  onSelectBus,
  onBookFeeder,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const polylinesRef = useRef<Map<string, L.Polyline>>(new Map());

  const [activeCorridor, setActiveCorridor] = useState<string>(selectedCorridorId);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [buses, setBuses] = useState<RealTimeGeoBus[]>(INITIAL_REAL_BUSES);
  const [selectedBus, setSelectedBus] = useState<RealTimeGeoBus | null>(null);
  const [selectedStop, setSelectedStop] = useState<GeographicStop | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    setActiveCorridor(selectedCorridorId);
  }, [selectedCorridorId]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center: Purwokerto Kota (Alun-Alun / Stasiun)
    const map = L.map(mapContainerRef.current, {
      center: [-7.4244, 109.2304],
      zoom: 13,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // Base Tile Layer (CartoDB Positron for clean streets or Esri for satellite)
    const tileUrl =
      mapType === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const attribution =
      mapType === 'satellite'
        ? '&copy; Esri &mdash; Banyumas Satellite'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Add User Location Pin
    const userIcon = L.divIcon({
      className: 'user-geo-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
          <div style="position: absolute; width: 28px; height: 28px; background: rgba(59, 130, 246, 0.35); border-radius: 9999px; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 14px; height: 14px; background: #2563eb; border: 2.5px solid #ffffff; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([-7.4278, 109.2275], { icon: userIcon })
      .addTo(map)
      .bindTooltip('Lokasi Anda (Purwokerto)', { permanent: false, direction: 'top' });

    // Draw Real Road Polylines for each corridor
    REAL_BANYUMAS_CORRIDORS.forEach((c) => {
      const isVisible = activeCorridor === 'all' || activeCorridor === c.id;
      const polyline = L.polyline(c.pathCoordinates, {
        color: c.color,
        weight: isVisible ? 6 : 2.5,
        opacity: isVisible ? 0.9 : 0.2,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      polyline.on('click', () => {
        setActiveCorridor(c.id);
        if (onSelectCorridor) onSelectCorridor(c.id);
      });

      polylinesRef.current.set(c.id, polyline);
    });

    // Add Stop / Halte Markers
    REAL_BANYUMAS_STOPS.forEach((stop) => {
      const isMatching =
        activeCorridor === 'all' || stop.corridorIds.includes(activeCorridor);

      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              width: ${stop.isHub ? '22px' : '16px'};
              height: ${stop.isHub ? '22px' : '16px'};
              background: ${stop.isHub ? '#00288e' : '#ffffff'};
              border: 3px solid ${stop.isHub ? '#ffffff' : '#00288e'};
              border-radius: ${stop.isHub ? '6px' : '9999px'};
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.2s ease;
            ">
              ${stop.isHub ? '<span style="color:#ffffff; font-size:10px; font-weight:800;">H</span>' : '<span style="width:5px; height:5px; background:#00288e; border-radius:9999px;"></span>'}
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([stop.lat, stop.lng], {
        icon: stopIcon,
        opacity: isMatching ? 1 : 0.35,
      }).addTo(map);

      marker.on('click', () => {
        setSelectedStop(stop);
        setSelectedBus(null);
        if (onSelectStop) onSelectStop(stop);
        map.panTo([stop.lat, stop.lng], { animate: true, duration: 0.6 });
      });

      marker.bindTooltip(stop.name, {
        direction: 'top',
        offset: [0, -10],
        className: 'banyumas-map-tooltip',
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapType]);

  // Update Polyline Visibility when corridor filter changes
  useEffect(() => {
    polylinesRef.current.forEach((polyline, cid) => {
      const isVisible = activeCorridor === 'all' || activeCorridor === cid;
      polyline.setStyle({
        weight: isVisible ? (activeCorridor === cid ? 7 : 5) : 2,
        opacity: isVisible ? 0.95 : 0.15,
      });
    });
  }, [activeCorridor]);

  // Real-Time Bus Movement Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          const corridor = REAL_BANYUMAS_CORRIDORS.find((c) => c.id === bus.corridorId);
          if (!corridor) return bus;

          const step = 0.015; // smooth increment along path
          let newProg = bus.progressAlongPath;
          let newDir = bus.direction;

          if (newDir === 'forward') {
            newProg += step;
            if (newProg >= 1) {
              if (corridor.id === 'k3a' || corridor.id === 'k3b') {
                newProg = 0; // loop
              } else {
                newProg = 1;
                newDir = 'backward';
              }
            }
          } else {
            newProg -= step;
            if (newProg <= 0) {
              newProg = 0;
              newDir = 'forward';
            }
          }

          // Interpolate GPS coordinate on real road path
          const { lat, lng } = interpolateGeoPath(corridor.pathCoordinates, newProg);

          return {
            ...bus,
            lat,
            lng,
            progressAlongPath: newProg,
            direction: newDir,
            speedKmH: Math.floor(28 + Math.random() * 14),
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Sync Moving Bus Markers with Leaflet Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    buses.forEach((bus) => {
      const isVisible = activeCorridor === 'all' || activeCorridor === bus.corridorId;
      const corridor = REAL_BANYUMAS_CORRIDORS.find((c) => c.id === bus.corridorId);
      const color = corridor?.color || '#00288e';

      const busHtml = `
        <div style="position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
          <div style="
            position: absolute;
            width: 38px;
            height: 38px;
            background: ${color};
            opacity: 0.3;
            border-radius: 9999px;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            background: ${color};
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 3px 6px;
            border-radius: 6px;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 3px;
          ">
            <span>🚌</span>
            <span>${bus.code}</span>
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        className: 'real-bus-marker',
        html: busHtml,
        iconSize: [44, 28],
        iconAnchor: [22, 14],
      });

      let marker = busMarkersRef.current.get(bus.id);
      if (!marker) {
        marker = L.marker([bus.lat, bus.lng], { icon: busIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedBus(bus);
          setSelectedStop(null);
          if (onSelectBus) onSelectBus(bus);
          map.panTo([bus.lat, bus.lng], { animate: true });
        });
        busMarkersRef.current.set(bus.id, marker);
      } else {
        marker.setLatLng([bus.lat, bus.lng]);
        marker.setIcon(busIcon);
        marker.setOpacity(isVisible ? 1 : 0.15);
      }
    });
  }, [buses, activeCorridor]);

  // Handler for 1-Tap Gojek & Grab launching
  const handleLaunchFeeder = (provider: 'gojek' | 'grab', destinationStop: string) => {
    const result = launchFeederApp({
      provider,
      serviceType: 'bike',
      pickupName: 'Lokasi Anda Saat Ini',
      pickupLat: -7.4278,
      pickupLng: 109.2275,
      dropoffName: destinationStop,
      estimatedFare: provider === 'gojek' ? 7000 : 7500,
    });

    setFeedbackToast(`Membuka aplikasi ${provider === 'gojek' ? 'Gojek (GoRide)' : 'Grab (GrabBike)'}...`);
    setTimeout(() => setFeedbackToast(null), 3500);

    if (onBookFeeder) {
      onBookFeeder(destinationStop, provider);
    }
  };

  const handleCenterUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-7.4278, 109.2275], 14, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[580px] rounded-2xl overflow-hidden border border-outline-variant/60 shadow-md flex flex-col bg-slate-100">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-secondary text-base">near_me</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Filter & Map Controls Ribbon */}
      <div className="absolute top-3 left-3 right-3 z-[999] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Corridor Quick Filter */}
        <div className="flex items-center gap-1 bg-surface-container-lowest/95 backdrop-blur-md p-1.5 rounded-xl border border-outline-variant/60 shadow-md pointer-events-auto overflow-x-auto max-w-[calc(100%-110px)] custom-scroll-hide">
          <button
            onClick={() => {
              setActiveCorridor('all');
              if (onSelectCorridor) onSelectCorridor('all');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeCorridor === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Semua
          </button>
          {REAL_BANYUMAS_CORRIDORS.map((c) => {
            const isSelected = activeCorridor === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCorridor(c.id);
                  if (onSelectCorridor) onSelectCorridor(c.id);
                }}
                style={{
                  backgroundColor: isSelected ? c.color : undefined,
                  color: isSelected ? '#ffffff' : c.color,
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shrink-0 ${
                  isSelected ? 'shadow-xs border-transparent' : 'border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container'
                }`}
              >
                K{c.code}
              </button>
            );
          })}
        </div>

        {/* Map Type & GPS Center Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setMapType(mapType === 'streets' ? 'satellite' : 'streets')}
            className="h-9 px-2.5 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/60 shadow-md flex items-center gap-1 text-[11px] font-bold text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
            title="Ganti Jenis Peta (Jalan Nyata / Satelit)"
          >
            <span className="material-symbols-outlined text-[16px]">
              {mapType === 'streets' ? 'satellite_alt' : 'map'}
            </span>
            <span className="hidden sm:inline">{mapType === 'streets' ? 'Satelit' : 'Jalan'}</span>
          </button>

          <button
            onClick={handleCenterUser}
            className="w-9 h-9 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/60 shadow-md flex items-center justify-center text-primary hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
            title="Pusatkan ke Lokasi Saya"
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Bottom Drawer: Selected Halte with Gojek & Grab Integration */}
      {selectedStop && (
        <div className="absolute bottom-3 left-3 right-3 z-[999] bg-surface-container-lowest/98 backdrop-blur-md rounded-2xl border-2 border-primary shadow-2xl p-3.5 space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between border-b border-outline-variant/30 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-2xl">storefront</span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-on-surface font-headline leading-tight">
                  {selectedStop.name}
                </h4>
                <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
                  {selectedStop.shelterType} • {selectedStop.feederCount} Mitra Siap Jemput
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedStop(null)}
              className="w-6 h-6 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Direct Gojek & Grab Launch Action Cluster */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-on-surface">Pesan Feeder Antar Moda ke Halte Ini:</span>
              <span className="text-[10px] text-secondary font-bold">Langsung ke Aplikasi</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Gojek Launch Button */}
              <button
                onClick={() => handleLaunchFeeder('gojek', selectedStop.name)}
                className="py-2.5 px-3 rounded-xl bg-[#00880C] hover:bg-[#00700A] text-white flex items-center justify-center gap-2 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-white text-[#00880C] flex items-center justify-center text-[11px] font-extrabold">
                  G
                </div>
                <span>Buka Gojek (GoRide)</span>
              </button>

              {/* Grab Launch Button */}
              <button
                onClick={() => handleLaunchFeeder('grab', selectedStop.name)}
                className="py-2.5 px-3 rounded-xl bg-[#00B14F] hover:bg-[#009241] text-white flex items-center justify-center gap-2 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-white text-[#00B14F] flex items-center justify-center text-[10px] font-extrabold">
                  Gr
                </div>
                <span>Buka Grab (GrabBike)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Drawer: Selected Moving Live Bus */}
      {selectedBus && !selectedStop && (
        <div className="absolute bottom-3 left-3 right-3 z-[999] bg-surface-container-lowest/98 backdrop-blur-md rounded-2xl border-2 border-secondary shadow-2xl p-3.5 space-y-2.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between border-b border-outline-variant/30 pb-2">
            <div className="flex items-center gap-2">
              <div
                style={{
                  backgroundColor:
                    REAL_BANYUMAS_CORRIDORS.find((c) => c.id === selectedBus.corridorId)?.color ||
                    '#00288e',
                }}
                className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs"
              >
                K{selectedBus.corridorCode}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-on-surface font-headline leading-tight">
                  {selectedBus.code} ({selectedBus.plateNumber})
                </h4>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  {selectedBus.driverName} • {selectedBus.operator}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedBus(null)}
              className="w-6 h-6 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs bg-surface-container-low p-2 rounded-xl">
            <div>
              <span className="text-[10px] text-on-surface-variant block">Kecepatan</span>
              <strong className="text-primary font-bold">{selectedBus.speedKmH} km/h</strong>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant block">Halte Tujuan</span>
              <strong className="text-on-surface font-bold truncate block">{selectedBus.nextStopName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant block">ETA</span>
              <strong className="text-secondary font-bold">~{selectedBus.etaMinutes} menit</strong>
            </div>
          </div>

          {/* Quick feeder to meet bus */}
          <button
            onClick={() => handleLaunchFeeder('gojek', selectedBus.nextStopName)}
            className="w-full py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
            <span>Jemput Bus di Halte {selectedBus.nextStopName} (Pesan Ojol)</span>
          </button>
        </div>
      )}
    </div>
  );
};
