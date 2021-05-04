import { QuestionsRole } from 'roles/rolesQuestions.enum';
import { EntityRepository, Repository } from 'typeorm';
import { Answers } from './entities/answers.entity';

@EntityRepository(Answers)
export class AnswersRepository extends Repository<Answers> {
  async getAnswersWithQuestion(
    role: QuestionsRole,
    idQuestion: number,
  ): Promise<any> {
    const answers = this.query(
      `select a.id, a.answer, a.score from answers a where a."role" = '${role}' and a."questionId" = ${idQuestion}`,
    );

    return answers;
  }
}
