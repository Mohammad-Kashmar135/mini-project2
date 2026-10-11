import { IsNotEmpty, IsString } from 'class-validator';

export class PitchIdParamDto {
  @IsString({ message: 'Pitch ID is required.' })
  @IsNotEmpty({ message: 'Pitch ID is required.' })
  pitchId?: string;
}