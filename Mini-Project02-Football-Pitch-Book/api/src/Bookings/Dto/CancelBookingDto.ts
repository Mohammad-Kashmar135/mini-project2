import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsIn } from "class-validator";
import { normalizePhone } from "../../common/normalize.util";
import { IsValidPhone } from "../../common/validators";

export class CancelBookingDto {
  // The phone is cleaned (spaces and dashes removed) BEFORE validation.
  @Transform(({ value }) =>
    typeof value === "string" ? normalizePhone(value) : value,
  )
  @IsValidPhone({ message: "A valid phone number is required." })
  customerPhone: string;
}
