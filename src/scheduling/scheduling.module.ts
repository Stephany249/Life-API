import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { SchedulingRepository } from './scheduling.repository';
import { WorkScheduleModule } from 'work-schedule/work-schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchedulingRepository]),
    WorkScheduleModule,
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService],
})
export class SchedulingModule {}
