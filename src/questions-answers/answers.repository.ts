import { QuestionsRole } from 'roles/rolesQuestions.enum';
import { EntityRepository, Repository } from 'typeorm';
import { Answers } from './entities/answers.entity';

@EntityRepository(Answers)
export class AnswersRepository extends Repository<Answers> {
  async getAnswersWithQuestion(
    role: QuestionsRole,
    idQuestion: number,
  ): Promise<any> {
    const answers = await this.query(
      `select a.id, a.answer, a.score from answers a where a."role" = '${role}' and a."questionId" = ${idQuestion}`,
    );

    return answers;
  }

  async getScoreAnswer(role: string, idAnswer: number): Promise<any> {
    const answerScore = await this.query(
      `select a.score from answers a where a."role" = '${role}' and a.id = ${idAnswer}`,
    );

    return answerScore;
  }

  async getQUestionAndAnswerWithMedicalRecord(idAnswer: number): Promise<any> {
    const answer = await this.query(
      `select a.id, a.answer, a."questionId" from answers a where a.id = ${idAnswer}`,
    );

    return answer;
  }
}
