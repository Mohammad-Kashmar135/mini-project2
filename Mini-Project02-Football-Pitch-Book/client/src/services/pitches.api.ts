import { request } from "./http";
import { Pitch } from "../types/pitch.types";

export async function getPitches(): Promise<Pitch[]> {
  return request<Pitch[]>("/pitches");
}

export async function getPitchById(pitchId: string): Promise<Pitch> {
  return request<Pitch>(`/pitches/${pitchId}`);
}
