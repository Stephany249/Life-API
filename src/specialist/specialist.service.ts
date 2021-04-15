import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialistRepository } from './specialist.repository';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { Specialist } from './entities/specialist.entity';

@Injectable()
export class SpecialistService {
  constructor(
    @InjectRepository(SpecialistRepository)
    private specialistRepository: SpecialistRepository,
  ) {}

  async create(createSpecialistDto: CreateSpecialistDto): Promise<Specialist> {
    return await this.specialistRepository.save(createSpecialistDto);
  }
}
