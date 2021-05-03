import { EntityRepository, Repository } from 'typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';
import { CreateWorkingDto } from './dto/create-working.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(WorkSchedule)
export class WorkScheduleRepository extends Repository<WorkSchedule> {
  async createWorkSchedule(
    createWorkDTO: CreateWorkingDto,
    crm: string,
  ): Promise<WorkSchedule> {
    const { day, from, to } = createWorkDTO;

    const workSchedule = this.create();
    workSchedule.weekdayId = day;
    workSchedule.from = from;
    workSchedule.to = to;
    workSchedule.crm = crm;
    try {
      await workSchedule.save();

      return workSchedule;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o usuário no banco de dados',
      );
    }
  }

  async updateWorkSchedule(
    crm: string,
    createWorkDTO: CreateWorkingDto,
  ): Promise<WorkSchedule> {
    const { day, from, to } = createWorkDTO;

    const workSchedule = await this.getWorkScheduleBySpecialistAndDate(
      crm,
      day,
    );

    if (!workSchedule) {
      return await this.createWorkSchedule(createWorkDTO, crm);
    }

    workSchedule.from = from;
    workSchedule.to = to;

    try {
      return await workSchedule.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o horário de trabalho no banco de dados',
      );
    }
  }

  async getWorkScheduleBySpecialist(crm: string) {
    return await this.find({ where: { crm } });
  }

  async getWorkScheduleBySpecialistAndDate(crm: string, weekdayId: number) {
    return await this.findOne({ where: { crm, weekdayId } });
  }
}
