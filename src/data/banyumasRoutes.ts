// Banyumas Official Transit Network Routes & Real-Time Live Bus Data
// Grounded directly in Transit_Network_Map_of_Banyumas_afe98846.pdf

export interface RouteWaypoint {
  x: number;
  y: number;
  name: string;
  isHub?: boolean;
  hubLines?: string[];
  stopId?: string;
  isBypassNote?: boolean;
}

export interface DetailedCorridorRoute {
  id: string;
  code: string;
  name: string;
  operator: 'Trans Banyumas' | 'Trans Jateng';
  color: string;
  textColor: string;
  origin: string;
  destination: string;
  operatingHours: string;
  fareGeneral: number;
  fareSpecial: number;
  frequencyMinutes: number;
  fleetCount: number;
  description: string;
  waypoints: RouteWaypoint[];
  svgPath: string;
}

export interface LiveSimulatedBus {
  id: string;
  code: string;
  plateNumber: string;
  driverName: string;
  corridorId: string;
  corridorCode: string;
  operator: 'Trans Banyumas' | 'Trans Jateng';
  direction: 'forward' | 'backward';
  // Progress along waypoint list (float 0 to waypoints.length - 1)
  progressIndex: number;
  speedKmH: number;
  availableSeats: number;
  totalSeats: number;
  occupancyPercent: number;
  statusText: string;
  isDwellAtStation: boolean;
  dwellRemainingSec: number;
  currentStopName: string;
  nextStopName: string;
  etaSeconds: number;
  distanceMeters: number;
  // Computed (x,y) on map canvas
  x: number;
  y: number;
  acTemp: number;
  isWheelchairReady: boolean;
}

export const OFFICIAL_BANYUMAS_CORRIDORS: DetailedCorridorRoute[] = [
  {
    id: 'k1',
    code: '1',
    name: 'Koridor 1: Pasar Pon ↔ Terminal Ajibarang',
    operator: 'Trans Banyumas',
    color: '#0284c7', // Sky Blue / Cyan (Resmi K1)
    textColor: '#ffffff',
    origin: 'Pasar Pon',
    destination: 'Terminal Ajibarang',
    operatingHours: '04.45 - 19.03 WIB',
    fareGeneral: 3900,
    fareSpecial: 2000,
    frequencyMinutes: 10,
    fleetCount: 8,
    description: 'Menghubungkan pusat Purwokerto barat dengan Karanglewas, Cilongok, dan Ajibarang.',
    svgPath: 'M 50 280 L 100 280 L 140 280 L 175 280 L 215 280 L 250 280 L 285 280 L 320 280 L 355 280 L 385 280 L 415 280 L 440 280',
    waypoints: [
      { x: 50, y: 280, name: 'Terminal Ajibarang', isHub: true, hubLines: ['k1'], stopId: 'stop-ajibarang' },
      { x: 100, y: 280, name: 'RSUD Ajibarang', isHub: false, stopId: 'stop-rsud-ajibarang' },
      { x: 140, y: 280, name: 'SMPN 1 Ajibarang', isHub: false, stopId: 'stop-smpn1-ajibarang' },
      { x: 175, y: 280, name: 'Pernasidi', isHub: false, stopId: 'stop-pernasidi' },
      { x: 215, y: 280, name: 'Pasar Cilongok', isHub: true, stopId: 'stop-cilongok' },
      { x: 250, y: 280, name: 'Puskesmas 1 Cilongok', isHub: false, stopId: 'stop-puskesmas-cilongok' },
      { x: 285, y: 280, name: 'Karanglo', isHub: false, stopId: 'stop-karanglo' },
      { x: 320, y: 280, name: 'Kecamatan Karanglewas', isHub: false, stopId: 'stop-karanglewas' },
      { x: 355, y: 280, name: 'Museum Pangsar Soedirman', isHub: true, stopId: 'stop-pangsar' },
      { x: 385, y: 280, name: 'RS Hermina', isHub: false, stopId: 'stop-hermina' },
      { x: 415, y: 280, name: 'Underpass Pasar Pon', isHub: false, stopId: 'stop-underpass-pon' },
      { x: 440, y: 280, name: 'Pasar Pon (Hub Barat)', isHub: true, hubLines: ['k1', 'k2'], stopId: 'stop-pasar-pon' },
    ],
  },
  {
    id: 'k2',
    code: '2',
    name: 'Koridor 2: Terminal Notog ↔ Terminal Baturraden',
    operator: 'Trans Banyumas',
    color: '#ea580c', // Orange (Resmi K2)
    textColor: '#ffffff',
    origin: 'Terminal Notog',
    destination: 'Terminal Baturraden',
    operatingHours: '04.45 - 17.25 WIB',
    fareGeneral: 3900,
    fareSpecial: 2000,
    frequencyMinutes: 10,
    fleetCount: 12,
    description: 'Jalur tulang punggung Utara-Selatan dari Lereng Gunung Slamet hingga Patikraja.',
    svgPath: 'M 440 640 L 440 580 L 440 520 L 440 460 L 440 400 L 440 340 L 440 280 L 440 230 L 470 210 L 505 210 L 505 160 L 505 120 L 505 80 L 505 50 L 505 25',
    waypoints: [
      { x: 440, y: 640, name: 'Terminal Notog (Patikraja)', isHub: true, hubLines: ['k2'], stopId: 'stop-notog' },
      { x: 440, y: 580, name: 'Desa Patikraja', isHub: false, stopId: 'stop-patikraja' },
      { x: 440, y: 520, name: 'Kedungrandu', isHub: false, stopId: 'stop-kedungrandu' },
      { x: 440, y: 460, name: 'Sidabowa', isHub: false, stopId: 'stop-sidabowa' },
      { x: 440, y: 400, name: 'Simpang Pengasinan', isHub: false, stopId: 'stop-pengasinan' },
      { x: 440, y: 340, name: 'TMP Tanjung Nirwana', isHub: false, stopId: 'stop-tanjung' },
      { x: 440, y: 280, name: 'Pasar Pon (Hub Transfer)', isHub: true, hubLines: ['k1', 'k2'], stopId: 'stop-pasar-pon' },
      { x: 440, y: 230, name: 'Stasiun PWT (Pintu Barat)', isHub: true, hubLines: ['k2'], stopId: 'stop-stasiun' },
      { x: 470, y: 210, name: 'Pasar Manis / Menara Teratai', isHub: true, hubLines: ['k2'], stopId: 'stop-menara-teratai' },
      { x: 505, y: 210, name: 'Alun-Alun Pwt (Rita Mall)', isHub: true, hubLines: ['k2'], stopId: 'stop-alun-alun' },
      { x: 505, y: 160, name: 'Karangsalam / Unwiku', isHub: false, stopId: 'stop-unwiku' },
      { x: 505, y: 120, name: 'Tugu Ikan Beji', isHub: false, stopId: 'stop-beji' },
      { x: 505, y: 80, name: 'Pandak / Rempoah', isHub: false, stopId: 'stop-pandak' },
      { x: 505, y: 50, name: 'Mandala Wisata', isHub: true, stopId: 'stop-mandala' },
      { x: 505, y: 25, name: 'Terminal Baturraden', isHub: true, hubLines: ['k2'], stopId: 'stop-baturraden' },
    ],
  },
  {
    id: 'k3a',
    code: '3A',
    name: 'Koridor 3A: Bulupitu ↔ Kebondalem (Searah Jarum Jam)',
    operator: 'Trans Banyumas',
    color: '#dc2626', // Red (Resmi K3A)
    textColor: '#ffffff',
    origin: 'Terminal Bulupitu',
    destination: 'Terminal Kebondalem (Loop)',
    operatingHours: '05.00 - 18.00 WIB',
    fareGeneral: 3900,
    fareSpecial: 2000,
    frequencyMinutes: 12,
    fleetCount: 7,
    description: 'Rute loop perkotaan searah jarum jam melintasi Moro, Pasar Wage, Kebondalem, dan Kampus Unsoed.',
    svgPath: 'M 570 450 L 520 450 L 500 390 L 500 340 L 500 290 L 560 280 L 560 210 L 610 210 L 640 160 L 680 210 L 640 270 L 640 350 L 570 450',
    waypoints: [
      { x: 570, y: 450, name: 'Terminal Bulupitu', isHub: true, hubLines: ['k3a', 'k3b', 'k4', 'b1'], stopId: 'stop-bulupitu' },
      { x: 520, y: 450, name: 'Suwatio / Puri Indah', isHub: false, stopId: 'stop-suwatio' },
      { x: 500, y: 390, name: 'TRAP (Utara/Timur)', isHub: false, stopId: 'stop-trap' },
      { x: 500, y: 340, name: 'Andhang Pangrenan', isHub: true, stopId: 'stop-andhang' },
      { x: 500, y: 290, name: 'Moro / Bioskop Rajawali', isHub: true, stopId: 'stop-moro' },
      { x: 560, y: 280, name: 'Pasar Wage (Jl. Sudirman)', isHub: true, stopId: 'stop-pasar-wage' },
      { x: 560, y: 210, name: 'Terminal Kebondalem', isHub: true, hubLines: ['k2', 'k3a', 'k3b'], stopId: 'stop-kebondalem' },
      { x: 610, y: 210, name: 'RS Jatiwinangun / RS DKT', isHub: false, stopId: 'stop-rs-dkt' },
      { x: 640, y: 160, name: 'Kampus Unsoed (Graha Widyatama)', isHub: true, stopId: 'stop-unsoed' },
      { x: 680, y: 210, name: 'Sunan Ampel / Kedungmalang', isHub: false, stopId: 'stop-sunan-ampel' },
      { x: 640, y: 270, name: 'SMAN 4 Purwokerto / Kombas', isHub: false, stopId: 'stop-sman4' },
      { x: 640, y: 350, name: 'RSU Sinar Kasih / MAN 2', isHub: false, stopId: 'stop-sinar-kasih' },
      { x: 570, y: 450, name: 'Terminal Bulupitu (Selesai Loop)', isHub: true, hubLines: ['k3a', 'k3b', 'k4', 'b1'], stopId: 'stop-bulupitu' },
    ],
  },
  {
    id: 'k3b',
    code: '3B',
    name: 'Koridor 3B: Bulupitu ↔ Kebondalem (Berlawanan Jarum Jam)',
    operator: 'Trans Banyumas',
    color: '#c026d3', // Magenta / Ungu (Resmi K3B)
    textColor: '#ffffff',
    origin: 'Terminal Bulupitu',
    destination: 'Terminal Kebondalem (Rev Loop)',
    operatingHours: '05.00 - 18.00 WIB',
    fareGeneral: 3900,
    fareSpecial: 2000,
    frequencyMinutes: 12,
    fleetCount: 7,
    description: 'Rute loop perkotaan berlawanan jarum jam dari Bulupitu ke Sinar Kasih, Unsoed, Kebondalem, dan TRAP.',
    svgPath: 'M 570 450 L 640 350 L 640 270 L 680 210 L 640 160 L 610 210 L 560 210 L 560 280 L 500 290 L 500 340 L 500 390 L 520 450 L 570 450',
    waypoints: [
      { x: 570, y: 450, name: 'Terminal Bulupitu', isHub: true, hubLines: ['k3a', 'k3b', 'k4', 'b1'], stopId: 'stop-bulupitu' },
      { x: 640, y: 350, name: 'RSU Sinar Kasih / MAN 2', isHub: false, stopId: 'stop-sinar-kasih' },
      { x: 640, y: 270, name: 'SMAN 4 Purwokerto / Kombas', isHub: false, stopId: 'stop-sman4' },
      { x: 680, y: 210, name: 'Sunan Ampel / Kedungmalang', isHub: false, stopId: 'stop-sunan-ampel' },
      { x: 640, y: 160, name: 'Kampus Unsoed (Graha Widyatama)', isHub: true, stopId: 'stop-unsoed' },
      { x: 610, y: 210, name: 'RS Jatiwinangun / RS DKT', isHub: false, stopId: 'stop-rs-dkt' },
      { x: 560, y: 210, name: 'Terminal Kebondalem', isHub: true, hubLines: ['k2', 'k3a', 'k3b'], stopId: 'stop-kebondalem' },
      { x: 560, y: 280, name: 'Pasar Wage MT Haryono', isHub: true, stopId: 'stop-pasar-wage' },
      { x: 500, y: 290, name: 'Moro / Rajawali', isHub: true, stopId: 'stop-moro' },
      { x: 500, y: 340, name: 'Andhang Pangrenan', isHub: true, stopId: 'stop-andhang' },
      { x: 500, y: 390, name: 'TRAP (Utara/Timur)', isHub: false, stopId: 'stop-trap' },
      { x: 520, y: 450, name: 'Suwatio', isHub: false, stopId: 'stop-suwatio' },
      { x: 570, y: 450, name: 'Terminal Bulupitu (Selesai Loop)', isHub: true, hubLines: ['k3a', 'k3b', 'k4', 'b1'], stopId: 'stop-bulupitu' },
    ],
  },
  {
    id: 'k4',
    code: '4',
    name: 'Koridor 4: Bulupitu ↔ Terminal Kejawar (RSUD Banyumas)',
    operator: 'Trans Banyumas',
    color: '#ca8a04', // Kuning Emas (Resmi K4)
    textColor: '#ffffff',
    origin: 'Terminal Bulupitu',
    destination: 'Terminal Kejawar RSUD Banyumas',
    operatingHours: '04.45 - 18.41 WIB',
    fareGeneral: 3900,
    fareSpecial: 2000,
    frequencyMinutes: 15,
    fleetCount: 8,
    description: 'Menghubungkan Purwokerto Selatan dengan Sokaraja, Kalibagor, dan Kota Lama Banyumas.',
    svgPath: 'M 570 450 L 620 465 L 660 465 L 700 465 L 740 465 L 770 465 L 800 500 L 825 530 L 850 560 L 880 585 L 910 610 L 940 635',
    waypoints: [
      { x: 570, y: 450, name: 'Terminal Bulupitu', isHub: true, hubLines: ['k3a', 'k3b', 'k4', 'b1'], stopId: 'stop-bulupitu' },
      { x: 620, y: 465, name: 'UNU / RS Dadi Keluarga', isHub: false, stopId: 'stop-unu' },
      { x: 660, y: 465, name: 'Depo Pelita / Candimas', isHub: true, stopId: 'stop-depo-pelita' },
      { x: 700, y: 465, name: 'RSU Wiradadi Husada', isHub: false, stopId: 'stop-wiradadi' },
      { x: 740, y: 465, name: 'SMPN 1 Sokaraja', isHub: false, stopId: 'stop-smpn1-sokaraja' },
      { x: 770, y: 465, name: 'Simpang 4 Klenteng Sokaraja', isHub: true, hubLines: ['k4', 'b1'], stopId: 'stop-sokaraja' },
      { x: 800, y: 500, name: 'Karangdadap', isHub: false, stopId: 'stop-karangdadap' },
      { x: 825, y: 530, name: 'Kecamatan Kalibagor', isHub: true, stopId: 'stop-kalibagor' },
      { x: 850, y: 560, name: 'Surya Yudha / Kaliori', isHub: false, stopId: 'stop-kaliori' },
      { x: 880, y: 585, name: 'Pasar Banyumas', isHub: true, stopId: 'stop-pasar-banyumas' },
      { x: 910, y: 610, name: 'Kota Lama & Alun-Alun Banyumas', isHub: true, stopId: 'stop-kota-lama' },
      { x: 940, y: 635, name: 'Terminal Kejawar (RSUD Banyumas)', isHub: true, hubLines: ['k4'], stopId: 'stop-kejawar' },
    ],
  },
  {
    id: 'b1',
    code: 'B1',
    name: 'Trans Jateng B1: Bulupitu ↔ Terminal Bukateja (Purbalingga)',
    operator: 'Trans Jateng',
    color: '#16a34a', // Hijau Trans Jateng (Resmi B1)
    textColor: '#ffffff',
    origin: 'Terminal Bulupitu',
    destination: 'Terminal Bukateja',
    operatingHours: '05.15 - 18.00 WIB',
    fareGeneral: 5000,
    fareSpecial: 1000,
    frequencyMinutes: 15,
    fleetCount: 10,
    description: 'Layanan koridor aglomerasi Barlingmascakeb Purwokerto - Sokaraja - Purbalingga - Bukateja.',
    svgPath: 'M 570 450 L 610 400 L 650 400 L 700 420 L 770 465 L 810 400 L 850 360 L 890 330 L 930 330 L 975 330',
    waypoints: [
      { x: 570, y: 450, name: 'Terminal Bulupitu', isHub: true, hubLines: ['k3a', 'k3b', 'k4', 'b1'], stopId: 'stop-bulupitu' },
      { x: 610, y: 400, name: 'RS Margono Soekarjo', isHub: true, hubLines: ['b1'], stopId: 'stop-rs-margono' },
      { x: 650, y: 400, name: 'UMP Kampus II', isHub: true, stopId: 'stop-ump2' },
      { x: 700, y: 420, name: 'Bulog Sokaraja Kulon', isHub: false, stopId: 'stop-bulog' },
      { x: 770, y: 465, name: 'Sokaraja Klenteng (Hub K4)', isHub: true, hubLines: ['k4', 'b1'], stopId: 'stop-sokaraja' },
      { x: 810, y: 400, name: 'Terminal Jompo', isHub: true, stopId: 'stop-jompo' },
      { x: 850, y: 360, name: 'Akper Yakpermas / Kalimanah', isHub: false, stopId: 'stop-kalimanah' },
      { x: 890, y: 330, name: 'Terminal Purbalingga', isHub: true, stopId: 'stop-purbalingga' },
      { x: 930, y: 330, name: 'Usman Janatin / Bojong', isHub: false, stopId: 'stop-usman' },
      { x: 975, y: 330, name: 'Terminal Bukateja', isHub: true, hubLines: ['b1'], stopId: 'stop-bukateja' },
    ],
  },
];

// Initial active fleet simulating live GPS trackers
export const INITIAL_LIVE_BUSES: LiveSimulatedBus[] = [
  {
    id: 'tb-101',
    code: 'TB-101',
    plateNumber: 'R 7012 OA',
    driverName: 'Pak Joko Subagyo',
    corridorId: 'k1',
    corridorCode: '1',
    operator: 'Trans Banyumas',
    direction: 'forward',
    progressIndex: 3.4,
    speedKmH: 38,
    availableSeats: 14,
    totalSeats: 22,
    occupancyPercent: 55,
    statusText: 'Melaju di Jalur Karanglewas',
    isDwellAtStation: false,
    dwellRemainingSec: 0,
    currentStopName: 'Museum Pangsar',
    nextStopName: 'SMPN 1 Karanglewas',
    etaSeconds: 150,
    distanceMeters: 750,
    x: 230,
    y: 280,
    acTemp: 22,
    isWheelchairReady: true,
  },
  {
    id: 'tb-104',
    code: 'TB-104',
    plateNumber: 'R 7019 OA',
    driverName: 'Pak Rudi Hartono',
    corridorId: 'k1',
    corridorCode: '1',
    operator: 'Trans Banyumas',
    direction: 'backward',
    progressIndex: 8.8,
    speedKmH: 34,
    availableSeats: 10,
    totalSeats: 22,
    occupancyPercent: 68,
    statusText: 'Mendekati Underpass Pasar Pon',
    isDwellAtStation: false,
    dwellRemainingSec: 0,
    currentStopName: 'RS Hermina',
    nextStopName: 'Underpass Pasar Pon',
    etaSeconds: 90,
    distanceMeters: 420,
    x: 400,
    y: 280,
    acTemp: 21,
    isWheelchairReady: true,
  },
  {
    id: 'tb-108',
    code: 'TB-108',
    plateNumber: 'R 7088 OA',
    driverName: 'Pak Slamet Riyadi',
    corridorId: 'k2',
    corridorCode: '2',
    operator: 'Trans Banyumas',
    direction: 'forward',
    progressIndex: 7.6,
    speedKmH: 31,
    availableSeats: 8,
    totalSeats: 22,
    occupancyPercent: 78,
    statusText: 'Melintas Menara Teratai Menuju Alun-Alun',
    isDwellAtStation: false,
    dwellRemainingSec: 0,
    currentStopName: 'Stasiun PWT (Pintu Barat)',
    nextStopName: 'Alun-Alun Pwt (Rita Mall)',
    etaSeconds: 135,
    distanceMeters: 550,
    x: 460,
    y: 220,
    acTemp: 22,
    isWheelchairReady: true,
  },
  {
    id: 'tb-202',
    code: 'TB-202',
    plateNumber: 'R 7091 OA',
    driverName: 'Pak Bambang Setyo',
    corridorId: 'k2',
    corridorCode: '2',
    operator: 'Trans Banyumas',
    direction: 'backward',
    progressIndex: 3.2,
    speedKmH: 36,
    availableSeats: 12,
    totalSeats: 22,
    occupancyPercent: 62,
    statusText: 'Arah Selatan Menuju Notog',
    isDwellAtStation: false,
    dwellRemainingSec: 0,
    currentStopName: 'Sidabowa',
    nextStopName: 'Kedungrandu',
    etaSeconds: 210,
    distanceMeters: 950,
    x: 440,
    y: 490,
    acTemp: 23,
    isWheelchairReady: true,
  },
  {
    id: 'tb-205',
    code: 'TB-205',
    plateNumber: 'R 7095 OA',
    driverName: 'Pak Tri Mulyono',
    corridorId: 'k2',
    corridorCode: '2',
    operator: 'Trans Banyumas',
    direction: 'forward',
    progressIndex: 12.1,
    speedKmH: 28,
    availableSeats: 6,
    totalSeats: 22,
    occupancyPercent: 85,
    statusText: 'Tanjakan Lereng Baturraden',
    isDwellAtStation: false,
    dwellRemainingSec: 0,
    currentStopName: 'Mandala Wisata',
    nextStopName: 'Terminal Baturraden',
    etaSeconds: 80,
    distanceMeters: 380,
    x: 505,
    y: 40,
    acTemp: 20,
    isWheelchairReady: true,
  },
  {
    id: 'tb-301',
    code: 'TB-301',
    plateNumber: 'R 7034 OA',
    driverName: 'Pak Wahyu Hidayat',
    corridorId: 'k3a',
    corridorCode: '3A',
    operator: 'Trans Banyumas',
    direction: 'forward',
    progressIndex: 4.8,
    speedKmH: 30,
    availableSeats: 16,
    totalSeats: 22,
    occupancyPercent: 42,
    statusText: 'Loop Searah Jarum Jam di Jl. Sudirman',
    isDwellAtStation: false,
    dwellRemainingSec: 0,
    currentStopName: 'Moro / Rajawali',
    nextStopName: 'Pasar Wage (Jl. Sudirman)',
    etaSeconds: 110,
    distanceMeters: 480,
    x: 545,
    y: 282,
    acTemp: 22,
    isWheelchairReady: true,
  },
  {
    id: 'tb-308',
    code: 'TB-308',
    plateNumber: 'R 7039 OA',
    driverName: 'Pak Agus Supriyadi',
    corridorId: 'k3b',
    corridorCode: '3B',
    operator: 'Trans Banyumas',
    direction: 'forward',
    progressIndex: 4.3,
    speedKmH: 33,
    availableSeats: 11,
    totalSeats: 22,
    occupancyPercent: 65,
    statusText: 'Area Kampus Unsoed Grendeng',
    isDwellAtStation: false,
    dwellRemainingSec: 0,
    currentStopName: 'Kampus Unsoed',
    nextStopName: 'RS Jatiwinangun / DKT',
    etaSeconds: 160,
    distanceMeters: 620,
    x: 625,
    y: 185,
    acTemp: 21,
    isWheelchairReady: true,
  },
  {
    id: 'tb-404',
    code: 'TB-404',
    plateNumber: 'R 7044 OA',
    driverName: 'Pak Hendro Wibowo',
    corridorId: 'k4',
    corridorCode: '4',
    operator: 'Trans Banyumas',
    direction: 'forward',
    progressIndex: 2.8,
    speedKmH: 42,
    availableSeats: 15,
    totalSeats: 22,
    occupancyPercent: 50,
    statusText: 'Melintas Depo Pelita Menuju Sokaraja',
    isDwellAtStation: false,
    dwellRemainingSec: 0,
    currentStopName: 'Depo Pelita',
    nextStopName: 'RSU Wiradadi Husada',
    etaSeconds: 140,
    distanceMeters: 800,
    x: 690,
    y: 465,
    acTemp: 22,
    isWheelchairReady: true,
  },
  {
    id: 'tj-01',
    code: 'TJ-01',
    plateNumber: 'AA 1042 B',
    driverName: 'Pak Sigit Purnomo',
    corridorId: 'b1',
    corridorCode: 'B1',
    operator: 'Trans Jateng',
    direction: 'forward',
    progressIndex: 5.6,
    speedKmH: 45,
    availableSeats: 18,
    totalSeats: 30,
    occupancyPercent: 40,
    statusText: 'Menuju Terminal Purbalingga',
    isDwellAtStation: false,
    dwellRemainingSec: 0,
    currentStopName: 'Terminal Jompo',
    nextStopName: 'Terminal Purbalingga',
    etaSeconds: 240,
    distanceMeters: 1400,
    x: 870,
    y: 345,
    acTemp: 20,
    isWheelchairReady: true,
  },
];

// Calculate smoothly interpolated (x, y) along waypoints
export function interpolateWaypointPosition(
  waypoints: RouteWaypoint[],
  progressIndex: number
): { x: number; y: number; prevStop: string; nextStop: string } {
  if (waypoints.length === 0) return { x: 0, y: 0, prevStop: '', nextStop: '' };

  const clamped = Math.max(0, Math.min(waypoints.length - 1, progressIndex));
  const idx = Math.floor(clamped);
  const frac = clamped - idx;

  const current = waypoints[idx];
  const next = waypoints[Math.min(waypoints.length - 1, idx + 1)];

  const x = current.x + (next.x - current.x) * frac;
  const y = current.y + (next.y - current.y) * frac;

  return {
    x,
    y,
    prevStop: current.name,
    nextStop: next.name,
  };
}
