import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FindAllDAyFromClientDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
