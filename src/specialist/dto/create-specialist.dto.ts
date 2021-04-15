import { User } from '../../users/entities/user.entity';

export class CreateSpecialistDto {
  user: User;
  crm: string;
}
