import { Injectable } from "@nestjs/common";
import { createSeedBookings, SeedBooking } from "../data/data";

@Injectable()
export class BookingsStore {
  private readonly storedBookings: SeedBooking[] = createSeedBookings();

  findAll(): SeedBooking[] {
    return [...this.storedBookings];
  }

  findByCode(code: string): SeedBooking | undefined {
    return this.storedBookings.find((booking) => booking.code === code);
  }

  findActiveByPitchAndDate(pitchId: string, date: string): SeedBooking[] {
    return this.storedBookings.filter(
      (booking) =>
        booking.pitchId === pitchId &&
        booking.date === date &&
        booking.status === "Confirmed",
    );
  }

  save(booking: SeedBooking): SeedBooking {
    const existingIndex = this.storedBookings.findIndex(
      (existing) => existing.code === booking.code,
    );

    if (existingIndex === -1) {
      this.storedBookings.push(booking);
    } else {
      this.storedBookings[existingIndex] = booking;
    }

    return booking;
  }

  generateUniqueCode(): string {
    let code: string;

    do {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      code = `PB-${randomDigits}`;
    } while (this.storedBookings.some((booking) => booking.code === code));

    return code;
  }
}
