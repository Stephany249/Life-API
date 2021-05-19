import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
  getMonth,
  getYear,
} from 'date-fns';
import { UsersService } from '../users/users.service';
import { UserRole } from '../roles/roles.enum';
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
  role: UserRole;
  id: string;
  date: Date;
}

interface RequestDeleteSchedulingClient {
  schedulingId: number;
  id: string;
  role: UserRole;
}

@Injectable()
export class SchedulingService {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private usersService: UsersService,
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
      throw new BadRequestException('Este horário já está ocupado');
    }

    const scheduling = this.schedulingRepository.create({
      crmSpecialist: crm,
      userId,
      date: schedulingDate,
      medicalRecordsId,
      role,
    });

    try {
      scheduling.save();
      return scheduling;
    } catch (err) {
      throw new InternalServerErrorException(
        'Erro ao salvar o agendamento no banco de dados',
      );
    }
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
          isAfter(new Date(compareDate), new Date()) &&
          schedulingInDay.length < length,
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
    const arrayScheduling = []
    const scheduling = await this.schedulingRepository.findSchedulingFromSpecialist(
      {
        crm,
        day,
        month,
        year,
      },
    );
    let j = 0;

    if(scheduling.length >= 1) {
      for(let i = 0; i < scheduling.length; i++) {
        if(getHours(scheduling[i].date) >= getHours(new Date(Date.now()))) {
          const { name } = await this.usersService.findById(scheduling[i].userId);
            arrayScheduling[j] = {
              scheduling: scheduling[i],
              name
            }
          j++;
        }

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
        getDate(date) === getDate(scheduling[i].date) && getHours(scheduling[i].date) >= getHours(date)) {
        arrayScheduling.push(scheduling[i]);
      }
    }

    return arrayScheduling;
  }

  async updateScheduling({
    schedulingId,
    role,
    id,
    date,
  }: RequestUpdateSchedulingClient): Promise<any> {
    let scheduling: any;

    if (role === UserRole.SPECIALIST) {
      scheduling = await this.schedulingRepository.getSchedulingThroughSchedulingIdAnSpecialistCrm(
        schedulingId,
        id,
      );
    } else {
      scheduling = await this.schedulingRepository.getSchedulingThroughSchedulingIdAndUserId(
        schedulingId,
        id,
      );
    }

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

  async cancelScheduling({
    schedulingId,
    role,
    id,
  }: RequestDeleteSchedulingClient): Promise<any> {
    let scheduling: any;
    let dateWithSub: Date;
    if (role === UserRole.SPECIALIST) {
      scheduling = await this.schedulingRepository.getSchedulingThroughSchedulingIdAnSpecialistCrm(
        schedulingId,
        id,
      );

      dateWithSub = subHours(scheduling.date, 2);
      const newDate = new Date(Date.now());

      if (isBefore(dateWithSub, newDate)) {
        throw new BadRequestException(
          'Você só pode cancelar o agendamento com no máximo 2 horas de antecedência.',
        );
      }

      const specialist = await this.checkSpecialistAvailabilityWithASpecificSpecialist(
        id,
        scheduling.date,
      );

      if (scheduling !== null) {
        scheduling.crmSpecialist = specialist;
        await this.schedulingRepository.save(scheduling);

        return { mensage: 'Agendamento cancelado com sucesso' };
      } else {
        scheduling.canceledAt = new Date();

        await this.schedulingRepository.save(scheduling);

        return { mensage: 'Agendamento cancelado com sucesso' };
      }
    } else {
      scheduling = await this.schedulingRepository.getSchedulingThroughSchedulingIdAndUserId(
        schedulingId,
        id,
      );

      dateWithSub = subHours(scheduling.date, 2);
      const newDate = new Date(Date.now());

      if (isBefore(dateWithSub, newDate)) {
        throw new BadRequestException(
          'Você só pode cancelar o agendamento com no máximo 2 horas de antecedência.',
        );
      }

      scheduling.canceledAt = new Date();

      await this.schedulingRepository.save(scheduling);

      return { mensage: 'Agendamento cancelado com sucesso' };
    }
  }

  async checkSpecialistAvailabilityWithASpecificSpecialist(
    crm: string,
    date: Date,
  ): Promise<any> {
    const day = getDate(date);
    const month = getMonth(date) + 1;
    const year = getYear(date);

    const hour = getHours(date);
    const weekDay = getDay(date) + 1;

    const specialists = await this.workScheduleService.checkSpecialistAvailability(
      crm,
      weekDay,
    );

    let daysOfMonth: any;

    let hoursOfDay: any;

    let returnCrm: any = null;

    if (specialists.length > 0) {
      for (const specialist of specialists) {
        const crmSpecialist: string = specialist.crm;
        daysOfMonth = await this.getListSpecialistMonthAvailaility({
          crm: crmSpecialist,
          month,
          year,
        });
        const dayMonth = day - 1;

        if (daysOfMonth[dayMonth].available == true) {
          hoursOfDay = await this.getListSpecialistDayAvailaility({
            crm: crmSpecialist,
            day,
            month,
            year,
          });

          for (const hourOfDay of hoursOfDay) {
            if (hourOfDay.hour === hour && hourOfDay.available == true) {
              returnCrm = crmSpecialist;
            }
          }
        }
      }
    }

    return returnCrm;
  }

  async createImmediateScheduling(
    userId: string,
    medicalRecordsId: number,
    date: Date,
  ): Promise<any> {
    const day = getDate(date);
    const month = getMonth(date) + 1;
    const year = getYear(date);

    const hour = getHours(date);
    const weekDay = getDay(date) + 1;

    const role = QuestionsRole.CLIENT;

    const specialists = await this.workScheduleService.checkAllAvailability(
      weekDay,
    );

    let daysOfMonth: any;

    let hoursOfDay: any;

    let scheduling: any;

    if (specialists.length > 0) {
      for (const specialist of specialists) {
        const crmSpecialist: string = specialist.crm;
        daysOfMonth = await this.getListSpecialistMonthAvailaility({
          crm: crmSpecialist,
          month,
          year,
        });
        const dayMonth = day - 1;

        if (daysOfMonth[dayMonth].available == true) {
          hoursOfDay = await this.getListSpecialistDayAvailaility({
            crm: crmSpecialist,
            day,
            month,
            year,
          });

          for (const hourOfDay of hoursOfDay) {
            if (hourOfDay.hour == hour) {
              scheduling = this.schedulingRepository.create({
                crmSpecialist,
                userId,
                date,
                medicalRecordsId,
                role,
              });

              try {
                scheduling.save();
                return {
                  scheduling,
                  message: 'Atendimento imediato cadastrado com sucesso',
                };
              } catch (err) {
                throw new InternalServerErrorException(
                  'Erro ao salvar o agendamento no banco de dados',
                );
              }
            }
          }
        }
      }
    } else {
      return { message: 'Sem profissionais disponíveis' };
    }
  }
}
