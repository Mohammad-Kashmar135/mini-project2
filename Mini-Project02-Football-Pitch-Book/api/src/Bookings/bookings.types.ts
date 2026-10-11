import { StoredBookingStatus } from "../data/data";
export interface StoredBooking {
  code: string;
  pitchId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string; // HH:mm
  durationHours: number;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: StoredBookingStatus;
  createdAt: string; // ISO
  cancelledAt?: string; // ISO
}

export interface BookingResponse {
  code: string;
  pitchId: string;
  pitchName: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string; // HH:mm
  durationHours: number;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: StoredBookingStatus;
  canCancel: true | false;
  createdAt: string; // ISO
  cancelledAt?: string; // ISO
}
