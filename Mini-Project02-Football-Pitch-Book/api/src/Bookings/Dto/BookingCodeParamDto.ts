import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsIn } from "class-validator";
import { normalizeCode } from "../../common/normalize.util";

export class BookingCodeParamDto {
  @Transform(({ value }) =>
    typeof value === "string" ? normalizeCode(value) : value,
  )
  @IsString({ message: "Booking code is required." })
  @IsNotEmpty({ message: "Booking code is required." })
  code: string;
}
