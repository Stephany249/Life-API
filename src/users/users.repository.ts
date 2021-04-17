import { EntityRepository, Repository, getRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user-roles.enum';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private ormRepository: Repository<User>;

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
    user.password = await this.hashPassword(password);
    try {
      await user.save();
      delete user.password;
      delete user.avatar_url;

      return user;
    } catch (error) {
      if (this.findByEmail(email)) {
        throw new ConflictException('E-mail já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 8);
  }

  async compareHash(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.findOne({ where: { email } });

    return user;
  }
}
