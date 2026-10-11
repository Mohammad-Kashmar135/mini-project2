import { Module } from "@nestjs/common";
import { CommonModule } from "./common/common.module";

// We will add PitchesModule, BookingsModule, AvailabilityModule, PricingModule 
@Module({
  imports: [CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
