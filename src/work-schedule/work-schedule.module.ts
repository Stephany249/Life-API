import { WorkScheduleService } from './work-schedule.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkScheduleController } from './work-schedule.controller';
import { WorkScheduleRepository } from './work-schedule.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WorkScheduleRepository])],
  controllers: [WorkScheduleController],
  providers: [WorkScheduleService],
  exports: [WorkScheduleService],
})
export class WorkScheduleModule {}
