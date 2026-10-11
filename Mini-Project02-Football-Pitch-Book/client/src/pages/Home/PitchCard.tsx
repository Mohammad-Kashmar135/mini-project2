import { Link } from "react-router-dom";
import type { Pitch } from "../../types/pitch.types";
import { formatPrice, formatTime } from "../../utils/format";

interface PitchCardProps {
  pitch: Pitch;
}

export default function PitchCard({ pitch }: PitchCardProps) {
  return (
    <article className="home-pitch-card">
      <header className="home-pitch-card__header">
        <h3 className="home-pitch-card__name">{pitch.name}</h3>
        <p className="home-pitch-card__type">{pitch.type}</p>
      </header>

      <dl className="home-pitch-card__details">
        <div className="home-pitch-card__row">
          <dt className="home-pitch-card__label">Normal price</dt>
          <dd className="home-pitch-card__value">
            {formatPrice(pitch.normalPricePerHour)} / hour
          </dd>
        </div>

        <div className="home-pitch-card__row home-pitch-card__row--peak">
          <dt className="home-pitch-card__label">Peak price</dt>
          <dd className="home-pitch-card__value">
            {formatPrice(pitch.peakPricePerHour)} / hour
          </dd>
        </div>

        <div className="home-pitch-card__row">
          <dt className="home-pitch-card__label">Opening hours</dt>
          <dd className="home-pitch-card__value">
            {formatTime(pitch.openingTime)} – {formatTime(pitch.closingTime)}
          </dd>
        </div>
      </dl>

      <Link
        className="home-pitch-card__link"
        to={`/pitches/${encodeURIComponent(pitch.id)}`}
      >
        View pitch
      </Link>
    </article>
  );
}
