import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
