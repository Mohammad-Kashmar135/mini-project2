import { Module } from "@nestjs/common";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { BookingsStore } from "./bookings.store";

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsStore],
})
export class BookingsModule {}
