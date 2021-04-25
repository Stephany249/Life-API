import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(__dirname, '..', 'notification', 'views'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', 'notification', 'views'),
    },
  },
  transport: {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '3f00b95fcd9687',
      pass: '722796c7a12348',
    },
  },
};
