interface CustomerFieldsProps {
  customerName: string;
  customerPhone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  nameError: string | null;
  phoneError: string | null;
  disabled: boolean;
}

export default function CustomerFields({
  customerName,
  customerPhone,
  onNameChange,
  onPhoneChange,
  nameError,
  phoneError,
  disabled,
}: CustomerFieldsProps) {
  return (
    <div className="booking-form-page__fields">
      <div className="booking-form-page__field">
        <label htmlFor="booking-customer-name">Full name</label>
        <input
          id="booking-customer-name"
          name="customerName"
          type="text"
          autoComplete="name"
          value={customerName}
          onChange={(event) => onNameChange(event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(nameError)}
          aria-describedby={
            nameError ? "booking-customer-name-error" : undefined
          }
          required
        />
        {nameError && (
          <p
            id="booking-customer-name-error"
            className="booking-form-page__field-error"
            role="alert"
          >
            {nameError}
          </p>
        )}
      </div>

      <div className="booking-form-page__field">
        <label htmlFor="booking-customer-phone">Phone number</label>
        <input
          id="booking-customer-phone"
          name="customerPhone"
          type="tel"
          autoComplete="tel"
          value={customerPhone}
          onChange={(event) => onPhoneChange(event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(phoneError)}
          aria-describedby={
            phoneError ? "booking-customer-phone-error" : undefined
          }
          required
        />
        {phoneError && (
          <p
            id="booking-customer-phone-error"
            className="booking-form-page__field-error"
            role="alert"
          >
            {phoneError}
          </p>
        )}
      </div>
    </div>
  );
}
