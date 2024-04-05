import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  sendMail(email: string) {
    this.mailerService.sendMail({
      to: email,
      from: this.configService.get('MAIL_USER'),
      subject: 'Bienvenido',
      text: `Bienvenido a nuestra plataforma.`,
      html: `<b>Bienvenido a nuestra plataforma.</b>`,
    });
  }
}
