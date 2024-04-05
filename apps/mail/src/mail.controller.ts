import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private rmqService: RmqService,
  ) {}

  @EventPattern({ cmd: 'sendMail' })
  sendMail(@Ctx() context: RmqContext, @Payload() email: string) {
    this.rmqService.acknowledgmentMessage(context);

    this.mailService.sendMail(email);

    return 'sended!';
  }
}
