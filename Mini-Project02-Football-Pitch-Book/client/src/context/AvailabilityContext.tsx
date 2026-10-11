import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getDayAvailability } from "../services/availability.api";
import type { DayAvailability, Slot } from "../types/availability.types";

const SELECTION_REJECTED_MESSAGE =
  "Please choose one or two consecutive hours.";
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

interface AvailabilityContextValue {
  availability: DayAvailability | null;
  isAvailabilityLoading: boolean;
  availabilityError: string | null;
  loadAvailability(pitchId: string, date: string): Promise<void>;

  selectedIndexes: number[]; // positions in availability.slots, sorted
  selectedSlots: Slot[]; // calculated from selectedIndexes
  selectionMessage: string | null; // message when a selection is rejected
  toggleSlot(index: number): void;
  clearSelection(): void;
}

interface SelectionState {
  indexes: number[];
  message: string | null;
}

const EMPTY_SELECTION: SelectionState = { indexes: [], message: null };

/**
 * Works out the selection after a click on `index`.
 * Returns `null` when the click must be ignored (nothing changes, not even the message).
 * Only the API `status` is read. The backend still decides if a booking is accepted.
 */
function getNextSelection(
  slots: Slot[],
  current: SelectionState,
  index: number,
): SelectionState | null {
  const slot = slots[index];
  if (!slot) return null;

  // Click a selected slot: remove it. The other selected slot (if any) stays.
  if (current.indexes.includes(index)) {
    return {
      indexes: current.indexes.filter((selected) => selected !== index),
      message: null,
    };
  }

  // Booked and past slots cannot be selected.
  if (slot.status !== "available") return null;

  if (current.indexes.length === 0) {
    return { indexes: [index], message: null };
  }

  // "Next to" means the neighbor index. Times are never parsed.
  const isNextToSelected =
    current.indexes.length === 1 && Math.abs(current.indexes[0] - index) === 1;
  if (isNextToSelected) {
    return {
      indexes: [current.indexes[0], index].sort((a, b) => a - b),
      message: null,
    };
  }

  // Not next to the selected slot, or a third slot: nothing changes except the message.
  return { indexes: current.indexes, message: SELECTION_REJECTED_MESSAGE };
}

const AvailabilityContext = createContext<AvailabilityContextValue | undefined>(
  undefined,
);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [availability, setAvailability] = useState<DayAvailability | null>(
    null,
  );
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );
  const [selection, setSelection] = useState<SelectionState>(EMPTY_SELECTION);

  // Every call to loadAvailability gets a number. Only the newest call may change the state,
  // so a slow older response can never overwrite a newer one, or stop the loading view too early.
  const latestRequestId = useRef(0);

  const loadAvailability = useCallback(
    async (pitchId: string, date: string) => {
      const requestId = ++latestRequestId.current;
      const isLatest = () => requestId === latestRequestId.current;

      setIsAvailabilityLoading(true);
      setAvailabilityError(null);
      setAvailability(null);
      setSelection(EMPTY_SELECTION);
      try {
        const result = await getDayAvailability(pitchId, date);
        if (isLatest()) setAvailability(result);
      } catch (err) {
        if (isLatest()) {
          setAvailabilityError(
            err instanceof Error ? err.message : DEFAULT_ERROR_MESSAGE,
          );
        }
      } finally {
        if (isLatest()) setIsAvailabilityLoading(false);
      }
    },
    [],
  );

  const toggleSlot = useCallback(
    (index: number) => {
      const slots = availability?.slots ?? [];
      setSelection(
        (current) => getNextSelection(slots, current, index) ?? current,
      );
    },
    [availability],
  );

  const clearSelection = useCallback(() => {
    setSelection(EMPTY_SELECTION);
  }, []);

  const selectedSlots = useMemo(() => {
    const slots = availability?.slots ?? [];
    return selection.indexes.flatMap((index) =>
      slots[index] ? [slots[index]] : [],
    );
  }, [availability, selection.indexes]);

  const value = useMemo<AvailabilityContextValue>(
    () => ({
      availability,
      isAvailabilityLoading,
      availabilityError,
      loadAvailability,
      selectedIndexes: selection.indexes,
      selectedSlots,
      selectionMessage: selection.message,
      toggleSlot,
      clearSelection,
    }),
    [
      availability,
      isAvailabilityLoading,
      availabilityError,
      loadAvailability,
      selection,
      selectedSlots,
      toggleSlot,
      clearSelection,
    ],
  );

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context)
    throw new Error("useAvailability must be used inside AvailabilityProvider");
  return context;
}
