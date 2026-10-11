import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsIn } from "class-validator";
import { normalizeCode, normalizePhone } from "../../common/normalize.util";
import { IsValidPhone } from "../../common/validators";

export class FindBookingDto {
  @Transform(({ value }) =>
    typeof value === "string" ? normalizePhone(value) : value,
  )
  @IsValidPhone({ message: "A valid phone number is required." })
  customerPhone: string;

  // The code is trimmed and uppercased BEFORE validation ('pb-4821' -> 'PB-4821').
  @Transform(({ value }) =>
    typeof value === "string" ? normalizeCode(value) : value,
  )
  @IsString({ message: "Booking code is required." })
  @IsNotEmpty({ message: "Booking code is required." })
  code: string;
}
