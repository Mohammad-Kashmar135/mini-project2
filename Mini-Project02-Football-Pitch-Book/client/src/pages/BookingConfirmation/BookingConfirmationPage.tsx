import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useBooking } from "../../context/BookingContext.tsx";
import { getLastBooking } from "../../utils/lastBooking.ts";
import StatusBadge from "../../components/common/StatusBadge.tsx";
import "./BookingConfirmationPage.css";

export default function BookingConfirmationPage() {
  const { code } = useParams<{ code: string }>();
  const { booking, isBookingLoading, bookingError, lookupBooking } =
    useBooking();

  const [restoreError, setRestoreError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function restoreBooking() {
      if (!code || booking?.code === code) {
        return;
      }

      const lastBooking = getLastBooking();

      if (!lastBooking || lastBooking.code !== code) {
        setRestoreError(
          "Booking details are not available in this session. You can find your booking using your phone number and confirmation code.",
        );
        return;
      }

      setRestoreError(null);

      const found = await lookupBooking({
        customerPhone: lastBooking.customerPhone,
        code: lastBooking.code,
      });

      if (isActive && !found) {
        setRestoreError(
          "We couldn't retrieve this booking. Please try again from My Booking.",
        );
      }
    }

    void restoreBooking();

    return () => {
      isActive = false;
    };
  }, [code, booking?.code, lookupBooking]);

  const confirmedBooking = booking?.code === code ? booking : null;

  if (!code) {
    return (
      <main className="booking-confirmation-page">
        <section className="booking-confirmation-card">
          <h1>Booking confirmation</h1>
          <p>A confirmation code was not provided.</p>
          <Link to="/my-booking">Find my booking</Link>
        </section>
      </main>
    );
  }

  if (isBookingLoading && !confirmedBooking) {
    return (
      <main className="booking-confirmation-page">
        <section className="booking-confirmation-card" aria-live="polite">
          <p>Retrieving your booking details…</p>
        </section>
      </main>
    );
  }

  if (!confirmedBooking) {
    return (
      <main className="booking-confirmation-page">
        <section className="booking-confirmation-card">
          <h1>Booking details unavailable</h1>
          <p role="alert">
            {restoreError ??
              bookingError ??
              "We couldn't display this booking."}
          </p>
          <Link to="/my-booking">Go to My Booking</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-confirmation-page">
      <section className="booking-confirmation-card">
        <div className="booking-confirmation-success" aria-hidden="true">
          ✓
        </div>

        <h1>Booking details</h1>
        <p className="booking-confirmation-intro">
          Keep your confirmation code so you can find your booking later.
        </p>

        <div className="booking-confirmation-code">
          <span>Confirmation code</span>
          <strong>{confirmedBooking.code}</strong>
        </div>

        <div className="booking-confirmation-status">
          <span>Status</span>
          <StatusBadge status={confirmedBooking.status} />
        </div>

        <dl className="booking-confirmation-details">
          <div>
            <dt>Pitch</dt>
            <dd>{confirmedBooking.pitchName}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{formatBookingDate(confirmedBooking.date)}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>
              {confirmedBooking.startTime} – {confirmedBooking.endTime}
            </dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>
              {confirmedBooking.durationHours}{" "}
              {confirmedBooking.durationHours === 1 ? "hour" : "hours"}
            </dd>
          </div>
          <div>
            <dt>Customer</dt>
            <dd>{confirmedBooking.customerName}</dd>
          </div>
          <div>
            <dt>Total price</dt>
            <dd>{formatPrice(confirmedBooking.totalPrice)}</dd>
          </div>
        </dl>

        <div className="booking-confirmation-actions">
          <Link to="/my-booking" className="booking-confirmation-primary">
            Manage my booking
          </Link>
          <Link to="/" className="booking-confirmation-secondary">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

function formatBookingDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(price);
}
