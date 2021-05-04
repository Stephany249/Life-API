import { QuestionsAndAnswersModule } from './questionsAndAnswers/questionsandanswers.module';
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

//  Configs
import { mailerConfig } from './configs/mailer.config';

@Module({
  imports: [
    QuestionsAndAnswersModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot(mailerConfig),
    UsersModule,
    SpecialistModule,
    AuthModule,
    NotificationModule,
    WorkScheduleModule,
  ],
})
export class AppModule {}
