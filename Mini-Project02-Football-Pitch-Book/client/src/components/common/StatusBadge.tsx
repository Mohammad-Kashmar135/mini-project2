import { BookingStatus } from "../../types/booking.types";
import "./StatusBadge.css";


interface StatusBadgeProps {
  status: BookingStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`status-badge status-badge--${status.toLowerCase()}`}
      role="status"
    >
      {status}
    </span>
  );
}
