import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from '../roles/roles.enum';
import { SpecialistService } from '../specialist/specialist.service';
import { cpf } from 'cpf-cnpj-validator';
import axios from 'axios';
import { classToClass } from 'class-transformer';

interface ReturnSpecilist {
  user: User;
  crm: string;
}

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
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
    } else if (createUserDto.cpf && !cpf.isValid(createUserDto.cpf)) {
      throw new BadRequestException('O CPF informado não é válido');
    } else {
      if (role === UserRole.SPECIALIST) {
        const isValidCRM = await axios.get(
          `https://www.consultacrm.com.br/api/index.php?tipo=crm&uf=&q=${createUserDto.crm}&chave=${process.env.CHAVE_CRM}&destino=json`,
        );

        if (isValidCRM.data.total == 1) {
          const user = await this.userRepository.createUser(
            createUserDto,
            role,
          );

          const specialist = {
            user,
            crm: createUserDto.crm,
          };

          const userSpecialist = await this.specialistService.create(
            specialist,
          );

          const crm = userSpecialist.crm;

          return { user, crm };
        } else {
          throw new BadRequestException('O CRM informado não é válido');
        }
      }
      return await this.userRepository.createUser(createUserDto, role);
    }
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await this.userRepository.compareHash(password, hash);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findByEmail(email);
  }

  async findById(user_id: string): Promise<any> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    if (user.role === UserRole.SPECIALIST) {
      const specialist = await this.specialistService.findById(user_id);

      return { user, specialist };
    }

    return classToClass(user);
  }

  async updateProfile({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const userWithUpdateEmail = await this.userRepository.findByEmail(email);

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new BadRequestException('E-mail já está em uso');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new BadRequestException(
        'Você precisa informar a senha antiga para definir uma nova senha.',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.userRepository.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new BadRequestException('Senha antiga não confere');
      }

      user.password = await this.userRepository.hashPassword(password);
    }

    return this.userRepository.save(user);
  }
}
