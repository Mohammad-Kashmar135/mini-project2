import { Controller, Get, Param } from "@nestjs/common";

import { PitchIdParamDto } from "./dto/pitch-id-param.dto";
import { Pitch } from "./pitch.types";
import { PitchesService } from "./pitches.service";

@Controller("pitches")
export class PitchesController {
  constructor(private readonly pitchesService: PitchesService) {}

  @Get()
  getPitches(): Pitch[] {
    return this.pitchesService.findAll();
  }

  @Get(":pitchId")
  getPitchById(@Param() params: PitchIdParamDto): Pitch {
    return this.pitchesService.findById(params.pitchId);
  }
}
