import { Injectable, NotFoundException } from "@nestjs/common";
import { SEED_PITCHES } from "../data/data";
import { Pitch } from "./pitch.types";

@Injectable()
export class PitchesService {
  findAll(): Pitch[] {
    return SEED_PITCHES.map((pitch) => ({ ...pitch }));
  }

  findById(id: string): Pitch {
    const pitch = SEED_PITCHES.find((item) => item.id === id);

    if (!pitch) {
      throw new NotFoundException("Pitch not found.");
    }

    return { ...pitch };
  }
}
