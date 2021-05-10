import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FindAllInDayFromSpecialistDto {
  @ApiProperty()
  @IsNotEmpty()
  crm: string;
  @ApiProperty()
  @IsNotEmpty()
  day: number;
  @ApiProperty()
  @IsNotEmpty()
  month: number;
  @ApiProperty()
  @IsNotEmpty()
  year: number;
}
