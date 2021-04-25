import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { NotifcationRepository } from './notification.repository';
import { User } from 'users/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotifcationRepository)
    private notificationRepository: NotifcationRepository,
    private mailerService: MailerService,
  ) {}

  async sendForgoutPasswordEmail(user: User): Promise<void> {
    const token = await this.notificationRepository.generate(user.id);

    const forgotPassowordTemplate = path.resolve(
      __dirname,
      'views',
      'forgot_password.hbs',
    );

    await this.mailerService.sendMail({
      to: user.name + ' ' + user.email,
      from: 'Equipe Life' + ' ' + 'equipe@life.com.br',
      subject: 'Email de recuperação de senha',
      template: forgotPassowordTemplate,
      context: {
        token: token.token,
        name: user.name,
        link: `http://localhost:3000/users/reset-password?token=${token.token}`,
      },
    });
  }

  async resetPassword(token: string): Promise<any> {
    const userToken = await this.notificationRepository.findByToken(token);

    if (!userToken) {
      throw new BadRequestException('Token do usuário não existe');
    }
    return userToken;
  }
}
