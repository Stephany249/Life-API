import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../roles/roles.enum';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const { email, name, password, cpf, birthday } = createUserDto;

    const user = this.create();
    user.email = email;
    user.name = name;
    user.role = role;
    user.cpf = cpf;
    user.birthday = birthday;
    user.password = password && (await this.hashPassword(password));
    try {
      await user.save();
      delete user.password;
      delete user.avatar;

      return user;
    } catch (error) {
      if (await this.findByEmail(email)) {
        throw new ConflictException('E-mail já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 8);
  }

  async compareHash(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.findOne({ where: { email } });
    return user;
  }

  async findById(id: string): Promise<any> {
    const user = await this.findOne({ where: { id: id } });

    return user;
  }

  async getSpecialists(role: UserRole): Promise<any> {
    const specialists = await this.query(
      `select u.id , u."name" , u.avatar, u."role", s.crm from "user" u join specialist s on u.id = s."userId" and u."role" = '${role}' order by u.name`,
    );

    return specialists;
  }
}
