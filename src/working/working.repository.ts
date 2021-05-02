import { EntityRepository, Repository } from 'typeorm';
import { Working } from './entities/working.entity';
import { CreateWorkingDto } from './dto/create-working.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Working)
export class WorkingRepository extends Repository<Working> {
  async createWorking(
    createWorkingDto: CreateWorkingDto,
    userId: string,
  ): Promise<any> {
    let i = 0;
    let j = 0;
    const working = [];

    const Hours = await this.getWorking(userId);
    if (Hours) {
      while (j < Hours.length) {
        await this.createQueryBuilder()
          .delete()
          .from(Working)
          .where('crm = :crm', { crm: userId });
        j++;
      }
    }

    while (i < createWorkingDto.working.length) {
      const hour = this.create();
      hour.day = createWorkingDto.working[i].day;
      hour.from = createWorkingDto.working[i].from;
      hour.to = createWorkingDto.working[i].to;
      hour.crm = userId;
      try {
        await hour.save();
        working.push(hour);
      } catch (err) {
        throw new InternalServerErrorException(
          'Erro ao salvar os horarios no banco de dados',
        );
      }
      i++;
    }

    return working;
  }

  async getWorking(userId: string) {
    return await this.find({ where: { crm: userId } });
  }
}
