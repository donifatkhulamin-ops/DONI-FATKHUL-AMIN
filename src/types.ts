export type TabType = 'dashboard' | 'rencana' | 'tracking' | 'tiket' | 'antarmoda' | 'history' | 'peta';

export interface BusCorridor {
  id: string;
  code: string;
  name: string;
  operator: 'Trans Banyumas' | 'Trans Jateng';
  origin: string;
  destination: string;
  status: 'Lancar' | 'Normal' | 'Padat';
  color: string;
  operatingHours: string;
  fareGeneral: number;
  fareSpecial: number;
  keyStops: string[];
}

export interface LiveBus {
  id: string;
  code: string;
  corridorId: string;
  corridorCode: string;
  operator: 'Trans Banyumas' | 'Trans Jateng';
  headingTo: string;
  status: string;
  availableSeats: number;
  totalSeats: number;
  occupancyPercent: number;
  etaMinutes: number;
  distanceMeters: number;
  currentStop: string;
  nextStop: string;
  speedKmH: number;
  latitude: number;
  longitude: number;
  punctuality: 'Tepat Waktu' | 'Sedikit Terlambat' | 'Lebih Awal';
}

export interface BusStop {
  id: string;
  name: string;
  corridorIds: string[];
  distanceToUser: string;
  walkMinutes: number;
  isHub: boolean;
  platform: string;
  feederCount: number;
}

export interface TripLeg {
  id: string;
  type: 'feeder' | 'bus' | 'walk';
  title: string;
  subtitle: string;
  distance: string;
  duration: string;
  cost: number;
  badge?: string;
  badgeColor?: string;
  busCorridorCode?: string;
  hubWaitMinutes?: number;
}

export interface TripRecommendation {
  id: string;
  title: string;
  isBest?: boolean;
  tag?: string;
  durationMinutes: number;
  totalCost: number;
  distanceKm: number;
  legs: TripLeg[];
  summaryNote?: string;
}

export interface UserTicket {
  ticketId: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'completed' | 'expired';
  origin: string;
  destination: string;
  legs: {
    sequence: number;
    title: string;
    description: string;
    cost: number;
    type: 'feeder' | 'bus' | 'walk';
  }[];
  totalFare: number;
  discount: number;
  paymentMethod: 'qris' | 'nfc' | 'wallet';
  passengerType: 'Umum' | 'Pelajar' | 'Mahasiswa' | 'Lansia' | 'Disabilitas';
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  nik?: string;
  isSubsidyVerified: boolean;
  subsidyType?: 'Pelajar' | 'Mahasiswa' | 'Lansia' | 'Disabilitas';
  walletBalance: number;
  isLoggedIn: boolean;
}

export interface HistoryTrip {
  id: string;
  bookingCode: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  corridors: string[];
  transportModes: ('bus' | 'feeder' | 'walk')[];
  totalFare: number;
  originalFare?: number;
  discountSaved?: number;
  distanceKm: number;
  durationMinutes: number;
  paymentMethod: 'qris' | 'nfc' | 'wallet';
  status: 'completed' | 'cancelled';
  legs: {
    title: string;
    description: string;
    fare: number;
    mode: 'bus' | 'feeder' | 'walk';
    corridorCode?: string;
  }[];
}

