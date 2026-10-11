import { useLayoutEffect, useRef } from "react";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loading from "../../components/common/Loading";
import { usePitches } from "../../context/PitchesContext";
import PitchCard from "./PitchCard";
import "./HomePage.css";
export function HomePage() {
  const { pitches, isPitchesLoading, pitchesError, loadPitches } = usePitches();
  const listHeadingRef = useRef<HTMLHeadingElement>(null);

  // The page loads its data every time it opens. useLayoutEffect (not useEffect) is needed here:
  // PitchesContext starts with isPitchesLoading = false and no pitches, so with useEffect the first
  // frame showed the "No pitches available" view before loading began.
  useLayoutEffect(() => {
    void loadPitches();
  }, [loadPitches]);

  const handleScrollToPitches = () => {
    const heading = listHeadingRef.current;
    if (!heading) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    heading.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    heading.focus({ preventScroll: true });
  };

  let content;
  if (pitchesError) {
    content = (
      <ErrorMessage message={pitchesError} onRetry={() => void loadPitches()} />
    );
  } else if (isPitchesLoading) {
    content = <Loading message="Loading pitches…" />;
  } else if (pitches.length === 0) {
    content = (
      <EmptyState
        title="No pitches available"
        description="Please check back later."
      />
    );
  } else {
    content = (
      <ul className="home-page__grid">
        {pitches.map((pitch) => (
          <li key={pitch.id} className="home-page__grid-item">
            <PitchCard pitch={pitch} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1 className="home-page__title">Book your football pitch</h1>
        <p className="home-page__tagline">
          Pick a pitch, choose your hour, and book your game in minutes.
        </p>
        <Button variant="accent" onClick={handleScrollToPitches}>
          See our pitches
        </Button>
      </section>

      <section
        className="home-page__pitches"
        aria-labelledby="home-pitches-heading"
      >
        <h2
          id="home-pitches-heading"
          className="home-page__section-title"
          ref={listHeadingRef}
          tabIndex={-1}
        >
          Our pitches
        </h2>
        {content}
      </section>
    </div>
  );
}

export default HomePage;
