import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SeedBooking, createSeedBookings } from "../data/data";
import { BookingsStore } from "./bookings.store";
import { BookingResponse, StoredBooking } from "./bookings.types";
import { CreateBookingDto } from "./dto/CreateBookingDto";
import { FindBookingDto } from "./dto/FindBookingDto";
import { CancelBookingDto } from "./dto/CancelBookingDto";
import { CANCEL_LIMIT_HOURS } from "../common/constants";
import { ClockService } from "../common/clock.service";
import { BookingCodeParamDto } from "./dto/BookingCodeParamDto";
import {
  formatHour,
  isPastSlot,
  isWithinBookingWindow,
  parseHour,
  toDateTime,
} from "../common/time.util";
import { PitchesService } from "../pitches/pitches.service";
import { PricingService } from "../pricing/pricing.service";

@Injectable()
export class BookingsService {
  constructor(
    private readonly store: BookingsStore,
    private readonly pitchesService: PitchesService,
    private readonly pricingService: PricingService,
    private readonly clock: ClockService,
  ) {}

  /**
   * Part C - Create booking (POST /api/bookings -> 201).
   *
   * IMPORTANT: this method is intentionally NOT async and has NO `await`.
   * The overlap check and the save run in one synchronous block, so two
   * identical requests can never both succeed (the second gets 409).
   *
   * The DTO already checked the format. Here we check only the RULES,
   * in the exact order of docs/API.md (stop at the first problem).
   */
  createBooking(dto: CreateBookingDto): BookingResponse {
    const now = this.clock.now();

    // 1. The pitch exists (PitchesService.findById throws 404 'Pitch not found.')
    const pitch = this.pitchesService.findById(dto.pitchId);

    // 2. Not more than 14 days ahead
    if (!isWithinBookingWindow(dto.date, now)) {
      throw new BadRequestException(
        "Bookings can only be made up to 14 days in advance.",
      );
    }

    // 3. Inside opening hours
    const startHour = parseHour(dto.startTime);
    const endHour = startHour + dto.durationHours;

    if (
      startHour < parseHour(pitch.openingTime) ||
      endHour > parseHour(pitch.closingTime)
    ) {
      throw new BadRequestException(
        "The booking must be within the pitch's opening hours.",
      );
    }

    // 4. The start time has not already started
    if (isPastSlot(dto.date, startHour, now)) {
      throw new BadRequestException(
        "This time has already started or passed. Please choose a future time.",
      );
    }

    // 5. No overlap with an ACTIVE booking on the same pitch and date
    //    (the store never returns cancelled bookings)
    const activeBookings = this.store.findActiveByPitchAndDate(
      pitch.id,
      dto.date,
    );

    const hasOverlap = activeBookings.some(
      (existing) =>
        startHour < parseHour(existing.endTime) &&
        endHour > parseHour(existing.startTime),
    );

    if (hasOverlap) {
      throw new ConflictException(
        "This time is already booked on this pitch. Please choose another time.",
      );
    }

    // 6. Price is always calculated by the system
    const totalPrice = this.pricingService.calculateTotalPrice(
      pitch,
      startHour,
      dto.durationHours,
    );

    // 7. Build the booking
    const booking: StoredBooking = {
      code: this.store.generateUniqueCode(),
      pitchId: pitch.id,
      date: dto.date,
      startTime: formatHour(startHour),
      endTime: formatHour(endHour),
      durationHours: dto.durationHours,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      totalPrice,
      status: "Confirmed",
      createdAt: now.toISOString(),
    };

    // 8. Save and return (no await between step 5 and here)
    this.store.save(booking);
    return this.toBookingResponse(booking);
  }

  // ---------------------------------------------------------------------
  // Part F helpers - createBooking needs toBookingResponse to compile.
  // They are calculated on every read and never stored.
  // ---------------------------------------------------------------------

  getBookingStatus(
    booking: StoredBooking,
    now: Date,
  ): "Confirmed" | "Cancelled" | "Completed" {
    if (booking.status === "Cancelled") return "Cancelled";

    const endDateTime = toDateTime(booking.date, parseHour(booking.endTime));
    if (endDateTime <= now) return "Completed";

    return "Confirmed";
  }

  canCancel(booking: StoredBooking, now: Date): boolean {
    if (this.getBookingStatus(booking, now) !== "Confirmed") return false;

    const startDateTime = toDateTime(
      booking.date,
      parseHour(booking.startTime),
    );
    const limitMs = CANCEL_LIMIT_HOURS * 60 * 60 * 1000;

    // strictly more than 2 hours (exactly 2 hours is too late)
    return startDateTime.getTime() - now.getTime() > limitMs;
  }

  toBookingResponse(booking: StoredBooking): BookingResponse {
    const now = this.clock.now();
    const pitch = this.pitchesService.findById(booking.pitchId);

    return {
      code: booking.code,
      pitchId: booking.pitchId,
      pitchName: pitch.name,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      durationHours: booking.durationHours,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      totalPrice: booking.totalPrice,
      status: this.getBookingStatus(booking, now),
      canCancel: this.canCancel(booking, now),
      createdAt: booking.createdAt,
      ...(booking.cancelledAt ? { cancelledAt: booking.cancelledAt } : {}),
    };
  }

  /**
   * Part D - Find booking (POST /api/bookings/find -> 200).
   *
   * Both the code AND the phone must match the SAME booking.
   * A wrong code and a wrong phone give the SAME 404 message,
   * so nobody can learn that a code exists or see another customer's booking.
   */
  findBooking(dto: FindBookingDto): BookingResponse {
    // dto.code and dto.customerPhone were already cleaned by the DTO.
    const booking = this.store.findByCode(dto.code);

    if (!booking || booking.customerPhone !== dto.customerPhone) {
      throw new NotFoundException(
        "Booking not found. Check your phone number and booking code.",
      );
    }

    // status and canCancel are calculated now, never read from storage
    return this.toBookingResponse(booking);
  }

  /**
   * Part E - Cancel booking (PATCH /api/bookings/:code/cancel -> 200).
   *
   * Checks run in this EXACT order (stop at the first problem):
   *  1. booking exists and phone matches      -> 404
   *  2. stored status is Cancelled            -> 400
   *  3. calculated status is Completed        -> 400
   *  4. starts in 2 hours or less             -> 400
   *  5. otherwise: cancel it
   */
  cancelBooking(code: string, dto: CancelBookingDto): BookingResponse {
    const now = this.clock.now();

    // 1. Same 404 message for a wrong code and a wrong phone
    const booking = this.store.findByCode(code);

    if (!booking || booking.customerPhone !== dto.customerPhone) {
      throw new NotFoundException(
        "Booking not found. Check your phone number and booking code.",
      );
    }

    // 2. Already cancelled (stored status)
    if (booking.status === "Cancelled") {
      throw new BadRequestException("This booking is already cancelled.");
    }

    // 3. Completed (calculated status, never stored)
    if (this.getBookingStatus(booking, now) === "Completed") {
      throw new BadRequestException(
        "This booking is completed and cannot be cancelled.",
      );
    }

    // 4. Here the status is Confirmed, so canCancel is false only because
    //    the match starts in 2 hours or less (exactly 2 hours is too late).
    if (!this.canCancel(booking, now)) {
      throw new BadRequestException(
        "Cancellation is no longer possible. The match starts in 2 hours or less.",
      );
    }

    // 5. Cancel: new status + cancelledAt, then save.
    //    findActiveByPitchAndDate skips cancelled bookings,
    //    so the slots are available again immediately.
    const cancelled: StoredBooking = {
      ...booking,
      status: "Cancelled",
      cancelledAt: now.toISOString(),
    };

    this.store.save(cancelled);

    // status 'Cancelled' and canCancel false are calculated here
    return this.toBookingResponse(cancelled);
  }
}
