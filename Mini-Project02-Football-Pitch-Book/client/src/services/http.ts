const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"
).replace(/\/+$/, "");

const NETWORK_ERROR_MESSAGE =
  "Cannot reach the server. Please check your connection and try again.";

const STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid input. Please check your data.",
  404: "The requested resource was not found.",
  409: "There is a conflict with this request (e.g., pitch already booked).",
  500: "A server error occurred. Please try again later.",
};

export interface ApiErrorType extends Error {
  status: number | null;
}

export function ApiError(
  message: string,
  status: number | null = null,
): ApiErrorType {
  const error = new Error(message) as ApiErrorType;
  error.name = "ApiError";
  error.status = status;
  return error;
}

function isApiErrorResponse(value: unknown): value is { message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
}

function getHttpErrorMessage(status: number, data: unknown): string {
  if (isApiErrorResponse(data)) {
    return data.message;
  }

  return STATUS_MESSAGES[status] ?? `Request failed with status ${status}.`;
}

export async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let response: Response;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const headers = new Headers(options?.headers);

  if (options?.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      ...options,
      headers,
    });
  } catch {
    throw ApiError(NETWORK_ERROR_MESSAGE, null);
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw ApiError(
        getHttpErrorMessage(response.status, null),
        response.status,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    throw ApiError("The server returned an invalid response.", response.status);
  }

  if (!response.ok) {
    throw ApiError(getHttpErrorMessage(response.status, data), response.status);
  }

  return data as T;
}
