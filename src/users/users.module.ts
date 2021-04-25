import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistModule } from '../specialist/specialist.module';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express/multer';
import { NotificationModule } from 'notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    SpecialistModule,
    MulterModule.register({
      dest: '../../tmp/uploads',
    }),
    NotificationModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
