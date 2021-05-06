import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersRepository } from './answers.repository';
import { QuestionsRepository } from './question.repository';
import { QuestionsAndAnswersController } from './questions-answers.controller';
import { QuestionsAndAnswersService } from './questions-answers.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionsRepository, AnswersRepository])],
  controllers: [QuestionsAndAnswersController],
  exports: [QuestionsAndAnswersService],
  providers: [QuestionsAndAnswersService],
})
export class QuestionsAndAnswersModule {}
