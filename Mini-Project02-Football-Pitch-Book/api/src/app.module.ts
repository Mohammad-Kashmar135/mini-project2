import { Module } from "@nestjs/common";
import { CommonModule } from "./common/common.module";
import { PitchesModule } from "./pitches/pitches.module";
import { PricingModule } from "./pricing/pricing.module";
import { AvailabilityModule } from "./availability/availability.module";
import { BookingsModule } from "./bookings/bookings.module";

@Module({
  imports: [
    CommonModule,
    PitchesModule,
    PricingModule,
    BookingsModule,
    AvailabilityModule,
  ],
})
export class AppModule {}
