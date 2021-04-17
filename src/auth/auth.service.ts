import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { sign } from 'jsonwebtoken';
import authConfig from '../configs/auth';
import { classToClass } from 'class-transformer';

interface IResponse {
  user: User;
  token: string;
}

interface IRequest {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async createSession({ email, password }: IRequest): Promise<IResponse> {
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

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.email,
      expiresIn,
    });

    return {
      user: classToClass(user),
      token,
    };
  }
}
