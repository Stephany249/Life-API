import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './user-roles.enum';
import { SpecialistService } from '../specialist/specialist.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private specialistService: SpecialistService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const user = await this.userRepository.createUser(createUserDto, role);
      if (user.role === UserRole.SPECIALIST) {
        const specialist = {
          user,
          crm: createUserDto.crm,
        };

        await this.specialistService.create(specialist);

        return user;
      }

      return user;
    }
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await this.userRepository.compareHash(password, hash);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findByEmail(email);
  }
}
