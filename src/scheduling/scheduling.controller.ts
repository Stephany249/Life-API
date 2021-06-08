import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SchedulingService } from './scheduling.service';
import { QuestionsRole } from '../roles/rolesQuestions.enum';
import { UserRole } from '../roles/roles.enum';

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

interface returnBodyUserAndMedicalRecording {
  userId: string;
  medicalRecordsId: number;
}

interface returnBodyUrl {
  url: string;
}

interface returnBodyDate {
  date: Date;
}

interface returnParams {
  idScheduling: number;
  id: string;
}

interface returnParamsEdit {
  idScheduling: number;
  id: string;
  crm: string
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
  @Get('/specialist-availability')
  async checkSpecialistAvailability(): Promise<any> {
    const date = new Date(Date.now());
    const availability = await this.schedulingService.checkSpecialistAvailability(date);

    return availability;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:idScheduling/client/:id/specialist/:crm')
  async updateSchedulingFromClient(
    @Param() params: returnParamsEdit,
    @Body() body: returnBodyDate,
  ): Promise<any> {
    const schedulingId = params.idScheduling;
    const id = params.id;
    const crm = params.crm;
    const date = body.date;

    const editScheduling = await this.schedulingService.updateSchedulingClient({
      schedulingId,
      id,
      date,
      crm,
    });

    return editScheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:idScheduling/specialist/:id/')
  async updateSchedulingFromSpecialist(
    @Param() params: returnParams,
    @Body() body: returnBodyDate,
  ): Promise<any> {
    const schedulingId = params.idScheduling;
    const id = params.id;
    const date = body.date;

    const editScheduling = await this.schedulingService.updateSchedulingSpecialist({
      schedulingId,
      id,
      date,
    });

    return editScheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':idScheduling/client/:id/')
  async deleteSchedulingFromClient(
    @Param() params: returnParams,
  ): Promise<any> {
    const schedulingId = params.idScheduling;
    const id = params.id;
    const role = UserRole.CLIENT;
    const cancelScheduling = await this.schedulingService.cancelScheduling({
      schedulingId,
      role,
      id,
    });
    return cancelScheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':idScheduling/specialist/:id/')
  async deleteSchedulingFromSpecialist(
    @Param() params: returnParams,
  ): Promise<any> {
    const schedulingId = params.idScheduling;
    const id = params.id;
    const role = UserRole.SPECIALIST;
    const cancelScheduling = await this.schedulingService.cancelScheduling({
      schedulingId,
      role,
      id,
    });

    return cancelScheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/immediate')
  async immediateSchedulingFromSpecialist(
    @Body() body: returnBodyUserAndMedicalRecording,
  ): Promise<any> {
    const userId = body.userId;
    const medicalRecordsId = body.medicalRecordsId;
    const data = new Date(Date.now());

    const immediateScheduling = await this.schedulingService.createImmediateScheduling(
      userId,
      medicalRecordsId,
      data,
    );

    return immediateScheduling;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/specialist/:id/schedule/:idScheduling/url/')
  async insertScheduleUrl(
    @Param() params: returnParams,
    @Body() body: returnBodyUrl,
  ): Promise<any> {
    const urlSchedule = body.url;
    const idSchedule = params.idScheduling;
    const crm = params.id;
    
    const scheduleWithUrl = await this.schedulingService.insertScheduleUrl(
      idSchedule,
      urlSchedule,
      crm
    );

    return scheduleWithUrl;
  }
}
