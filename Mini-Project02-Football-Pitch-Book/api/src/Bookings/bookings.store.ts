import { createSeedBookings, SeedBooking } from "../data/data";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BookingsStore {
  private storedbookings: SeedBooking[] = createSeedBookings();

  findAll(): SeedBooking[] {
    return this.storedbookings;
  }

  findByCode(code: string): SeedBooking | undefined {
    return this.storedbookings.find((booking) => booking.code === code);
  }

  findActiveByPitchAndDate(pitchId: string, date: string): SeedBooking[] {
    return this.storedbookings.filter(
      (booking) =>
        booking.pitchId === pitchId &&
        booking.date === date &&
        booking.status === "Confirmed",
    );
  }

  save(booking: SeedBooking): SeedBooking {
    const existbooking = this.storedbookings.findIndex(
      (booking) => booking.code === booking.code,
    );
    if (existbooking === -1) {
      this.storedbookings.push(booking);
    } else {
      this.storedbookings[existbooking] = booking;
    }
    return booking;
  }

  generateUniqueCode(): string {
    let code = "";
    do {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      code = `PB-${randomDigits}`;
    } while (this.storedbookings.some((b) => b.code === code));

    return code;
  }
}
