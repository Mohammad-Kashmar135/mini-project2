import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Pitch } from "../types/pitch.types";
import { getPitches, getPitchById } from "../services/pitches.api";

interface PitchesContextValue {
  pitches: Pitch[];
  isPitchesLoading: boolean;
  pitchesError: string | null;
  loadPitches: () => Promise<void>;

  currentPitch: Pitch | null;
  isPitchLoading: boolean;
  pitchError: string | null;
  loadPitch: (pitchId: string) => Promise<void>;
}

const DEFAULT_ERROR = "Something went wrong. Please try again.";

const PitchesContext = createContext<PitchesContextValue | undefined>(
  undefined,
);

export function PitchesProvider({ children }: { children: ReactNode }) {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [isPitchesLoading, setIsPitchesLoading] = useState(false);
  const [pitchesError, setPitchesError] = useState<string | null>(null);

  const [currentPitch, setCurrentPitch] = useState<Pitch | null>(null);
  const [isPitchLoading, setIsPitchLoading] = useState(false);
  const [pitchError, setPitchError] = useState<string | null>(null);

  const pitchesRequestId = useRef(0);
  const pitchRequestId = useRef(0);

  const loadPitches = useCallback(async (): Promise<void> => {
    const requestId = ++pitchesRequestId.current;

    setIsPitchesLoading(true);
    setPitchesError(null);

    try {
      const result = await getPitches();

      if (requestId === pitchesRequestId.current) {
        setPitches(result);
      }
    } catch (error: unknown) {
      if (requestId === pitchesRequestId.current) {
        setPitchesError(error instanceof Error ? error.message : DEFAULT_ERROR);
      }
    } finally {
      if (requestId === pitchesRequestId.current) {
        setIsPitchesLoading(false);
      }
    }
  }, []);

  const loadPitch = useCallback(async (pitchId: string): Promise<void> => {
    const requestId = ++pitchRequestId.current;

    setIsPitchLoading(true);
    setPitchError(null);
    setCurrentPitch(null);

    try {
      const result = await getPitchById(pitchId);

      if (requestId === pitchRequestId.current) {
        setCurrentPitch(result);
      }
    } catch (error: unknown) {
      if (requestId === pitchRequestId.current) {
        setPitchError(error instanceof Error ? error.message : DEFAULT_ERROR);
      }
    } finally {
      if (requestId === pitchRequestId.current) {
        setIsPitchLoading(false);
      }
    }
  }, []);

  const value = useMemo<PitchesContextValue>(
    () => ({
      pitches,
      isPitchesLoading,
      pitchesError,
      loadPitches,
      currentPitch,
      isPitchLoading,
      pitchError,
      loadPitch,
    }),
    [
      pitches,
      isPitchesLoading,
      pitchesError,
      loadPitches,
      currentPitch,
      isPitchLoading,
      pitchError,
      loadPitch,
    ],
  );

  return (
    <PitchesContext.Provider value={value}>{children}</PitchesContext.Provider>
  );
}

export function usePitches(): PitchesContextValue {
  const context = useContext(PitchesContext);

  if (!context) {
    throw new Error("usePitches must be used inside PitchesProvider");
  }

  return context;
}
