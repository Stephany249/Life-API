import { NotificationService } from './notification.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifcationRepository } from './notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotifcationRepository])],
  exports: [NotificationService],
  providers: [NotificationService],
})
export class NotificationModule {}
