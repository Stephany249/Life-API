import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersRepository } from './answers.repository';
import { QuestionsRepository } from './question.repository';
import { QuestionsAndAnswersController } from './questionsandanswers.controller';
import { QuestionsAndAnswersService } from './questionsandanswers.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionsRepository, AnswersRepository])],
  controllers: [QuestionsAndAnswersController],
  providers: [QuestionsAndAnswersService],
})
export class QuestionsAndAnswersModule {}
