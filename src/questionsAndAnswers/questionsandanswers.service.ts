import { Injectable } from '@nestjs/common';
import { QuestionsRole } from 'roles/rolesQuestions.enum';
import { AnswersRepository } from './answers.repository';
import { QuestionsRepository } from './question.repository';

@Injectable()
export class QuestionsAndAnswersService {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async getQuestionAndAnswer(role: QuestionsRole): Promise<any> {
    const questions = await this.questionsRepository.getQuestions(role);

    const questionAndAnswer = [];
    for (let i = 0; i < questions.length; i++) {
      const answer = await this.answersRepository.getAnswersWithQuestion(
        role,
        questions[i].id,
      );
      questionAndAnswer[i] = {
        id: questions[i].id,
        question: questions[i].question,
        answers: answer,
        role: questions[i].role,
      };
    }

    return { questionAndAnswer };
  }
}
