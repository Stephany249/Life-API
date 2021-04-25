import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { isAfter, addHours } from 'date-fns';

import { UserRepository } from 'users/users.repository';
import { NotifcationRepository } from './notification.repository';
import { User } from 'users/entities/user.entity';

interface IRequest {
  token: string;
  password: string;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotifcationRepository)
    private userRepository: UserRepository,
    private notificationRepository: NotifcationRepository,
  ) {}

  async sendForgoutPasswordEmail(user: User): Promise<void> {
    console.log('User NOtification', user);
    const token = await this.notificationRepository.generate(user.id);

    const forgotPassowordTemplate = path.resolve(
      __dirname,
      'views',
      'forgot_password.hbs',
    );

    console.log('token', token);
    console.log('template', forgotPassowordTemplate);

    await this.notificationRepository.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Life] Recuperação de senha',
      templateData: {
        file: forgotPassowordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/users/reset-password?token=${token}`,
        },
      },
    });
  }

  async resetPassword({ token, password }: IRequest): Promise<void> {
    const userToken = await this.notificationRepository.findByToken(token);

    if (!userToken) {
      throw new BadRequestException('Token do usuário não existe');
    }

    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) {
      throw new BadRequestException('Usuário não existe');
    }

    const tokenCreatedAt = userToken.createdAt;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new BadRequestException('Token expirado.');
    }

    user.password = await this.userRepository.hashPassword(password);

    await this.userRepository.save(user);
  }
}
