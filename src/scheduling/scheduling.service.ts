import { BadRequestException, Injectable } from '@nestjs/common';
import {
  getDate,
  getDaysInMonth,
  isAfter,
  getDay,
  startOfHour,
  getHours,
  isBefore,
  parseISO,
  subHours,
} from 'date-fns';
import { QuestionsRole } from '../roles/rolesQuestions.enum';
import { WorkScheduleService } from '../work-schedule/work-schedule.service';
import { SchedulingRepository } from './scheduling.repository';

interface IRequest {
  crm: string;
  day?: number;
  month: number;
  year: number;
}

interface RequestCreate {
  userId: string;
  date: Date;
  crm: string;
  medicalRecordsId: number;
  role: QuestionsRole;
}

type IResponseDay = Array<{
  day: number;
  available: boolean;
}>;

type IResponseHour = Array<{
  hour: number;
  available: boolean;
}>;

interface RequestUserId {
  userId: string;
}

interface RequestUpdateSchedulingClient {
  schedulingId: number;
  userId: string;
  date: Date;
}

interface RequestUpdateSchedulingSpecialist {
  schedulingId: number;
  specialistCrm: string;
  date: Date;
}

@Injectable()
export class SchedulingService {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private workScheduleService: WorkScheduleService,
  ) {}

  async createScheduling({
    userId,
    date,
    crm,
    medicalRecordsId,
    role,
  }: RequestCreate): Promise<any> {
    const data = date.toString();
    const dataParsed = parseISO(data);
    const schedulingDate = startOfHour(dataParsed);

    if (isBefore(schedulingDate, Date.now())) {
      throw new BadRequestException(
        'Você não pode criar um agendamento em uma data passada.',
      );
    }

    const hours = await this.workScheduleService.getHoursDay(
      crm,
      getDay(dataParsed) + 1,
    );

    if (
      getHours(schedulingDate) < parseInt(hours.from) ||
      getHours(schedulingDate) > parseInt(hours.to)
    ) {
      throw new BadRequestException(
        `Você só pode criar agendamentos entre ${hours.from} e ${hours.to}`,
      );
    }

    const findAppointmentInSameDate = await this.schedulingRepository.findByDate(
      schedulingDate,
      crm,
    );

    if (findAppointmentInSameDate) {
      throw new BadRequestException('Este agendamento já está agendado');
    }

    const scheduling = this.schedulingRepository.create({
      crmSpecialist: crm,
      userId,
      date: schedulingDate,
      medicalRecordsId,
      role,
    });

    scheduling.save();

    return scheduling;
  }

  async getListSpecialistMonthAvailaility({
    crm,
    month,
    year,
  }: IRequest): Promise<IResponseDay> {
    const scheduling = await this.schedulingRepository.findAllInMonthFromSpecialist(
      {
        crm,
        month,
        year,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = [];
    for (const day of eachDayArray) {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const schedulingInDay = scheduling.filter((schedule) => {
        return getDate(schedule.date) === day;
      });

      const length = await this.workScheduleService.getHoursPerDay(
        crm,
        getDay(compareDate) + 1,
      );

      availability.push({
        day,
        available:
          isAfter(compareDate, new Date()) && schedulingInDay.length < length,
      });
    }

    return availability;
  }

  async getListSpecialistDayAvailaility({
    crm,
    day,
    month,
    year,
  }: IRequest): Promise<IResponseHour> {
    const scheduling = await this.schedulingRepository.findAllInDayFromSpecialist(
      {
        crm,
        day,
        month,
        year,
      },
    );

    const data = new Date(year, month - 1, day);

    const hoursAvailable = await this.workScheduleService.getHoursPerDay(
      crm,
      getDay(data) + 1,
    );

    const hours = await this.workScheduleService.getHoursDay(
      crm,
      getDay(data) + 1,
    );

    const hourStart = parseInt(hours.from);

    const eachHourArray = Array.from(
      { length: hoursAvailable },
      (_, index) => index + hourStart,
    );

    const availability = [];

    for (const hour of eachHourArray) {
      const hasSchedulingInHour = scheduling.find(
        (schedule) => getHours(schedule.date) === hour,
      );

      const currentDate = new Date(Date.now());

      const compareDate = new Date(year, month - 1, day, hour);

      availability.push({
        hour,
        available: !hasSchedulingInHour && isAfter(compareDate, currentDate),
      });
    }

    return availability;
  }

  async getSchedulingSpecialist({
    crm,
    day,
    month,
    year,
  }: IRequest): Promise<any> {
    const scheduling = await this.schedulingRepository.findAllInDayFromSpecialist(
      {
        crm,
        day,
        month,
        year,
      },
    );

    const compareDate = new Date(Date.now());
    const arrayScheduling = [];

    for (let i = 0; i < scheduling.length; i++) {
      if (isAfter(scheduling[i].date, compareDate)) {
        arrayScheduling.push(scheduling[i]);
      }
    }

    return arrayScheduling;
  }

  async getSchedulingClient({ userId }: RequestUserId): Promise<any> {
    const date = new Date(Date.now());
    const scheduling = await this.schedulingRepository.findSchedulingFromClient(
      {
        userId,
      },
    );

    const arrayScheduling = [];

    for (let i = 0; i < scheduling.length; i++) {
      if (
        getDate(date) === getDate(scheduling[i].date) &&
        getHours(scheduling[i].date) > getHours(date)
      ) {
        arrayScheduling.push(scheduling[i]);
      }
    }

    return arrayScheduling;
  }

  async updateSchedulingFromClient({
    schedulingId,
    userId,
    date,
  }: RequestUpdateSchedulingClient): Promise<any> {
    const scheduling = await this.schedulingRepository.getSchedulingThroughSchedulingIdAndUserId(
      schedulingId,
      userId,
    );

    const data = date.toString();
    const dataParsed = parseISO(data);

    const dateWithSub = subHours(scheduling.date, 2);

    const newDate = new Date(Date.now());

    if (isBefore(dateWithSub, newDate)) {
      throw new BadRequestException(
        'Você só pode editar o agendamento com 2 horas de antecedência.',
      );
    }

    if (isBefore(dataParsed, Date.now())) {
      throw new BadRequestException(
        'Você não pode criar um agendamento em uma data passada.',
      );
    }

    const hours = await this.workScheduleService.getHoursDay(
      scheduling.crmSpecialist,
      getDay(dataParsed) + 1,
    );

    if (
      getHours(dataParsed) < parseInt(hours.from) ||
      getHours(dataParsed) > parseInt(hours.to)
    ) {
      throw new BadRequestException(
        `Você só pode criar agendamentos entre ${hours.from} e ${hours.to}`,
      );
    }

    const findAppointmentInSameDate = await this.schedulingRepository.findByDate(
      dataParsed,
      scheduling.crmSpecialist,
    );

    if (findAppointmentInSameDate) {
      throw new BadRequestException('Este horário já está ocupado');
    }

    scheduling.date = dataParsed;

    const editScheduling = await this.schedulingRepository.save(scheduling);

    return editScheduling;
  }

  async updateSchedulingFromSpecialist({
    schedulingId,
    specialistCrm,
    date,
  }: RequestUpdateSchedulingSpecialist): Promise<any> {
    const scheduling = await this.schedulingRepository.getSchedulingThroughSchedulingIdAnSpecialistCrm(
      schedulingId,
      specialistCrm,
    );

    const data = date.toString();
    const dataParsed = parseISO(data);

    const dateWithSub = subHours(scheduling.date, 2);

    const newDate = new Date(Date.now());

    if (isBefore(dateWithSub, newDate)) {
      throw new BadRequestException(
        'Você só pode editar o agendamento com 2 horas de antecedência.',
      );
    }

    if (isBefore(dataParsed, Date.now())) {
      throw new BadRequestException(
        'Você não pode criar um agendamento em uma data passada.',
      );
    }

    const hours = await this.workScheduleService.getHoursDay(
      specialistCrm,
      getDay(dataParsed) + 1,
    );

    if (
      getHours(dataParsed) < parseInt(hours.from) ||
      getHours(dataParsed) > parseInt(hours.to)
    ) {
      throw new BadRequestException(
        `Você só pode criar agendamentos entre ${hours.from} e ${hours.to}`,
      );
    }

    const findAppointmentInSameDate = await this.schedulingRepository.findByDate(
      dataParsed,
      specialistCrm,
    );

    if (findAppointmentInSameDate) {
      throw new BadRequestException('Este horário já está ocupado');
    }

    scheduling.date = dataParsed;

    const editScheduling = await this.schedulingRepository.save(scheduling);

    return editScheduling;
  }
}
