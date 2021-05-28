import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalRecordDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe a resposta da questão',
  })
  readonly question1: number;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe a resposta da questão',
  })
  readonly question2: number;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe a resposta da questão',
  })
  readonly question3: number;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe a resposta da questão',
  })
  readonly question4: number;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe a resposta da questão',
  })
  readonly question5: number;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe a resposta da questão',
  })
  readonly question6: string;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe a resposta da questão',
  })
  readonly question7: number;
  @ApiProperty()
  readonly question8: number;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Informe a resposta da questão',
  })
  readonly question9: string;
  @ApiProperty()
  readonly question10: number;
}
