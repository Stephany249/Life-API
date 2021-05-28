import { QuestionsRole } from '../roles/rolesQuestions.enum';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecord } from './entities/medical-record.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(MedicalRecord)
export class MedicalRecordRepository extends Repository<MedicalRecord> {
  async createMedicalRecord(
    createMedicalRecordDto: CreateMedicalRecordDto,
    role: QuestionsRole,
    userId: string,
    score: number,
    scale: string,
  ): Promise<any> {
    const medicalRecord = this.create();
    medicalRecord.userId = userId;
    medicalRecord.role = role;
    medicalRecord.question1 = createMedicalRecordDto.question1;
    medicalRecord.question2 = createMedicalRecordDto.question2;
    medicalRecord.question3 = createMedicalRecordDto.question3;
    medicalRecord.question4 = createMedicalRecordDto.question4; 
    medicalRecord.question5 = createMedicalRecordDto.question5;
    medicalRecord.question6 = createMedicalRecordDto.question6;
    medicalRecord.question7 = createMedicalRecordDto.question7;
    medicalRecord.question8 = createMedicalRecordDto.question8;
    medicalRecord.question9 = createMedicalRecordDto.question9;
    medicalRecord.question10 = createMedicalRecordDto.question10;
    medicalRecord.score = score;
    medicalRecord.scale = scale;

    try {
      await medicalRecord.save();

      return medicalRecord;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Erro ao salvar o prontuário no banco de dados',
      );
    }
  }

  async getMedicalRecord(idMedcalRecord: number): Promise<any> {
    return await this.find({ where: { id: idMedcalRecord } });
  }
}
