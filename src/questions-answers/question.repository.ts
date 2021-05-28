import { QuestionsRole } from 'roles/rolesQuestions.enum';
import { EntityRepository, Repository } from 'typeorm';
import { Questions } from './entities/questions.entity';

@EntityRepository(Questions)
export class QuestionsRepository extends Repository<Questions> {
  async getQuestions(role: QuestionsRole): Promise<any> {
    const questions = await this.query(
      `select q.id, q.question, q."role" from questions q where q."role" = '${role}' order by q.id`,
    );

    return questions;
  }

  async getQuestion(role: QuestionsRole, idQuestion: number): Promise<any> {
    const question = await this.query(
      `select q.id, q.question from questions q where q."role" = '${role}' and q.id = ${idQuestion}`,
    );

    return question;
  }

  async getQuestionsThroughTheQuestion(
    role: QuestionsRole,
    idQuestion: number,
  ): Promise<any> {
    const questions = await this.query(
      `select q.id, q.question, q."role" from questions q where q."role" = '${role}' and q.id = ${idQuestion}`,
    );

    return questions;
  }
}
