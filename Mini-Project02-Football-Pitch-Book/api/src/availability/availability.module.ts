import { Module } from '@nestjs/common';
import { BookingsModule } from '../bookings/bookings.module';
import { PitchesModule } from '../pitches/pitches.module';
import { PricingModule } from '../pricing/pricing.module';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
  imports: [PitchesModule, PricingModule, BookingsModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AvailabilityModule {}
