import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/CreateBookingDto";
import { FindBookingDto } from "./dto/FindBookingDto";
import { BookingCodeParamDto } from "./dto/BookingCodeParamDto";
import { CancelBookingDto } from "./dto/CancelBookingDto";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly BookingsService: BookingsService) {}

  @Post()
  createBooking(@Body() dto: CreateBookingDto) {
    return this.BookingsService.createBooking(dto);
  }

  @Post("find")
  @HttpCode(200)
  findBooking(@Body() dto: FindBookingDto) {
    return this.BookingsService.findBooking(dto);
  }

  @Patch(":code/cancel")
  cancelBooking(
    @Param() params: BookingCodeParamDto,
    @Body() dto: CancelBookingDto,
  ) {
    return this.BookingsService.cancelBooking(params.code, dto);
  }
}
