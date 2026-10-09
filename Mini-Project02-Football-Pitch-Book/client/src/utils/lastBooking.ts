import { FindBookingPayload as LastBooking } from "../types/booking.types";

const LAST_BOOK_KEY = "pb.lastBooking";

function isLastBooking(value: unknown): value is LastBooking {
  if (typeof value != "object" || value === null) return false;

  if (!("code" in value) || !("customerPhone" in value)) return false;

  return (
    typeof value.code === "string" && typeof value.customerPhone === "string"
  );
}

export function saveLastBooking(booking: LastBooking): void {
  try {
    sessionStorage.setItem(LAST_BOOK_KEY, JSON.stringify(booking));
  } catch {
    console.log("Storage may be unavailable; the app should still work.");
  }
}

export function getLastBooing(): LastBooking | null {
  try {
    const storedValue = sessionStorage.getItem(LAST_BOOK_KEY);
    if (storedValue === null) return null;
    const lastbooking: unknown = JSON.parse(storedValue);
    return isLastBooking(lastbooking) ? lastbooking : null;
  } catch {
    console.log(
      "The value may be invalid JSON, or storage may be unavailable.",
    );
    return null;
  }
}
