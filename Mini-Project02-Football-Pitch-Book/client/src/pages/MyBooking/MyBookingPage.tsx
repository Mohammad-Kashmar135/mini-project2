import { useState } from "react";

import { useBooking } from "../../context/BookingContext.tsx";
import type { FindBookingPayload } from "../../types/booking.types.ts";
import FindBookingForm from "./FindBookingForm.tsx";
import BookingDetails from "./BookingDetails.tsx";
import "./MyBookingPage.css";

export default function MyBookingPage() {
  const {
    booking,
    isBookingLoading,
    bookingError,
    lookupBooking,
    cancelCurrentBooking,
  } = useBooking();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleFind(payload: FindBookingPayload): Promise<void> {
    setSuccessMessage(null);
    await lookupBooking(payload);
  }

  async function handleCancel(): Promise<void> {
    if (!booking || isBookingLoading) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${booking.code}?`,
    );

    if (!confirmed) {
      return;
    }

    setSuccessMessage(null);

    const cancelled = await cancelCurrentBooking();

    if (cancelled) {
      setSuccessMessage("Your booking cancellation was successful.");
    }
  }

  return (
    <main className="my-booking-page">
      <div className="my-booking-container">
        <header className="my-booking-header">
          <h1>My Booking</h1>
          <p>
            Enter the phone number and confirmation code you used when making
            your booking.
          </p>
        </header>

        <section
          className="my-booking-search"
          aria-labelledby="my-booking-search-title"
        >
          <h2 id="my-booking-search-title">Find a booking</h2>
          <FindBookingForm isLoading={isBookingLoading} onFind={handleFind} />
        </section>

        {bookingError && (
          <p
            className="my-booking-message my-booking-message--error"
            role="alert"
          >
            {bookingError}
          </p>
        )}

        {successMessage && (
          <p
            className="my-booking-message my-booking-message--success"
            role="status"
          >
            {successMessage}
          </p>
        )}

        {booking && (
          <BookingDetails
            booking={booking}
            isLoading={isBookingLoading}
            onCancel={handleCancel}
          />
        )}
      </div>
    </main>
  );
}
