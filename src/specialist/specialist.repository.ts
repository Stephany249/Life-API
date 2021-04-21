import { EntityRepository, Repository } from 'typeorm';
import { Specialist } from './entities/specialist.entity';

@EntityRepository(Specialist)
export class SpecialistRepository extends Repository<Specialist> {
  async findByCRM(crm: string): Promise<Specialist | undefined> {
    const specialist = await this.findOne({ where: { crm } });

    return specialist;
  }

  async findById(id: string): Promise<Specialist | undefined> {
    const user = await this.findOne({ where: { user: id } });

    return user;
  }
}
