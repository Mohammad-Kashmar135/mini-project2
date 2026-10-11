export type SlotStatus = 'available' | 'booked' | 'past';

export interface Slot {
  startTime: string;
  endTime: string;
  status: SlotStatus;
  price: number;
  isPeak: boolean;
}

export interface DayAvailability {
  pitchId: string;
  date: string;
  slots: Slot[];
}
