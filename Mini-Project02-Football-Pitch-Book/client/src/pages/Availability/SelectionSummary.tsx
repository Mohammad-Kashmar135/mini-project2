import Button from "../../components/common/Button";
import type { Slot } from "../../types/availability.types";
import { formatDuration, formatTime } from "../../utils/format";

interface SelectionSummaryProps {
  selectedSlots: Slot[];
  selectionMessage: string | null;
  onContinue: () => void;
}

/** Shows the selected time range and duration. It does not show a total price: the Booking Form does. */
export function SelectionSummary({
  selectedSlots,
  selectionMessage,
  onContinue,
}: SelectionSummaryProps) {
  const hasSelection = selectedSlots.length > 0;
  const first = selectedSlots[0];
  const last = selectedSlots[selectedSlots.length - 1];

  return (
    <div className="availability-page__summary">
      <div className="availability-page__summary-info">
        {hasSelection ? (
          <>
            <p className="availability-page__summary-range">
              {formatTime(first.startTime)} – {formatTime(last.endTime)}
            </p>
            <p className="availability-page__summary-duration">
              {formatDuration(selectedSlots.length)}
            </p>
          </>
        ) : (
          <p className="availability-page__summary-empty">
            No hours selected yet. Choose one or two consecutive hours.
          </p>
        )}
        {selectionMessage && (
          <p className="availability-page__summary-message" role="alert">
            {selectionMessage}
          </p>
        )}
      </div>
      <Button variant="primary" disabled={!hasSelection} onClick={onContinue}>
        Continue to booking
      </Button>
    </div>
  );
}

export default SelectionSummary;
