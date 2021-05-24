import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { CreateListWorkingDto } from './dto/create-list-working.dto';
import { CreateWorkingDto } from './dto/create-working.dto';
import { WorkScheduleService } from './work-schedule.service';

interface DeleteWorkSchedule {
  crm: string;
  weekdayId: number;
}

@Controller('working')
export class WorkScheduleController {
  constructor(private workingService: WorkScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create/:crm')
  async createWorkSchedule(
    @Param() crm : string,
    @Body() createWorkingDto: CreateWorkingDto,
  ): Promise<any> {
    const hours = await this.workingService.createWorkSchedule(
      createWorkingDto,
      crm,
    );
    return hours;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:crm')
  async showWorkingHours(@Param() crm: string): Promise<any> {
    const hours = await this.workingService.getWorkScheduleBySpecialist(crm);

    return hours;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:crm')
  async updateWorkSchedule(
    @Param() crm: string,
    @Body() createWorkingDto: CreateWorkingDto,
  ): Promise<any> {
    const workSchedule = await this.workingService.updateWorkSchedule(
      crm,
      createWorkingDto,
    );

    return workSchedule;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:crm/list')
  async updateListWorkSchedule(
    @Param() crm: string,
    @Body() createListWorkingDto: CreateListWorkingDto,
  ): Promise<any> {
    const workSchedule = await this.workingService.updateListWorkSchedule(
      crm,
      createListWorkingDto,
    );
    return workSchedule;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:crm/day/:weekdayId')
  async deleteWorkSchedule(@Param() deleteWorkSchedule: DeleteWorkSchedule) {
    const workSchedule = await this.workingService.deleteWorkSchedule(
      deleteWorkSchedule.crm,
      deleteWorkSchedule.weekdayId,
    );

    return workSchedule;
  }
}
