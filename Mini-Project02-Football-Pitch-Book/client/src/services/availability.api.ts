import type { DayAvailability } from "../types/availability.types";
import { request } from "./http";

/**
 * GET /pitches/:pitchId/availability?date=YYYY-MM-DD
 *
 * The path is relative to VITE_API_URL (which already ends with /api).
 * Errors are turned into `ApiError` by `request`, so they are not handled here.
 * Only AvailabilityContext calls this function.
 */
export function getDayAvailability(pitchId: string, date: string): Promise<DayAvailability> {
  return request<DayAvailability>(
    `/pitches/${encodeURIComponent(pitchId)}/availability?date=${encodeURIComponent(date)}`,
  );
}
