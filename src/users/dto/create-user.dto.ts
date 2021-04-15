import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  readonly email: string;
  @ApiProperty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsString()
  readonly password: string;
  @ApiProperty()
  @IsString()
  readonly passwordConfirmation: string;
  @ApiProperty()
  @IsString()
  readonly cpf: string;
  @ApiProperty()
  readonly crm: string;
  @ApiProperty()
  @IsDateString()
  readonly birthday: Date;
}
