import type { Booking } from "../../types/booking.types.ts";
import StatusBadge from "../../components/common/StatusBadge.tsx";
import {
  formatBookingDate,
  formatPrice,
} from "../../utils/bookingFormatters.ts";

interface BookingDetailsProps {
  booking: Booking;
  isLoading: boolean;
  onCancel: () => Promise<void>;
}

export default function BookingDetails({
  booking,
  isLoading,
  onCancel,
}: BookingDetailsProps) {
  const canCancel = booking.status === "Confirmed" && booking.canCancel;

  return (
    <section
      className="my-booking-details"
      aria-labelledby="my-booking-details-title"
    >
      <div className="my-booking-details-heading">
        <h2 id="my-booking-details-title">Your booking</h2>
        <StatusBadge status={booking.status} />
      </div>

      <dl className="my-booking-data">
        <div>
          <dt>Confirmation code</dt>
          <dd>{booking.code}</dd>
        </div>
        <div>
          <dt>Pitch</dt>
          <dd>{booking.pitchName}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatBookingDate(booking.date)}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>
            {booking.startTime} – {booking.endTime}
          </dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>
            {booking.durationHours}{" "}
            {booking.durationHours === 1 ? "hour" : "hours"}
          </dd>
        </div>
        <div>
          <dt>Customer</dt>
          <dd>{booking.customerName}</dd>
        </div>
        <div>
          <dt>Phone number</dt>
          <dd>{booking.customerPhone}</dd>
        </div>
        <div>
          <dt>Total price</dt>
          <dd>{formatPrice(booking.totalPrice)}</dd>
        </div>
      </dl>

      {canCancel ? (
        <div className="my-booking-cancel-section">
          <p>
            You can cancel this confirmed booking. The server will verify that
            cancellation is still allowed.
          </p>
          <button
            className="my-booking-cancel"
            type="button"
            disabled={isLoading}
            onClick={() => void onCancel()}
          >
            {isLoading ? "Please wait…" : "Cancel booking"}
          </button>
        </div>
      ) : (
        <p className="my-booking-cancel-note">
          {booking.status === "Cancelled"
            ? "This booking has been cancelled."
            : booking.status === "Completed"
              ? "This match has already been played."
              : "The cancellation deadline has passed. Matches can only be cancelled more than 2 hours before they start."}
        </p>
      )}
    </section>
  );
}
