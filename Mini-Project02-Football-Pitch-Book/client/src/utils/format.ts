const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/;

/**
 * `'2026-10-16'` -> `Fri, 16 Oct 2026`.
 * The text is read part by part, so the calendar date never shifts through a time zone.
 * A value that is not a real `YYYY-MM-DD` date is returned unchanged.
 */
export function formatDate(date: string): string {
  const match = DATE_PATTERN.exec(date);
  if (!match) return date;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const utc = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day;
  if (!isRealDate) return date;

  return `${WEEKDAYS[utc.getUTCDay()]}, ${day} ${MONTHS[month - 1]} ${year}`;
}

/**
 * `'20:00'` -> `20:00`. The API already sends `HH:mm`; this keeps one place for time display.
 * A value that is not a real time is returned unchanged.
 */
export function formatTime(time: string): string {
  const match = TIME_PATTERN.exec(time);
  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return time;

  return `${String(hours).padStart(2, "0")}:${match[2]}`;
}

/**
 * `30` -> `$30`. Whole amounts have no decimals; other amounts show two decimals.
 * A number that is not finite shows an em dash instead of `$NaN`.
 * The frontend only displays prices from the API. It never calculates them.
 */
export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

/** `1` -> `1 hour`, `2` -> `2 hours`. A number that is not finite shows an em dash. */
export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours)) return "—";
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}
