import { Module } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { SpecialistRepository } from './specialist.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistController } from './specialist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialistRepository])],
  providers: [SpecialistService],
  exports: [SpecialistService],
  controllers: [SpecialistController],
})
export class SpecialistModule {}
