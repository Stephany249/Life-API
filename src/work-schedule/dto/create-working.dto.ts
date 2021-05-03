import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateWorkingDto {
  @ApiProperty()
  @IsNumber()
  readonly day: number;

  @ApiProperty()
  @IsString()
  readonly from: string;

  @ApiProperty()
  @IsString()
  readonly to: string;
}
