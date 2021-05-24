import {
  BadRequestException,
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
    userCRM: string,
  ): Promise<any> {
    if (await this.getWorkingSchedule(userCRM, createWorkingDto.day)) {
      throw new ConflictException(
        'Dia já está cadastrado para este profissional',
      );
    }

    return await this.workingRepository.createWorkSchedule(
      createWorkingDto,
      userCRM,
    );
  }

  async getWorkingSchedule(userCRM: string, weekdayId: number): Promise<any> {
    return await this.workingRepository.getWorkScheduleBySpecialistAndDate(
      userCRM,
      weekdayId,
    );
  }

  async getWorkScheduleBySpecialist(userCRM: string) {
    return await this.workingRepository.getWorkScheduleBySpecialist(
      userCRM,
    );
  }

  async updateWorkSchedule(crm: string, createWorkingDto: CreateWorkingDto) {
    return await this.workingRepository.updateWorkSchedule(
      crm,
      createWorkingDto,
    );
  }

  async deleteWorkSchedule(crm: string, weekdayId: number) {
    console
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

    if (workSchedule !== undefined) {
      return workSchedule;
    } else {
      throw new BadRequestException('Dados não encontrados');
    }
  }

  async updateListWorkSchedule(
    crm: string,
    createListWorkingDto: CreateListWorkingDto,
  ) {
    try {
      const respList = [];
      let entered = 0;
      const currentTimes = await this.getWorkScheduleBySpecialist(crm);

      if(currentTimes.length > 0) {
        for (const currentTime of currentTimes) {
          for(const workSchedule of createListWorkingDto.working) {
            if(currentTime.weekdayId !== workSchedule.day) {
              entered++;
              if(createListWorkingDto.working.length === entered) {
                await this.deleteWorkSchedule(crm, currentTime.weekdayId);
              }
            }
          }
          entered = 0;
        }
      }
      
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

  async checkSpecialistAvailability(
    crm: string,
    weekDay: number,
  ): Promise<any> {
    const specialists = await this.workingRepository.checkSpecialistAvailability(
      crm,
      weekDay,
    );

    return specialists;
  }

  async checkAllAvailability(weekDay: number): Promise<any> {
    const specialists = await this.workingRepository.checkAllAvailability(
      weekDay,
    );

    return specialists;
  }
}
