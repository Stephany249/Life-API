import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWorkingDto {
  @ApiProperty()
  @IsNotEmpty()
  working: [{ day: string; from: string; to: string }];
}
