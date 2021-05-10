import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FindAllMonthFromSpecialistDto {
  @ApiProperty()
  @IsNotEmpty()
  crm: string;
  @ApiProperty()
  @IsNotEmpty()
  month: number;
  @ApiProperty()
  @IsNotEmpty()
  year: number;
}
