import type { Quote } from "../../types/booking.types";

interface PriceSummaryProps {
  pitchName: string;
  quote: Quote;
}

export default function PriceSummary({ pitchName, quote }: PriceSummaryProps) {
  return (
    <section
      className="booking-form-page__summary"
      aria-labelledby="booking-price-summary-title"
    >
      <h2 id="booking-price-summary-title">Booking summary</h2>

      <p className="booking-form-page__pitch-name">{pitchName}</p>
      <p className="booking-form-page__summary-date">
        Date: <strong>{quote.date}</strong>
      </p>

      <p>
        Time:{" "}
        <strong>
          {quote.startTime} – {quote.endTime}
        </strong>
      </p>

      <p>
        Duration:{" "}
        <strong>
          {quote.durationHours} {quote.durationHours === 1 ? "hour" : "hours"}
        </strong>
      </p>

      <div className="booking-form-page__hour-list">
        {quote.hours.map((hour) => (
          <div className="booking-form-page__hour" key={hour.startTime}>
            <span>
              {hour.startTime}
              {hour.isPeak && (
                <span className="booking-form-page__peak">Peak</span>
              )}
            </span>

            <strong>${hour.price}</strong>
          </div>
        ))}
      </div>

      <div className="booking-form-page__total">
        <span>Total price</span>
        <strong>${quote.totalPrice}</strong>
      </div>
    </section>
  );
}
