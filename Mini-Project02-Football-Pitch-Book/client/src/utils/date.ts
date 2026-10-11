const pad = (value: number, length = 2): string =>
  String(value).padStart(length, "0");

export function toDateString(date: Date): string {
  if (Number.isNaN(date.getTime())) return "";
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Today (local date) as `YYYY-MM-DD`. */
export function getTodayString(): string {
  return toDateString(new Date());
}

/** Today plus `days` (local date) as `YYYY-MM-DD`. Negative numbers go back in time. */
export function addDaysToToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateString(date);
}
