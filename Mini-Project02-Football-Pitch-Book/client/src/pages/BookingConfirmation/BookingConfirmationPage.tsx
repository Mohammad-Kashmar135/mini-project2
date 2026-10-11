import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import StatusBadge from "../../components/common/StatusBadge.tsx";
import { useBooking } from "../../context/BookingContext.tsx";
import {
  formatBookingDate,
  formatPrice,
} from "../../utils/bookingFormatters.ts";
import { getLastBooking } from "../../utils/lastBooking.ts";

import "./BookingConfirmationPage.css";

export default function BookingConfirmationPage() {
  const { code } = useParams<{ code: string }>();
  const { booking, isBookingLoading, bookingError, lookupBooking } =
    useBooking();

  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [canRetryRestore, setCanRetryRestore] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Reuse an in-flight request if the effect runs again before it finishes.
  const restoreRequestRef = useRef<Promise<boolean> | null>(null);

  useEffect(() => {
    let isActive = true;

    async function restoreBooking(): Promise<void> {
      if (!code || booking?.code === code) {
        setRestoreError(null);
        setCanRetryRestore(false);
        return;
      }

      const lastBooking = getLastBooking();

      if (!lastBooking || lastBooking.code !== code) {
        setCanRetryRestore(false);
        setRestoreError(
          "Booking details are not available in this session. You can find your booking using your phone number and confirmation code.",
        );
        return;
      }

      setCanRetryRestore(true);
      setRestoreError(null);

      let request = restoreRequestRef.current;

      if (!request) {
        request = lookupBooking({
          customerPhone: lastBooking.customerPhone,
          code: lastBooking.code,
        });

        restoreRequestRef.current = request;
      }

      try {
        const found = await request;

        if (!isActive) {
          return;
        }

        if (!found) {
          setRestoreError(
            "We couldn't retrieve this booking. Please try again or use My Booking.",
          );
        } else {
          setRestoreError(null);
        }
      } finally {
        if (restoreRequestRef.current === request) {
          restoreRequestRef.current = null;
        }
      }
    }

    void restoreBooking();

    return () => {
      isActive = false;
    };
  }, [code, booking?.code, lookupBooking, retryCount]);

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
        <section
          className="booking-confirmation-card"
          aria-live="polite"
          aria-busy="true"
        >
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

          <div className="booking-confirmation-actions">
            {canRetryRestore && (
              <button
                type="button"
                className="booking-confirmation-retry"
                onClick={() => setRetryCount((count) => count + 1)}
                disabled={isBookingLoading}
              >
                Try again
              </button>
            )}

            <Link to="/my-booking" className="booking-confirmation-secondary">
              Go to My Booking
            </Link>
          </div>
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
            <dt>Phone</dt>
            <dd>{confirmedBooking.customerPhone}</dd>
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
