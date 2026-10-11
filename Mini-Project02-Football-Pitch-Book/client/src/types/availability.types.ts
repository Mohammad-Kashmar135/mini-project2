// Copies the "DayAvailability" contract in docs/API.md (section 4.3).
// Do not change a field here without updating the API documentation first.

export type SlotStatus = "available" | "booked" | "past";

export interface Slot {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: SlotStatus;
  price: number;
  isPeak: boolean;
}

export interface DayAvailability {
  pitchId: string;
  date: string; // YYYY-MM-DD
  slots: Slot[];
}
