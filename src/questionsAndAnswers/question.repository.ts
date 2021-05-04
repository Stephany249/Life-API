import { QuestionsRole } from 'roles/rolesQuestions.enum';
import { EntityRepository, Repository } from 'typeorm';
import { Questions } from './entities/questions.entity';

@EntityRepository(Questions)
export class QuestionsRepository extends Repository<Questions> {
  async getQuestions(role: QuestionsRole): Promise<any> {
    const questions = this.query(
      `select q.id, q.question, q."role" from questions q where q."role" = '${role}'`,
    );

    return questions;
  }
}
