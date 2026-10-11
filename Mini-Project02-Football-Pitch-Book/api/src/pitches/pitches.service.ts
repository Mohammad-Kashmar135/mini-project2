import { Injectable, NotFoundException } from "@nestjs/common";
import { Pitch } from "./pitch.types";
import { SEED_PITCHES } from "../data/data";


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
