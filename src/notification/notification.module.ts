import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from './notification.service';
import { NotifcationRepository } from './notification.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotifcationRepository]),
    forwardRef(() => UsersModule),
  ],
  exports: [NotificationService],
  providers: [NotificationService],
})
export class NotificationModule {}
