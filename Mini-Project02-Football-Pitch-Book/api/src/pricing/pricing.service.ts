import { BadRequestException, Injectable } from '@nestjs/common';
import { ClockService } from '../common/clock.service';
import { PEAK_END_HOUR, PEAK_START_HOUR } from '../common/constants';
import {
  formatHour,
  isWithinBookingWindow,
  parseHour,
} from '../common/time.util';
import { Pitch } from '../pitches/pitch.types';
import { Quote, QuoteHour } from './pricing.types';

@Injectable()
export class PricingService {
  constructor(private readonly clockService: ClockService) {}
  isPeakHour(hour: number): boolean {
    return hour >= PEAK_START_HOUR && hour < PEAK_END_HOUR;
  }

  getHourPrice(pitch: Pitch, hour: number): number {
    return this.isPeakHour(hour)
      ? pitch.peakPricePerHour
      : pitch.normalPricePerHour;
  }

  calculateTotalPrice(
    pitch: Pitch,
    startHour: number,
    durationHours: number,
  ): number {
    let total = 0;

    for (let hour = startHour; hour < startHour + durationHours; hour++) {
      total += this.getHourPrice(pitch, hour);
    }

    return total;
  }

  getQuote(
    pitch: Pitch,
    date: string,
    startTime: string,
    durationHours: number,
  ): Quote {
    if (!isWithinBookingWindow(date, this.clockService.now())) {
      throw new BadRequestException(
        'Bookings can only be made up to 14 days in advance.',
      );
    }

    const startHour = parseHour(startTime);
    const endHour = startHour + durationHours;

    if (
      startHour < parseHour(pitch.openingTime) ||
      endHour > parseHour(pitch.closingTime)
    ) {
      throw new BadRequestException(
        "The booking must be within the pitch's opening hours.",
      );
    }

    const hours: QuoteHour[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      hours.push({
        startTime: formatHour(hour),
        price: this.getHourPrice(pitch, hour),
        isPeak: this.isPeakHour(hour),
      });
    }

    return {
      pitchId: pitch.id,
      date,
      startTime,
      endTime: formatHour(endHour),
      durationHours,
      hours,
      totalPrice: this.calculateTotalPrice(pitch, startHour, durationHours),
    };
  }
}
