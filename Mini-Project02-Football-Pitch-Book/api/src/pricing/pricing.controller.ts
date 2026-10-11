import { Controller, Get, Param, Query } from '@nestjs/common';
import { PitchIdParamDto } from '../pitches/dto/pitch-id-param.dto';
import { PitchesService } from '../pitches/pitches.service';
import { QuoteQueryDto } from './dto/quote-query.dto';
import { PricingService } from './pricing.service';
import { Quote } from './pricing.types';

@Controller('pitches/:pitchId/quote')
export class PricingController {
  constructor(
    private readonly pitchesService: PitchesService,
    private readonly pricingService: PricingService,
  ) {}

  @Get()
  getQuote(
    @Param() params: PitchIdParamDto,
    @Query() query: QuoteQueryDto,
  ): Quote {
    const pitch = this.pitchesService.findById(params.pitchId);

    return this.pricingService.getQuote(
      pitch,
      query.date,
      query.startTime,
      query.durationHours,
    );
  }
}
