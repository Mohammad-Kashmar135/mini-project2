import { Module } from "@nestjs/common";
import { CommonModule } from "./common/common.module";
import { BookingsModule } from "./Bookings/bookings.module";




// We will add PitchesModule, BookingsModule, AvailabilityModule, PricingModule 
@Module({
  imports: [CommonModule,BookingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
