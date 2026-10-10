import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePitches } from "../../context/PitchesContext";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import PageContainer from "../../components/common/PageContainer";
import Button from "../../components/common/Button";
import "./PitchDetailsPage.css";

export default function PitchDetailsPage() {
  const { pitchId } = useParams<{ pitchId: string }>();
  const navigate = useNavigate();
  const { currentPitch, isPitchLoading, pitchError, loadPitch } = usePitches();

  useEffect(() => {
    if (pitchId) {
      loadPitch(pitchId);
    }
  }, [pitchId, loadPitch]);

  if (isPitchLoading) return <Loading message="Loading pitch details..." />;

  if (pitchError) {
    return (
      <PageContainer>
        <ErrorMessage
          message={pitchError}
          onRetry={() => pitchId && loadPitch(pitchId)}
        />
        <Link to="/" className="pitch-details-page__back-link">
          Return to Home
        </Link>
      </PageContainer>
    );
  }

  if (!currentPitch) return null;

  return (
    <PageContainer title={currentPitch.name}>
      <div className="pitch-details-page__card">
        <div className="pitch-details-page__info">
          <p>
            <strong>Type:</strong> {currentPitch.type}
          </p>
          <p>
            <strong>Surface:</strong> {currentPitch.surface}
          </p>
          <p>
            <strong>Opening Hours:</strong> {currentPitch.openingTime} -{" "}
            {currentPitch.closingTime}
          </p>
          <p className="pitch-details-page__desc">{currentPitch.description}</p>
        </div>

        <div className="pitch-details-page__pricing">
          <h3>Pricing</h3>
          <ul>
            <li>Normal hour: ${currentPitch.normalPricePerHour}</li>
            <li className="pitch-details-page__peak-price">
              Peak hour: ${currentPitch.peakPricePerHour}
            </li>
          </ul>

          <div className="pitch-details-page__peak-note">
            Peak hours are 18:00–22:00, every day. <br />
            Any hour that starts inside this period is charged at the peak
            price.
          </div>

          <div className="pitch-details-page__example">
            <strong>Example:</strong> 1 Normal Hour ($
            {currentPitch.normalPricePerHour}) + 1 Peak Hour ($
            {currentPitch.peakPricePerHour}) =$
            {currentPitch.normalPricePerHour + currentPitch.peakPricePerHour}
          </div>
        </div>

        <div className="pitch-details-page__actions">
          <Button
            variant="primary"
            onClick={() => navigate(`/pitches/${currentPitch.id}/availability`)}
          >
            Check availability
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
