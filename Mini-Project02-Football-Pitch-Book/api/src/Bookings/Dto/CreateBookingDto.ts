import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { normalizePhone } from "../../common/normalize.util";
import {
  IsCalendarDate,
  IsOnTheHour,
  IsValidPhone,
} from "../../common/validators";
import { Type } from "class-transformer";
import { IsIn, IsInt } from "class-validator";
export class CreateBookingDto {
  @IsString({ message: "Pitch ID is required." })
  @IsNotEmpty({ message: "Pitch ID is required." })
  pitchId: string;

  // 2. date is a real calendar date YYYY-MM-DD
  @IsCalendarDate({ message: "Invalid date. Use the format YYYY-MM-DD." })
  date: string;

  // 3. startTime is on the hour (HH:00)
  @IsOnTheHour({
    message: "Start time must be on the hour, for example 18:00.",
  })
  startTime: string;

  // 4. durationHours must be the NUMBER 1 or 2.
  //    It comes from a JSON body, so there is NO @Type(() => Number) here:
  //    the text "2" must be rejected.
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2], { message: "A booking can be one or two hours only." })
  durationHours!: 1 | 2;

  // 5. customerName: trimmed first, then must not be empty
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString({ message: "Customer name is required." })
  @IsNotEmpty({ message: "Customer name is required." })
  customerName: string;

  // 6. customerPhone: spaces and dashes removed first, then validated.
  //    The cleaned value is what gets saved.
  @Transform(({ value }) =>
    typeof value === "string" ? normalizePhone(value) : value,
  )
  @IsValidPhone({ message: "A valid phone number is required." })
  customerPhone: string;
}
