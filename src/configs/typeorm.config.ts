import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Notification } from '../notification/entities/notification.entity';
import { WorkSchedule } from '../work-schedule/entities/work-schedule.entity';
import { Weekday } from '../work-schedule/entities/weekday.entity';
import { Questions } from '../questions-answers/entities/questions.entity';
import { Answers } from '../questions-answers/entities/answers.entity';
import { MedicalRecord } from '../medical-record/entities/medical-record.entity';
import { Scheduling } from '../scheduling/entities/scheduling.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'pgsql',
  port: 5432,
  username: 'pguser',
  password: 'pgpassword',
  database: 'Life',
  entities: [
    User,
    Specialist,
    Notification,
    Weekday,
    WorkSchedule,
    Questions,
    Answers,
    MedicalRecord,
    Scheduling,
  ],
  synchronize: true,
};
