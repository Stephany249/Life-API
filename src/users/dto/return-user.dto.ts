import { User } from '../entities/user.entity';

interface ReturnSpecilist {
  user: User;
  crm: string;
}

export class ReturnUserDto {
  user: User | ReturnSpecilist;
  message: string;
}
