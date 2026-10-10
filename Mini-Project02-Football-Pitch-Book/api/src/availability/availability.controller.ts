import { Controller, Get, Param, Query } from '@nestjs/common';
import { PitchIdParamDto } from '../pitches/dto/pitch-id-param.dto';
import { AvailabilityService } from './availability.service';
import { AvailabilityQueryDto } from './dto/availability-query.dto';

@Controller('pitches')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get(':pitchId/availability')
  getDayAvailability(
    @Param() params: PitchIdParamDto,
    @Query() query: AvailabilityQueryDto,
  ) {
    return this.availabilityService.getDayAvailability(
      params.pitchId,
      query.date,
    );
  }
}
