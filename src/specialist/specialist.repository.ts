import { EntityRepository, Repository } from 'typeorm';
import { Specialist } from './entities/specialist.entity';

@EntityRepository(Specialist)
export class SpecialistRepository extends Repository<Specialist> {
  async findByCRM(crm: string): Promise<Specialist | undefined> {
    const specialist = await this.findOne({ where: { crm } });

    return specialist;
  }

  async findById(userId: string): Promise<Specialist | undefined> {
    const specialist = await this.findOne({ where: { userId } });

    return specialist;
  }

  async findSpecialistAndUser(userId: string): Promise<Specialist | undefined> {
    const specialist = await this.query(`
      select u.*, s.crm from "user" u join specialist s on u.id = s."userId" and u.id ='${userId}'
    `);

    return specialist;
  }
}
