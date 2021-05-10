import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { SchedulingService } from './scheduling.service';
import { QuestionsRole } from '../roles/rolesQuestions.enum';

interface returnCrm {
  crm: string;
}

interface returnQuery {
  day?: number;
  month: number;
  year: number;
}

interface returnBody {
  userId: string;
  date: Date;
  medicalRecordsId: number;
}

@Controller('scheduling')
export class SchedulingController {
  constructor(private schedulingService: SchedulingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:crm/client')
  async createScheduling(
    @Param() crmSpecialist: returnCrm,
    @Body() body: returnBody,
  ): Promise<any> {
    const crm = crmSpecialist.crm;
    const userId = body.userId;
    const date = body.date;
    const medicalRecordsId = body.medicalRecordsId;
    const role = QuestionsRole.CLIENT;

    console.log(body);

    const scheduling = await this.schedulingService.createScheduling({
      crm,
      userId,
      date,
      medicalRecordsId,
      role,
    });

    return scheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:crm/days')
  async getListSpecialistMonthAvailaility(
    @Param() crmSpecialist: returnCrm,
    @Query() query: returnQuery,
  ): Promise<any> {
    const crm = crmSpecialist.crm;
    const month = query.month;
    const year = query.year;

    const scheduling = await this.schedulingService.getListSpecialistMonthAvailaility(
      { crm, month, year },
    );

    return scheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:crm/hours')
  async getListSpecialistDayAvailaility(
    @Param() crmSpecialist: returnCrm,
    @Query() query: returnQuery,
  ): Promise<any> {
    const crm = crmSpecialist.crm;
    const day = query.day;
    const month = query.month;
    const year = query.year;

    const scheduling = await this.schedulingService.getListSpecialistDayAvailaility(
      { crm, day, month, year },
    );

    return scheduling;
  }
}
