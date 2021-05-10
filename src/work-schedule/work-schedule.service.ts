import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWorkingDto } from './dto/create-working.dto';
import { CreateListWorkingDto } from './dto/create-list-working.dto';
import { WorkScheduleRepository } from './work-schedule.repository';

interface userCRM {
  crm: string;
}

@Injectable()
export class WorkScheduleService {
  constructor(private workingRepository: WorkScheduleRepository) {}

  async createWorkSchedule(
    createWorkingDto: CreateWorkingDto,
    userCRM: userCRM,
  ): Promise<any> {
    if (await this.getWorkingSchedule(userCRM, createWorkingDto.day)) {
      throw new ConflictException(
        'Dia já está cadastrado para este profissional',
      );
    }

    return await this.workingRepository.createWorkSchedule(
      createWorkingDto,
      userCRM.crm,
    );
  }

  async getWorkingSchedule(userCRM: userCRM, weekdayId: number): Promise<any> {
    return await this.workingRepository.getWorkScheduleBySpecialistAndDate(
      userCRM.crm,
      weekdayId,
    );
  }

  async getWorkScheduleBySpecialist(userCRM: userCRM) {
    return await this.workingRepository.getWorkScheduleBySpecialist(
      userCRM.crm,
    );
  }

  async updateWorkSchedule(crm: string, createWorkingDto: CreateWorkingDto) {
    return await this.workingRepository.updateWorkSchedule(
      crm,
      createWorkingDto,
    );
  }

  async deleteWorkSchedule(crm: string, weekdayId: number) {
    const workSchedule = await this.workingRepository.getWorkScheduleBySpecialistAndDate(
      crm,
      weekdayId,
    );

    return await this.workingRepository.remove(workSchedule);
  }

  async getHoursPerDay(crm: string, weekdayId: number) {
    const workSchedule = await this.workingRepository.getWorkScheduleBySpecialistAndDate(
      crm,
      weekdayId,
    );

    if (workSchedule) {
      const total = parseInt(workSchedule.to) - parseInt(workSchedule.from);

      return total;
    }
  }

  async getHoursDay(crm: string, weekdayId: number) {
    const workSchedule = await this.workingRepository.getWorkScheduleBySpecialistAndDate(
      crm,
      weekdayId,
    );

    return workSchedule;
  }

  async updateListWorkSchedule(
    crm: string,
    createListWorkingDto: CreateListWorkingDto,
  ) {
    try {
      const respList = [];
      for (const workSchedule of createListWorkingDto.working) {
        const work = await this.workingRepository.updateWorkSchedule(
          crm,
          workSchedule,
        );
        respList.push(work);
      }
      return respList;
    } catch (err) {
      throw new InternalServerErrorException(
        'Erro ao salvar o horário de trabalho no banco de dados',
      );
    }
  }
}
