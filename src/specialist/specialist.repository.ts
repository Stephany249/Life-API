import { EntityRepository, Repository } from 'typeorm';
import { Specialist } from './entities/specialist.entity';

@EntityRepository(Specialist)
export class SpecialistRepository extends Repository<Specialist> {}
