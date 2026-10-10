export function ApiError(message: string): Error {
  const error = new Error(message);
  error.name = "ApiError";
  return error;
}

export async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw ApiError(
        errorData.message || "Something went wrong. Please try again.",
      );
    }

    return response.json();
  } catch (error: any) {
    if (error.name === "ApiError") {
      throw error;
    }
    throw ApiError(
      "Cannot reach the server. Please check your connection and try again.",
    );
  }
}
