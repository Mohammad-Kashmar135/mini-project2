import { Module } from "@nestjs/common";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { BookingsStore } from "./bookings.store";
import { PitchesModule } from "../pitches/pitches.module";
import { PricingModule } from "../pricing/pricing.module";

@Module({
  imports: [PitchesModule, PricingModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsStore],
  exports: [BookingsStore],
})
export class BookingsModule {}
