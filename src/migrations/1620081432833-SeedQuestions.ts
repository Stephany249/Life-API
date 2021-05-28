import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedQuestions1620081432833 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO questions (question, role) VALUES('Você tem se sentido desanimado, deprimido, ou desesperançado desde o mês passado?', 'CLIENT'),('Você está preocupado pela falta de interesse ou prazer em fazer as coisas?', 'CLIENT'),('Você tem ataques súbitos ou inesperados de ansiedade ou nervosismo?', 'CLIENT'), ('Você se sente tenso, preocupado ou estressado com frequência?', 'CLIENT'), ('Você tem atravessado algum período significativamente estressante nos últimos 6 meses?', 'CLIENT'), ('Você enfrentou em sua história algum evento potencialmente ameaçador à sua vida tais como:', 'CLIENT'),('Com que frequência você consome bebidas alcoólicas?', 'CLIENT'), ('Nos dias em que você bebe, quantos drinks você toma em média?', 'CLIENT'),('Você usa medicamentos/drogas em excesso para:', 'CLIENT'),('Nos dias em que você usa medicamentos ou drogas pelas razões anteriores, que quantidades você costuma usar?', 'CLIENT'), ('Seu amigo(a) tem se sentido desanimado(a), deprimido(a), ou desesperançado(a) desde o mês passado?', 'FRIEND'), ('Seu amigo(a) está preocupado(a) pela falta de interesse ou prazer em fazer as coisas?', 'FRIEND'), ('Seu amigo(a) tem ataques súbitos ou inesperados de ansiedade ou nervosismo?', 'FRIEND'), ('Seu amigo(a) se sente tenso(a), preocupado(a)  ou estressado(a) com frequência?', 'FRIEND'), ('Seu amigo(a) tem atravessado algum período significativamente estressante nos últimos 6 meses?', 'FRIEND'), ('Seu amigo(a) enfrentou em sua história algum evento potencialmente ameaçador à sua vida tais como:', 'FRIEND'), ('Com que frequência seu amigo(a) consome bebidas alcoólicas?', 'FRIEND'), ('Nos dias em que seu amigo(a) bebe, quantos drinks ele(a) toma em média?', 'FRIEND'), ('Seu amigo(a) usa medicamentos/drogas em excesso para:', 'FRIEND'), ('Nos dias em que seu amigo(a) usa medicamentos ou drogas pelas razões anteriores, que quantidades ele(a) costuma usar?', 'FRIEND')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM questions where id BETWEEN 1 AND 20');
  }
}
