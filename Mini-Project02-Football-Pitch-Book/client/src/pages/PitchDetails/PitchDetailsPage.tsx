import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loading from "../../components/common/Loading";
import PageContainer from "../../components/common/PageContainer";
import { usePitches } from "../../context/PitchesContext";
import "./PitchDetailsPage.css";

export default function PitchDetailsPage() {
  const { pitchId } = useParams<{ pitchId: string }>();
  const navigate = useNavigate();

  const { currentPitch, isPitchLoading, pitchError, loadPitch } = usePitches();

  useEffect(() => {
    if (pitchId) {
      void loadPitch(pitchId);
    }
  }, [pitchId, loadPitch]);

  const pitch = currentPitch?.id === pitchId ? currentPitch : null;

  if (!pitchId) {
    return (
      <PageContainer title="Pitch not found">
        <p>A pitch ID was not provided.</p>
        <Link to="/">Back to all pitches</Link>
      </PageContainer>
    );
  }

  if (isPitchLoading && !pitch) {
    return <Loading message="Loading pitch details..." />;
  }

  if (pitchError && !pitch) {
    return (
      <PageContainer title="Unable to load pitch">
        <ErrorMessage
          message={pitchError}
          onRetry={() => void loadPitch(pitchId)}
        />
        <Link to="/">Back to all pitches</Link>
      </PageContainer>
    );
  }

  if (!pitch) {
    return (
      <PageContainer title="Pitch not found">
        <p>Pitch not found.</p>
        <Link to="/">Back to all pitches</Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={pitch.name}>
      <div className="pitch-details-page__card">
        <div className="pitch-details-page__info">
          <p>
            <strong>Type:</strong> {pitch.type}
          </p>

          <p>
            <strong>Surface:</strong> {pitch.surface}
          </p>

          <p>
            <strong>Opening hours:</strong> {pitch.openingTime} -{" "}
            {pitch.closingTime}
          </p>

          <p className="pitch-details-page__desc">{pitch.description}</p>
        </div>

        <div className="pitch-details-page__pricing">
          <h3>Pricing</h3>

          <ul>
            <li>Normal hour: ${pitch.normalPricePerHour}</li>
            <li className="pitch-details-page__peak-price">
              Peak hour: ${pitch.peakPricePerHour}
            </li>
          </ul>

          <p className="pitch-details-page__peak-note">
            Peak hours are 18:00–22:00, every day. Any hour that starts inside
            this period is charged at the peak price.
          </p>

          <p className="pitch-details-page__example">
            <strong>Example:</strong> 1 Normal Hour (${pitch.normalPricePerHour}
            ) + 1 Peak Hour (${pitch.peakPricePerHour}) = $
            {pitch.normalPricePerHour + pitch.peakPricePerHour}
          </p>
        </div>

        <div className="pitch-details-page__actions">
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/pitches/${encodeURIComponent(pitch.id)}/availability`)
            }
          >
            Check availability
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
