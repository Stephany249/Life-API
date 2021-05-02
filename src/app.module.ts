import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config.ts';
import { MailerModule } from '@nestjs-modules/mailer';

//Application Modules
import { SpecialistModule } from './specialist/specialist.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { WorkingModule } from './working/working.module';

//  Configs
import { mailerConfig } from './configs/mailer.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot(mailerConfig),
    UsersModule,
    SpecialistModule,
    AuthModule,
    NotificationModule,
    WorkingModule,
  ],
})
export class AppModule {}
