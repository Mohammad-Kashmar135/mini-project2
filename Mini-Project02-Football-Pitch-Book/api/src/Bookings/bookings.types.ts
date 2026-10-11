import type { StoredBookingStatus } from "../data/data";

export type BookingStatus = StoredBookingStatus | "Completed";

export interface StoredBooking {
  code: string;
  pitchId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: 1 | 2;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: StoredBookingStatus;
  createdAt: string;
  cancelledAt?: string;
}

export interface BookingResponse {
  code: string;
  pitchId: string;
  pitchName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: 1 | 2;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: BookingStatus;
  canCancel: boolean;
  createdAt: string;
  cancelledAt?: string;
}
