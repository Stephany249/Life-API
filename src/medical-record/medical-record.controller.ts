import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { QuestionsRole } from 'roles/rolesQuestions.enum';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordService } from './medical-record.service';

interface returnUserId {
  id: string;
}

interface returnMedicalRecordId {
  id: number;
}

@Controller('medical-record')
export class MedicalRecordController {
  constructor(private medicalRecordService: MedicalRecordService) {}

  @UseGuards(JwtAuthGuard)
  @Post('client/:id')
  async createMedicalRecordCliente(
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
    @Param() userId: returnUserId,
  ): Promise<any> {
    const medicalRecord = await this.medicalRecordService.createMedicalRecord(
      createMedicalRecordDto,
      QuestionsRole.CLIENT,
      userId.id,
    );

    return medicalRecord;
  }

  @UseGuards(JwtAuthGuard)
  @Post('friend/:id')
  async createMedicalRecordFriend(
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
    @Param() userId: returnUserId,
  ): Promise<any> {
    const medicalRecord = await this.medicalRecordService.createMedicalRecord(
      createMedicalRecordDto,
      QuestionsRole.FRIEND,
      userId.id,
    );

    return medicalRecord;
  }

  @UseGuards(JwtAuthGuard)
  @Get('client/:id')
  async getMedicalRecordClient(
    @Param() idMedicalRecord: returnMedicalRecordId,
  ): Promise<any> {
    const medicalRecord = await this.medicalRecordService.getMedicalRecord(
      idMedicalRecord.id,
      QuestionsRole.CLIENT,
    );

    return medicalRecord;
  }

  @UseGuards(JwtAuthGuard)
  @Get('friend/:id')
  async getMedicalRecordFriend(
    @Param() idMedicalRecord: returnMedicalRecordId,
  ): Promise<any> {
    const medicalRecord = await this.medicalRecordService.getMedicalRecord(
      idMedicalRecord.id,
      QuestionsRole.FRIEND,
    );

    return medicalRecord;
  }

}
