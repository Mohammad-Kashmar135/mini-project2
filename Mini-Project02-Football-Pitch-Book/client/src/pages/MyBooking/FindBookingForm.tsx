import { useState, type FormEvent } from "react";
import type { FindBookingPayload } from "../../types/booking.types.ts";

interface FindBookingFormProps {
  isLoading: boolean;
  onFind: (payload: FindBookingPayload) => Promise<void>;
}

export default function FindBookingForm({
  isLoading,
  onFind,
}: FindBookingFormProps) {
  const [customerPhone, setCustomerPhone] = useState("");
  const [code, setCode] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    await onFind({
      customerPhone: customerPhone.trim(),
      code: code.trim(),
    });
  }

  return (
    <form className="my-booking-form" onSubmit={handleSubmit}>
      <div className="my-booking-field">
        <label htmlFor="my-booking-phone">Phone number</label>
        <input
          id="my-booking-phone"
          name="customerPhone"
          type="tel"
          autoComplete="tel"
          value={customerPhone}
          onChange={(event) => setCustomerPhone(event.target.value)}
          required
          disabled={isLoading}
          placeholder="Enter the phone used for booking"
        />
      </div>

      <div className="my-booking-field">
        <label htmlFor="my-booking-code">Confirmation code</label>
        <input
          id="my-booking-code"
          name="code"
          type="text"
          autoComplete="off"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
          disabled={isLoading}
          placeholder="Enter your confirmation code"
        />
      </div>

      <button
        className="my-booking-submit"
        type="submit"
        disabled={isLoading || !customerPhone.trim() || !code.trim()}
      >
        {isLoading ? "Searching…" : "Find booking"}
      </button>
    </form>
  );
}
