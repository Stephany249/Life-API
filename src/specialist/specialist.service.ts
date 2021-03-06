import { ConflictException, Injectable } from '@nestjs/common';
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
    const specialist = await this.specialistRepository.findByCRM(
      createSpecialistDto.crm,
    );

    if (specialist) {
      throw new ConflictException('CRM já está em uso');
    }
    return await this.specialistRepository.save(createSpecialistDto);
  }

  async findSpecialistAndUser(user_id: string): Promise<Specialist> {
    const user = await this.specialistRepository.findSpecialistAndUser(user_id);

    return user;
  }

  async findById(user_id: string): Promise<Specialist> {
    const user = await this.specialistRepository.findById(user_id);

    return user;
  }
}
