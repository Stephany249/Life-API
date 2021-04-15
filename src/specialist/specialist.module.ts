import { Module } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { SpecialistRepository } from './specialist.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialistRepository])],
  providers: [SpecialistService],
  exports: [SpecialistService],
})
export class SpecialistModule {}
