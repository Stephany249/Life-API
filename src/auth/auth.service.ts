import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { sign, verify } from 'jsonwebtoken';
import authConfig from '../configs/auth';
import { classToClass } from 'class-transformer';

interface IResponse {
  user: User;
  //token: string;
}

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

interface ReturnSpecilist {
  user: User;
  crm: string;
}

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async createSession(email: string, password: string): Promise<IResponse> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnprocessableEntityException(
        'Incorrect email/password combination.',
      );
    }

    const passwordMatched = await this.userService.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnprocessableEntityException(
        'Incorrect email/password combination.',
      );
    }

    return {
      user: classToClass(user),
    };
  }

  async validateUser(token: string): Promise<User | ReturnSpecilist> {
    try {
      const decoded = verify(token, authConfig.jwt.secret);

      const { sub: id } = decoded as ITokenPayload;

      return await this.userService.findById(id);
    } catch {
      throw new BadRequestException('Invalid JWT token');
    }
  }
}
