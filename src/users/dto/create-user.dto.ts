import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe o nome do usuário',
  })
  readonly name: string;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe uma senha',
  })
  readonly password: string;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe a confirmação de senha',
  })
  readonly passwordConfirmation: string;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe o CPF',
  })
  readonly cpf: string;
  @ApiProperty()
  readonly crm: string;
  @ApiProperty()
  @IsDateString()
  readonly birthday: Date;
}
