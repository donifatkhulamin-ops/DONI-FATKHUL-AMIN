import React, { useState, useEffect, useRef } from 'react';
import {
  OFFICIAL_BANYUMAS_CORRIDORS,
  INITIAL_LIVE_BUSES,
  DetailedCorridorRoute,
  LiveSimulatedBus,
  RouteWaypoint,
  interpolateWaypointPosition,
} from '../data/banyumasRoutes.ts';

interface TransitNetworkMapProps {
  selectedCorridorId?: string;
  onSelectCorridor?: (id: string) => void;
  onSelectStop?: (stopName: string) => void;
  onBookFeederAtStop?: (stopName: string) => void;
  onNavigateToRute?: (originStop: string) => void;
}

export const TransitNetworkMap: React.FC<TransitNetworkMapProps> = ({
  selectedCorridorId = 'all',
  onSelectCorridor,
  onSelectStop,
  onBookFeederAtStop,
  onNavigateToRute,
}) => {
  const [activeCorridorId, setActiveCorridorId] = useState<string>(selectedCorridorId);
  const [zoom, setZoom] = useState<number>(1);
  const [buses, setBuses] = useState<LiveSimulatedBus[]>(INITIAL_LIVE_BUSES);
  const [selectedBusId, setSelectedBusId] = useState<string | null>('tb-108');
  const [selectedStopName, setSelectedStopName] = useState<string | null>('Alun-Alun Pwt (Rita Mall)');
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x or 2.5x
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoFollowBus, setAutoFollowBus] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Sync external corridor prop
  useEffect(() => {
    if (selectedCorridorId) {
      setActiveCorridorId(selectedCorridorId);
    }
  }, [selectedCorridorId]);

  // Main Live GPS Bus Simulation Loop
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          const corridor = OFFICIAL_BANYUMAS_CORRIDORS.find((c) => c.id === bus.corridorId);
          if (!corridor) return bus;

          const numWaypoints = corridor.waypoints.length;
          let newDwell = bus.dwellRemainingSec;
          let isDwelling = bus.isDwellAtStation;
          let newProgress = bus.progressIndex;
          let newDirection = bus.direction;
          let currentSpeed = bus.speedKmH;

          // If currently pausing at station
          if (isDwelling) {
            newDwell -= 1;
            currentSpeed = 0;
            if (newDwell <= 0) {
              isDwelling = false;
              currentSpeed = Math.floor(28 + Math.random() * 14);
            }
          } else {
            // Bus moving along waypoints
            const step = (0.045 * simSpeed);
            if (newDirection === 'forward') {
              newProgress += step;
              if (newProgress >= numWaypoints - 1) {
                // Loop or reverse
                if (corridor.id === 'k3a' || corridor.id === 'k3b') {
                  newProgress = 0; // seamless loop
                } else {
                  newProgress = numWaypoints - 1;
                  newDirection = 'backward';
                }
                isDwelling = true;
                newDwell = 3;
              }
            } else {
              newProgress -= step;
              if (newProgress <= 0) {
                newProgress = 0;
                newDirection = 'forward';
                isDwelling = true;
                newDwell = 3;
              }
            }

            // Check if passing an integer waypoint
            const nearestInt = Math.round(newProgress);
            if (Math.abs(newProgress - nearestInt) < 0.035 && !isDwelling && Math.random() < 0.35) {
              isDwelling = true;
              newDwell = 2;
              currentSpeed = 0;
            }
          }

          // Interpolate current (x, y) coordinates
          const { x, y, prevStop, nextStop } = interpolateWaypointPosition(
            corridor.waypoints,
            newProgress
          );

          // Calculate ETA in seconds based on distance remaining to next waypoint
          const fracToNext = Math.abs(newProgress - Math.floor(newProgress));
          const etaSec = Math.max(15, Math.round((1 - fracToNext) * 120));
          const distM = Math.max(80, Math.round((1 - fracToNext) * 900));

          return {
            ...bus,
            progressIndex: newProgress,
            direction: newDirection,
            isDwellAtStation: isDwelling,
            dwellRemainingSec: newDwell,
            speedKmH: isDwelling ? 0 : currentSpeed,
            currentStopName: prevStop,
            nextStopName: nextStop,
            etaSeconds: etaSec,
            distanceMeters: distM,
            statusText: isDwelling
              ? `Sedang Berhenti di Halte ${prevStop}`
              : `Menuju Halte ${nextStop}`,
            x,
            y,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, simSpeed]);

  const handleCorridorClick = (cid: string) => {
    setActiveCorridorId(cid);
    if (onSelectCorridor) onSelectCorridor(cid);
  };

  const isCorridorVisible = (cid: string) => {
    return activeCorridorId === 'all' || activeCorridorId === cid;
  };

  const selectedBus = buses.find((b) => b.id === selectedBusId) || null;

  // Find all waypoints across corridors for stop search & markers
  const allWaypoints: {
    corridor: DetailedCorridorRoute;
    waypoint: RouteWaypoint;
  }[] = [];

  OFFICIAL_BANYUMAS_CORRIDORS.forEach((c) => {
    c.waypoints.forEach((wp) => {
      allWaypoints.push({ corridor: c, waypoint: wp });
    });
  });

  // Filtered stops for search dropdown
  const filteredStops = searchQuery.trim()
    ? Array.from(
        new Set(
          allWaypoints
            .map((item) => item.waypoint.name)
            .filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      ).slice(0, 5)
    : [];

  const handleSelectSearchStop = (name: string) => {
    setSelectedStopName(name);
    setSearchQuery('');
    if (onSelectStop) onSelectStop(name);
  };

  // Find info about the currently selected stop
  const selectedStopInfo = selectedStopName
    ? {
        name: selectedStopName,
        passingCorridors: OFFICIAL_BANYUMAS_CORRIDORS.filter((c) =>
          c.waypoints.some((wp) => wp.name === selectedStopName)
        ),
        approachingBuses: buses
          .filter((b) => b.nextStopName === selectedStopName || b.currentStopName === selectedStopName)
          .sort((a, b) => a.etaSeconds - b.etaSeconds),
      }
    : null;

  return (
    <div className="relative w-full bg-[#f8fafc] rounded-2xl border border-outline-variant/60 overflow-hidden shadow-sm flex flex-col">
      {/* Ribbon 1: Corridor Filter & Live Pulse */}
      <div className="bg-surface-container-lowest px-3 py-2 border-b border-outline-variant/30 flex items-center justify-between gap-2 overflow-x-auto custom-scroll-hide z-10">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
          </span>
          <span className="text-[10px] font-bold text-on-surface uppercase tracking-wider">
            RADAR RUTE:
          </span>
          <button
            onClick={() => handleCorridorClick('all')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              activeCorridorId === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            Semua (6 Jalur)
          </button>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {OFFICIAL_BANYUMAS_CORRIDORS.map((c) => {
            const isSelected = activeCorridorId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCorridorClick(c.id)}
                style={{
                  backgroundColor: isSelected ? c.color : undefined,
                  borderColor: c.color,
                  color: isSelected ? c.textColor : c.color,
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  isSelected ? 'shadow-xs scale-102' : 'bg-surface-container-lowest hover:opacity-85'
                }`}
                title={c.name}
              >
                K{c.code}
              </button>
            );
          })}
        </div>

        {/* Zoom & Simulation Toggles */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <button
            onClick={() => setIsSimulationRunning(!isSimulationRunning)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              isSimulationRunning
                ? 'bg-secondary text-white'
                : 'bg-surface-container text-on-surface-variant'
            }`}
            title={isSimulationRunning ? 'Jeda Simulasi' : 'Lanjutkan Simulasi'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSimulationRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button
            onClick={() => setSimSpeed(simSpeed === 1 ? 2.5 : 1)}
            className={`px-2 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center cursor-pointer ${
              simSpeed > 1 ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
            }`}
            title="Kecepatan Simulasi"
          >
            {simSpeed}x
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
            className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center font-bold text-xs hover:bg-surface-container-high cursor-pointer"
            title="Perbesar Peta"
          >
            +
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.75, z - 0.15))}
            className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center font-bold text-xs hover:bg-surface-container-high cursor-pointer"
            title="Perkecil Peta"
          >
            -
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setSelectedBusId(null);
            }}
            className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
            title="Reset Posisi Peta"
          >
            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Stop Search Bar Overlay */}
      <div className="bg-surface-container-low px-3 py-1.5 border-b border-outline-variant/30 flex items-center gap-2 relative">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Halte / Titik Transit di Peta (cth: Baturraden, Unsoed, Ajibarang)..."
            className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-surface-container-lowest border border-outline-variant/60 focus:outline-hidden focus:border-primary text-on-surface placeholder:text-on-surface-variant/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
            >
              ✕
            </button>
          )}

          {/* Search Dropdown Results */}
          {filteredStops.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-xl z-50 overflow-hidden divide-y divide-outline-variant/20 animate-in fade-in duration-100">
              {filteredStops.map((stopName) => (
                <button
                  key={stopName}
                  onClick={() => handleSelectSearchStop(stopName)}
                  className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-primary-fixed/20 flex items-center justify-between text-on-surface cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[15px]">location_on</span>
                    {stopName}
                  </span>
                  <span className="text-[10px] text-primary font-bold">Lihat di Peta ➔</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>{buses.length} Bus Melintas</span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div
        ref={mapContainerRef}
        className="relative w-full h-[540px] overflow-hidden bg-[#fafcff] cursor-grab active:cursor-grabbing select-none"
      >
        <svg
          viewBox="0 0 1020 680"
          className="w-full h-full transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Subtle background grid pattern */}
            <pattern id="bms-transit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>

            {/* Glowing radar pulse filter */}
            <filter id="radar-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#bms-transit-grid)" opacity="0.6" />

          {/* Geographical Context & Labels */}
          {/* Gunung Slamet in the North */}
          <g opacity="0.85">
            <path
              d="M 410 15 L 505 55 L 600 15 Z"
              fill="#e0f2fe"
              stroke="#bae6fd"
              strokeWidth="1.5"
            />
            <text
              x="505"
              y="38"
              textAnchor="middle"
              fill="#0369a1"
              fontSize="10"
              fontWeight="bold"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              ▲ G. SLAMET (UTARA)
            </text>
          </g>

          {/* Sungai Serayu (South Waterway) */}
          <g opacity="0.75">
            <path
              d="M 20 650 Q 340 600 680 640 T 1000 645"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="6"
              strokeDasharray="8 4"
            />
            <text
              x="750"
              y="662"
              fill="#64748b"
              fontSize="9"
              fontWeight="bold"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Sungai Serayu (Banyumas)
            </text>
          </g>

          {/* Central Purwokerto Urban Zone Outline */}
          <rect
            x="410"
            y="180"
            width="270"
            height="290"
            rx="18"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text
            x="425"
            y="200"
            fill="#94a3b8"
            fontSize="9"
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Kawasan Perkotaan Purwokerto
          </text>

          {/* ======================================================== */}
          {/* CORRIDOR ROUTE TRACKS (FROM OFFICIAL PDF MAP) */}
          {/* ======================================================== */}
          {OFFICIAL_BANYUMAS_CORRIDORS.map((c) => {
            const isVisible = isCorridorVisible(c.id);
            const isSelected = activeCorridorId === c.id;

            return (
              <g
                key={c.id}
                className="transition-opacity duration-200 cursor-pointer"
                opacity={isVisible ? 1 : 0.18}
                onClick={() => handleCorridorClick(c.id)}
              >
                {/* Outer halo */}
                <path
                  d={c.svgPath}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={isSelected ? 10 : 7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isSelected ? 0.35 : 0.15}
                />
                {/* Main colored route track */}
                <path
                  d={c.svgPath}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={isSelected ? 6 : 4.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Inner track highlight for contrast */}
                <path
                  d={c.svgPath}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeDasharray={c.id === 'k3b' ? '6 4' : 'none'}
                  opacity={0.8}
                />
              </g>
            );
          })}

          {/* ======================================================== */}
          {/* STOPS & HUBS (Ground Truth from Transit Map) */}
          {/* ======================================================== */}
          {OFFICIAL_BANYUMAS_CORRIDORS.map((c) => {
            if (!isCorridorVisible(c.id)) return null;

            return c.waypoints.map((wp, idx) => {
              const isSelected = selectedStopName === wp.name;
              const isHub = !!wp.isHub;

              return (
                <g
                  key={`${c.id}-${wp.name}-${idx}`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStopName(wp.name);
                    setSelectedBusId(null);
                    if (onSelectStop) onSelectStop(wp.name);
                  }}
                >
                  {isHub ? (
                    <>
                      {/* Hub Diamond / Rounded Rect */}
                      <rect
                        x={wp.x - 9}
                        y={wp.y - 7}
                        width={18}
                        height={14}
                        rx={4}
                        fill={isSelected ? '#00288e' : '#ffffff'}
                        stroke="#0f172a"
                        strokeWidth={2.5}
                        className="transition-transform group-hover:scale-125"
                      />
                      <circle cx={wp.x} cy={wp.y} r={3} fill={isSelected ? '#ffffff' : '#0f172a'} />
                    </>
                  ) : (
                    <circle
                      cx={wp.x}
                      cy={wp.y}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#00288e' : '#ffffff'}
                      stroke={c.color}
                      strokeWidth={2}
                      className="transition-transform group-hover:scale-125"
                    />
                  )}

                  {/* Stop Name Label */}
                  <text
                    x={wp.x}
                    y={wp.y - (isHub ? 11 : 8)}
                    textAnchor="middle"
                    fontSize={isHub ? '9.5' : '7.5'}
                    fontWeight={isHub ? 'bold' : '600'}
                    fill={isSelected ? '#00288e' : '#1e293b'}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    className="select-none pointer-events-none drop-shadow-xs"
                  >
                    {wp.name}
                  </text>
                </g>
              );
            });
          })}

          {/* ======================================================== */}
          {/* REAL-TIME MOVING BUSES WITH LIVE RADAR GPS PINGS */}
          {/* ======================================================== */}
          {buses
            .filter((b) => isCorridorVisible(b.corridorId))
            .map((bus) => {
              const isSelected = selectedBusId === bus.id;
              const corridor = OFFICIAL_BANYUMAS_CORRIDORS.find((c) => c.id === bus.corridorId);
              const color = corridor?.color || '#00288e';

              return (
                <g
                  key={bus.id}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBusId(bus.id);
                    setSelectedStopName(null);
                  }}
                >
                  {/* Radar Wave Ping Ring */}
                  <circle
                    cx={bus.x}
                    cy={bus.y}
                    r={isSelected ? 18 : 12}
                    fill={color}
                    opacity={isSelected ? 0.45 : 0.25}
                    className="animate-ping"
                  />

                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      cx={bus.x}
                      cy={bus.y}
                      r={14}
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                    />
                  )}

                  {/* Bus Body Circle */}
                  <circle
                    cx={bus.x}
                    cy={bus.y}
                    r={isSelected ? 9 : 7.5}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="shadow-lg transition-transform group-hover:scale-125"
                  />

                  {/* Bus Icon */}
                  <text
                    x={bus.x}
                    y={bus.y + 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    className="pointer-events-none"
                  >
                    {bus.corridorCode}
                  </text>

                  {/* Floating Telemetry Badge Above Bus */}
                  <g transform={`translate(${bus.x}, ${bus.y - 18})`}>
                    <rect
                      x={-28}
                      y={-11}
                      width={56}
                      height={13}
                      rx={3}
                      fill="#0f172a"
                      opacity={0.92}
                    />
                    <text
                      x={0}
                      y={-2}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="7.5"
                      fontWeight="bold"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {bus.code} • {bus.speedKmH}kph
                    </text>
                  </g>
                </g>
              );
            })}
        </svg>

        {/* Legend Box Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-md p-3 rounded-xl border border-outline-variant/60 shadow-md max-w-[260px] text-xs space-y-1.5 pointer-events-auto z-20">
          <div className="flex items-center justify-between pb-1 border-b border-outline-variant/30">
            <span className="font-bold text-[11px] text-on-surface">JARINGAN TRANS BANYUMAS</span>
            <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
              GPS Live
            </span>
          </div>
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <span className="font-semibold text-on-surface">K1: Pasar Pon ↔ Ajibarang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
              <span className="font-semibold text-on-surface">K2: Notog ↔ Baturraden</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
              <span className="font-semibold text-on-surface">K3A & 3B: Bulupitu ↔ Kebondalem</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ca8a04]" />
              <span className="font-semibold text-on-surface">K4: Bulupitu ↔ Kejawar RSUD BMS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
              <span className="font-semibold text-on-surface">B1: Bulupitu ↔ Bukateja (Trans Jateng)</span>
            </div>
          </div>
          <div className="pt-1 border-t border-outline-variant/30 flex justify-between text-[10px] text-on-surface-variant font-medium">
            <span>Tarif: Rp 3.900 (Umum)</span>
            <span className="font-bold text-secondary">Rp 2.000 (Pelajar/Lansia)</span>
          </div>
        </div>

        {/* Floating Telemetry Drawer: Selected Live Bus */}
        {selectedBus && (
          <div className="absolute top-3 right-3 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-primary shadow-2xl max-w-[280px] text-xs space-y-2.5 animate-in fade-in zoom-in-95 pointer-events-auto z-30">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-2">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor:
                      OFFICIAL_BANYUMAS_CORRIDORS.find((c) => c.id === selectedBus.corridorId)?.color ||
                      '#00288e',
                  }}
                  className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs"
                >
                  K{selectedBus.corridorCode}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface font-headline leading-none">
                    {selectedBus.code}
                  </h4>
                  <span className="text-[11px] text-on-surface-variant font-semibold">
                    {selectedBus.plateNumber} • {selectedBus.operator}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBusId(null)}
                className="w-6 h-6 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Live Status Row */}
            <div className="bg-surface-container-low p-2 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant">Status:</span>
                <span className="font-bold text-secondary">{selectedBus.statusText}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant">Kecepatan Saat Ini:</span>
                <span className="font-bold text-primary">{selectedBus.speedKmH} km/jam</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant">Suhu Kabin / AC:</span>
                <span className="font-semibold text-on-surface">{selectedBus.acTemp}°C (Dingin)</span>
              </div>
            </div>

            {/* Halte Next & ETA */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Halte Sebelumnya:</span>
                <span className="font-medium text-on-surface">{selectedBus.currentStopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Halte Berikutnya:</span>
                <span className="font-bold text-primary">{selectedBus.nextStopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Estimasi Tiba (ETA):</span>
                <span className="font-bold text-secondary">
                  {Math.floor(selectedBus.etaSeconds / 60)}m {selectedBus.etaSeconds % 60}d (~{selectedBus.distanceMeters}m)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Keterisian Kursi:</span>
                <span className="font-bold text-on-surface">
                  {selectedBus.totalSeats - selectedBus.availableSeats}/{selectedBus.totalSeats} Kursi ({selectedBus.occupancyPercent}%)
                </span>
              </div>
            </div>

            {/* Occupancy bar */}
            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  selectedBus.occupancyPercent > 75
                    ? 'bg-amber-500'
                    : selectedBus.occupancyPercent > 90
                    ? 'bg-red-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${selectedBus.occupancyPercent}%` }}
              />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => {
                  setSelectedStopName(selectedBus.nextStopName);
                  if (onSelectStop) onSelectStop(selectedBus.nextStopName);
                }}
                className="py-1.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-[11px] font-bold text-on-surface transition-colors cursor-pointer"
              >
                Lihat Halte
              </button>
              <button
                onClick={() => {
                  if (onNavigateToRute) onNavigateToRute(selectedBus.currentStopName);
                }}
                className="py-1.5 bg-primary hover:bg-primary-container text-white rounded-xl text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
              >
                Beli Tiket
              </button>
            </div>
          </div>
        )}

        {/* Floating Telemetry Drawer: Selected Halte / Station */}
        {selectedStopInfo && !selectedBus && (
          <div className="absolute top-3 right-3 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-secondary shadow-2xl max-w-[280px] text-xs space-y-2.5 animate-in fade-in zoom-in-95 pointer-events-auto z-30">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shadow-xs">
                  <span className="material-symbols-outlined text-lg">storefront</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface font-headline leading-tight">
                    {selectedStopInfo.name}
                  </h4>
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
                    Halte Terpadu MaaS
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStopName(null)}
                className="w-6 h-6 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Passing corridors */}
            <div className="space-y-1">
              <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
                KORIDOR YANG MELINTASI:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedStopInfo.passingCorridors.map((c) => (
                  <span
                    key={c.id}
                    style={{ backgroundColor: c.color }}
                    className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs"
                  >
                    K{c.code}: {c.origin.split(' ')[0]} - {c.destination.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Approaching Buses at This Stop */}
            <div className="bg-surface-container-low p-2 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-on-surface block uppercase tracking-wider">
                ESTIMASI KEDATANGAN REAL-TIME:
              </span>
              {selectedStopInfo.approachingBuses.length > 0 ? (
                selectedStopInfo.approachingBuses.slice(0, 2).map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-[11px] py-0.5">
                    <span className="font-bold text-primary">
                      {b.code} (K{b.corridorCode})
                    </span>
                    <span className="font-bold text-secondary">
                      ~{Math.ceil(b.etaSeconds / 60)} mnt lagi
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-on-surface-variant">
                  Bus terdekat sedang dalam perjalanan (~5-8 menit).
                </div>
              )}
            </div>

            {/* Feeder Booking Action */}
            <button
              onClick={() => {
                if (onBookFeederAtStop) onBookFeederAtStop(selectedStopInfo.name);
              }}
              type="button"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
              <span>Pesan Ojek Online Feeder ke Halte ini</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
