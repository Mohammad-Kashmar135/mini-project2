import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Pitch } from '../types/pitch.types';
import { getPitches, getPitchById } from '../services/pitches.api';

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

const PitchesContext = createContext<PitchesContextValue | undefined>(undefined);

export function PitchesProvider({ children }: { children: ReactNode }) {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [isPitchesLoading, setIsPitchesLoading] = useState(false);
  const [pitchesError, setPitchesError] = useState<string | null>(null);

  const [currentPitch, setCurrentPitch] = useState<Pitch | null>(null);
  const [isPitchLoading, setIsPitchLoading] = useState(false);
  const [pitchError, setPitchError] = useState<string | null>(null);

  const loadPitches = useCallback(async () => {
    setIsPitchesLoading(true);
    setPitchesError(null);
    try {
      const data = await getPitches();
      setPitches(data);
    } catch (err) {
      setPitchesError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsPitchesLoading(false);
    }
  }, []);

  const loadPitch = useCallback(async (pitchId: string) => {
    setIsPitchLoading(true);
    setPitchError(null);
    setCurrentPitch(null);
    try {
      const data = await getPitchById(pitchId);
      setCurrentPitch(data);
    } catch (err) {
      setPitchError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsPitchLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      pitches, isPitchesLoading, pitchesError, loadPitches,
      currentPitch, isPitchLoading, pitchError, loadPitch
    }),
    [pitches, isPitchesLoading, pitchesError, loadPitches, currentPitch, isPitchLoading, pitchError, loadPitch]
  );

  return <PitchesContext.Provider value={value}>{children}</PitchesContext.Provider>;
}

export function usePitches() {
  const context = useContext(PitchesContext);
  if (!context) throw new Error('usePitches must be used inside PitchesProvider');
  return context;
}