import { ApiProperty } from '@nestjs/swagger';

export class CreateListWorkingDto {
  @ApiProperty()
  working: [
    {
      day: number;
      from: string;
      to: string;
    },
  ];
}
