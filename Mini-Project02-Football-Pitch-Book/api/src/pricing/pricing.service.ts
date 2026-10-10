import { Injectable } from '@nestjs/common';
import { PEAK_END_HOUR, PEAK_START_HOUR } from '../common/constants';
import { Pitch } from '../pitches/pitch.types';

@Injectable()
export class PricingService {
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
}
