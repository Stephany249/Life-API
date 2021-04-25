import nodemailer, { MailerService } from '@nestjs-modules/mailer';

import { EntityRepository, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { SendMailDTO } from './dto/send-notification.dto';

import handlebars from 'handlebars';

import * as fs from 'fs';

interface ITemplateVariables {
  [key: string]: string | number;
}

interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}

@EntityRepository(Notification)
export class NotifcationRepository extends Repository<Notification> {
  constructor(private mailerService: MailerService) {
    super();
  }
  async generate(id: string): Promise<Notification> {
    const userToken = this.create({
      user_id: id,
    });

    await this.save(userToken);

    return userToken;
  }

  async findByToken(token: string): Promise<Notification | undefined> {
    const userToken = await this.findOne({ where: { token } });

    return userToken;
  }

  async sendEmail({
    to,
    from,
    subject,
    templateData,
  }: SendMailDTO): Promise<void> {
    const message = await this.mailerService.sendMail({
      from: {
        name: from?.name || 'Equipe Life',
        address: from?.email || 'equipe@life.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
  }

  async parse({ file, variables }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
