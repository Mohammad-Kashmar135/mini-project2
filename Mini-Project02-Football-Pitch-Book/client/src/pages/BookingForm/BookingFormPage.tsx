import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { useBooking } from "../../context/BookingContext.tsx";
import { usePitches } from "../../context/PitchesContext.tsx";
import { saveLastBooking } from "../../utils/lastBooking.ts";

import CustomerFields from "./CustomerFields.tsx";
import PriceSummary from "./PriceSummary.tsx";
import "./BookingFormPage.css";

export default function BookingFormPage() {
  const { pitchId = "" } = useParams<{ pitchId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const date = searchParams.get("date") ?? "";
  const startTime = searchParams.get("start") ?? "";
  const durationValue = searchParams.get("duration") ?? "";
  const duration = Number(durationValue);

  const hasValidSelection =
    Boolean(pitchId) &&
    Boolean(date) &&
    Boolean(startTime) &&
    (durationValue === "1" || durationValue === "2");

  const { currentPitch, isPitchLoading, pitchError, loadPitch } = usePitches();

  const {
    quote,
    isQuoteLoading,
    quoteError,
    loadQuote,
    isBookingLoading,
    bookingError,
    submitBooking,
    clearBooking,
  } = useBooking();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [overlapError, setOverlapError] = useState(false);

  // Protect against two rapid submissions before React re-renders.
  const submissionInProgress = useRef(false);

  useEffect(() => {
    clearBooking();
  }, [clearBooking]);

  useEffect(() => {
    if (!hasValidSelection) return;

    void loadPitch(pitchId);
    void loadQuote(pitchId, date, startTime, duration);
  }, [
    pitchId,
    date,
    startTime,
    duration,
    hasValidSelection,
    loadPitch,
    loadQuote,
  ]);

  const isLoading = isPitchLoading || isQuoteLoading;
  const isSubmitting = isBookingLoading;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current || isSubmitting) return;

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();

    const nextNameError = trimmedName ? null : "Please enter your name.";

    const nextPhoneError = trimmedPhone
      ? null
      : "Please enter your phone number.";

    setNameError(nextNameError);
    setPhoneError(nextPhoneError);
    setOverlapError(false);

    if (nextNameError || nextPhoneError) return;
    if (!hasValidSelection || !quote) return;

    submissionInProgress.current = true;

    try {
      const booking = await submitBooking({
        pitchId,
        date,
        startTime,
        durationHours: duration as 1 | 2,
        customerName: trimmedName,
        customerPhone: trimmedPhone,
      });

      if (booking) {
        saveLastBooking({
          code: booking.code,
          customerPhone: booking.customerPhone,
        });
        navigate(`/confirmation/${encodeURIComponent(booking.code)}`);
        return;
      }

      // Detect common overlap wording without replacing the API message.
      // The exact message is still displayed from bookingError.
      // A failed request does not clear either customer field.
    } finally {
      submissionInProgress.current = false;
    }
  }

  useEffect(() => {
    const message = bookingError?.toLowerCase() ?? "";

    setOverlapError(
      message.includes("overlap") ||
        message.includes("already booked") ||
        message.includes("conflict"),
    );
  }, [bookingError]);

  const availabilityUrl =
    `/pitches/${encodeURIComponent(pitchId)}/availability` +
    (date ? `?date=${encodeURIComponent(date)}` : "");

  if (!hasValidSelection) {
    return (
      <main className="booking-form-page">
        <section className="booking-form-page__message">
          <h1>Choose a time first</h1>
          <p>Please choose a time first.</p>
          <Link to={availabilityUrl}>Back to availability</Link>
        </section>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="booking-form-page">
        <p className="booking-form-page__notice" role="status">
          Loading booking details and price…
        </p>
      </main>
    );
  }

  if (pitchError || quoteError || !quote) {
    return (
      <main className="booking-form-page">
        <section className="booking-form-page__message" role="alert">
          <h1>Unable to load your booking</h1>
          <p>{pitchError ?? quoteError ?? "Unable to load the price quote."}</p>
          <Link to={availabilityUrl}>Back to availability</Link>
          <button
            className="booking-form-page__secondary-button"
            type="button"
            onClick={() => {
              void loadPitch(pitchId);
              void loadQuote(pitchId, date, startTime, duration);
            }}
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  const displayedPitchName =
    currentPitch?.id === pitchId ? currentPitch.name : "";

  if (!displayedPitchName) {
    return (
      <main className="booking-form-page">
        <p className="booking-form-page__notice" role="status">
          Loading pitch details…
        </p>
      </main>
    );
  }

  return (
    <main className="booking-form-page">
      <header className="booking-form-page__header">
        <Link className="booking-form-page__back-link" to={availabilityUrl}>
          ← Change time
        </Link>
        <h1>Complete your booking</h1>
        <p>Check the price and enter your contact details.</p>
      </header>

      <div className="booking-form-page__layout">
        <PriceSummary pitchName={displayedPitchName} quote={quote} />

        <section className="booking-form-page__form-panel">
          <h2>Your details</h2>

          <form onSubmit={handleSubmit} noValidate>
            <CustomerFields
              customerName={customerName}
              customerPhone={customerPhone}
              onNameChange={(value) => {
                setCustomerName(value);
                if (value.trim()) setNameError(null);
              }}
              onPhoneChange={(value) => {
                setCustomerPhone(value);
                if (value.trim()) setPhoneError(null);
              }}
              nameError={nameError}
              phoneError={phoneError}
              disabled={isSubmitting}
            />

            {bookingError && (
              <div className="booking-form-page__error" role="alert">
                <p>{bookingError}</p>
                {overlapError && (
                  <Link to={availabilityUrl}>Choose another time</Link>
                )}
              </div>
            )}

            <button
              className="booking-form-page__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking…" : "Confirm booking"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
