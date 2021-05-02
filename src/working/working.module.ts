import { WorkingService } from './working.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkingController } from './working.controller';
import { WorkingRepository } from './working.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WorkingRepository])],
  controllers: [WorkingController],
  providers: [WorkingService],
})
export class WorkingModule {}
