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
import { UpdateUserDto } from './dto/update-user.dto';
import * as path from 'path';
import * as fs from 'fs';
import { addHours, isAfter } from 'date-fns';
import { NotificationService } from '../notification/notification.service';

interface ReturnSpecilist {
  user: User;
  crm: string;
}

interface IResponse {
  token: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private specialistService: SpecialistService,
    private notificationService: NotificationService,
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

        if (isValidCRM.data.total >= 1) {
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

    delete user.password;

    if (user.role === UserRole.SPECIALIST) {
      const specialist = await this.specialistService.findById(user.id);

      return { user, specialist };
    }

    return classToClass(user);
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const userWithUpdateEmail = await this.userRepository.findByEmail(
      updateUserDto.email,
    );

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new BadRequestException('E-mail já está em uso');
    }

    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    user.birthday = updateUserDto.birthday;

    if (updateUserDto.password && !updateUserDto.oldPassword) {
      throw new BadRequestException(
        'Você precisa informar a senha antiga para definir uma nova senha.',
      );
    }

    if (updateUserDto.password && updateUserDto.oldPassword) {
      const checkOldPassword = await this.userRepository.compareHash(
        updateUserDto.oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new BadRequestException('Senha antiga não confere');
      }

      user.password = await this.userRepository.hashPassword(
        updateUserDto.password,
      );
    }

    const userUpdated = await this.userRepository.save(user);

    if (userUpdated.role === UserRole.SPECIALIST) {
      const specialist = await this.specialistService.findById(userUpdated.id);

      delete userUpdated.password;

      return { userUpdated, specialist };
    }

    delete userUpdated.password;

    return userUpdated;
  }

  async updateAvatar(id: string, avatarFileName: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestException(
        'Apenas usuários autenticados podem alterar o avatar',
      );
    }

    if (user.avatar) {
      const filePath = path.resolve('./tmp/uploads/' + user.avatar);
      await fs.promises.unlink(filePath);
    }

    user.avatar = avatarFileName;

    await this.userRepository.save(user);

    delete user.password;

    return user;
  }

  async resetPassword(reset: IResponse): Promise<any> {
    const userToken = await this.notificationService.resetPassword(reset.token);

    const user = await this.userRepository.findById(userToken.userId);

    if (!user) {
      throw new BadRequestException('Usuário não existe');
    }

    const tokenCreatedAt = userToken.createdAt;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), new Date(compareDate))) {
      throw new BadRequestException('Token expirado.');
    }

    user.password = await this.userRepository.hashPassword(reset.password);

    await this.userRepository.save(user);

    return user;
  }
}
