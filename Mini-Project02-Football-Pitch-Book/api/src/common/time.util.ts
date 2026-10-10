import { MAX_ADVANCE_DAYS } from './constants';

export function parseHour(time: string): number {
  return Number(time.split(':')[0]);
}

export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDateTime(date: string, hour: number): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, hour, 0, 0, 0);
}

export function isPastSlot(date: string, hour: number, now: Date): boolean {
  return toDateTime(date, hour) <= now;
}

export function isWithinBookingWindow(date: string, now: Date): boolean {
  const lastAllowedDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + MAX_ADVANCE_DAYS,
  );
  return date <= toDateString(lastAllowedDay);
}
