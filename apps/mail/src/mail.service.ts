import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  sendMail(email: string) {
    console.log(`Sending mail to ${email}`);
  }
}
