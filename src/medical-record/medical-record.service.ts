import { BadRequestException, Injectable } from '@nestjs/common';
import { QuestionsAndAnswersService } from 'questions-answers/questions-answers.service';
import { QuestionsRole } from 'roles/rolesQuestions.enum';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordRepository } from './medical-record.repository';

@Injectable()
export class MedicalRecordService {
  constructor(
    private medicalRecordRepository: MedicalRecordRepository,
    private questionsAndAnswersService: QuestionsAndAnswersService,
  ) {}

  async createMedicalRecord(
    createMedicalRecordDto: CreateMedicalRecordDto,
    role: QuestionsRole,
    userId: string,
  ) {
    let score = 0;
    let scale = ' ';
    const returnScoreForAnswers = [];
    const status = [];

    if (role === 'CLIENT') {
      returnScoreForAnswers.push(
        await this.questionsAndAnswersService.getScoreAnswer(
          role,
          createMedicalRecordDto.question1,
        ),
      );
      returnScoreForAnswers.push(
        await this.questionsAndAnswersService.getScoreAnswer(
          role,
          createMedicalRecordDto.question2,
        ),
      );
      returnScoreForAnswers.push(
        await this.questionsAndAnswersService.getScoreAnswer(
          role,
          createMedicalRecordDto.question3,
        ),
      );
      returnScoreForAnswers.push(
        await this.questionsAndAnswersService.getScoreAnswer(
          role,
          createMedicalRecordDto.question4,
        ),
      );

      returnScoreForAnswers.push(
        await this.questionsAndAnswersService.getScoreAnswer(
          role,
          createMedicalRecordDto.question5,
        ),
      );

      const question6 = createMedicalRecordDto.question6.split(',');
      for (let i = 0; i < question6.length - 1; i++) {
        console.log(question6);
        if (question6[i] !== '26') {
          returnScoreForAnswers.push(
            await this.questionsAndAnswersService.getScoreAnswer(
              role,
              parseInt(question6[i]),
            ),
          );
        } else if (question6[i] === '26') {
          returnScoreForAnswers.push(
            await this.questionsAndAnswersService.getScoreAnswer(
              role,
              parseInt(question6[i]),
            ),
          );
        }

        break;
      }

      returnScoreForAnswers.push(
        await this.questionsAndAnswersService.getScoreAnswer(
          role,
          createMedicalRecordDto.question7,
        ),
      );
      if (
        createMedicalRecordDto.question7 !== 30 &&
        createMedicalRecordDto.question8 === null
      ) {
        throw new BadRequestException('Deve ser informado a questão 8');
      } else if (
        createMedicalRecordDto.question7 !== 30 &&
        createMedicalRecordDto.question8
      ) {
        returnScoreForAnswers.push(
          await this.questionsAndAnswersService.getScoreAnswer(
            role,
            createMedicalRecordDto.question8,
          ),
        );
      }

      const question9 = createMedicalRecordDto.question9.split(',');
      for (let i = 0; i < question9.length - 1; i++) {
        if (question9[i] !== '40') {
          returnScoreForAnswers.push(
            await this.questionsAndAnswersService.getScoreAnswer(
              role,
              parseInt(question9[i]),
            ),
          );
        } else if (question9[i] === '40') {
          returnScoreForAnswers.push(
            await this.questionsAndAnswersService.getScoreAnswer(
              role,
              parseInt(question9[i]),
            ),
          );
        }
        break;
      }

      for (let i = 0; i < question9.length - 1; i++) {
        if (question9[i] === '40') {
          break;
        } else {
          if (createMedicalRecordDto.question10 === null) {
            throw new BadRequestException('Deve ser informado a questão 10');
          } else if (createMedicalRecordDto.question10) {
            returnScoreForAnswers.push(
              await this.questionsAndAnswersService.getScoreAnswer(
                role,
                createMedicalRecordDto.question10,
              ),
            );
          }
          break;
        }
      }

      for (let i = 0; i < returnScoreForAnswers.length; i++) {
        score += returnScoreForAnswers[i][0].score;
      }

      if (score >= 0 && score <= 17) {
        scale = 'Azul';
      } else if (score >= 18 && score <= 28) {
        scale = 'Verde';
      } else if (score >= 29 && score <= 37) {
        scale = 'Amarelo';
      } else if (score >= 38 && score <= 48) {
        scale = 'Laranja';
      } else {
        scale = 'Vermelho';
      }
    } else {
      if (
        createMedicalRecordDto.question7 !== 75 &&
        createMedicalRecordDto.question8 === null
      ) {
        throw new BadRequestException('Deve ser informado a questão 8');
      }

      const question9 = createMedicalRecordDto.question9.split(',');
      for (let i = 0; i < question9.length - 1; i++) {
        if (question9[i] === '85') {
          break;
        } else {
          if (createMedicalRecordDto.question10 === null) {
            throw new BadRequestException('Deve ser informado a questão 10');
          }
        }
        break;
      }
    }

    const medical = await this.medicalRecordRepository.createMedicalRecord(
      createMedicalRecordDto,
      role,
      userId,
      score,
      scale,
    );

    const medicalRecordId = medical.id;
    const medicalRecordRole = medical.role;

    if (scale === 'Laranja' || scale === 'Vermelho') {
      status.push('Atendimento imediato', 'CVV');
    } else if (
      role === 'FRIEND' ||
      scale === 'Azul' ||
      scale === 'Verde' ||
      scale === 'Amarelo'
    ) {
      status.push('Agendar um atendimento', 'Atendimento imediato');
    }

    return { medicalRecordId, medicalRecordRole, status };
  }

  async getMedicalRecord(idMedcalRecord: number, role: QuestionsRole) {
    const medicalRecord = await this.medicalRecordRepository.getMedicalRecord(
      idMedcalRecord,
    );

    const questionsAndAnswers = [];

    questionsAndAnswers.push(
      await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
        medicalRecord[0].question1,
        role,
      ),
    );

    questionsAndAnswers.push(
      await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
        medicalRecord[0].question2,
        role,
      ),
    );

    questionsAndAnswers.push(
      await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
        medicalRecord[0].question3,
        role,
      ),
    );

    questionsAndAnswers.push(
      await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
        medicalRecord[0].question4,
        role,
      ),
    );

    questionsAndAnswers.push(
      await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
        medicalRecord[0].question5,
        role,
      ),
    );
    questionsAndAnswers.push(
      await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
        medicalRecord[0].question6,
        role,
      ),
    );

    questionsAndAnswers.push(
      await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
        medicalRecord[0].question7,
        role,
      ),
    );

    if (medicalRecord[0].question8) {
      questionsAndAnswers.push(
        await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
          medicalRecord[0].question8,
          role,
        ),
      );
    } else {
      questionsAndAnswers.push(
        await this.questionsAndAnswersService.getQuestion(role, 8),
      );
    }

    for (let i = 0; i < medicalRecord[0].question9.length; i++) {
      questionsAndAnswers.push(
        await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
          medicalRecord[0].question9[i],
          role,
        ),
      );
    }

    if (medicalRecord[0].question10) {
      questionsAndAnswers.push(
        await this.questionsAndAnswersService.getQUestionAndAnswerWithMedicalRecord(
          medicalRecord[0].question10,
          role,
        ),
      );
    } else {
      questionsAndAnswers.push(
        await this.questionsAndAnswersService.getQuestion(role, 10),
      );
    }

    return questionsAndAnswers;
  }
}
