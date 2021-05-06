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

    return questionAndAnswer;
  }

  async getQuestion(role: QuestionsRole, idQuestion: number): Promise<any> {
    const question = await this.questionsRepository.getQuestion(
      role,
      idQuestion,
    );

    return question;
  }

  async getScoreAnswer(role: string, idAnswer: number): Promise<any> {
    const score = await this.answersRepository.getScoreAnswer(role, idAnswer);

    return score;
  }

  async getQUestionAndAnswerWithMedicalRecord(
    idAnswer: number,
    role: QuestionsRole,
  ): Promise<any> {
    const idAnswerString = idAnswer.toString();
    const answer = [];
    if (idAnswerString.includes(',')) {
      const answerArray = idAnswerString.split(',');
      for (let i = 0; i < answerArray.length; i++) {
        const answers = await this.answersRepository.getQUestionAndAnswerWithMedicalRecord(
          parseInt(answerArray[i]),
        );
        answer.push(answers[0]);
      }
    } else {
      const answers = await this.answersRepository.getQUestionAndAnswerWithMedicalRecord(
        idAnswer,
      );

      answer.push(answers[0]);
    }

    const questions = await this.questionsRepository.getQuestionsThroughTheQuestion(
      role,
      answer[0].questionId,
    );

    const questionAndAnswer = [];
    questionAndAnswer[0] = {
      id: questions[0].id,
      question: questions[0].question,
      answer,
    };

    return questionAndAnswer;
  }
}
