import { Module } from "@nestjs/common";
import { BookingsModule } from "./Bookings/bookings.module";
@Module({
  imports: [BookingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
