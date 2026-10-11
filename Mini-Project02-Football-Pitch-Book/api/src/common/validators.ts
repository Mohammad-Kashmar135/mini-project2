import { registerDecorator, ValidationOptions } from "class-validator";

/**
 * Registers a reusable custom validation decorator.
 */
function createValidatorDecorator(
  name: string,
  isValid: (value: unknown) => boolean,
  defaultMessage: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    registerDecorator({
      name,
      target: target.constructor,
      propertyName: String(propertyName),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return isValid(value);
        },

        defaultMessage(): string {
          return defaultMessage;
        },
      },
    });
  };
}

/**
 * Checks that a date is in YYYY-MM-DD format
 * and represents a real calendar date.
 */
function isCalendarDate(value: unknown): boolean {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (year < 1 || month < 1 || month > 12) {
    return false;
  }

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return day >= 1 && day <= daysInMonth[month - 1];
}

/**
 * Checks that a time uses HH:00 format,
 * with an hour between 00 and 23.
 */
function isOnTheHour(value: unknown): boolean {
  return typeof value === "string" && /^(?:[01]\d|2[0-3]):00$/.test(value);
}

/**
 * Checks a phone number after removing spaces and dashes.
 * The remaining number must contain 8 to 15 digits,
 * with an optional leading plus sign.
 */
function isValidPhone(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const normalizedPhone = value.replace(/[\s-]/g, "");

  return /^\+?\d{8,15}$/.test(normalizedPhone);
}

/**
 * Custom decorator for real calendar dates.
 */
export function IsCalendarDate(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return createValidatorDecorator(
    "isCalendarDate",
    isCalendarDate,
    "Date must be a valid calendar date.",
    validationOptions,
  );
}

/**
 * Custom decorator for times on the hour.
 */
export function IsOnTheHour(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return createValidatorDecorator(
    "isOnTheHour",
    isOnTheHour,
    "Time must be on the hour.",
    validationOptions,
  );
}

/**
 * Custom decorator for valid phone numbers.
 */
export function IsValidPhone(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return createValidatorDecorator(
    "isValidPhone",
    isValidPhone,
    "Phone number must contain 8 to 15 digits.",
    validationOptions,
  );
}
