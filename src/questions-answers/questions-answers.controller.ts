import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { QuestionsRole } from 'roles/rolesQuestions.enum';
import { QuestionsAndAnswersService } from './questions-answers.service';

@Controller('questions')
export class QuestionsAndAnswersController {
  constructor(
    private readonly questionsAndAnswersService: QuestionsAndAnswersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/answers/client')
  async getQuestionsAnswerClient() {
    const questionAnswer = this.questionsAndAnswersService.getQuestionAndAnswer(
      QuestionsRole.CLIENT,
    );

    return questionAnswer;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/answers/friend')
  async getQuestionsAnswerFriend() {
    const questionAnswer = this.questionsAndAnswersService.getQuestionAndAnswer(
      QuestionsRole.FRIEND,
    );

    return questionAnswer;
  }
}
