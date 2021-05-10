import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { SchedulingService } from './scheduling.service';
import { QuestionsRole } from '../roles/rolesQuestions.enum';

interface returnCrm {
  crm: string;
}

interface returnUserId {
  id: string;
}

interface returnQuery {
  day: number;
  month: number;
  year: number;
}

interface returnQueryMonthYear {
  month: number;
  year: number;
}

interface returnBody {
  userId: string;
  date: Date;
  medicalRecordsId: number;
}

interface returnBodyDate {
  date: Date;
}

interface returnParams {
  idScheduling: number;
  id: string;
}

@Controller('scheduling')
export class SchedulingController {
  constructor(private schedulingService: SchedulingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:crm/month-availability')
  async getListSpecialistMonthAvailaility(
    @Param() crmSpecialist: returnCrm,
    @Query() query: returnQueryMonthYear,
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
  @Get('/:crm/day-availability')
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

  @UseGuards(JwtAuthGuard)
  @Post('/:crm/client')
  async createSchedulingClient(
    @Param() crmSpecialist: returnCrm,
    @Body() body: returnBody,
  ): Promise<any> {
    const crm = crmSpecialist.crm;
    const userId = body.userId;
    const date = body.date;
    const medicalRecordsId = body.medicalRecordsId;
    const role = QuestionsRole.CLIENT;

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
  @Post('/:crm/friend')
  async createSchedulingFriend(
    @Param() crmSpecialist: returnCrm,
    @Body() body: returnBody,
  ): Promise<any> {
    const crm = crmSpecialist.crm;
    const userId = body.userId;
    const date = body.date;
    const medicalRecordsId = body.medicalRecordsId;
    const role = QuestionsRole.FRIEND;

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
  @Get('/specialist/:crm')
  async getSchedulingSpecialist(
    @Param() crmSpecialist: returnCrm,
    @Query() query: returnQuery,
  ): Promise<any> {
    const crm = crmSpecialist.crm;
    const day = query.day;
    const month = query.month;
    const year = query.year;

    const scheduling = await this.schedulingService.getSchedulingSpecialist({
      crm,
      day,
      month,
      year,
    });

    return scheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/client/:id')
  async getSchedulingClient(@Param() id: returnUserId): Promise<any> {
    const userId = id.id;

    const scheduling = await this.schedulingService.getSchedulingClient({
      userId,
    });

    return scheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:idScheduling/client/:id/')
  async updateSchedulingFromClient(
    @Param() params: returnParams,
    @Body() body: returnBodyDate,
  ): Promise<any> {
    const schedulingId = params.idScheduling;
    const userId = params.id;
    const date = body.date;

    const editScheduling = await this.schedulingService.updateSchedulingFromClient(
      {
        schedulingId,
        userId,
        date,
      },
    );

    return editScheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:idScheduling/specialist/:id/')
  async updateSchedulingFromSpecialist(
    @Param() params: returnParams,
    @Body() body: returnBodyDate,
  ): Promise<any> {
    const schedulingId = params.idScheduling;
    const specialistCrm = params.id;
    const date = body.date;

    const editScheduling = await this.schedulingService.updateSchedulingFromSpecialist(
      {
        schedulingId,
        specialistCrm,
        date,
      },
    );

    return editScheduling;
  }
}
