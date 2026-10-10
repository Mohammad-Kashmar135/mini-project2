export type BookingStatus = "Confirmed" | "Cancelled" | "Completed";

export interface Booking {
  code: string;
  pitchId: string;
  pitchName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: BookingStatus;
  canCancel: boolean;
}

export interface QuoteHour {
  startTime: string;
  price: number;
  isPeak: boolean;
}

export interface Quote {
  pitchId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hours: QuoteHour[];
  totalPrice: number;
}

export interface CreateBookingPayload {
  pitchId: string;
  date: string;
  startTime: string;
  durationHours: 1 | 2;
  customerName: string;
  customerPhone: string;
}

export interface FindBookingPayload {
  customerPhone: string;
  code: string;
}

export interface CancelBookingPayload {
  customerPhone: string;
}
