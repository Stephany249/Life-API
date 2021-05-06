import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordRepository } from './medical-record.repository';
import { QuestionsAndAnswersModule } from 'questions-answers/questions-answers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalRecordRepository]),
    QuestionsAndAnswersModule,
  ],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
})
export class MedicalRecordModule {}
