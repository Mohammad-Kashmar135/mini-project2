import { Type } from 'class-transformer';
import { IsIn } from 'class-validator';
import { IsCalendarDate, IsOnTheHour } from '../../common/validators';

export class QuoteQueryDto {
  @IsCalendarDate({ message: 'Invalid date. Use the format YYYY-MM-DD.' })
  date: string;

  @IsOnTheHour({
    message: 'Start time must be on the hour, for example 18:00.',
  })
  startTime: string;

  @Type(() => Number)
  @IsIn([1, 2], { message: 'A booking can be one or two hours only.' })
  durationHours: number;
}
