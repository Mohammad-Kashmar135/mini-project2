/**
 * Seed data for Football Pitch Booking (in-memory only).
 *
 * - Pitches are static.
 * - Bookings use dates RELATIVE to "today", so the demo always works
 *   (booked slots in the coming days, one Completed, one Cancelled).
 * - Stored status is only 'Confirmed' | 'Cancelled'.
 *   'Completed' is DERIVED when reading: Confirmed + end time already passed.
 *   (PB-1008 and PB-1009 are in the past, so they show as Completed.)
 * - totalPrice values below are pre-calculated with the pricing rules
 *   (peak = hours starting 18:00-21:00, each hour priced separately).
 *   The real price on new bookings must come from the PricingService.
 */

export const CURRENCY = 'USD';

export interface SeedPitch {
  id: string;
  name: string;
  type: '5-a-side' | '7-a-side';
  description: string;
  surface: string;
  normalPricePerHour: number;
  peakPricePerHour: number;
  openingTime: string; // HH:mm
  closingTime: string; // HH:mm
}

export type StoredBookingStatus = 'Confirmed' | 'Cancelled';

export interface SeedBooking {
  code: string;
  pitchId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationHours: 1 | 2;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: StoredBookingStatus;
  createdAt: string; // ISO
  cancelledAt?: string; // ISO
}

/* ----------------------------- Pitches ----------------------------- */

export const SEED_PITCHES: SeedPitch[] = [
  {
    id: 'pitch-a',
    name: 'Pitch A',
    type: '5-a-side',
    description: 'Compact indoor pitch, ideal for quick matches with friends.',
    surface: 'Artificial grass',
    normalPricePerHour: 20,
    peakPricePerHour: 30,
    openingTime: '08:00',
    closingTime: '23:00',
  },
  {
    id: 'pitch-b',
    name: 'Pitch B',
    type: '5-a-side',
    description: 'Outdoor 5-a-side pitch with floodlights for evening games.',
    surface: 'Artificial grass',
    normalPricePerHour: 18,
    peakPricePerHour: 28,
    openingTime: '08:00',
    closingTime: '23:00',
  },
  {
    id: 'pitch-c',
    name: 'Pitch C',
    type: '7-a-side',
    description: 'Mid-size pitch for bigger groups, with seating along the side.',
    surface: 'Artificial grass',
    normalPricePerHour: 35,
    peakPricePerHour: 50,
    openingTime: '08:00',
    closingTime: '23:00',
  },
  {
    id: 'pitch-d',
    name: 'Pitch D',
    type: '7-a-side',
    description: 'Premium 7-a-side pitch with the best surface and lighting.',
    surface: 'Premium turf',
    normalPricePerHour: 40,
    peakPricePerHour: 60,
    openingTime: '09:00',
    closingTime: '23:00',
  },
];

/* ----------------------------- Helpers ----------------------------- */

const pad = (n: number): string => String(n).padStart(2, '0');

/** Local date as YYYY-MM-DD, `offset` days from today (negative = past). */
const dateFromToday = (offset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const hoursAgoIso = (hours: number): string =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

/* ----------------------------- Bookings ---------------------------- */

/**
 * Call once when the server starts (e.g. in BookingsStore constructor).
 *
 * Demo cases covered:
 *  - Friday-style scenario on Pitch A (+2 days): 19:00 booked, 20:00 and 21:00 free
 *    (the 20:00 booking PB-1010 is Cancelled, so it does NOT block the slot).
 *  - Overlap rejection: try 21:00-23:00 on Pitch C (+3 days) -> overlaps PB-1004.
 *  - Same time on different pitches allowed: PB-1004 (Pitch C) and PB-1011 (Pitch D).
 *  - Mixed normal + peak pricing: PB-1003 (17:00-19:00).
 *  - Completed: PB-1008, PB-1009 (past, still stored as Confirmed).
 *  - Cancelled: PB-1010.
 *
 * NOT seedable (depends on the current time): the "cancel within 2 hours" rejection.
 * To demo it, create a booking that starts within the next 2 hours, then try to cancel.
 */
export const createSeedBookings = (): SeedBooking[] => [
  // --- Upcoming (Confirmed) ---
  {
    code: 'PB-1001',
    pitchId: 'pitch-a',
    date: dateFromToday(2),
    startTime: '19:00',
    endTime: '20:00',
    durationHours: 1,
    customerName: 'Sami Darwish',
    customerPhone: '0955000101',
    totalPrice: 30, // 1 peak
    status: 'Confirmed',
    createdAt: hoursAgoIso(30),
  },
  {
    code: 'PB-1002',
    pitchId: 'pitch-a',
    date: dateFromToday(1),
    startTime: '08:00',
    endTime: '10:00',
    durationHours: 2,
    customerName: 'Lina Haddad',
    customerPhone: '0955000102',
    totalPrice: 40, // 2 normal
    status: 'Confirmed',
    createdAt: hoursAgoIso(26),
  },
  {
    code: 'PB-1003',
    pitchId: 'pitch-b',
    date: dateFromToday(1),
    startTime: '17:00',
    endTime: '19:00',
    durationHours: 2,
    customerName: 'Omar Khalil',
    customerPhone: '0955000103',
    totalPrice: 46, // 1 normal (17:00) + 1 peak (18:00)
    status: 'Confirmed',
    createdAt: hoursAgoIso(20),
  },
  {
    code: 'PB-1004',
    pitchId: 'pitch-c',
    date: dateFromToday(3),
    startTime: '20:00',
    endTime: '22:00',
    durationHours: 2,
    customerName: 'Rami Nasser',
    customerPhone: '0955000104',
    totalPrice: 100, // 2 peak
    status: 'Confirmed',
    createdAt: hoursAgoIso(18),
  },
  {
    code: 'PB-1005',
    pitchId: 'pitch-d',
    date: dateFromToday(4),
    startTime: '18:00',
    endTime: '19:00',
    durationHours: 1,
    customerName: 'Hiba Mansour',
    customerPhone: '0955000105',
    totalPrice: 60, // 1 peak
    status: 'Confirmed',
    createdAt: hoursAgoIso(12),
  },
  {
    code: 'PB-1006',
    pitchId: 'pitch-b',
    date: dateFromToday(5),
    startTime: '20:00',
    endTime: '22:00',
    durationHours: 2,
    customerName: 'Tarek Aziz',
    customerPhone: '0955000106',
    totalPrice: 56, // 2 peak
    status: 'Confirmed',
    createdAt: hoursAgoIso(8),
  },
  {
    code: 'PB-1007',
    pitchId: 'pitch-d',
    date: dateFromToday(6),
    startTime: '10:00',
    endTime: '11:00',
    durationHours: 1,
    customerName: 'Dana Youssef',
    customerPhone: '0955000107',
    totalPrice: 40, // 1 normal
    status: 'Confirmed',
    createdAt: hoursAgoIso(6),
  },
  {
    code: 'PB-1011',
    pitchId: 'pitch-d',
    date: dateFromToday(3),
    startTime: '20:00',
    endTime: '21:00',
    durationHours: 1,
    customerName: 'Fadi Saleh',
    customerPhone: '0955000111',
    totalPrice: 60, // 1 peak (same time as PB-1004, different pitch)
    status: 'Confirmed',
    createdAt: hoursAgoIso(5),
  },

  // --- Past (stored Confirmed -> shown as Completed) ---
  {
    code: 'PB-1008',
    pitchId: 'pitch-a',
    date: dateFromToday(-1),
    startTime: '19:00',
    endTime: '21:00',
    durationHours: 2,
    customerName: 'Nour Ibrahim',
    customerPhone: '0955000108',
    totalPrice: 60, // 2 peak
    status: 'Confirmed',
    createdAt: hoursAgoIso(72),
  },
  {
    code: 'PB-1009',
    pitchId: 'pitch-c',
    date: dateFromToday(-2),
    startTime: '18:00',
    endTime: '19:00',
    durationHours: 1,
    customerName: 'Yazan Othman',
    customerPhone: '0955000109',
    totalPrice: 50, // 1 peak
    status: 'Confirmed',
    createdAt: hoursAgoIso(96),
  },

  // --- Cancelled (does not block its slot) ---
  {
    code: 'PB-1010',
    pitchId: 'pitch-a',
    date: dateFromToday(2),
    startTime: '20:00',
    endTime: '21:00',
    durationHours: 1,
    customerName: 'Majd Farah',
    customerPhone: '0955000110',
    totalPrice: 30, // 1 peak
    status: 'Cancelled',
    createdAt: hoursAgoIso(40),
    cancelledAt: hoursAgoIso(10),
  },
];