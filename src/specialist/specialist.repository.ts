import { EntityRepository, Repository } from 'typeorm';
import { Specialist } from './entities/specialist.entity';

@EntityRepository(Specialist)
export class SpecialistRepository extends Repository<Specialist> {
  async findByCRM(crm: string): Promise<Specialist | undefined> {
    const specialist = await this.findOne({ where: { crm } });

    return specialist;
  }

  async findById(user: string): Promise<Specialist | undefined> {
    const specialist = await this.findOne({ where: { user } });

    return specialist;
  }
}
