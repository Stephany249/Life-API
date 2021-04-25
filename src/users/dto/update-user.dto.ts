import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe um endereço de email válido',
  })
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe o nome do usuário',
  })
  readonly name: string;
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly birthday: Date;
  @ApiProperty()
  readonly password: string;
  @ApiProperty()
  readonly oldPassword: string;
}
