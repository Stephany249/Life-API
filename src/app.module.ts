import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { MailerModule } from '@nestjs-modules/mailer';

//Application Modules
import { SpecialistModule } from './specialist/specialist.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { WorkScheduleModule } from './work-schedule/work-schedule.module';
import { QuestionsAndAnswersModule } from './questions-answers/questions-answers.module';
import { MedicalRecordModule } from './medical-record/medical-record.module';
import { SchedulingModule } from './scheduling/scheduling.module';

//  Configs
import { mailerConfig } from './configs/mailer.config';

@Module({
  imports: [
    SchedulingModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot(mailerConfig),
    UsersModule,
    SpecialistModule,
    AuthModule,
    NotificationModule,
    WorkScheduleModule,
    QuestionsAndAnswersModule,
    MedicalRecordModule,
  ],
})
export class AppModule {}
