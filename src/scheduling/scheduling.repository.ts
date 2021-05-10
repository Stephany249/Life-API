import { EntityRepository, Raw, Repository } from 'typeorm';
import { FindAllInDayFromSpecialistDto } from './dto/find-all-day.dto ';
import { FindAllMonthFromSpecialistDto } from './dto/find-all-month.dto';
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
    });

    return schedule;
  }
}
