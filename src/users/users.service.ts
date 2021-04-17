import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './user-roles.enum';
import { SpecialistService } from '../specialist/specialist.service';
import { cpf } from 'cpf-cnpj-validator';
import axios from 'axios';

interface ReturnSpecilist {
  user: User;
  crm: string;
}

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
  ): Promise<User | ReturnSpecilist> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else if(!cpf.isValid(createUserDto.cpf)) {
      throw new BadRequestException('O CPF informado não é valido');
    } else{
      const user = await this.userRepository.createUser(createUserDto, role);
      if (user.role === UserRole.SPECIALIST) {
        const specialist = {
          user,
          crm: createUserDto.crm,
        };
        const isValidCRM = await axios.get(
          `https://www.consultacrm.com.br/api/index.php?tipo=crm&q=${createUserDto.crm}&chave=8395551542&destino=json`,
        );

        if (isValidCRM.data.total > 0) {
          const userSpecialist = await this.specialistService.create(specialist);

          const crm = userSpecialist.crm;
  
          return { user, crm };
        } else {
          throw new BadRequestException('O CRM informado não é valido');
        }

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
