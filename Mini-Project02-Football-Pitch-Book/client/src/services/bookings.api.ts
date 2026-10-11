import type {
  Booking,
  CancelBookingPayload,
  CreateBookingPayload,
  FindBookingPayload,
  Quote,
} from "../types/booking.types";
import { request } from "./http";

export function getQuote(
  pitchId: string,
  date: string,
  startTime: string,
  durationHours: number,
): Promise<Quote> {
  const params = new URLSearchParams({
    date,
    startTime,
    durationHours: String(durationHours),
  });

  return request<Quote>(
    `/pitches/${encodeURIComponent(pitchId)}/quote?${params.toString()}`,
  );
}

export function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  return request<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function findBooking(payload: FindBookingPayload): Promise<Booking> {
  return request<Booking>("/bookings/find", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function cancelBooking(
  code: string,
  payload: CancelBookingPayload,
): Promise<Booking> {
  return request<Booking>(`/bookings/${encodeURIComponent(code)}/cancel`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
