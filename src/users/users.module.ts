import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistModule } from 'src/specialist/specialist.module';
import { UsersController } from './users.controller';
import { LocalStrategy } from 'src/auth/local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), SpecialistModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
