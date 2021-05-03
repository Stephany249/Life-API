import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDays1620060574971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO weekday (name) VALUES('Domingo'), ('Segunda'), ('Terça'), ('Quarta'), ('Quinta'), ('Sexta'), ('Sábado')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM weekday where id BETWEEN 1 AND 7');
  }
}
