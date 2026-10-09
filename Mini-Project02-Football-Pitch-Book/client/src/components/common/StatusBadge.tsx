import "./StatusBadge.css";

export type BookingStatus = "Confirmed" | "Cancelled" | "Completed";

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
