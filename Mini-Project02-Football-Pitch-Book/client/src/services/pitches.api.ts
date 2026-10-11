import { request } from "./http";
import type { Pitch } from "../types/pitch.types";

export function getPitches(): Promise<Pitch[]> {
  return request<Pitch[]>("/pitches");
}

export function getPitchById(pitchId: string): Promise<Pitch> {
  return request<Pitch>(`/pitches/${encodeURIComponent(pitchId)}`);
}
