import type {
  Booking,
  CancelBookingPayload,
  CreateBookingPayload,
  FindBookingPayload,
  Quote,
} from "../types/booking.types";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"
).replace(/\/+$/, "");

const NETWORK_ERROR_MESSAGE =
  "Cannot reach the server. Please check your connection and try again.";

const SERVER_ERROR_MESSAGE = "Something went wrong. Please try again.";

interface ApiErrorBody {
  message?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0);
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(SERVER_ERROR_MESSAGE, response.status);
    }

    throw new ApiError(SERVER_ERROR_MESSAGE, response.status);
  }

  if (!response.ok) {
    const body = data as ApiErrorBody;
    const message =
      typeof body?.message === "string" ? body.message : SERVER_ERROR_MESSAGE;

    throw new ApiError(message, response.status);
  }

  return data as T;
}

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
