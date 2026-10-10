import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingsStore } from '../bookings/bookings.store';
import { ClockService } from '../common/clock.service';
import {
  formatHour,
  isPastSlot,
  isWithinBookingWindow,
  parseHour,
} from '../common/time.util';
import { PitchesService } from '../pitches/pitches.service';
import { PricingService } from '../pricing/pricing.service';
import { DayAvailability, Slot, SlotStatus } from './availability.types';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly pitchesService: PitchesService,
    private readonly pricingService: PricingService,
    private readonly bookingsStore: BookingsStore,
    private readonly clockService: ClockService,
  ) {}

  getDayAvailability(pitchId: string, date: string): DayAvailability {
    const pitch = this.pitchesService.findById(pitchId);
    const now = this.clockService.now();

    if (!isWithinBookingWindow(date, now)) {
      throw new BadRequestException(
        'Bookings can only be made up to 14 days in advance.',
      );
    }

    const bookedHours = this.getBookedHours(pitchId, date);
    const slots: Slot[] = [];

    for (
      let hour = parseHour(pitch.openingTime);
      hour < parseHour(pitch.closingTime);
      hour++
    ) {
      slots.push({
        startTime: formatHour(hour),
        endTime: formatHour(hour + 1),
        status: this.getSlotStatus(date, hour, now, bookedHours),
        price: this.pricingService.getHourPrice(pitch, hour),
        isPeak: this.pricingService.isPeakHour(hour),
      });
    }

    return { pitchId, date, slots };
  }

  private getBookedHours(pitchId: string, date: string): number[] {
    const bookedHours: number[] = [];
    const bookings = this.bookingsStore.findActiveByPitchAndDate(pitchId, date);

    for (const booking of bookings) {
      for (
        let hour = parseHour(booking.startTime);
        hour < parseHour(booking.endTime);
        hour++
      ) {
        bookedHours.push(hour);
      }
    }

    return bookedHours;
  }

  private getSlotStatus(
    date: string,
    hour: number,
    now: Date,
    bookedHours: number[],
  ): SlotStatus {
    if (isPastSlot(date, hour, now)) {
      return 'past';
    }

    if (bookedHours.includes(hour)) {
      return 'booked';
    }

    return 'available';
  }
}
