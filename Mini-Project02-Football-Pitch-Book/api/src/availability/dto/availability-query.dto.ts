import { IsCalendarDate } from '../../common/validators';

export class AvailabilityQueryDto {
  @IsCalendarDate({ message: 'Invalid date. Use the format YYYY-MM-DD.' })
  date: string;
}
