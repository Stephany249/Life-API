import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Specialist } from '../specialist/entities/specialist.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'pguser',
  password: 'pgpassword',
  database: 'Life',
  entities: [User, Specialist],
  synchronize: true,
};
