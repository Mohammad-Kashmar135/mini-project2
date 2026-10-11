import { Slot } from "../../types/availability.types";
import { formatPrice } from "../../utils/format";
import { formatTime } from "../../utils/format";

type SlotView = "available" | "selected" | "booked" | "past";

const SLOT_LABELS: Record<SlotView, string> = {
  available: "Available",
  selected: "Selected",
  booked: "Booked",
  past: "Past",
};

const LEGEND_ORDER: SlotView[] = ["available", "selected", "booked", "past"];

interface SlotGridProps {
  slots: Slot[];
  selectedIndexes: number[];
  onToggleSlot: (index: number) => void;
}

/** Shows the slots exactly as the API returned them. It never decides what is free. */
export function SlotGrid({
  slots,
  selectedIndexes,
  onToggleSlot,
}: SlotGridProps) {
  return (
    <div className="availability-page__slots">
      <ul className="availability-page__legend" aria-label="Slot colors">
        {LEGEND_ORDER.map((view) => (
          <li key={view} className="availability-page__legend-item">
            <span
              className={`availability-page__legend-swatch availability-page__legend-swatch--${view}`}
              aria-hidden="true"
            />
            {SLOT_LABELS[view]}
          </li>
        ))}
      </ul>

      <ul className="availability-page__grid">
        {slots.map((slot, index) => {
          const isSelected = selectedIndexes.includes(index);
          const view: SlotView = isSelected ? "selected" : slot.status;
          const isAvailable = slot.status === "available";

          return (
            <li
              key={`${slot.startTime}-${index}`}
              className="availability-page__grid-item"
            >
              <button
                type="button"
                className={`availability-page__slot availability-page__slot--${view}`}
                disabled={!isAvailable}
                aria-pressed={isAvailable ? isSelected : undefined}
                onClick={() => onToggleSlot(index)}
              >
                <span className="availability-page__slot-time">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </span>
                <span className="availability-page__slot-price">
                  {formatPrice(slot.price)}
                </span>
                {slot.isPeak && (
                  <span className="availability-page__slot-peak">Peak</span>
                )}
                <span className="availability-page__slot-status">
                  {SLOT_LABELS[view]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SlotGrid;
