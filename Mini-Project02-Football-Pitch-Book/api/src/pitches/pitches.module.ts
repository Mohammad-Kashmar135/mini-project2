import { Module } from '@nestjs/common';

import { PitchesController } from './pitches.controller';
import { PitchesService } from './pitches.service';

@Module({
  controllers: [PitchesController],
  providers: [PitchesService],
  //exports: [PitchesService],
})
export class PitchesModule {}