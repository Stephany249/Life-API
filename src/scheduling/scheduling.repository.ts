import { EntityRepository, Raw, Repository } from 'typeorm';
import { FindAllInDayFromSpecialistDto } from './dto/find-all-day.dto ';
import { FindAllMonthFromSpecialistDto } from './dto/find-all-month.dto';
import { FindAllDAyFromClientDto } from './dto/find-scheduling-day-client.dto';
import { Scheduling } from './entities/scheduling.entity';

@EntityRepository(Scheduling)
export class SchedulingRepository extends Repository<Scheduling> {
  async findByDate(date: Date, crm: string): Promise<any> {
    const findScheduling = await this.findOne({
      where: { date, crmSpecialist: crm },
    });

    return findScheduling;
  }

  async findAllInMonthFromSpecialist({
    crm,
    month,
    year,
  }: FindAllMonthFromSpecialistDto): Promise<any> {
    const parseMonth = String(month).padStart(2, '0');

    const schedule = await this.find({
      where: {
        crmSpecialist: crm,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parseMonth}-${year}'`,
        ),
      },
    });

    return schedule;
  }

  async findAllInDayFromSpecialist({
    crm,
    day,
    month,
    year,
  }: FindAllInDayFromSpecialistDto): Promise<any> {
    const parseMonth = String(month).padStart(2, '0');
    const parseDay = String(day).padStart(2, '0');

    const schedule = await this.find({
      where: {
        crmSpecialist: crm,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parseDay}-${parseMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return schedule;
  }

  async findSchedulingFromClient({
    userId,
  }: FindAllDAyFromClientDto): Promise<any> {
    const schedule = await this.find({
      where: {
        userId,
      },
      relations: ['specialist'],
    });

    return schedule;
  }

  async getSchedulingThroughSchedulingIdAndUserId(
    schedulingId: number,
    userId: string,
  ): Promise<any> {
    const scheduling = await this.findOne({
      where: { id: schedulingId, userId },
    });

    return scheduling;
  }

  async getSchedulingThroughSchedulingIdAnSpecialistCrm(
    schedulingId: number,
    specialistCrm: string,
  ): Promise<any> {
    const scheduling = await this.findOne({
      where: { id: schedulingId, crmSpecialist: specialistCrm },
    });

    return scheduling;
  }
}
