import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  cancelBooking,
  createBooking,
  findBooking,
  getQuote,
} from "../services/bookings.api";

import type {
  Booking,
  CancelBookingPayload,
  CreateBookingPayload,
  FindBookingPayload,
  Quote,
} from "../types/booking.types";

interface BookingContextValue {
  quote: Quote | null;
  isQuoteLoading: boolean;
  quoteError: string | null;
  loadQuote: (
    pitchId: string,
    date: string,
    startTime: string,
    durationHours: number,
  ) => Promise<void>;

  booking: Booking | null;
  isBookingLoading: boolean;
  bookingError: string | null;
  submitBooking: (payload: CreateBookingPayload) => Promise<Booking | null>;
  lookupBooking: (payload: FindBookingPayload) => Promise<boolean>;
  cancelCurrentBooking: () => Promise<boolean>;
  clearBooking: () => void;
}

interface BookingProviderProps {
  children: ReactNode;
}

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined,
);

export function BookingProvider({ children }: BookingProviderProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const quoteRequestId = useRef(0);

  const bookingSubmissionInProgress = useRef(false);
  const bookingLookupInProgress = useRef(false);
  const cancellationInProgress = useRef(false);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const loadQuote = useCallback(
    async (
      pitchId: string,
      date: string,
      startTime: string,
      durationHours: number,
    ): Promise<void> => {
      const requestId = ++quoteRequestId.current;

      setIsQuoteLoading(true);
      setQuoteError(null);
      setQuote(null);

      try {
        const result = await getQuote(pitchId, date, startTime, durationHours);

       
        if (requestId === quoteRequestId.current) {
          setQuote(result);
        }
      } catch (error: unknown) {
        if (requestId === quoteRequestId.current) {
          setQuoteError(
            error instanceof Error
              ? error.message
              : "Unable to load the price quote.",
          );
        }
      } finally {
        if (requestId === quoteRequestId.current) {
          setIsQuoteLoading(false);
        }
      }
    },
    [],
  );

  const submitBooking = useCallback(
    async (payload: CreateBookingPayload): Promise<Booking | null> => {
      if (bookingSubmissionInProgress.current) {
        return null;
      }

      bookingSubmissionInProgress.current = true;
      setIsBookingLoading(true);
      setBookingError(null);

      try {
        const result = await createBooking(payload);

        setBooking(result);
        return result;
      } catch (error: unknown) {
        setBookingError(
          error instanceof Error
            ? error.message
            : "Unable to create the booking.",
        );

        return null;
      } finally {
        bookingSubmissionInProgress.current = false;
        setIsBookingLoading(false);
      }
    },
    [],
  );

  const lookupBooking = useCallback(
    async (payload: FindBookingPayload): Promise<boolean> => {
      if (bookingLookupInProgress.current) {
        return false;
      }

      bookingLookupInProgress.current = true;
      setIsBookingLoading(true);
      setBookingError(null);

      try {
        const result = await findBooking(payload);

        setBooking(result);
        return true;
      } catch (error: unknown) {
        setBooking(null);
        setBookingError(
          error instanceof Error
            ? error.message
            : "Unable to find the booking.",
        );

        return false;
      } finally {
        bookingLookupInProgress.current = false;
        setIsBookingLoading(false);
      }
    },
    [],
  );

  const cancelCurrentBooking = useCallback(async (): Promise<boolean> => {
    if (cancellationInProgress.current) {
      return false;
    }
    if (!booking) {
      setBookingError("No booking is available to cancel.");
      return false;
    }
    cancellationInProgress.current = true;

    const currentBooking = booking;
    const payload: CancelBookingPayload = {
      customerPhone: currentBooking.customerPhone,
    };

    setIsBookingLoading(true);
    setBookingError(null);

    try {
      const updatedBooking = await cancelBooking(currentBooking.code, payload);

      setBooking(updatedBooking);
      return true;
    } catch (error: unknown) {
      const cancellationError =
        error instanceof Error
          ? error.message
          : "Unable to cancel the booking.";

      // Refresh the booking in case its status changed on the server.
      try {
        const refreshedBooking = await findBooking({
          customerPhone: currentBooking.customerPhone,
          code: currentBooking.code,
        });

        setBooking(refreshedBooking);
      } catch {
        // Keep the last known booking if refreshing also fails.
      }

      // Keep the original cancellation error, not the refresh error.
      setBookingError(cancellationError);
      return false;
    } finally {
      cancellationInProgress.current = false;
      setIsBookingLoading(false);
    }
  }, [booking]);

  const clearBooking = useCallback((): void => {
    setBooking(null);
    setBookingError(null);
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({
      quote,
      isQuoteLoading,
      quoteError,
      loadQuote,
      booking,
      isBookingLoading,
      bookingError,
      submitBooking,
      lookupBooking,
      cancelCurrentBooking,
      clearBooking,
    }),
    [
      quote,
      isQuoteLoading,
      quoteError,
      loadQuote,
      booking,
      isBookingLoading,
      bookingError,
      submitBooking,
      lookupBooking,
      cancelCurrentBooking,
      clearBooking,
    ],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);

  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider.");
  }

  return context;
}
