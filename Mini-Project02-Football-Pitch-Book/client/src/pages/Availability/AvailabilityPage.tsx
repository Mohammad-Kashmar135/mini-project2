import { useLayoutEffect, type ChangeEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loading from "../../components/common/Loading";
import PageContainer from "../../components/common/PageContainer";
import { MAX_ADVANCE_DAYS } from "../../constants";
import { useAvailability } from "../../context/AvailabilityContext";
import { usePitches } from "../../context/PitchesContext";
import { addDaysToToday, getTodayString } from "../../utils/date";
import { formatDate } from "../../utils/format";

import SelectionSummary from "./SelectionSummary";
import SlotGrid from "./SlotGrid";
import "./AvailabilityPage.css";

const PITCH_NOT_FOUND_MESSAGE = "Pitch not found.";

// The two documented 400 messages of GET /pitches/:pitchId/availability (docs/API.md, sections 7 and 14).
// AvailabilityContext exposes only the message text, so the page recognizes these two fixed messages.
// If the backend changes either message, change it here too. This is the only place that does this check.
const DATE_ERROR_MESSAGES = [
  "Invalid date. Use the format YYYY-MM-DD.",
  "Bookings can only be made up to 14 days in advance.",
];

/** `/pitches/:pitchId/book?date=YYYY-MM-DD&start=HH:mm&duration=1|2` (the colon is kept readable). */
function buildBookingPath(
  pitchId: string,
  date: string,
  start: string,
  duration: number,
): string {
  const encode = (value: string) =>
    encodeURIComponent(value).replace(/%3A/g, ":");
  return `/pitches/${encodeURIComponent(pitchId)}/book?date=${encode(date)}&start=${encode(start)}&duration=${duration}`;
}

export function AvailabilityPage() {
  const { pitchId = "" } = useParams<{ pitchId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { currentPitch, pitchError, loadPitch } = usePitches();
  const {
    availability,
    isAvailabilityLoading,
    availabilityError,
    loadAvailability,
    selectedIndexes,
    selectedSlots,
    selectionMessage,
    toggleSlot,
  } = useAvailability();

  const today = getTodayString();
  const maxDate = addDaysToToday(MAX_ADVANCE_DAYS);
  const date = searchParams.get("date") || today;

  // The page loads its data every time it opens or when the pitch or date changes.
  // useLayoutEffect (not useEffect) is needed here: AvailabilityContext and PitchesContext keep
  // their last data and error between pages, and with useEffect the previous visit's error was
  // seen on screen before the new request started. Starting it before paint avoids that.
  useLayoutEffect(() => {
    if (!pitchId) return;
    void loadPitch(pitchId);
  }, [pitchId, loadPitch]);

  useLayoutEffect(() => {
    if (!pitchId) return;
    void loadAvailability(pitchId, date);
  }, [pitchId, date, loadAvailability]);

  const pitchName =
    currentPitch && currentPitch.id === pitchId ? currentPitch.name : null;

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextDate = event.target.value;
    if (!nextDate) return; // the input was cleared: keep the current date
    setSearchParams({ date: nextDate });
  };

  const handleGoToToday = () => {
    setSearchParams({ date: today });
  };

  const handleRetry = () => {
    void loadAvailability(pitchId, date);
    if (pitchError) void loadPitch(pitchId);
  };

  const handleContinue = () => {
    if (selectedSlots.length < 1 || selectedSlots.length > 2) return;
    navigate(
      buildBookingPath(
        pitchId,
        date,
        selectedSlots[0].startTime,
        selectedSlots.length,
      ),
    );
  };

  const isPitchNotFound =
    !pitchId ||
    availabilityError === PITCH_NOT_FOUND_MESSAGE ||
    pitchError === PITCH_NOT_FOUND_MESSAGE;
  const isDateError =
    availabilityError !== null &&
    DATE_ERROR_MESSAGES.includes(availabilityError);

  let content;
  if (isPitchNotFound) {
    content = (
      <div className="availability-page__problem">
        <ErrorMessage message={PITCH_NOT_FOUND_MESSAGE} />
        <Link className="availability-page__link" to="/">
          Back to all pitches
        </Link>
      </div>
    );
  } else if (availabilityError && isDateError && date !== today) {
    content = (
      <div className="availability-page__problem">
        <ErrorMessage message={availabilityError} />
        <Button variant="primary" onClick={handleGoToToday}>
          Go back to today
        </Button>
      </div>
    );
  } else if (availabilityError) {
    content = (
      <ErrorMessage message={availabilityError} onRetry={handleRetry} />
    );
  } else if (isAvailabilityLoading || !availability) {
    content = <Loading message="Loading availability…" />;
  } else if (availability.slots.length === 0) {
    content = (
      <EmptyState
        title="No time slots for this day"
        description="Please choose another date."
      />
    );
  } else {
    content = (
      <>
        <SlotGrid
          slots={availability.slots}
          selectedIndexes={selectedIndexes}
          onToggleSlot={toggleSlot}
        />
        <SelectionSummary
          selectedSlots={selectedSlots}
          selectionMessage={selectionMessage}
          onContinue={handleContinue}
        />
      </>
    );
  }

  return (
    <PageContainer
      title={pitchName ? `${pitchName} availability` : "Pitch availability"}
    >
      <div className="availability-page">
        <div className="availability-page__header">
          {pitchId && (
            <Link
              className="availability-page__back"
              to={`/pitches/${encodeURIComponent(pitchId)}`}
            >
              ← Back to pitch
            </Link>
          )}
          <p className="availability-page__subtitle">{formatDate(date)}</p>
        </div>

        <div className="availability-page__controls">
          <label
            className="availability-page__label"
            htmlFor="availability-date"
          >
            Date
          </label>
          <input
            id="availability-date"
            className="availability-page__date-input"
            type="date"
            value={date}
            min={today}
            max={maxDate}
            onChange={handleDateChange}
          />
          <span className="availability-page__hint">
            Up to {MAX_ADVANCE_DAYS} days ahead
          </span>
        </div>

        {content}
      </div>
    </PageContainer>
  );
}

export default AvailabilityPage;
