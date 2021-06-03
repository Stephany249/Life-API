import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAnswers1620082820419 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO answers (answer, score, "questionId", role) VALUES ('Sim', 6, 1, 'CLIENT'), ('Não', 0, 1, 'CLIENT'), ('Nunca', 0, 2, 'CLIENT'), ('Raramente', 1, 2, 'CLIENT'), ('Às vezes', 2, 2, 'CLIENT'), ('Muitas vezes', 3, 2, 'CLIENT'), ('Sempre', 4, 2, 'CLIENT'), ('Nunca', 0, 3, 'CLIENT'), ('Raramente', 1, 3, 'CLIENT'), ('Às vezes', 2, 3, 'CLIENT'), ('Muitas vezes', 3, 3, 'CLIENT'), ('Sempre', 4, 3, 'CLIENT'), ('Nunca', 0, 4, 'CLIENT'), ('Raramente', 1, 4, 'CLIENT'), ('Às vezes', 2, 4, 'CLIENT'), ('Muitas vezes', 3, 4, 'CLIENT'), ('Sempre', 4, 4, 'CLIENT'), ('Sim', 6, 5, 'CLIENT'), ('Não', 0, 5, 'CLIENT'), ('Catástrofes naturais', 7, 6, 'CLIENT'), ('Acidente grave', 7, 6, 'CLIENT'), ('Violência física', 7, 6, 'CLIENT'), ('Violência sexual', 7, 6, 'CLIENT'), ('Combate militar', 7, 6, 'CLIENT'), ('Abuso infantil', 7, 6, 'CLIENT'), ('Nenhum', 0, 6, 'CLIENT'), ('Diariamente', 7, 7, 'CLIENT'), ('Somente nos finais de semana', 3, 7, 'CLIENT'), ('Só em ocasiões especiais', 1, 7, 'CLIENT'), ('Nunca', 0, 7, 'CLIENT'), ('1', 0, 8, 'CLIENT'), ('2', 2, 8, 'CLIENT'), ('3', 4, 8, 'CLIENT'), ('4', 6, 8, 'CLIENT'), ('5 ou mais', 7, 8, 'CLIENT'), ('Relaxar', 7, 9, 'CLIENT'), ('Aliviar o estresse', 7, 9, 'CLIENT'), ('Acalmar meus nervos ', 7, 9, 'CLIENT'), ('Controlar uma dor', 7, 9, 'CLIENT'), ('Não utilizo', 0, 9, 'CLIENT'), ('1-2', 1, 10, 'CLIENT'), ('3-4', 3, 10, 'CLIENT'), ('5-6', 4, 10, 'CLIENT'), ('7-8', 6, 10, 'CLIENT'), ('9 ou mais', 7, 10, 'CLIENT'), ('Sim', 6, 11, 'FRIEND'), ('Não', 0, 11, 'FRIEND'), ('Nunca', 0, 12, 'FRIEND'), ('Raramente', 1, 12, 'FRIEND'), ('Às vezes', 2, 12, 'FRIEND'), ('Muitas vezes', 3, 12, 'FRIEND'), ('Sempre', 4, 12, 'FRIEND'), ('Nunca', 0, 13, 'FRIEND'), ('Raramente', 1, 13, 'FRIEND'), ('Às vezes', 2, 13, 'FRIEND'), ('Muitas vezes', 3, 13, 'FRIEND'), ('Sempre', 4, 13, 'FRIEND'), ('Nunca', 0, 14, 'FRIEND'), ('Raramente', 1, 14, 'FRIEND'), ('Às vezes', 2, 14, 'FRIEND'), ('Muitas vezes', 3, 14, 'FRIEND'), ('Sempre', 4, 14, 'FRIEND'), ('Sim', 6, 15, 'FRIEND'), ('Não', 0, 15, 'FRIEND'), ('Catástrofes naturais', 7, 16, 'FRIEND'), ('Acidente grave', 7, 16, 'FRIEND'), ('Violência física', 7, 16, 'FRIEND'), ('Violência sexual', 7, 16, 'FRIEND'), ('Combate militar', 7, 16, 'FRIEND'), ('Abuso infantil', 7, 16, 'FRIEND'), ('Nenhum/ Não sei', 0, 16, 'FRIEND'), ('Diariamente', 7, 17, 'FRIEND'), ('Somente nos finais de semana', 3, 17, 'FRIEND'), ('Só em ocasiões especiais', 1, 17, 'FRIEND'), ('Nunca', 0, 17, 'FRIEND'), ('1', 0, 18, 'FRIEND'), ('2', 2, 18, 'FRIEND'), ('3', 4, 18, 'FRIEND'), ('4', 6, 18, 'FRIEND'), ('5 ou mais', 7, 18, 'FRIEND'), ('Relaxar', 7, 19, 'FRIEND'), ('Aliviar o estresse', 7, 19, 'FRIEND'), ('Acalmar meus nervos ', 7, 19, 'FRIEND'), ('Controlar uma dor', 7, 19, 'FRIEND'), ('Não utiliza', 0, 19, 'FRIEND'), ('1-2', 1, 20, 'FRIEND'), ('3-4', 3, 20, 'FRIEND'), ('5-6', 4, 20, 'FRIEND'), ('7-8', 6, 20, 'FRIEND'), ('9 ou mais', 7, 20, 'FRIEND')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM answers where id BETWEEN 1 AND 90');
  }
}
