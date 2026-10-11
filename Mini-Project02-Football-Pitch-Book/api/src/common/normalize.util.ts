/**
 * Remove spaces and dashes from a phone number before validating or storing it.
 * Example: '+963 912-345-678' becomes '+963912345678'.
 */
export function normalizePhone(value: string): string {
  return value.replace(/[\s-]/g, '');
}

/**
 * Normalize a booking code so lookups are case-insensitive and whitespace-safe.
 * Example: ' pb-4821 ' becomes 'PB-4821'.
 */
export function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}
