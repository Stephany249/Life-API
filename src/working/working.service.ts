import { Injectable } from '@nestjs/common';
import { CreateWorkingDto } from './dto/create-working.dto';
import { WorkingRepository } from './working.repository';

interface userCRM {
  crm: string;
}

@Injectable()
export class WorkingService {
  constructor(private workingRepository: WorkingRepository) {}

  async createWorkingHours(
    createWorkingDto: CreateWorkingDto,
    userCRM: userCRM,
  ): Promise<any> {
    return await this.workingRepository.createWorking(
      createWorkingDto,
      userCRM.crm,
    );
  }

  async getWorkingHours(userCRM: userCRM): Promise<any> {
    return await this.workingRepository.getWorking(userCRM.crm);
  }
}
